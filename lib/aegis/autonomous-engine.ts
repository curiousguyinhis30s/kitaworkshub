/**
 * Project AEGIS - Autonomous Engine
 * Core orchestrator for the autonomous software factory
 */

import { EventEmitter } from 'events';

// --- Types & Interfaces ---

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  REVIEW = 'review',
  DONE = 'done',
  FAILED = 'failed',
}

export enum AgentType {
  EXPLORER = 'explorer',
  PLANNER = 'planner',
  CODER = 'coder',
  REVIEWER = 'reviewer',
  TESTER = 'tester',
}

export interface Task {
  id: string;
  prompt: string;
  status: TaskStatus;
  attempts: number;
  complexity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  output?: unknown;
  error?: string;
  agentUsed?: AgentType;
}

export interface EngineStatus {
  isRunning: boolean;
  isPaused: boolean;
  activeTasks: number;
  dailySpend: number;
  circuitBreakersOpen: boolean;
}

export interface AgentConfig {
  name: AgentType;
  execute: (task: Task) => Promise<TaskResult>;
}

export interface PocketBaseClient {
  getList: (filter: string) => Promise<Task[]>;
  update: (id: string, data: Partial<Task>) => Promise<Task>;
}

// --- Configuration Constants ---

const CONFIG = {
  POLL_INTERVAL_MS: 2000,
  MAX_DAILY_SPEND: 50.0,
  MAX_CONSECUTIVE_FAILURES: 3,
  HALLUCINATION_REGEX: /^[^<>{}]*$/,
};

// --- Memory System ---

class MemorySystem {
  private lessons: Map<string, string> = new Map();

  public store(key: string, value: string): void {
    this.lessons.set(key, value);
    console.log(`[Memory] Stored lesson: ${key}`);
  }

  public retrieve(key: string): string | undefined {
    return this.lessons.get(key);
  }

  public getAll(): Map<string, string> {
    return this.lessons;
  }
}

// --- Core Engine Class ---

export class AutonomousEngine extends EventEmitter {
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  private dailySpend: number = 0;
  private taskFailureCounts: Map<string, number> = new Map();
  private memory: MemorySystem = new MemorySystem();

  private pbClient: PocketBaseClient;
  private agents: Map<AgentType, AgentConfig>;

  constructor(pbClient: PocketBaseClient, agents: AgentConfig[]) {
    super();
    this.pbClient = pbClient;

    this.agents = new Map();
    agents.forEach(agent => this.agents.set(agent.name, agent));
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.emit('engine:started');
    console.log('[Engine] Starting Autonomous Loop...');

    this.intervalId = setInterval(async () => {
      if (!this.isPaused) {
        await this.poll();
      }
    }, CONFIG.POLL_INTERVAL_MS);
  }

  public pause(): void {
    this.isPaused = true;
    this.emit('engine:paused');
    console.log('[Engine] Paused.');
  }

  public resume(): void {
    this.isPaused = false;
    this.emit('engine:resumed');
    console.log('[Engine] Resumed.');
  }

  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.emit('engine:stopped');
    console.log('[Engine] Stopped.');
  }

  public getStatus(): EngineStatus {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      activeTasks: this.taskFailureCounts.size,
      dailySpend: this.dailySpend,
      circuitBreakersOpen: this.checkCircuitBreakers(),
    };
  }

  private async poll(): Promise<void> {
    if (this.checkCircuitBreakers()) {
      this.pause();
      this.emit('circuit:tripped', 'Cost Cap or Failure Limit Reached');
      return;
    }

    try {
      const tasks = await this.pbClient.getList(`status = "${TaskStatus.TODO}"`);

      if (tasks.length > 0) {
        this.emit('tasks:discovered', tasks.length);
        const task = tasks[0];
        await this.dispatchTask(task);
      }
    } catch (error) {
      console.error('[Engine] Polling error:', error);
      this.emit('engine:error', error);
    }
  }

  public async dispatchTask(task: Task): Promise<TaskResult> {
    try {
      await this.updateTaskStatus(task.id, TaskStatus.DOING);
      this.emit('task:started', task.id);

      const agentType = this.routeModel(task);
      this.emit('task:routed', { taskId: task.id, agent: agentType });

      const agent = this.agents.get(agentType);
      if (!agent) {
        throw new Error(`Agent ${agentType} not found in pool.`);
      }

      const result = await agent.execute(task);

      if (result.success) {
        if (this.detectHallucination(result.output)) {
          throw new Error('Hallucination detected: Invalid output format.');
        }

        await this.updateTaskStatus(task.id, TaskStatus.REVIEW);
        this.memory.store(`task_${task.id}_success`, JSON.stringify(result.output));
        this.taskFailureCounts.delete(task.id);

        this.emit('task:completed', result);
        return result;
      } else {
        throw new Error(result.error || 'Agent execution failed');
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const currentFails = (this.taskFailureCounts.get(task.id) || 0) + 1;
      this.taskFailureCounts.set(task.id, currentFails);
      this.dailySpend += 0.05;

      if (currentFails >= CONFIG.MAX_CONSECUTIVE_FAILURES) {
        await this.updateTaskStatus(task.id, TaskStatus.FAILED);
        this.taskFailureCounts.delete(task.id);
        this.emit('task:failed', { taskId: task.id, reason: 'Loop detected: Max retries' });
        return { taskId: task.id, success: false, error: 'Task aborted after max retries' };
      }

      await this.updateTaskStatus(task.id, TaskStatus.TODO);
      this.emit('task:retry', { taskId: task.id, attempt: currentFails });
      return { taskId: task.id, success: false, error: errorMessage };
    }
  }

  private routeModel(task: Task): AgentType {
    const prompt = task.prompt.toLowerCase();

    if (prompt.includes('test') || prompt.includes('verify')) {
      return AgentType.TESTER;
    }
    if (prompt.includes('review') || prompt.includes('check')) {
      return AgentType.REVIEWER;
    }
    if (prompt.includes('plan') || prompt.includes('design')) {
      return AgentType.PLANNER;
    }
    if (prompt.includes('file') || prompt.includes('write') || prompt.includes('code')) {
      return AgentType.CODER;
    }

    return AgentType.EXPLORER;
  }

  private checkCircuitBreakers(): boolean {
    if (this.dailySpend >= CONFIG.MAX_DAILY_SPEND) {
      console.warn('[Engine] Circuit Breaker: Cost Cap Exceeded');
      return true;
    }
    return false;
  }

  private detectHallucination(output: unknown): boolean {
    if (typeof output !== 'string') return false;
    return !CONFIG.HALLUCINATION_REGEX.test(output);
  }

  private async updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
    try {
      await this.pbClient.update(id, {
        status,
        updatedAt: new Date()
      });
    } catch (e) {
      console.error(`[Engine] Failed to update status for task ${id}`, e);
    }
  }

  public resetDailySpend(): void {
    this.dailySpend = 0;
    this.emit('budget:reset');
  }

  public getMemory(): Map<string, string> {
    return this.memory.getAll();
  }
}

export default AutonomousEngine;
