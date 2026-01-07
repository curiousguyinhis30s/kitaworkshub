/**
 * Project AEGIS - Tri-Model Router
 * Cost optimization through intelligent model routing
 * TARGET: Claude ≤5% | GLM ≥70% | Gemini ~15%
 */

export interface Task {
  type: 'architecture' | 'security' | 'debug' | 'research' | 'prototype' | 'code' | 'test' | 'docs' | 'format';
  priority: 'critical' | 'high' | 'medium' | 'low';
  contextLength: number;
}

export type ModelChoice = 'CLAUDE' | 'GLM' | 'GEMINI';

export interface UsageStats {
  claude: { percentage: number; tokens: number; cost: number };
  glm: { percentage: number; tokens: number; cost: number };
  gemini: { percentage: number; tokens: number; cost: number };
  totalTokens: number;
  totalCost: number;
}

export interface BudgetStatus {
  isWithinBudget: boolean;
  remainingBudget: number;
  dailyTotal: number;
}

interface ModelMetrics {
  tokens: number;
  cost: number;
}

const CONFIG = {
  TARGET_ALLOCATION: {
    CLAUDE: 0.05,
    GLM: 0.70,
    GEMINI: 0.15
  },
  BUDGET_LIMIT: 100,
  COST_PER_TOKEN: {
    CLAUDE: 0.003,
    GLM: 0.0001,
    GEMINI: 0.0005
  },
  CONTEXT_THRESHOLD: 100000
};

export class TriModelRouter {
  private metrics: Record<ModelChoice, ModelMetrics>;
  private dailyTotalCost: number;
  private lastResetDate: string;

  constructor() {
    this.metrics = {
      CLAUDE: { tokens: 0, cost: 0 },
      GLM: { tokens: 0, cost: 0 },
      GEMINI: { tokens: 0, cost: 0 }
    };
    this.dailyTotalCost = 0;
    this.lastResetDate = new Date().toDateString();
  }

  public routeModel(task: Task): ModelChoice {
    this.checkDailyReset();

    // Critical architecture/security always routes to Claude
    if (
      (task.type === 'architecture' || task.type === 'security') &&
      (task.priority === 'critical' || task.priority === 'high')
    ) {
      return 'CLAUDE';
    }

    // Large context > 100k tokens -> Gemini
    if (task.contextLength > CONFIG.CONTEXT_THRESHOLD) {
      return 'GEMINI';
    }

    // Capability-based routing
    if (['architecture', 'security', 'debug'].includes(task.type)) {
      if (this.isAllocationExceeded('CLAUDE')) {
        return this.selectSecondaryModel(task);
      }
      return 'CLAUDE';
    }

    if (['research', 'prototype', 'docs'].includes(task.type)) {
      if (this.isAllocationExceeded('GEMINI')) {
        return 'GLM';
      }
      return 'GEMINI';
    }

    // Default for routine tasks: code, test, format
    return 'GLM';
  }

  public trackUsage(model: ModelChoice, tokens: number, cost: number): void {
    this.checkDailyReset();

    this.metrics[model].tokens += tokens;
    this.metrics[model].cost += cost;
    this.dailyTotalCost += cost;
  }

  public getUsageStats(): UsageStats {
    const totalTokens = this.metrics.CLAUDE.tokens + this.metrics.GLM.tokens + this.metrics.GEMINI.tokens;

    const calculatePercentage = (tokens: number): number => {
      return totalTokens === 0 ? 0 : (tokens / totalTokens);
    };

    return {
      claude: {
        percentage: calculatePercentage(this.metrics.CLAUDE.tokens),
        tokens: this.metrics.CLAUDE.tokens,
        cost: this.metrics.CLAUDE.cost
      },
      glm: {
        percentage: calculatePercentage(this.metrics.GLM.tokens),
        tokens: this.metrics.GLM.tokens,
        cost: this.metrics.GLM.cost
      },
      gemini: {
        percentage: calculatePercentage(this.metrics.GEMINI.tokens),
        tokens: this.metrics.GEMINI.tokens,
        cost: this.metrics.GEMINI.cost
      },
      totalTokens,
      totalCost: this.dailyTotalCost
    };
  }

  public checkBudget(): BudgetStatus {
    this.checkDailyReset();

    return {
      isWithinBudget: this.dailyTotalCost < CONFIG.BUDGET_LIMIT,
      remainingBudget: Math.max(0, CONFIG.BUDGET_LIMIT - this.dailyTotalCost),
      dailyTotal: this.dailyTotalCost
    };
  }

  public rebalance(): void {
    const stats = this.getUsageStats();

    if (stats.claude.percentage > CONFIG.TARGET_ALLOCATION.CLAUDE * 1.5) {
      console.warn('[Rebalance] Claude usage high. Routing non-critical tasks to GLM.');
    }
    if (stats.gemini.percentage > CONFIG.TARGET_ALLOCATION.GEMINI * 1.5) {
      console.warn('[Rebalance] Gemini usage high. Routing to GLM if possible.');
    }
    if (stats.glm.percentage < CONFIG.TARGET_ALLOCATION.GLM * 0.5) {
      console.warn('[Rebalance] GLM underutilized. Consider routing more tasks to GLM.');
    }
  }

  public getTargetAllocations(): typeof CONFIG.TARGET_ALLOCATION {
    return CONFIG.TARGET_ALLOCATION;
  }

  public getCostPerToken(): typeof CONFIG.COST_PER_TOKEN {
    return CONFIG.COST_PER_TOKEN;
  }

  private isAllocationExceeded(model: ModelChoice): boolean {
    const stats = this.getUsageStats();
    const modelStats = model === 'CLAUDE' ? stats.claude :
                       model === 'GEMINI' ? stats.gemini : stats.glm;

    const target = CONFIG.TARGET_ALLOCATION[model];
    return modelStats.percentage > (target * 1.2);
  }

  private selectSecondaryModel(task: Task): ModelChoice {
    if (['debug'].includes(task.type)) return 'GEMINI';
    return 'GLM';
  }

  private checkDailyReset(): void {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.metrics = {
        CLAUDE: { tokens: 0, cost: 0 },
        GLM: { tokens: 0, cost: 0 },
        GEMINI: { tokens: 0, cost: 0 }
      };
      this.dailyTotalCost = 0;
      this.lastResetDate = today;
    }
  }
}

export default TriModelRouter;
