/**
 * Project AEGIS - Agent Pool
 * Manages specialized AI agents for different tasks
 */

export enum AgentType {
  EXPLORER = 'explorer',
  PLANNER = 'planner',
  CODER = 'coder',
  REVIEWER = 'reviewer',
  TESTER = 'tester',
}

export interface AgentConfig {
  name: string;
  model: string;
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}

export interface Task {
  id: string;
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AgentResult {
  agentId: string;
  taskId: string;
  success: boolean;
  data?: string;
  error?: string;
  duration: number;
}

export type AgentStatus = 'IDLE' | 'BUSY' | 'ERROR';

export interface DispatchJob {
  agentType: AgentType;
  task: Task;
}

interface IAgent {
  id: string;
  type: AgentType;
  config: AgentConfig;
  status: AgentStatus;
  execute(task: string): Promise<string>;
}

class BaseAgent implements IAgent {
  public readonly id: string;
  public readonly type: AgentType;
  public readonly config: AgentConfig;
  public status: AgentStatus;

  constructor(type: AgentType, config: AgentConfig) {
    this.id = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.config = config;
    this.status = 'IDLE';
  }

  public async execute(prompt: string): Promise<string> {
    this.status = 'BUSY';

    try {
      const response = await this.callLlm(
        this.config.model,
        this.config.systemPrompt,
        prompt,
        this.config.maxTokens,
        this.config.temperature
      );

      this.status = 'IDLE';
      return response;
    } catch (error) {
      this.status = 'ERROR';
      throw error;
    }
  }

  private async callLlm(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    console.log(`[${this.type.toUpperCase()}] Calling ${model}...`);

    // Simulate API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    return `[Response from ${model}] Processed: "${userPrompt.substring(0, 50)}..."`;
  }
}

// Default agent configurations
export const DEFAULT_AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  [AgentType.EXPLORER]: {
    name: 'Explorer Agent',
    model: 'gemini-2.0-flash',
    systemPrompt: 'You are a codebase explorer. Scan files, map territory, gather context.',
    maxTokens: 8000,
    temperature: 0.3,
  },
  [AgentType.PLANNER]: {
    name: 'Planner Agent',
    model: 'claude-3.5-sonnet',
    systemPrompt: 'You are a strategic planner. Break goals into atomic JSON task steps.',
    maxTokens: 4000,
    temperature: 0.2,
  },
  [AgentType.CODER]: {
    name: 'Coder Agent',
    model: 'glm-4',
    systemPrompt: 'You are a skilled developer. Write clean, efficient, tested code.',
    maxTokens: 16000,
    temperature: 0.1,
  },
  [AgentType.REVIEWER]: {
    name: 'Reviewer Agent',
    model: 'claude-3.5-sonnet',
    systemPrompt: 'You are a code reviewer. Run linters, check types, review logic.',
    maxTokens: 4000,
    temperature: 0.1,
  },
  [AgentType.TESTER]: {
    name: 'Tester Agent',
    model: 'glm-4',
    systemPrompt: 'You are a QA engineer. Generate comprehensive test cases and fixtures.',
    maxTokens: 8000,
    temperature: 0.2,
  },
};

export class AgentPool {
  private agents: Map<AgentType, IAgent> = new Map();
  private readonly MAX_RETRIES = 3;
  private readonly DEFAULT_TIMEOUT = 60000;

  constructor(initializeDefaults = true) {
    if (initializeDefaults) {
      this.initializeDefaultAgents();
    }
  }

  private initializeDefaultAgents(): void {
    Object.entries(DEFAULT_AGENT_CONFIGS).forEach(([type, config]) => {
      this.registerAgent(type as AgentType, config);
    });
  }

  public registerAgent(type: AgentType, config: AgentConfig): void {
    if (this.agents.has(type)) {
      console.warn(`Agent ${type} already registered. Overwriting...`);
    }

    const agent = new BaseAgent(type, config);
    this.agents.set(type, agent);
    console.log(`Agent registered: ${config.name} (${type})`);
  }

  public getAgentStatus(type: AgentType): AgentStatus {
    const agent = this.agents.get(type);
    if (!agent) {
      throw new Error(`No agent found for type: ${type}`);
    }
    return agent.status;
  }

  public getAllAgentStatuses(): Record<AgentType, AgentStatus> {
    const statuses: Partial<Record<AgentType, AgentStatus>> = {};
    this.agents.forEach((agent, type) => {
      statuses[type] = agent.status;
    });
    return statuses as Record<AgentType, AgentStatus>;
  }

  public async dispatch(agentType: AgentType, task: Task): Promise<AgentResult> {
    const startTime = Date.now();
    const agent = this.agents.get(agentType);

    if (!agent) {
      return this.createErrorResult(task.id, agentType, `Agent not found: ${agentType}`, startTime);
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await this.withTimeout(this.executeAgent(agent, task), this.DEFAULT_TIMEOUT);

        return {
          agentId: agent.id,
          taskId: task.id,
          success: true,
          data: result,
          duration: Date.now() - startTime,
        };
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed for ${agentType}: ${lastError.message}`);

        if (attempt < this.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    return this.createErrorResult(task.id, agentType, lastError?.message || 'Unknown error', startTime);
  }

  public async parallelDispatch(jobs: DispatchJob[]): Promise<AgentResult[]> {
    const promises = jobs.map(job => this.dispatch(job.agentType, job.task));
    return Promise.all(promises);
  }

  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Agent execution timed out')), ms)
      ),
    ]);
  }

  private async executeAgent(agent: IAgent, task: Task): Promise<string> {
    return await agent.execute(task.prompt);
  }

  private createErrorResult(taskId: string, type: AgentType, message: string, startTime: number): AgentResult {
    return {
      agentId: 'unknown',
      taskId,
      success: false,
      error: `[${type}] ${message}`,
      duration: Date.now() - startTime,
    };
  }
}

export default AgentPool;
