/**
 * BP Agent - 商业计划书生成代理
 */

import type { SkillContext, SkillResponse, ProjectInfo, UserIntent } from '../types.js';
import { extractProjectInfo } from '../utils/project-extractor.js';
import { generateBPContent } from '../tools/bp-generator.js';

export class BPAgent {
  async initialize(context: SkillContext): Promise<void> {
    console.log('[BP Agent] 初始化完成');
  }

  /**
   * 处理 BP 生成请求
   */
  async handle(intent: UserIntent, context: SkillContext): Promise<SkillResponse> {
    try {
      // 1. 收集项目信息
      const projectInfo = await this.collectProjectInfo(intent, context);

      // 2. 生成 BP 内容
      const bpContent = await generateBPContent(projectInfo, context);

      // 3. 返回结果
      return {
        type: 'text',
        content: `✅ 已为您生成商业计划书\n\n${this.formatBPPreview(bpContent)}\n\n💡 建议：\n${bpContent.recommendations.map(r => `• ${r}`).join('\n')}`,
        metadata: {
          projectInfo,
          bpContent,
        },
      };
    } catch (error) {
      return {
        type: 'error',
        content: `生成 BP 时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 生成 BP（命令模式）
   */
  async generate(args: Record<string, any>, context: SkillContext): Promise<SkillResponse> {
    return this.handle(
      {
        type: 'generate_bp',
        entities: args,
        confidence: 1.0,
      },
      context
    );
  }

  /**
   * 收集项目信息（多轮对话）
   */
  private async collectProjectInfo(
    intent: UserIntent,
    context: SkillContext
  ): Promise<ProjectInfo> {
    // 检查是否已有部分信息
    if (intent.entities.projectInfo) {
      return intent.entities.projectInfo as ProjectInfo;
    }

    // 从存储中获取之前的对话历史
    const conversationHistory = await context.storage.get(
      `fa:conversation:${context.sessionId}`
    );

    // 使用 LLM 提取项目信息
    const extractionPrompt = this.buildExtractionPrompt(conversationHistory);

    const response = await context.llm.chat({
      system: extractionPrompt.system,
      messages: extractionPrompt.messages,
    });

    // 解析提取的信息
    const projectInfo = await extractProjectInfo(response.content);

    // 检查信息完整性，如有缺失引导用户补充
    const missingFields = this.checkMissingFields(projectInfo);

    if (missingFields.length > 0) {
      // 这里应该通过对话继续收集信息
      // 简化处理：使用默认值
      console.warn('[BP Agent] 缺少字段:', missingFields);
    }

    return projectInfo;
  }

  /**
   * 构建信息提取 Prompt
   */
  private buildExtractionPrompt(conversationHistory: any): {
    system: string;
    messages: any[];
  } {
    return {
      system: `你是一位专业的 FA，正在帮助创业者准备商业计划书。
请从对话中提取以下项目信息：
- 项目名称
- 所属行业
- 发展阶段
- 融资轮次
- 项目描述
- 团队信息
- 产品信息
- 市场信息
- 商业模式
- 财务数据

以 JSON 格式返回提取的信息。`,
      messages: conversationHistory || [],
    };
  }

  /**
   * 检查缺失字段
   */
  private checkMissingFields(projectInfo: ProjectInfo): string[] {
    const required = ['name', 'industry', 'stage', 'fundingRound', 'description'];
    const missing: string[] = [];

    for (const field of required) {
      if (!projectInfo[field as keyof ProjectInfo]) {
        missing.push(field);
      }
    }

    return missing;
  }

  /**
   * 格式化 BP 预览
   */
  private formatBPPreview(bpContent: any): string {
    return `
📊 **商业计划书大纲**

1. 执行摘要
   ${bpContent.executive_summary.substring(0, 200)}...

2. 公司介绍
   ${bpContent.company_intro.substring(0, 150)}...

3. 市场分析
   - 目标市场规模: ${bpContent.market_size}
   - 增长趋势: ${bpContent.market_trends}

4. 产品/服务
   ${bpContent.product_description.substring(0, 150)}...

5. 商业模式
   ${bpContent.business_model}

6. 竞争分析
   主要竞品: ${bpContent.competitors.join(', ')}

7. 团队介绍
   核心成员: ${bpContent.team_count} 人

8. 财务规划
   预计 3 年营收: ${bpContent.revenue_projection}

9. 融资计划
   本轮融资: ${bpContent.funding_amount}
`;
  }
}
