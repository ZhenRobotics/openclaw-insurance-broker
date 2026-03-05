/**
 * Investor Match Agent - 投资人匹配代理
 */

import type {
  SkillContext,
  SkillResponse,
  UserIntent,
  ProjectInfo,
  Investor,
  InvestorMatch,
} from '../types.js';
import { loadInvestorDatabase } from '../tools/investor-db.js';
import { matchInvestors as matchInvestorsUtil } from '../utils/investor-matcher.js';

export class InvestorMatchAgent {
  private investorDb: Investor[] = [];

  async initialize(context: SkillContext): Promise<void> {
    // 加载投资人数据库
    this.investorDb = await loadInvestorDatabase(context);
    console.log(`[Investor Match Agent] 已加载 ${this.investorDb.length} 个投资机构`);
  }

  /**
   * 匹配投资人
   */
  async matchInvestors(
    intent: UserIntent | Record<string, any>,
    context: SkillContext
  ): Promise<SkillResponse> {
    try {
      const projectInfo = intent.entities?.projectInfo || intent;

      // 执行智能匹配
      const matches = await matchInvestorsUtil(
        projectInfo as ProjectInfo,
        this.investorDb,
        context
      );

      // 取前 10 个匹配结果
      const topMatches = matches.slice(0, 10);

      return {
        type: 'text',
        content: this.formatMatches(topMatches),
        metadata: { matches: topMatches },
      };
    } catch (error) {
      return {
        type: 'error',
        content: `匹配投资人时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 分析单个投资人
   */
  async analyzeInvestor(
    intent: UserIntent | Record<string, any>,
    context: SkillContext
  ): Promise<SkillResponse> {
    try {
      const investorName = intent.entities?.investorName || intent.investorName;

      // 在数据库中查找投资人
      const investor = this.investorDb.find(
        (inv) =>
          inv.name === investorName ||
          inv.name_en === investorName ||
          inv.id === investorName
      );

      if (!investor) {
        return {
          type: 'text',
          content: `未找到投资机构: ${investorName}\n\n您可以尝试：\n• 检查机构名称是否正确\n• 使用英文名称搜索\n• 浏览完整投资机构列表`,
        };
      }

      return {
        type: 'text',
        content: this.formatInvestorProfile(investor),
        metadata: { investor },
      };
    } catch (error) {
      return {
        type: 'error',
        content: `分析投资人时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 格式化匹配结果
   */
  private formatMatches(matches: InvestorMatch[]): string {
    let content = `🎯 **为您推荐以下投资机构**\n\n`;

    matches.forEach((match, index) => {
      const { investor, score, reasons } = match;

      content += `**${index + 1}. ${investor.name}**`;
      if (investor.name_en) {
        content += ` (${investor.name_en})`;
      }
      content += `\n`;

      content += `   匹配度: ${Math.round(score * 100)}% ${'⭐'.repeat(Math.ceil(score * 5))}\n`;
      content += `   类型: ${this.getInvestorTypeName(investor.type)}\n`;
      content += `   偏好阶段: ${investor.stage_preference.join(', ')}\n`;
      content += `   投资金额: ${investor.check_size.min}-${investor.check_size.max} 万元\n`;

      content += `   匹配原因:\n`;
      reasons.slice(0, 3).forEach((reason) => {
        content += `   • ${reason}\n`;
      });

      if (investor.contact?.email) {
        content += `   📧 ${investor.contact.email}\n`;
      }

      content += `\n`;
    });

    content += `\n💡 **接触建议**\n`;
    content += `• 优先联系匹配度 80% 以上的机构\n`;
    content += `• 准备好项目 BP 和数据指标\n`;
    content += `• 了解投资机构的决策流程\n`;
    content += `• 通过温暖介绍效果更佳\n`;

    return content;
  }

  /**
   * 格式化投资人画像
   */
  private formatInvestorProfile(investor: Investor): string {
    let content = `🏢 **${investor.name}** 投资画像\n\n`;

    if (investor.name_en) {
      content += `**英文名**: ${investor.name_en}\n`;
    }

    content += `**类型**: ${this.getInvestorTypeName(investor.type)}\n`;
    content += `**偏好阶段**: ${investor.stage_preference.join(', ')}\n`;
    content += `**偏好行业**: ${investor.industry_preference.join(', ')}\n`;
    content += `**投资区域**: ${investor.region_preference.join(', ')}\n\n`;

    content += `**投资规模**\n`;
    content += `- 单笔范围: ${investor.check_size.min}-${investor.check_size.max} 万元\n`;
    content += `- 典型金额: ${investor.check_size.typical} 万元\n\n`;

    if (investor.investment_thesis) {
      content += `**投资理念**\n${investor.investment_thesis}\n\n`;
    }

    if (investor.investment_count) {
      content += `**投资数量**: ${investor.investment_count} 个项目\n\n`;
    }

    if (investor.notable_investments && investor.notable_investments.length > 0) {
      content += `**知名案例**\n`;
      investor.notable_investments.forEach((inv) => {
        content += `• ${inv}\n`;
      });
      content += `\n`;
    }

    if (investor.portfolio && investor.portfolio.length > 0) {
      content += `**投资组合** (部分)\n`;
      investor.portfolio.slice(0, 5).forEach((company) => {
        content += `• ${company.name} - ${company.industry} - ${company.round}轮 (${company.year})\n`;
      });
      content += `\n`;
    }

    if (investor.contact) {
      content += `**联系方式**\n`;
      if (investor.contact.email) content += `📧 ${investor.contact.email}\n`;
      if (investor.contact.phone) content += `📱 ${investor.contact.phone}\n`;
      if (investor.contact.wechat) content += `💬 ${investor.contact.wechat}\n`;
      content += `\n`;
    }

    if (investor.social_media) {
      content += `**社交媒体**\n`;
      if (investor.social_media.website) content += `🌐 ${investor.social_media.website}\n`;
      if (investor.social_media.linkedin) content += `💼 ${investor.social_media.linkedin}\n`;
      if (investor.social_media.twitter) content += `🐦 ${investor.social_media.twitter}\n`;
    }

    return content;
  }

  private getInvestorTypeName(type: string): string {
    const names: Record<string, string> = {
      vc: '风险投资 (VC)',
      pe: '私募股权 (PE)',
      corporate: '战略投资 (CVC)',
      angel: '天使投资',
      government: '政府引导基金',
    };
    return names[type] || type;
  }
}
