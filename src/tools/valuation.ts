/**
 * 估值分析工具
 */

import type {
  ProjectInfo,
  ValuationAnalysis,
  ComparableCompany,
  SkillContext,
} from '../types.js';

/**
 * 计算项目估值
 */
export async function calculateValuation(
  project: ProjectInfo | any,
  context: SkillContext
): Promise<ValuationAnalysis> {
  // 根据项目阶段选择合适的估值方法
  const method = selectValuationMethod(project);

  let analysis: ValuationAnalysis;

  switch (method) {
    case 'comparable':
      analysis = await comparableValuation(project, context);
      break;
    case 'venture_capital':
      analysis = ventureCapitalValuation(project);
      break;
    case 'market_multiple':
      analysis = await marketMultipleValuation(project, context);
      break;
    case 'dcf':
    default:
      analysis = dcfValuation(project);
      break;
  }

  return analysis;
}

/**
 * 选择估值方法
 */
function selectValuationMethod(
  project: ProjectInfo | any
): 'comparable' | 'dcf' | 'venture_capital' | 'market_multiple' {
  // 根据项目阶段和数据完整性选择方法
  if (project.stage === 'idea' || project.stage === 'mvp') {
    return 'venture_capital'; // 早期项目用风险投资法
  }

  if (project.financial?.revenue_history && project.financial.revenue_history.length > 0) {
    return 'market_multiple'; // 有收入用市场倍数法
  }

  return 'comparable'; // 默认用可比公司法
}

/**
 * 可比公司法估值
 */
async function comparableValuation(
  project: ProjectInfo | any,
  context: SkillContext
): Promise<ValuationAnalysis> {
  // 查找可比公司
  const comparables = await findComparables(project, context);

  // 计算估值
  const avgMultiple =
    comparables.reduce((sum, comp) => sum + (comp.multiple || 0), 0) /
    comparables.length;

  const projectRevenue = project.financial?.revenue_history?.slice(-1)[0]?.revenue || 100;

  const estimatedValue = {
    low: Math.round(projectRevenue * avgMultiple * 0.7),
    mid: Math.round(projectRevenue * avgMultiple),
    high: Math.round(projectRevenue * avgMultiple * 1.3),
  };

  return {
    method: 'comparable',
    estimated_value: estimatedValue,
    comparables,
    assumptions: {
      revenue: projectRevenue,
      avg_multiple: avgMultiple,
      discount_factor: 0.7,
    },
    recommendations: [
      `基于可比公司分析，估值区间为 ${estimatedValue.low.toLocaleString()} - ${estimatedValue.high.toLocaleString()} 万元`,
      '建议重点参考同阶段、同行业的近期融资案例',
      '考虑自身的差异化优势调整估值',
    ],
  };
}

/**
 * 查找可比公司
 */
async function findComparables(
  project: ProjectInfo | any,
  context: SkillContext
): Promise<ComparableCompany[]> {
  // 使用 LLM 生成可比公司列表
  const response = await context.llm.chat({
    system: `你是投资研究分析师，请找出与目标项目可比的公司。

返回 JSON 数组格式:
[
  {
    "name": "公司名称",
    "industry": "行业",
    "stage": "阶段",
    "latest_round": "最近融资轮次",
    "valuation": 估值(万元),
    "revenue": 收入(万元),
    "growth_rate": 增长率(%),
    "multiple": PS倍数
  }
]`,
    messages: [
      {
        role: 'user',
        content: `项目: ${project.name}\n行业: ${project.industry}\n阶段: ${project.stage}\n\n请找出 5-8 家可比公司。`,
      },
    ],
  });

  try {
    return JSON.parse(response.content);
  } catch {
    // 默认可比公司
    return [
      {
        name: '示例公司 A',
        industry: project.industry,
        stage: project.stage,
        latest_round: project.fundingRound,
        valuation: 5000,
        revenue: 500,
        growth_rate: 150,
        multiple: 10,
      },
      {
        name: '示例公司 B',
        industry: project.industry,
        stage: project.stage,
        latest_round: project.fundingRound,
        valuation: 8000,
        revenue: 600,
        growth_rate: 180,
        multiple: 13.3,
      },
    ];
  }
}

/**
 * 市场倍数法估值
 */
async function marketMultipleValuation(
  project: ProjectInfo | any,
  context: SkillContext
): Promise<ValuationAnalysis> {
  // 获取行业平均 PS 倍数
  const industryMultiple = await getIndustryMultiple(project.industry, context);

  const revenue = project.financial?.revenue_history?.slice(-1)[0]?.revenue || 100;

  const estimatedValue = {
    low: Math.round(revenue * industryMultiple.low),
    mid: Math.round(revenue * industryMultiple.mid),
    high: Math.round(revenue * industryMultiple.high),
  };

  return {
    method: 'market_multiple',
    estimated_value: estimatedValue,
    assumptions: {
      revenue,
      ps_multiple: industryMultiple,
    },
    recommendations: [
      `基于市场倍数法，PS 倍数取 ${industryMultiple.low}x - ${industryMultiple.high}x`,
      '高增长公司可以获得更高的估值倍数',
      '建议突出自身的增长潜力和竞争优势',
    ],
  };
}

/**
 * 获取行业倍数
 */
async function getIndustryMultiple(
  industry: string,
  context: SkillContext
): Promise<{ low: number; mid: number; high: number }> {
  // 简化：返回预设的行业倍数
  const industryMultiples: Record<string, any> = {
    SaaS: { low: 5, mid: 8, high: 12 },
    企业服务: { low: 4, mid: 6, high: 10 },
    电商: { low: 1, mid: 2, high: 3 },
    教育: { low: 3, mid: 5, high: 8 },
    医疗: { low: 4, mid: 7, high: 10 },
    金融科技: { low: 5, mid: 8, high: 12 },
    AI: { low: 8, mid: 12, high: 20 },
  };

  return industryMultiples[industry] || { low: 3, mid: 5, high: 8 };
}

/**
 * 风险投资法估值
 */
function ventureCapitalValuation(project: ProjectInfo | any): ValuationAnalysis {
  // 早期项目估值参数
  const params = {
    angel: { low: 500, mid: 1000, high: 2000 },
    'pre-a': { low: 2000, mid: 4000, high: 8000 },
    a: { low: 5000, mid: 10000, high: 20000 },
    b: { low: 15000, mid: 30000, high: 50000 },
  };

  const fundingRound = project.fundingRound || 'angel';
  const estimatedValue =
    params[fundingRound as keyof typeof params] || params.angel;

  return {
    method: 'venture_capital',
    estimated_value: estimatedValue,
    assumptions: {
      funding_round: fundingRound,
      typical_range: estimatedValue,
    },
    recommendations: [
      `${fundingRound} 轮的典型估值范围`,
      '早期估值主要基于团队、市场空间和技术壁垒',
      '建议突出团队背景和技术优势',
      '关键是找到认可赛道的投资人',
    ],
  };
}

/**
 * DCF 估值（现金流折现法）
 */
function dcfValuation(project: ProjectInfo | any): ValuationAnalysis {
  // 简化的 DCF 计算
  const projections = project.financial?.projections || {
    periods: 5,
    revenue: [100, 200, 400, 700, 1000],
    cost: [80, 140, 260, 420, 600],
  };

  const discountRate = 0.15; // 15% 折现率
  let npv = 0;

  for (let i = 0; i < projections.periods; i++) {
    const fcf = projections.revenue[i] - projections.cost[i];
    npv += fcf / Math.pow(1 + discountRate, i + 1);
  }

  // 加上终值
  const terminalValue =
    (projections.revenue[projections.periods - 1] * 0.2) / (discountRate - 0.03);
  npv += terminalValue / Math.pow(1 + discountRate, projections.periods);

  const estimatedValue = {
    low: Math.round(npv * 0.7),
    mid: Math.round(npv),
    high: Math.round(npv * 1.3),
  };

  return {
    method: 'dcf',
    estimated_value: estimatedValue,
    assumptions: {
      discount_rate: discountRate,
      terminal_growth_rate: 0.03,
      projection_periods: projections.periods,
    },
    recommendations: [
      'DCF 法适用于有稳定现金流预测的成熟项目',
      '关键假设是折现率和永续增长率',
      '建议结合其他方法交叉验证',
    ],
  };
}
