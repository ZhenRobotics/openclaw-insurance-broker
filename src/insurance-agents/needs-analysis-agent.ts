/**
 * 保险需求分析 Agent
 * 通过多轮对话收集用户信息，分析保险需求
 */

import type { SkillContext, SkillResponse, UserInfo } from '../insurance-types.js';

export class NeedsAnalysisAgent {
  async initialize(context: SkillContext): Promise<void> {
    console.log('[Needs Analysis Agent] 初始化完成');
  }

  /**
   * 进行保险需求分析
   */
  async analyze(context: SkillContext): Promise<SkillResponse> {
    try {
      // 1. 收集用户信息
      const userInfo = await this.collectUserInfo(context);

      // 2. 分析风险缺口
      const riskAnalysis = await this.analyzeRisks(userInfo, context);

      // 3. 生成需求报告
      const needsReport = this.generateReport(userInfo, riskAnalysis);

      return {
        type: 'text',
        content: needsReport,
        metadata: {
          userInfo,
          riskAnalysis,
        },
      };
    } catch (error) {
      return {
        type: 'error',
        content: `需求分析时出错: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * 收集用户信息（多轮对话）
   */
  private async collectUserInfo(context: SkillContext): Promise<UserInfo> {
    // 检查会话中是否已有部分信息
    const storedInfo = await context.storage.get(`insurance:user:${context.userId}`);

    if (storedInfo) {
      return storedInfo as UserInfo;
    }

    // 使用 LLM 提取用户信息
    const response = await context.llm.chat({
      system: `你是保险需求分析专家。从对话中提取以下信息：
- 年龄
- 性别
- 职业
- 收入水平
- 婚姻状况
- 子女情况
- 健康状况
- 已有保险
- 预算范围

以 JSON 格式返回提取的信息。`,
      messages: [
        {
          role: 'user',
          content: '请分析我的保险需求',
        },
      ],
    });

    // 解析用户信息
    const userInfo: UserInfo = {
      age: 30, // 示例数据
      gender: 'male',
      occupation: 'IT',
      income: 200000,
      income_level: 'middle',
      familySize: 3,
      marital_status: 'married',
      hasChildren: true,
      has_children: true,
      children_count: 1,
      hasMortgage: true,
      healthStatus: 'good',
      health_status: 'good',
      smokingStatus: false,
      existingInsurance: [],
      budget: {
        min: 3000,
        max: 8000,
        recommended: 5000,
      },
    };

    // 保存到会话
    await context.storage.set(`insurance:user:${context.userId}`, userInfo);

    return userInfo;
  }

  /**
   * 分析风险缺口
   */
  private async analyzeRisks(
    userInfo: UserInfo,
    context: SkillContext
  ): Promise<any> {
    const risks = {
      health_risk: this.assessHealthRisk(userInfo),
      death_risk: this.assessDeathRisk(userInfo),
      accident_risk: this.assessAccidentRisk(userInfo),
      property_risk: this.assessPropertyRisk(userInfo),
    };

    return risks;
  }

  /**
   * 评估健康风险
   */
  private assessHealthRisk(userInfo: UserInfo): any {
    const { age, health_status, has_children } = userInfo;

    let risk_level = 'medium';
    const recommendations = [];

    // 年龄因素
    if (age >= 30) {
      risk_level = 'high';
      recommendations.push('重疾险（保额建议年收入的 3-5 倍）');
      recommendations.push('百万医疗险（应对大额医疗费用）');
    }

    // 健康状况
    if (health_status === 'poor' || health_status === 'chronic') {
      recommendations.push('防癌医疗险（健康告知宽松）');
    }

    // 家庭因素
    if (has_children) {
      recommendations.push('考虑为子女配置重疾险和医疗险');
    }

    return {
      risk_level,
      priority: 'high',
      recommended_coverage: age * 50000, // 年龄 * 5 万作为建议保额
      recommendations,
    };
  }

  /**
   * 评估身故风险
   */
  private assessDeathRisk(userInfo: UserInfo): any {
    const { age, marital_status, has_children, income_level } = userInfo;

    let risk_level = 'low';
    const recommendations = [];

    // 家庭责任
    if (marital_status === 'married' || has_children) {
      risk_level = 'high';

      // 计算建议保额（覆盖家庭 5-10 年支出）
      let recommended_coverage = 1000000;
      if (income_level === 'high') {
        recommended_coverage = 2000000;
      } else if (income_level === 'middle') {
        recommended_coverage = 1500000;
      }

      recommendations.push(`定期寿险（保额建议 ${recommended_coverage / 10000} 万）`);
      recommendations.push('保障期建议覆盖至退休或子女独立');
    }

    return {
      risk_level,
      priority: marital_status === 'married' ? 'high' : 'medium',
      recommended_coverage: 1000000,
      recommendations,
    };
  }

  /**
   * 评估意外风险
   */
  private assessAccidentRisk(userInfo: UserInfo): any {
    const { occupation, age } = userInfo;

    return {
      risk_level: 'medium',
      priority: 'medium',
      recommended_coverage: 1000000,
      recommendations: [
        '综合意外险（保额 50-100 万）',
        '优先选择含猝死保障的产品',
        '关注职业类别限制',
      ],
    };
  }

  /**
   * 评估财产风险
   */
  private assessPropertyRisk(userInfo: UserInfo): any {
    return {
      risk_level: 'low',
      priority: 'low',
      recommendations: [
        '如有车辆，配置车险',
        '如有房产，考虑家财险',
      ],
    };
  }

  /**
   * 生成需求报告
   */
  private generateReport(userInfo: UserInfo, riskAnalysis: any): string {
    const { age, marital_status, has_children, budget } = userInfo;

    let report = `📊 **保险需求分析报告**\n\n`;

    // 基本信息
    report += `**基本信息**\n`;
    report += `• 年龄: ${age} 岁\n`;
    report += `• 婚姻状况: ${this.formatMaritalStatus(marital_status || '未知')}\n`;
    report += `• 子女: ${has_children ? `有（${userInfo.children_count || 0} 人）` : '无'}\n`;

    if (budget) {
      report += `• 预算: ${budget.min.toLocaleString()} - ${budget.max.toLocaleString()} 元/年\n\n`;
    } else {
      report += `• 预算: 待确定\n\n`;
    }

    // 风险分析
    report += `**风险分析**\n\n`;

    report += `1️⃣ **健康风险** - ${this.formatRiskLevel(riskAnalysis.health_risk.risk_level)}\n`;
    report += `   建议保额: ${(riskAnalysis.health_risk.recommended_coverage / 10000).toFixed(0)} 万元\n`;
    report += `   推荐产品:\n`;
    riskAnalysis.health_risk.recommendations.forEach((rec: string) => {
      report += `   • ${rec}\n`;
    });
    report += `\n`;

    report += `2️⃣ **身故风险** - ${this.formatRiskLevel(riskAnalysis.death_risk.risk_level)}\n`;
    report += `   建议保额: ${(riskAnalysis.death_risk.recommended_coverage / 10000).toFixed(0)} 万元\n`;
    report += `   推荐产品:\n`;
    riskAnalysis.death_risk.recommendations.forEach((rec: string) => {
      report += `   • ${rec}\n`;
    });
    report += `\n`;

    report += `3️⃣ **意外风险** - ${this.formatRiskLevel(riskAnalysis.accident_risk.risk_level)}\n`;
    report += `   推荐产品:\n`;
    riskAnalysis.accident_risk.recommendations.forEach((rec: string) => {
      report += `   • ${rec}\n`;
    });
    report += `\n`;

    // 总结和建议
    report += `**总结与建议**\n\n`;
    report += `优先级排序:\n`;
    report += `1. 健康保障（重疾险 + 医疗险）\n`;
    report += `2. 身故保障（定期寿险）\n`;
    report += `3. 意外保障（综合意外险）\n\n`;

    report += `💡 **下一步**:\n`;
    report += `• 查看推荐产品: 输入 "推荐保险产品"\n`;
    report += `• 设计保险方案: 输入 "设计保险方案"\n`;
    report += `• 了解产品详情: 输入 "重疾险介绍"\n`;

    return report;
  }

  /**
   * 格式化婚姻状况
   */
  private formatMaritalStatus(status: string): string {
    const map: { [key: string]: string } = {
      single: '未婚',
      married: '已婚',
      divorced: '离异',
      widowed: '丧偶',
    };
    return map[status] || status;
  }

  /**
   * 格式化风险等级
   */
  private formatRiskLevel(level: string): string {
    const map: { [key: string]: string } = {
      low: '低 🟢',
      medium: '中 🟡',
      high: '高 🔴',
    };
    return map[level] || level;
  }
}
