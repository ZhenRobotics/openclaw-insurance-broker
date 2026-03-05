/**
 * BP 生成工具
 */

import type { ProjectInfo, SkillContext } from '../types.js';

/**
 * 生成商业计划书内容
 */
export async function generateBPContent(
  project: ProjectInfo,
  context: SkillContext
): Promise<any> {
  const prompt = buildBPPrompt(project);

  const response = await context.llm.chat({
    system: prompt.system,
    messages: [
      {
        role: 'user',
        content: prompt.userMessage,
      },
    ],
    temperature: 0.7,
    maxTokens: 4000,
  });

  // 解析生成的 BP 内容
  return parseBPContent(response.content, project);
}

/**
 * 构建 BP 生成 Prompt
 */
function buildBPPrompt(project: ProjectInfo): {
  system: string;
  userMessage: string;
} {
  return {
    system: `你是一位资深的商业计划书撰写专家，曾帮助数百家创业公司成功融资。

请根据项目信息生成一份专业的商业计划书，包含以下章节：

1. 执行摘要 (Executive Summary)
   - 简明扼要，突出核心价值
   - 1-2 段话说清楚：做什么、解决什么问题、为什么能成功

2. 公司介绍
   - 愿景使命
   - 发展历程
   - 主要成就

3. 市场分析
   - 目标市场规模 (TAM/SAM/SOM)
   - 市场趋势和增长驱动因素
   - 用户痛点

4. 产品/服务
   - 核心产品介绍
   - 技术优势
   - 竞争壁垒

5. 商业模式
   - 盈利模式
   - 定价策略
   - 单位经济模型

6. 竞争分析
   - 主要竞品
   - 竞争优势
   - 差异化定位

7. 市场营销
   - 获客策略
   - 增长计划
   - 渠道策略

8. 团队介绍
   - 创始人和核心团队
   - 顾问/投资人背景

9. 财务规划
   - 历史财务数据
   - 未来 3 年预测
   - 关键财务指标

10. 融资计划
    - 融资金额和用途
    - 里程碑规划
    - 退出机制

要求：
- 语言专业但不失生动
- 数据详实，有理有据
- 突出亮点，但不夸大
- 格式清晰，逻辑严密`,

    userMessage: `请为以下项目生成商业计划书：

项目名称: ${project.name}
所属行业: ${project.industry}
发展阶段: ${project.stage}
融资轮次: ${project.fundingRound}

项目描述:
${project.description}

${project.team ? `团队信息:\n${JSON.stringify(project.team, null, 2)}` : ''}

${project.product ? `产品信息:\n${JSON.stringify(project.product, null, 2)}` : ''}

${project.market ? `市场信息:\n${JSON.stringify(project.market, null, 2)}` : ''}

${project.business ? `商业信息:\n${JSON.stringify(project.business, null, 2)}` : ''}

${project.financial ? `财务信息:\n${JSON.stringify(project.financial, null, 2)}` : ''}

请生成详细的商业计划书内容。`,
  };
}

/**
 * 解析 BP 内容
 */
function parseBPContent(content: string, project: ProjectInfo): any {
  // 简化版：直接返回生成的内容
  // 实际应该做更复杂的解析和结构化

  return {
    executive_summary: content.substring(0, 500),
    company_intro: `${project.name} 是一家专注于 ${project.industry} 的创新企业...`,
    market_size: '100 亿人民币',
    market_trends: '年增长率 30%',
    product_description: project.product?.description || '创新产品...',
    business_model: project.business?.model || 'B2B SaaS',
    competitors: project.market?.competitors?.map((c) => c.name) || ['竞品A', '竞品B'],
    team_count: project.team?.length || 5,
    revenue_projection: '第三年 5000 万',
    funding_amount: '2000 万人民币',
    full_content: content,
    recommendations: [
      '建议补充更多财务数据支撑',
      '可以增加客户案例和证言',
      '市场规模需要引用权威数据来源',
      '团队背景可以更加详细',
    ],
  };
}

/**
 * 优化 BP 内容（多轮迭代）
 */
export async function optimizeBP(
  currentBP: any,
  feedback: string,
  context: SkillContext
): Promise<any> {
  const response = await context.llm.chat({
    system: `你是 BP 优化专家，根据反馈改进商业计划书。`,
    messages: [
      {
        role: 'user',
        content: `当前 BP:\n${currentBP.full_content}\n\n反馈意见:\n${feedback}\n\n请优化 BP 内容。`,
      },
    ],
  });

  return parseBPContent(response.content, currentBP.project);
}
