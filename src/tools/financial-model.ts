/**
 * 财务建模工具
 */

import type { ProjectInfo, SkillContext } from '../types.js';

/**
 * 构建财务模型（三表）
 */
export async function buildFinancialModel(
  project: ProjectInfo | any,
  context: SkillContext
): Promise<any> {
  // 获取历史财务数据
  const historicalData = project.financial?.revenue_history || [];

  // 获取业务假设
  const assumptions = await getBusinessAssumptions(project, context);

  // 生成三表
  const incomeStatement = generateIncomeStatement(assumptions);
  const balanceSheet = generateBalanceSheet(assumptions);
  const cashFlow = generateCashFlow(assumptions);

  // 计算关键指标
  const metrics = calculateMetrics(incomeStatement, balanceSheet, cashFlow);

  // 生成建议
  const recommendations = generateRecommendations(metrics);

  return {
    income_statement: incomeStatement,
    balance_sheet: balanceSheet,
    cash_flow: cashFlow,
    metrics,
    recommendations,
    assumptions,
  };
}

/**
 * 获取业务假设
 */
async function getBusinessAssumptions(
  project: ProjectInfo | any,
  context: SkillContext
): Promise<any> {
  // 使用 LLM 生成合理的业务假设
  const response = await context.llm.chat({
    system: `你是财务建模专家，根据项目信息生成合理的财务假设。

返回 JSON 格式:
{
  "revenue_growth_rate": [年增长率数组],
  "gross_margin": 毛利率,
  "operating_expense_ratio": {
    "sales_marketing": 销售费用率,
    "rd": 研发费用率,
    "admin": 管理费用率
  },
  "initial_revenue": 起始收入,
  "cac": 获客成本,
  "ltv": 客户生命周期价值
}`,
    messages: [
      {
        role: 'user',
        content: `项目信息:\n${JSON.stringify(project, null, 2)}\n\n请生成财务假设。`,
      },
    ],
  });

  try {
    return JSON.parse(response.content);
  } catch {
    // 默认假设
    return {
      revenue_growth_rate: [1.0, 1.5, 1.3], // 100%, 150%, 130% 增长
      gross_margin: 0.7,
      operating_expense_ratio: {
        sales_marketing: 0.35,
        rd: 0.2,
        admin: 0.15,
      },
      initial_revenue: 100, // 100 万
      cac: 1000,
      ltv: 5000,
    };
  }
}

/**
 * 生成损益表
 */
function generateIncomeStatement(assumptions: any): any[] {
  const years = 3;
  const statements = [];

  let revenue = assumptions.initial_revenue;

  for (let i = 0; i < years; i++) {
    const growthRate = assumptions.revenue_growth_rate[i] || 1.5;
    revenue = i === 0 ? revenue : revenue * growthRate;

    const cogs = revenue * (1 - assumptions.gross_margin);
    const grossProfit = revenue - cogs;

    const salesExpense = revenue * assumptions.operating_expense_ratio.sales_marketing;
    const rdExpense = revenue * assumptions.operating_expense_ratio.rd;
    const adminExpense = revenue * assumptions.operating_expense_ratio.admin;

    const operatingProfit = grossProfit - salesExpense - rdExpense - adminExpense;
    const netProfit = operatingProfit * 0.85; // 假设 15% 税率

    statements.push({
      year: i + 1,
      revenue: Math.round(revenue),
      cogs: Math.round(cogs),
      gross_profit: Math.round(grossProfit),
      sales_expense: Math.round(salesExpense),
      rd_expense: Math.round(rdExpense),
      admin_expense: Math.round(adminExpense),
      operating_profit: Math.round(operatingProfit),
      net_profit: Math.round(netProfit),
    });
  }

  return statements;
}

/**
 * 生成资产负债表
 */
function generateBalanceSheet(assumptions: any): any[] {
  const years = 3;
  const statements = [];

  let cash = assumptions.initial_revenue * 2; // 假设初始现金为 2 倍收入
  let equity = cash;

  for (let i = 0; i < years; i++) {
    const revenue = assumptions.initial_revenue * Math.pow(1.5, i);
    const currentAssets = Math.round(cash + revenue * 0.2); // 应收账款
    const fixedAssets = Math.round(revenue * 0.3);

    const currentLiabilities = Math.round(revenue * 0.15);
    const longTermLiabilities = Math.round(revenue * 0.1);

    const retainedEarnings = Math.round(revenue * 0.15 * i);
    const totalEquity = equity + retainedEarnings;

    statements.push({
      year: i + 1,
      current_assets: currentAssets,
      fixed_assets: fixedAssets,
      total_assets: currentAssets + fixedAssets,
      current_liabilities: currentLiabilities,
      long_term_liabilities: longTermLiabilities,
      total_liabilities: currentLiabilities + longTermLiabilities,
      equity: totalEquity,
      retained_earnings: retainedEarnings,
    });

    cash += revenue * 0.3;
  }

  return statements;
}

/**
 * 生成现金流量表
 */
function generateCashFlow(assumptions: any): any[] {
  const years = 3;
  const statements = [];

  let cash = assumptions.initial_revenue * 2;

  for (let i = 0; i < years; i++) {
    const revenue = assumptions.initial_revenue * Math.pow(1.5, i);
    const operating = Math.round(revenue * 0.2);
    const investing = Math.round(-revenue * 0.15);
    const financing = i === 0 ? Math.round(revenue * 2) : 0;

    cash += operating + investing + financing;

    statements.push({
      year: i + 1,
      operating,
      investing,
      financing,
      net_cash_flow: operating + investing + financing,
      ending_cash: Math.round(cash),
    });
  }

  return statements;
}

/**
 * 计算关键指标
 */
function calculateMetrics(
  incomeStatement: any[],
  balanceSheet: any[],
  cashFlow: any[]
): any {
  const lastYear = incomeStatement[incomeStatement.length - 1];
  const firstYear = incomeStatement[0];

  const grossMargin = (
    (lastYear.gross_profit / lastYear.revenue) *
    100
  ).toFixed(1);
  const netMargin = ((lastYear.net_profit / lastYear.revenue) * 100).toFixed(1);

  const totalGrowth =
    ((lastYear.revenue - firstYear.revenue) / firstYear.revenue) * 100;
  const revenueGrowth = (totalGrowth / (incomeStatement.length - 1)).toFixed(1);

  // 计算盈亏平衡点
  let breakEvenMonth = 0;
  for (let i = 0; i < incomeStatement.length; i++) {
    if (incomeStatement[i].net_profit > 0) {
      breakEvenMonth = i * 12 + 6; // 假设在年中实现
      break;
    }
  }
  if (breakEvenMonth === 0) breakEvenMonth = incomeStatement.length * 12 + 6;

  return {
    gross_margin: grossMargin,
    net_margin: netMargin,
    revenue_growth: revenueGrowth,
    break_even_month: breakEvenMonth,
    ltv_cac_ratio: 5.0, // 简化
    payback_period: 12, // 简化，12 个月
  };
}

/**
 * 生成财务建议
 */
function generateRecommendations(metrics: any): string[] {
  const recommendations = [];

  if (parseFloat(metrics.gross_margin) < 50) {
    recommendations.push('毛利率偏低，建议优化成本结构或提高产品定价');
  }

  if (parseFloat(metrics.net_margin) < 10) {
    recommendations.push('净利率较低，需要控制运营费用');
  }

  if (metrics.break_even_month > 36) {
    recommendations.push('盈亏平衡时间较长，可能需要更多融资以支持发展');
  }

  if (parseFloat(metrics.revenue_growth) > 100) {
    recommendations.push('高增长预期，需要确保有足够的资源支撑');
  }

  if (recommendations.length === 0) {
    recommendations.push('财务模型整体合理，建议定期更新和调整假设');
  }

  return recommendations;
}
