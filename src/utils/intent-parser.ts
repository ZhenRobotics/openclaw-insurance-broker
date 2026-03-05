/**
 * 意图识别解析器
 */

import type { UserIntent, IntentType, SkillContext } from '../types.js';

/**
 * 解析用户意图
 */
export async function parseUserIntent(
  message: string,
  context: SkillContext
): Promise<UserIntent> {
  // 关键词匹配（简单版本）
  const keywords: Record<IntentType, string[]> = {
    generate_bp: ['bp', '商业计划书', '计划书', '生成bp', '写bp'],
    build_financial_model: ['财务模型', '三表', '财务预测', '财务规划', '损益表'],
    analyze_valuation: ['估值', '估价', '公司价值', '值多少钱'],
    match_investors: ['推荐投资人', '匹配投资', '找投资', '投资机构', '投资人'],
    analyze_investor: ['分析', '投资人画像', '机构分析'],
    fundraising_strategy: ['融资策略', '融资规划', '怎么融资', '融资建议'],
    term_sheet_review: ['term sheet', '投资条款', '条款解读'],
    due_diligence_prep: ['尽调', '尽职调查', '材料清单', 'dd'],
    industry_analysis: ['行业分析', '赛道', '市场分析', '行业趋势'],
    general_consultation: [],
    unknown: [],
  };

  // 遍历关键词进行匹配
  for (const [intentType, words] of Object.entries(keywords)) {
    if (words.some((word) => message.toLowerCase().includes(word.toLowerCase()))) {
      return {
        type: intentType as IntentType,
        entities: await extractEntities(message, intentType as IntentType, context),
        confidence: 0.8,
      };
    }
  }

  // 使用 LLM 进行意图识别
  return await parseWithLLM(message, context);
}

/**
 * 使用 LLM 识别意图
 */
async function parseWithLLM(
  message: string,
  context: SkillContext
): Promise<UserIntent> {
  const response = await context.llm.chat({
    system: `你是一个意图识别助手。分析用户消息并返回意图类型和实体。

可用的意图类型：
- generate_bp: 生成商业计划书
- build_financial_model: 构建财务模型
- analyze_valuation: 估值分析
- match_investors: 匹配投资人
- analyze_investor: 分析投资机构
- fundraising_strategy: 融资策略
- term_sheet_review: Term Sheet 解读
- due_diligence_prep: 尽调准备
- industry_analysis: 行业分析
- general_consultation: 一般咨询

以 JSON 格式返回:
{
  "type": "意图类型",
  "entities": {实体对象},
  "confidence": 0-1 之间的置信度
}`,
    messages: [
      {
        role: 'user',
        content: message,
      },
    ],
  });

  try {
    const result = JSON.parse(response.content);
    return {
      type: result.type || 'general_consultation',
      entities: result.entities || {},
      confidence: result.confidence || 0.5,
    };
  } catch {
    return {
      type: 'general_consultation',
      entities: {},
      confidence: 0.5,
    };
  }
}

/**
 * 提取实体信息
 */
async function extractEntities(
  message: string,
  intentType: IntentType,
  context: SkillContext
): Promise<Record<string, any>> {
  const entities: Record<string, any> = {};

  // 根据意图类型提取不同的实体
  switch (intentType) {
    case 'generate_bp':
      // 提取行业、阶段等信息
      entities.industry = extractIndustry(message);
      entities.stage = extractStage(message);
      break;

    case 'match_investors':
      entities.fundingRound = extractFundingRound(message);
      entities.amount = extractAmount(message);
      break;

    case 'analyze_investor':
      entities.investorName = extractInvestorName(message);
      break;

    case 'industry_analysis':
      entities.industry = extractIndustry(message);
      break;
  }

  return entities;
}

/**
 * 提取行业信息
 */
function extractIndustry(message: string): string | undefined {
  const industries = [
    'SaaS',
    '企业服务',
    '电商',
    '教育',
    '医疗',
    '金融科技',
    'AI',
    '人工智能',
    '大数据',
    '物联网',
    '新能源',
    '智能硬件',
  ];

  for (const industry of industries) {
    if (message.includes(industry)) {
      return industry;
    }
  }

  return undefined;
}

/**
 * 提取发展阶段
 */
function extractStage(message: string): string | undefined {
  const stages: Record<string, string> = {
    '想法': 'idea',
    'MVP': 'mvp',
    '产品': 'mvp',
    '早期': 'early-revenue',
    '增长': 'growth',
    '成熟': 'mature',
  };

  for (const [keyword, stage] of Object.entries(stages)) {
    if (message.includes(keyword)) {
      return stage;
    }
  }

  return undefined;
}

/**
 * 提取融资轮次
 */
function extractFundingRound(message: string): string | undefined {
  const rounds = ['天使', 'angel', 'pre-a', 'a轮', 'b轮', 'c轮'];

  for (const round of rounds) {
    if (message.toLowerCase().includes(round.toLowerCase())) {
      return round.replace('轮', '').replace('天使', 'angel');
    }
  }

  return undefined;
}

/**
 * 提取金额
 */
function extractAmount(message: string): number | undefined {
  // 匹配数字 + 单位（万、百万、千万、亿）
  const regex = /(\d+(?:\.\d+)?)\s*(万|百万|千万|亿)/;
  const match = message.match(regex);

  if (match) {
    const num = parseFloat(match[1]);
    const unit = match[2];

    switch (unit) {
      case '万':
        return num;
      case '百万':
        return num * 100;
      case '千万':
        return num * 1000;
      case '亿':
        return num * 10000;
    }
  }

  return undefined;
}

/**
 * 提取投资人名称
 */
function extractInvestorName(message: string): string | undefined {
  // 简单实现：去除"分析"等关键词后的剩余部分
  return message
    .replace(/分析|投资人|机构|画像|的|了解/g, '')
    .trim();
}
