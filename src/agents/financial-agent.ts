/**
 * Financial Agent - 财务建模与估值分析代理
 */

import type {
  SkillContext,
  SkillResponse,
  UserIntent,
  FinancialProjection,
  ValuationAnalysis,
  ProjectInfo,
} from '../types.js';
import { buildFinancialModel } from '../tools/financial-model.js';
import { calculateValuation } from '../tools/valuation.js';

export class FinancialAgent {
  async initialize(context: SkillContext): Promise<void> {
    console.log('[Financial Agent] 初始化完成');
  }

  /**
   * 构建财务模型
   */
  async buildModel(
    intent: UserIntent | Record<string, any>,
    context: SkillContext
  ): Promise<SkillResponse> {
    try {
      const projectInfo = intent.entities?.projectInfo || intent;

      // 构建三表模型
      const model = await buildFinancialModel(projectInfo, context);

      return {
        type: 'text',
        content: this.formatFinancialModel(model),
        metadata: { model },
      };
    } catch (error) {
      return {
        type: 'error',
        content: `构建财务模型时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 估值分析
   */
  async analyzeValuation(
    intent: UserIntent | Record<string, any>,
    context: SkillContext
  ): Promise<SkillResponse> {
    try {
      const projectInfo = intent.entities?.projectInfo || intent;

      // 执行估值分析
      const valuation = await calculateValuation(projectInfo, context);

      return {
        type: 'text',
        content: this.formatValuation(valuation),
        metadata: { valuation },
      };
    } catch (error) {
      return {
        type: 'error',
        content: `估值分析时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 格式化财务模型输出
   */
  private formatFinancialModel(model: any): string {
    const { income_statement, balance_sheet, cash_flow } = model;

    return `
💰 **三年期财务模型**

📈 **损益表 (单位: 万元)**
${this.formatIncomeStatement(income_statement)}

💼 **资产负债表 (单位: 万元)**
${this.formatBalanceSheet(balance_sheet)}

💵 **现金流量表 (单位: 万元)**
${this.formatCashFlow(cash_flow)}

📊 **关键指标**
- 毛利率: ${model.metrics.gross_margin}%
- 净利率: ${model.metrics.net_margin}%
- 收入增长率: ${model.metrics.revenue_growth}%
- 预计盈亏平衡点: 第 ${model.metrics.break_even_month} 个月

💡 **财务建议**
${model.recommendations.map((r: string) => `• ${r}`).join('\n')}
`;
  }

  private formatIncomeStatement(is: any[]): string {
    const headers = '|  项目  | 第1年 | 第2年 | 第3年 |';
    const separator = '|--------|-------|-------|-------|';
    const rows = [
      `| 营业收入 | ${is[0].revenue} | ${is[1].revenue} | ${is[2].revenue} |`,
      `| 营业成本 | ${is[0].cogs} | ${is[1].cogs} | ${is[2].cogs} |`,
      `| 毛利润 | ${is[0].gross_profit} | ${is[1].gross_profit} | ${is[2].gross_profit} |`,
      `| 销售费用 | ${is[0].sales_expense} | ${is[1].sales_expense} | ${is[2].sales_expense} |`,
      `| 管理费用 | ${is[0].admin_expense} | ${is[1].admin_expense} | ${is[2].admin_expense} |`,
      `| 研发费用 | ${is[0].rd_expense} | ${is[1].rd_expense} | ${is[2].rd_expense} |`,
      `| 营业利润 | ${is[0].operating_profit} | ${is[1].operating_profit} | ${is[2].operating_profit} |`,
      `| 净利润 | ${is[0].net_profit} | ${is[1].net_profit} | ${is[2].net_profit} |`,
    ];

    return [headers, separator, ...rows].join('\n');
  }

  private formatBalanceSheet(bs: any[]): string {
    return `
**资产**
- 流动资产: ${bs[0].current_assets} → ${bs[2].current_assets}
- 固定资产: ${bs[0].fixed_assets} → ${bs[2].fixed_assets}

**负债**
- 流动负债: ${bs[0].current_liabilities} → ${bs[2].current_liabilities}
- 长期负债: ${bs[0].long_term_liabilities} → ${bs[2].long_term_liabilities}

**所有者权益**
- 实收资本: ${bs[0].equity} → ${bs[2].equity}
- 留存收益: ${bs[0].retained_earnings} → ${bs[2].retained_earnings}
`;
  }

  private formatCashFlow(cf: any[]): string {
    return `
- 经营活动现金流: ${cf[0].operating} → ${cf[2].operating}
- 投资活动现金流: ${cf[0].investing} → ${cf[2].investing}
- 筹资活动现金流: ${cf[0].financing} → ${cf[2].financing}
- 期末现金余额: ${cf[0].ending_cash} → ${cf[2].ending_cash}
`;
  }

  /**
   * 格式化估值分析输出
   */
  private formatValuation(valuation: ValuationAnalysis): string {
    const { method, estimated_value, comparables } = valuation;

    let content = `
🎯 **估值分析报告**

**估值方法**: ${this.getMethodName(method)}

**估值区间** (单位: 万元)
- 保守估计: ${estimated_value.low.toLocaleString()}
- 中性估计: ${estimated_value.mid.toLocaleString()}
- 乐观估计: ${estimated_value.high.toLocaleString()}
`;

    if (comparables && comparables.length > 0) {
      content += `\n**可比公司**\n`;
      comparables.forEach((comp) => {
        content += `\n${comp.name}\n`;
        content += `  - 轮次: ${comp.latest_round}\n`;
        content += `  - 估值: ${comp.valuation.toLocaleString()} 万元\n`;
        if (comp.revenue) {
          content += `  - PS 倍数: ${comp.multiple}x\n`;
        }
      });
    }

    content += `\n💡 **估值建议**\n`;
    content += valuation.recommendations.map((r) => `• ${r}`).join('\n');

    return content;
  }

  private getMethodName(method: string): string {
    const names: Record<string, string> = {
      comparable: '可比公司法',
      dcf: '现金流折现法 (DCF)',
      venture_capital: '风险投资法',
      market_multiple: '市场倍数法',
    };
    return names[method] || method;
  }
}
