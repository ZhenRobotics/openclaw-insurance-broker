/**
 * 投资人数据库管理
 */

import type { Investor, SkillContext } from '../types.js';

/**
 * 加载投资人数据库
 */
export async function loadInvestorDatabase(
  context: SkillContext
): Promise<Investor[]> {
  try {
    // 从配置的路径加载数据
    const dbPath = context.config.investorDatabasePath;
    const data = await context.storage.get(dbPath);

    if (data && Array.isArray(data)) {
      return data;
    }

    // 如果没有数据，返回示例数据
    return getDefaultInvestors();
  } catch (error) {
    console.error('[Investor DB] 加载失败:', error);
    return getDefaultInvestors();
  }
}

/**
 * 获取默认投资人数据（示例）
 */
function getDefaultInvestors(): Investor[] {
  return [
    {
      id: 'sequoia-china',
      name: '红杉资本中国',
      name_en: 'Sequoia Capital China',
      type: 'vc',
      stage_preference: ['a', 'b', 'c'],
      industry_preference: [
        '企业服务',
        'SaaS',
        'AI',
        '金融科技',
        '医疗健康',
        '消费升级',
      ],
      region_preference: ['北京', '上海', '深圳', '杭州'],
      check_size: {
        min: 1000,
        max: 50000,
        typical: 5000,
      },
      investment_count: 500,
      notable_investments: [
        '字节跳动',
        '美团',
        '拼多多',
        '京东',
        '新浪',
        '阿里巴巴',
      ],
      investment_thesis:
        '专注于科技/传媒、医疗健康、消费品/服务三大赛道，寻找具有清晰商业模式、强大执行团队的高成长企业',
      contact: {
        email: 'china@sequoiacap.com',
        address: '北京市朝阳区',
      },
      social_media: {
        website: 'https://www.sequoiacap.com/china',
      },
    },
    {
      id: 'ggv-capital',
      name: 'GGV 纪源资本',
      name_en: 'GGV Capital',
      type: 'vc',
      stage_preference: ['a', 'b', 'c'],
      industry_preference: ['企业服务', '消费互联网', '跨境电商', '新零售'],
      region_preference: ['北京', '上海', '深圳', '美国'],
      check_size: {
        min: 2000,
        max: 30000,
        typical: 8000,
      },
      investment_count: 350,
      notable_investments: ['小红书', '满帮', '哈啰出行', 'Airbnb', 'Wish'],
      investment_thesis: '连接中美市场，投资改变生活方式的创新企业',
      social_media: {
        website: 'https://www.ggvc.com',
      },
    },
    {
      id: 'idg-capital',
      name: 'IDG 资本',
      name_en: 'IDG Capital',
      type: 'vc',
      stage_preference: ['pre-a', 'a', 'b', 'c'],
      industry_preference: [
        'AI',
        '企业服务',
        '医疗健康',
        '新能源',
        '先进制造',
      ],
      region_preference: ['北京', '上海', '深圳', '成都'],
      check_size: {
        min: 1000,
        max: 40000,
        typical: 6000,
      },
      investment_count: 800,
      notable_investments: ['百度', '搜狐', '腾讯', '小米', '美团', '蔚来'],
      investment_thesis: '早期投资专家，关注技术驱动的创新企业',
      social_media: {
        website: 'http://www.idgcapital.com',
      },
    },
    {
      id: 'zhen-fund',
      name: '真格基金',
      name_en: 'ZhenFund',
      type: 'vc',
      stage_preference: ['angel', 'pre-a'],
      industry_preference: [
        'AI',
        '企业服务',
        '教育',
        '医疗',
        '消费升级',
        '文娱',
      ],
      region_preference: ['北京', '上海', '深圳', '杭州'],
      check_size: {
        min: 100,
        max: 2000,
        typical: 500,
      },
      investment_count: 700,
      notable_investments: ['找钢网', 'VIPKID', '小红书', 'ofo', '罗辑思维'],
      investment_thesis: '专注早期，帮助创业者从 0 到 1',
      social_media: {
        website: 'http://www.zhenfund.com',
      },
    },
    {
      id: 'hillhouse-capital',
      name: '高瓴资本',
      name_en: 'Hillhouse Capital',
      type: 'pe',
      stage_preference: ['b', 'c', 'pre-ipo'],
      industry_preference: [
        '企业服务',
        '医疗健康',
        '新能源',
        '高端制造',
        '消费',
      ],
      region_preference: ['北京', '上海', '深圳', '香港'],
      check_size: {
        min: 10000,
        max: 500000,
        typical: 50000,
      },
      investment_count: 400,
      notable_investments: [
        '京东',
        '美团',
        '滴滴',
        '蔚来',
        '宁德时代',
        '百济神州',
      ],
      investment_thesis: '长期结构性价值投资，关注产业升级和消费升级',
      social_media: {
        website: 'https://www.hillhousecap.com',
      },
    },
    {
      id: 'matrix-partners',
      name: '经纬中国',
      name_en: 'Matrix Partners China',
      type: 'vc',
      stage_preference: ['angel', 'pre-a', 'a', 'b'],
      industry_preference: ['企业服务', 'AI', '医疗', '消费', '硬科技'],
      region_preference: ['北京', '上海', '深圳'],
      check_size: {
        min: 500,
        max: 20000,
        typical: 3000,
      },
      investment_count: 450,
      notable_investments: ['滴滴', '饿了么', '陌陌', '猎豹移动', '找钢网'],
      investment_thesis: '早期投资为主，深度陪伴创业者成长',
      social_media: {
        website: 'http://www.matrixpartners.com.cn',
      },
    },
    {
      id: 'morn-star',
      name: '晨兴资本',
      name_en: 'Morningside Venture Capital',
      type: 'vc',
      stage_preference: ['angel', 'pre-a', 'a'],
      industry_preference: ['移动互联网', '企业服务', 'AI', '新消费'],
      region_preference: ['北京', '上海', '深圳'],
      check_size: {
        min: 500,
        max: 10000,
        typical: 2000,
      },
      investment_count: 200,
      notable_investments: ['小米', '快手', 'UC', 'YY', '迅雷'],
      investment_thesis: '专注早期，寻找改变产业的创新者',
      social_media: {
        website: 'http://www.morningside.com.cn',
      },
    },
    {
      id: 'source-code-capital',
      name: '源码资本',
      name_en: 'Source Code Capital',
      type: 'vc',
      stage_preference: ['pre-a', 'a', 'b'],
      industry_preference: ['企业服务', 'AI', '新零售', '医疗', '教育'],
      region_preference: ['北京', '上海', '深圳', '杭州'],
      check_size: {
        min: 1000,
        max: 15000,
        typical: 4000,
      },
      investment_count: 150,
      notable_investments: ['字节跳动', '美菜', '贝壳找房', '每日优鲜', '货拉拉'],
      investment_thesis: 'Code for value - 投资驱动产业升级的代码',
      social_media: {
        website: 'http://www.sourcecodecap.com',
      },
    },
  ];
}

/**
 * 添加投资人
 */
export async function addInvestor(
  investor: Investor,
  context: SkillContext
): Promise<void> {
  const db = await loadInvestorDatabase(context);
  db.push(investor);
  await context.storage.set(context.config.investorDatabasePath, db);
}

/**
 * 更新投资人信息
 */
export async function updateInvestor(
  investorId: string,
  updates: Partial<Investor>,
  context: SkillContext
): Promise<void> {
  const db = await loadInvestorDatabase(context);
  const index = db.findIndex((inv) => inv.id === investorId);

  if (index !== -1) {
    db[index] = { ...db[index], ...updates };
    await context.storage.set(context.config.investorDatabasePath, db);
  }
}

/**
 * 搜索投资人
 */
export async function searchInvestors(
  query: string,
  context: SkillContext
): Promise<Investor[]> {
  const db = await loadInvestorDatabase(context);
  const lowerQuery = query.toLowerCase();

  return db.filter(
    (inv) =>
      inv.name.toLowerCase().includes(lowerQuery) ||
      inv.name_en?.toLowerCase().includes(lowerQuery) ||
      inv.industry_preference.some((ind) =>
        ind.toLowerCase().includes(lowerQuery)
      )
  );
}
