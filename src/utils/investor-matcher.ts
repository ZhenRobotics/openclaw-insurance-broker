/**
 * 投资人智能匹配算法
 */

import type {
  ProjectInfo,
  Investor,
  InvestorMatch,
  SkillContext,
} from '../types.js';

/**
 * 匹配投资人
 */
export async function matchInvestors(
  project: ProjectInfo,
  investors: Investor[],
  context: SkillContext
): Promise<InvestorMatch[]> {
  const matches: InvestorMatch[] = [];

  for (const investor of investors) {
    const match = await calculateMatch(project, investor, context);
    if (match.score > 0.3) {
      // 只返回匹配度 > 30% 的
      matches.push(match);
    }
  }

  // 按匹配度排序
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * 计算单个投资人的匹配度
 */
async function calculateMatch(
  project: ProjectInfo,
  investor: Investor,
  context: SkillContext
): Promise<InvestorMatch> {
  let score = 0;
  const reasons: string[] = [];
  const recommendations: string[] = [];

  // 1. 融资阶段匹配 (权重: 30%)
  if (investor.stage_preference.includes(project.fundingRound)) {
    score += 0.3;
    reasons.push(`该机构专注于 ${project.fundingRound} 轮投资`);
  }

  // 2. 行业匹配 (权重: 30%)
  const industryMatch = investor.industry_preference.some((industry) =>
    project.industry.includes(industry) || industry.includes(project.industry)
  );
  if (industryMatch) {
    score += 0.3;
    reasons.push(`与您的行业 (${project.industry}) 高度匹配`);
  }

  // 3. 投资金额匹配 (权重: 20%)
  if (project.financial?.funding_history) {
    const lastRound = project.financial.funding_history.slice(-1)[0];
    if (lastRound) {
      const amount = lastRound.amount;
      if (
        amount >= investor.check_size.min &&
        amount <= investor.check_size.max
      ) {
        score += 0.2;
        reasons.push(
          `投资金额与您的需求匹配 (${investor.check_size.min}-${investor.check_size.max} 万)`
        );
      }
    }
  } else {
    // 没有历史数据，给个中等分
    score += 0.1;
  }

  // 4. 投资组合相关性 (权重: 20%)
  if (investor.portfolio) {
    const relatedCount = investor.portfolio.filter((company) =>
      company.industry.includes(project.industry)
    ).length;

    if (relatedCount > 0) {
      score += 0.2 * Math.min(relatedCount / 5, 1);
      reasons.push(
        `已投资 ${relatedCount} 个相关行业项目，有丰富的资源和经验`
      );
    }
  }

  // 生成推荐建议
  if (score > 0.7) {
    recommendations.push('强烈推荐：优先接触该机构');
    recommendations.push('准备好详细的数据指标和 BP');
  } else if (score > 0.5) {
    recommendations.push('值得尝试：可以发送 BP 建立初步联系');
  } else if (score > 0.3) {
    recommendations.push('备选机构：如前期接触不顺利可考虑');
  }

  if (investor.notable_investments && investor.notable_investments.length > 0) {
    recommendations.push(
      `可以研究该机构的明星案例: ${investor.notable_investments[0]}`
    );
  }

  return {
    investor,
    score,
    reasons,
    recommendations,
  };
}

/**
 * 使用 LLM 增强匹配（可选）
 */
export async function enhanceMatchWithLLM(
  project: ProjectInfo,
  investor: Investor,
  context: SkillContext
): Promise<{
  score: number;
  reasoning: string;
}> {
  const response = await context.llm.chat({
    system: `你是投资匹配专家。评估项目与投资机构的匹配度，返回 0-1 之间的分数和理由。`,
    messages: [
      {
        role: 'user',
        content: `项目: ${JSON.stringify(project)}\n\n投资机构: ${JSON.stringify(investor)}\n\n请评估匹配度并说明理由。`,
      },
    ],
  });

  // 简化处理
  return {
    score: 0.5,
    reasoning: response.content,
  };
}
