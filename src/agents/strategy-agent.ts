/**
 * Strategy Agent - 融资策略与尽调支持代理
 */

import type {
  SkillContext,
  SkillResponse,
  UserIntent,
  FundraisingStrategy,
  DueDiligenceChecklist,
} from '../types.js';

export class StrategyAgent {
  async initialize(context: SkillContext): Promise<void> {
    console.log('[Strategy Agent] 初始化完成');
  }

  /**
   * 创建融资策略
   */
  async createStrategy(
    intent: UserIntent | Record<string, any>,
    context: SkillContext
  ): Promise<SkillResponse> {
    try {
      const projectInfo = intent.entities?.projectInfo || intent;

      // 使用 LLM 生成融资策略
      const response = await context.llm.chat({
        system: this.getStrategySystemPrompt(),
        messages: [
          {
            role: 'user',
            content: `请为以下项目制定融资策略:\n${JSON.stringify(projectInfo, null, 2)}`,
          },
        ],
      });

      // 解析策略（简化版，实际应该更复杂）
      const strategy = this.parseStrategy(response.content);

      return {
        type: 'text',
        content: this.formatStrategy(strategy),
        metadata: { strategy },
      };
    } catch (error) {
      return {
        type: 'error',
        content: `制定融资策略时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Term Sheet 解读
   */
  async reviewTermSheet(
    intent: UserIntent | Record<string, any>,
    context: SkillContext
  ): Promise<SkillResponse> {
    try {
      const termSheet = intent.entities?.termSheet || intent.termSheet;

      const response = await context.llm.chat({
        system: this.getTermSheetSystemPrompt(),
        messages: [
          {
            role: 'user',
            content: `请解读以下 Term Sheet 并提供谈判建议:\n${termSheet}`,
          },
        ],
      });

      return {
        type: 'text',
        content: response.content,
      };
    } catch (error) {
      return {
        type: 'error',
        content: `解读 Term Sheet 时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 准备尽调材料
   */
  async prepareDueDiligence(
    intent: UserIntent | Record<string, any>,
    context: SkillContext
  ): Promise<SkillResponse> {
    try {
      const checklist = this.generateDDChecklist();

      return {
        type: 'text',
        content: this.formatDDChecklist(checklist),
        metadata: { checklist },
      };
    } catch (error) {
      return {
        type: 'error',
        content: `生成尽调清单时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 行业分析
   */
  async analyzeIndustry(
    intent: UserIntent | Record<string, any>,
    context: SkillContext
  ): Promise<SkillResponse> {
    try {
      const industry = intent.entities?.industry || intent.industry;

      let searchResults = [];
      if (context.tools.searchWeb && context.config.enableWebSearch) {
        // 使用网络搜索获取最新行业数据
        searchResults = await context.tools.searchWeb(
          `${industry} 行业趋势 投资 2024-2026`
        );
      }

      const response = await context.llm.chat({
        system: this.getIndustryAnalysisSystemPrompt(),
        messages: [
          {
            role: 'user',
            content: `请分析 ${industry} 行业的投资趋势、市场规模和竞争格局。\n\n参考资料:\n${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}`,
          },
        ],
      });

      return {
        type: 'text',
        content: response.content,
      };
    } catch (error) {
      return {
        type: 'error',
        content: `分析行业时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * System Prompts
   */
  private getStrategySystemPrompt(): string {
    return `你是一位资深的融资顾问，专注于帮助创业公司制定融资策略。

请根据项目信息提供以下内容：
1. 推荐的融资轮次和金额
2. 预计稀释比例
3. Pre-money 估值建议
4. 融资时间线（各阶段及时长）
5. 关键里程碑
6. Pitch 策略要点
7. 谈判技巧

以结构化的方式输出，包含具体的数字和可执行的建议。`;
  }

  private getTermSheetSystemPrompt(): string {
    return `你是一位精通投资条款的法律和财务顾问。

请解读 Term Sheet 中的关键条款，包括但不限于：
- 估值和定价
- 优先清算权
- 反稀释条款
- 董事会席位
- 保护性条款
- 拖售权和跟售权
- 回购权

对每个条款：
1. 解释其含义
2. 分析对创始人的影响
3. 提供谈判建议
4. 指出需要特别注意的风险点`;
  }

  private getIndustryAnalysisSystemPrompt(): string {
    return `你是一位行业分析专家，专注于一级市场投资研究。

请提供全面的行业分析报告，包括：
1. 行业概况和定义
2. 市场规模和增长趋势
3. 产业链结构
4. 竞争格局和主要玩家
5. 投资热度和趋势
6. 关键成功因素
7. 风险和挑战
8. 未来展望

使用数据支撑观点，引用可靠来源。`;
  }

  /**
   * 解析融资策略（简化版）
   */
  private parseStrategy(content: string): FundraisingStrategy {
    // 实际应该用更复杂的解析逻辑
    return {
      recommended_round: 'Pre-A',
      target_amount: 2000,
      dilution_estimate: 15,
      pre_money_valuation: 8000,
      timeline: [
        {
          phase: '准备阶段',
          duration: '4-6 周',
          activities: ['完善 BP', '准备财务数据', '整理尽调材料'],
        },
        {
          phase: '接触阶段',
          duration: '6-8 周',
          activities: ['初步接触投资人', '发送 BP', '安排初步会议'],
        },
        {
          phase: '尽调阶段',
          duration: '4-6 周',
          activities: ['配合尽调', '回答问题', '提供补充材料'],
        },
        {
          phase: '谈判签约',
          duration: '2-4 周',
          activities: ['Term Sheet 谈判', '法律文件审核', '签约交割'],
        },
      ],
      key_milestones: [
        {
          title: 'BP 定稿',
          description: '完成商业计划书并获得 3 位行业专家反馈',
          deadline: '第 2 周',
          importance: 'critical',
        },
        {
          title: '首轮接触',
          description: '与 20 家目标投资机构建立初步联系',
          deadline: '第 8 周',
          importance: 'high',
        },
      ],
      pitch_strategy: [
        '开场 30 秒抓住注意力，突出核心价值主张',
        '用数据说话，展示增长势头',
        '讲故事，让投资人记住你的愿景',
        '提前准备常见问题的答案',
      ],
      negotiation_tips: [
        '不要急于接受第一个 offer',
        '争取更高估值，但要有数据支撑',
        '关注条款的长期影响，不只是估值',
        '保持多个投资人同时推进，增加议价能力',
      ],
    };
  }

  /**
   * 格式化融资策略
   */
  private formatStrategy(strategy: FundraisingStrategy): string {
    let content = `🚀 **融资策略方案**\n\n`;

    content += `**融资概要**\n`;
    content += `- 推荐轮次: ${strategy.recommended_round}\n`;
    content += `- 目标金额: ${strategy.target_amount.toLocaleString()} 万元\n`;
    content += `- 预计稀释: ${strategy.dilution_estimate}%\n`;
    content += `- Pre-money 估值: ${strategy.pre_money_valuation.toLocaleString()} 万元\n\n`;

    content += `**融资时间线** (预计 16-24 周)\n`;
    strategy.timeline.forEach((phase, i) => {
      content += `\n${i + 1}. **${phase.phase}** (${phase.duration})\n`;
      phase.activities.forEach((activity) => {
        content += `   • ${activity}\n`;
      });
    });

    content += `\n**关键里程碑**\n`;
    strategy.key_milestones.forEach((milestone) => {
      const icon =
        milestone.importance === 'critical'
          ? '🔴'
          : milestone.importance === 'high'
          ? '🟡'
          : '🟢';
      content += `\n${icon} **${milestone.title}** (${milestone.deadline})\n`;
      content += `   ${milestone.description}\n`;
    });

    content += `\n📊 **Pitch 策略**\n`;
    strategy.pitch_strategy.forEach((tip) => {
      content += `• ${tip}\n`;
    });

    content += `\n🤝 **谈判建议**\n`;
    strategy.negotiation_tips.forEach((tip) => {
      content += `• ${tip}\n`;
    });

    return content;
  }

  /**
   * 生成尽调清单
   */
  private generateDDChecklist(): DueDiligenceChecklist {
    return {
      categories: [
        {
          name: '公司基本信息',
          items: [
            {
              title: '营业执照',
              description: '公司营业执照副本',
              required: true,
              documents: ['营业执照扫描件', '最新年检记录'],
            },
            {
              title: '公司章程',
              description: '现行有效的公司章程',
              required: true,
              documents: ['公司章程', '历次章程修正案'],
            },
            {
              title: '股权结构',
              description: '完整的股权结构和股东名册',
              required: true,
              documents: ['股东名册', '股权架构图', '代持协议（如有）'],
            },
          ],
        },
        {
          name: '财务信息',
          items: [
            {
              title: '财务报表',
              description: '近三年及最近一期财务报表',
              required: true,
              documents: [
                '资产负债表',
                '利润表',
                '现金流量表',
                '审计报告（如有）',
              ],
            },
            {
              title: '税务文件',
              description: '纳税申报和完税证明',
              required: true,
              documents: ['纳税申报表', '完税证明', '税务合规证明'],
            },
            {
              title: '银行账户',
              description: '公司银行账户信息和流水',
              required: true,
              documents: ['银行开户许可证', '近6个月银行流水'],
            },
          ],
        },
        {
          name: '业务运营',
          items: [
            {
              title: '商业合同',
              description: '重要的商业合同和协议',
              required: true,
              documents: ['客户合同清单', '供应商合同清单', '重大合同原件'],
            },
            {
              title: '知识产权',
              description: '专利、商标、著作权等',
              required: true,
              documents: [
                '专利证书',
                '商标注册证',
                '软件著作权证书',
                'IP 清单',
              ],
            },
            {
              title: '产品技术',
              description: '产品介绍和技术文档',
              required: false,
              documents: ['产品说明书', '技术白皮书', '研发文档'],
            },
          ],
        },
        {
          name: '人力资源',
          items: [
            {
              title: '组织架构',
              description: '公司组织架构和人员名单',
              required: true,
              documents: ['组织架构图', '员工花名册'],
            },
            {
              title: '核心团队',
              description: '创始人和核心团队简历',
              required: true,
              documents: ['创始人简历', '核心团队背景调查'],
            },
            {
              title: '劳动合同',
              description: '员工劳动合同和社保缴纳',
              required: true,
              documents: ['劳动合同样本', '社保缴纳证明'],
            },
          ],
        },
        {
          name: '法律合规',
          items: [
            {
              title: '诉讼仲裁',
              description: '历史和进行中的诉讼、仲裁',
              required: true,
              documents: ['诉讼清单', '法院判决书（如有）'],
            },
            {
              title: '行政处罚',
              description: '行政处罚和监管措施',
              required: true,
              documents: ['行政处罚决定书（如有）', '合规声明'],
            },
            {
              title: '关联交易',
              description: '关联方及关联交易情况',
              required: true,
              documents: ['关联方清单', '关联交易明细'],
            },
          ],
        },
      ],
      estimated_time: '4-6 周',
      tips: [
        '提前准备，避免临时抱佛脚',
        '建立电子数据室，方便投资人查阅',
        '对敏感信息做好脱敏处理',
        '指定专人负责对接尽调事宜',
        '对可能的问题提前准备解释说明',
      ],
    };
  }

  /**
   * 格式化尽调清单
   */
  private formatDDChecklist(checklist: DueDiligenceChecklist): string {
    let content = `📋 **尽职调查材料清单**\n\n`;
    content += `预计准备时间: ${checklist.estimated_time}\n\n`;

    checklist.categories.forEach((category, i) => {
      content += `**${i + 1}. ${category.name}**\n\n`;

      category.items.forEach((item) => {
        const requiredIcon = item.required ? '🔴 [必需]' : '⚪ [可选]';
        content += `${requiredIcon} **${item.title}**\n`;
        content += `   ${item.description}\n`;
        content += `   所需文件:\n`;
        item.documents.forEach((doc) => {
          content += `   • ${doc}\n`;
        });
        content += `\n`;
      });
    });

    content += `💡 **准备建议**\n`;
    checklist.tips.forEach((tip) => {
      content += `• ${tip}\n`;
    });

    return content;
  }
}
