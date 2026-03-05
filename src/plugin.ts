/**
 * OpenClaw FA Plugin - 一级市场投融资顾问
 * Plugin 主入口文件
 */

import type { PluginAPI, HookEvent, ServiceDefinition } from './plugin-types.js';
import { BPAgent } from './agents/bp-agent.js';
import { FinancialAgent } from './agents/financial-agent.js';
import { InvestorMatchAgent } from './agents/investor-match-agent.js';
import { StrategyAgent } from './agents/strategy-agent.js';
import { parseUserIntent } from './utils/intent-parser.js';
import { createFAContext } from './adapters/context-adapter.js';

/**
 * FA Plugin 主类
 */
class FAPlugin {
  private api!: PluginAPI;
  private bpAgent!: BPAgent;
  private financialAgent!: FinancialAgent;
  private investorMatchAgent!: InvestorMatchAgent;
  private strategyAgent!: StrategyAgent;
  private initialized = false;

  /**
   * 初始化 Plugin
   */
  async initialize(api: PluginAPI): Promise<void> {
    this.api = api;

    // 创建各个 Agent 实例（延迟初始化，在首次使用时初始化）
    this.bpAgent = new BPAgent();
    this.financialAgent = new FinancialAgent();
    this.investorMatchAgent = new InvestorMatchAgent();
    this.strategyAgent = new StrategyAgent();

    this.initialized = true;
    api.logger.info('[FA Plugin] 初始化完成');
  }

  /**
   * 确保 Agent 已初始化（延迟初始化）
   */
  private async ensureAgentInitialized(agent: any, context: any): Promise<void> {
    if (agent._initialized) {
      return;
    }

    if (agent.initialize) {
      await agent.initialize(context);
      agent._initialized = true;
    }
  }

  /**
   * 处理消息的 Hook
   */
  async handleMessage(event: HookEvent): Promise<void> {
    try {
      // 只处理 message:preprocessed 事件
      if (event.type !== 'message:preprocessed') {
        return;
      }

      const { message, context } = event;

      // 创建FA特定的context
      const faContext = createFAContext(context, this.api);

      // 解析用户意图
      const intent = await parseUserIntent(message.text, faContext);

      // 如果不是FA相关意图，跳过处理
      if (intent.type === 'unknown' || intent.confidence < 0.6) {
        return;
      }

      this.api.logger.info(`[FA Plugin] 检测到意图: ${intent.type}, 置信度: ${intent.confidence}`);

      // 根据意图路由到不同的 Agent（延迟初始化）
      let response;
      switch (intent.type) {
        case 'generate_bp':
          await this.ensureAgentInitialized(this.bpAgent, faContext);
          response = await this.bpAgent.handle(intent, faContext);
          break;

        case 'build_financial_model':
          await this.ensureAgentInitialized(this.financialAgent, faContext);
          response = await this.financialAgent.buildModel(intent, faContext);
          break;

        case 'analyze_valuation':
          await this.ensureAgentInitialized(this.financialAgent, faContext);
          response = await this.financialAgent.analyzeValuation(intent, faContext);
          break;

        case 'match_investors':
          await this.ensureAgentInitialized(this.investorMatchAgent, faContext);
          response = await this.investorMatchAgent.matchInvestors(intent, faContext);
          break;

        case 'analyze_investor':
          await this.ensureAgentInitialized(this.investorMatchAgent, faContext);
          response = await this.investorMatchAgent.analyzeInvestor(intent, faContext);
          break;

        case 'fundraising_strategy':
          await this.ensureAgentInitialized(this.strategyAgent, faContext);
          response = await this.strategyAgent.createStrategy(intent, faContext);
          break;

        case 'term_sheet_review':
          await this.ensureAgentInitialized(this.strategyAgent, faContext);
          response = await this.strategyAgent.reviewTermSheet(intent, faContext);
          break;

        case 'due_diligence_prep':
          await this.ensureAgentInitialized(this.strategyAgent, faContext);
          response = await this.strategyAgent.prepareDueDiligence(intent, faContext);
          break;

        case 'industry_analysis':
          await this.ensureAgentInitialized(this.strategyAgent, faContext);
          response = await this.strategyAgent.analyzeIndustry(intent, faContext);
          break;

        case 'general_consultation':
          response = await this.handleGeneralConsultation(message.text, faContext);
          break;

        default:
          // 不处理，让OpenClaw的默认Agent处理
          return;
      }

      // 发送响应给用户
      if (response && response.content) {
        event.messages.push(response.content.toString());

        // 标记该消息已被处理，阻止默认Agent处理
        event.stopPropagation = true;
      }
    } catch (error) {
      this.api.logger.error('[FA Plugin] 处理消息时出错:', error);
      // 发生错误时不阻止默认处理
    }
  }

  /**
   * 处理通用咨询
   */
  private async handleGeneralConsultation(
    message: string,
    context: any
  ): Promise<any> {
    const response = await context.llm.chat({
      system: `你是一位经验丰富的投融资顾问（FA），专注于一级市场。
你的职责包括：
- 帮助创业者准备融资材料
- 匹配合适的投资机构
- 提供融资策略建议
- 解答融资相关问题

请以专业、友好的方式回答用户的问题。`,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return {
      type: 'text',
      content: response.content,
    };
  }
}

/**
 * FA Service 定义
 */
const faService: ServiceDefinition = {
  id: 'fa',
  displayName: 'FA - 投融资顾问',

  async start(api: PluginAPI) {
    api.logger.info('[FA Service] 启动中...');

    // 可以在这里加载投资人数据库等资源
    const config = api.getConfig();
    const dbPath = config.fa?.investorDatabasePath || './data/investors.json';

    api.logger.info(`[FA Service] 投资人数据库路径: ${dbPath}`);
    api.logger.info('[FA Service] 启动完成');
  },

  async stop(api: PluginAPI) {
    api.logger.info('[FA Service] 停止');
  },
};

/**
 * Plugin 导出函数
 */
export default async function (api: PluginAPI) {
  api.logger.info('[FA Plugin] 加载中...');

  // 初始化 Plugin
  const plugin = new FAPlugin();
  await plugin.initialize(api);

  // 注册 FA Service
  api.registerService(faService);

  // 注册消息处理 Hook
  api.registerHook({
    name: 'fa-message-handler',
    on: ['message:preprocessed'],
    handler: async (event: HookEvent) => {
      await plugin.handleMessage(event);
    },
  });

  api.logger.info('[FA Plugin] 加载完成');
}
