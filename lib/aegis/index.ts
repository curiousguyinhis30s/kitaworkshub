/**
 * Project AEGIS - Autonomous Engineering & Generative Intelligence System
 *
 * A hyper-efficient, autonomous software factory designed to simulate
 * the output of a 50-person engineering team at <1% of the operational cost.
 *
 * Core Philosophy: "Token Arbitrage" - Intelligence as a commodity
 * Target Allocation: Claude ≤5% | GLM ≥70% | Gemini ~15%
 */

export { AutonomousEngine } from './autonomous-engine';
export type {
  Task,
  TaskResult,
  EngineStatus,
  AgentConfig as EngineAgentConfig,
  PocketBaseClient,
  TaskStatus
} from './autonomous-engine';

export { TriModelRouter } from './tri-model-router';
export type {
  Task as RouterTask,
  ModelChoice,
  UsageStats,
  BudgetStatus
} from './tri-model-router';

export { AgentPool, DEFAULT_AGENT_CONFIGS, AgentType } from './agent-pool';
export type {
  AgentConfig,
  AgentResult,
  AgentStatus,
  DispatchJob
} from './agent-pool';

/**
 * Quick start example:
 *
 * ```typescript
 * import { AutonomousEngine, TriModelRouter, AgentPool } from '@/lib/aegis';
 *
 * // Initialize components
 * const router = new TriModelRouter();
 * const agentPool = new AgentPool();
 *
 * // Create engine with your PocketBase client
 * const engine = new AutonomousEngine(pbClient, agentConfigs);
 *
 * // Start autonomous loop
 * engine.start();
 *
 * // Monitor events
 * engine.on('task:completed', (result) => console.log('Task done:', result));
 * engine.on('circuit:tripped', (reason) => console.warn('Circuit breaker:', reason));
 *
 * // Check model allocation
 * const stats = router.getUsageStats();
 * console.log(`Claude: ${(stats.claude.percentage * 100).toFixed(1)}%`);
 * ```
 */
