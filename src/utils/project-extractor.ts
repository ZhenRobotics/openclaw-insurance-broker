/**
 * 项目信息提取工具
 */

import type { ProjectInfo } from '../types.js';

/**
 * 从文本中提取项目信息
 */
export async function extractProjectInfo(text: string): Promise<ProjectInfo> {
  try {
    // 尝试解析 JSON
    const parsed = JSON.parse(text);

    return {
      name: parsed.name || '未命名项目',
      industry: parsed.industry || '其他',
      sector: parsed.sector,
      stage: parsed.stage || 'idea',
      fundingRound: parsed.fundingRound || 'angel',
      description: parsed.description || '',
      team: parsed.team || [],
      product: parsed.product,
      market: parsed.market,
      business: parsed.business,
      financial: parsed.financial,
    };
  } catch {
    // JSON 解析失败，返回默认值
    return {
      name: '未命名项目',
      industry: '其他',
      stage: 'idea',
      fundingRound: 'angel',
      description: text,
    };
  }
}

/**
 * 验证项目信息完整性
 */
export function validateProjectInfo(projectInfo: ProjectInfo): {
  valid: boolean;
  missingFields: string[];
} {
  const requiredFields = ['name', 'industry', 'stage', 'fundingRound', 'description'];
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!projectInfo[field as keyof ProjectInfo]) {
      missingFields.push(field);
    }
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
