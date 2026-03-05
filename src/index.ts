/**
 * OpenClaw Insurance Broker Skill - AI 保险经纪人
 * 主入口文件
 */

import type { Skill, SkillContext, SkillResponse } from './types.js';
import { NeedsAnalysisAgent } from './insurance-agents/needs-analysis-agent.js';

export class InsuranceBrokerSkill implements Skill {
  id = 'insurance-broker';
  name = 'AI 保险经纪人';
  version = '0.1.0';
  description = '智能保险经纪人，提供需求分析、产品推荐、理赔协助等全方位保险服务';

  private needsAnalysisAgent: NeedsAnalysisAgent;

  constructor() {
    this.needsAnalysisAgent = new NeedsAnalysisAgent();
  }

  /**
   * Skill 初始化
   */
  async initialize(context: SkillContext): Promise<void> {
    console.log('[Insurance Broker Skill] 初始化中...');
    await this.needsAnalysisAgent.initialize(context);
    console.log('[Insurance Broker Skill] 初始化完成');
  }

  /**
   * 处理用户消息 - 实现 Skill 接口的 handle 方法
   */
  async handle(
    message: string,
    context: SkillContext
  ): Promise<SkillResponse> {
    console.log(`[Insurance Broker Skill] 处理消息: ${message}`);

    // 简单的意图识别
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('需求分析') ||
      lowerMessage.includes('保险需求') ||
      lowerMessage.includes('分析')
    ) {
      return await this.needsAnalysisAgent.analyze(context);
    }

    if (
      lowerMessage.includes('推荐') ||
      lowerMessage.includes('产品') ||
      lowerMessage.includes('买什么')
    ) {
      return {
        type: 'text',
        content:
          '产品推荐功能即将推出！目前您可以：\n\n' +
          '🔍 进行保险需求分析 - 请说"分析我的保险需求"\n' +
          '💡 咨询保险知识 - 直接提出您的问题',
      };
    }

    // 默认处理 - 通用保险咨询
    return await this.handleGeneralConsultation(message, context);
  }

  /**
   * 处理通用保险咨询
   */
  private async handleGeneralConsultation(
    message: string,
    context: SkillContext
  ): Promise<SkillResponse> {
    // 使用 LLM 进行对话式咨询
    const response = await context.llm.chat({
      system: `你是一位专业的保险经纪人，拥有丰富的保险知识和经验。

你的职责包括：
- 分析客户的保险需求
- 推荐适合的保险产品
- 解答保险相关问题
- 提供理赔协助和指导
- 解释保险术语和条款

请以专业、客观、易懂的方式回答用户的问题。始终站在用户角度，提供中立的建议。`,
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

  /**
   * Skill 停用时调用
   */
  async shutdown(): Promise<void> {
    console.log('[Insurance Broker Skill] 停用');
  }
}

// 导出 Skill 实例
export default new InsuranceBrokerSkill();

// 同时导出类型，供其他模块使用
export type { Skill, SkillContext, SkillResponse } from './types.js';
export type {
  UserInfo,
  InsuranceProduct,
  RiskAssessment,
  NeedsAnalysisReport,
} from './insurance-types.js';
