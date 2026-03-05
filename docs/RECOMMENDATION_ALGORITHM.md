# 🎯 智能推荐算法 - 详细设计文档

## 目录
- [算法概述](#算法概述)
- [多目标优化推荐](#多目标优化推荐)
- [产品组合优化](#产品组合优化)
- [协同过滤推荐](#协同过滤推荐)
- [场景化推荐](#场景化推荐)
- [强化学习优化](#强化学习优化)

---

## 算法概述

### 从规则匹配到智能推荐的演进

| 方法 | 特点 | 适用场景 | 局限性 |
|------|------|---------|--------|
| **规则匹配** | 简单、可解释 | 简单需求 | 无法处理复杂权衡 |
| **评分排序** | 易实现 | 单一目标优化 | 忽略用户偏好差异 |
| **多目标优化** | 处理复杂权衡 | 多维度决策 | 需要权重设定 |
| **协同过滤** | 发现隐藏偏好 | 个性化推荐 | 冷启动问题 |
| **强化学习** | 持续优化 | 长期价值最大化 | 需要大量数据 |

**本系统采用混合推荐策略**，根据场景选择最合适的算法。

---

## 多目标优化推荐

### 1. 问题建模

保险产品推荐本质上是一个**多目标优化问题**：

```
目标：
- 最大化保障覆盖 (maximize coverage)
- 最小化保费支出 (minimize cost)
- 最大化产品匹配度 (maximize fit)
- 最大化用户满意度 (maximize satisfaction)

约束：
- 预算约束：total_premium ≤ budget
- 保障需求约束：coverage ≥ required_coverage
- 健康约束：符合健康告知要求
- 年龄约束：符合投保年龄
```

### 2. 算法实现

```typescript
class MultiObjectiveOptimizer {
  /**
   * 多目标优化推荐
   */
  async optimize(
    userProfile: UserProfile,
    needs: InsuranceNeeds,
    budget: Budget
  ): Promise<RecommendationResult[]> {
    // 1. 获取候选产品
    const candidates = await this.getCandidateProducts(
      needs.product_type,
      userProfile
    );

    // 2. 定义目标函数
    const objectives = this.defineObjectives(userProfile, needs);

    // 3. 计算每个产品的目标值
    const evaluations = candidates.map(product => ({
      product: product,
      objectives: this.evaluateObjectives(product, objectives, userProfile, needs)
    }));

    // 4. 帕累托前沿筛选
    const paretoFrontier = this.findParetoFrontier(evaluations);

    // 5. 根据用户偏好排序
    const ranked = this.rankByPreferences(paretoFrontier, userProfile.preferences);

    return ranked;
  }

  /**
   * 定义目标函数
   */
  private defineObjectives(
    userProfile: UserProfile,
    needs: InsuranceNeeds
  ): Objective[] {
    return [
      {
        name: 'coverage',
        weight: userProfile.preferences.decision_factors.find(f => f.factor === 'coverage')?.weight || 0.3,
        direction: 'maximize',
        calculate: (product) => this.calculateCoverageScore(product, needs)
      },
      {
        name: 'cost',
        weight: userProfile.preferences.decision_factors.find(f => f.factor === 'price')?.weight || 0.4,
        direction: 'minimize',
        calculate: (product) => this.calculateCostScore(product, userProfile)
      },
      {
        name: 'brand',
        weight: userProfile.preferences.decision_factors.find(f => f.factor === 'brand')?.weight || 0.1,
        direction: 'maximize',
        calculate: (product) => this.calculateBrandScore(product, userProfile)
      },
      {
        name: 'flexibility',
        weight: userProfile.preferences.decision_factors.find(f => f.factor === 'flexibility')?.weight || 0.2,
        direction: 'maximize',
        calculate: (product) => this.calculateFlexibilityScore(product)
      }
    ];
  }

  /**
   * 计算保障评分
   */
  private calculateCoverageScore(
    product: Product,
    needs: InsuranceNeeds
  ): number {
    let score = 0;

    // 1. 保额是否满足需求
    const coverageRatio = product.coverage_amount / needs.required_coverage;
    if (coverageRatio >= 1) {
      score += 40; // 基础分
      score += Math.min(20, (coverageRatio - 1) * 10); // 超额奖励
    } else {
      score += coverageRatio * 40; // 不足则按比例给分
    }

    // 2. 保障范围是否全面
    if (product.type === 'critical_illness') {
      const diseaseCoverage = product.features.diseases_covered;
      // 重疾数量
      score += Math.min(15, diseaseCoverage.critical / 10);
      // 轻症数量
      score += Math.min(10, diseaseCoverage.mild / 5);
      // 中症数量
      score += Math.min(10, diseaseCoverage.moderate / 2);
    }

    // 3. 附加权益
    const additionalBenefits = product.features.additional_benefits || [];
    score += Math.min(15, additionalBenefits.length * 3);

    return Math.min(100, score);
  }

  /**
   * 计算成本评分（越低越好）
   */
  private calculateCostScore(
    product: Product,
    userProfile: UserProfile
  ): number {
    const premium = this.calculatePremium(product, userProfile);
    const budget = userProfile.insurance_status.budget;

    // 1. 是否在预算内
    if (premium > budget.max) {
      return 0; // 超预算直接0分
    }

    // 2. 性价比评分
    const budgetUtilization = premium / budget.preferred;

    if (budgetUtilization <= 0.8) {
      // 低于预算，性价比高
      return 100;
    } else if (budgetUtilization <= 1.0) {
      // 接近预算
      return 100 - (budgetUtilization - 0.8) * 100;
    } else {
      // 超过偏好预算但在最大预算内
      return 80 - (budgetUtilization - 1.0) * 200;
    }
  }

  /**
   * 计算品牌评分
   */
  private calculateBrandScore(
    product: Product,
    userProfile: UserProfile
  ): number {
    let score = 50; // 基准分

    const preferences = userProfile.preferences.brands;

    // 1. 偏好品牌
    if (preferences.preferred.includes(product.company)) {
      score += 50;
    }

    // 2. 避免品牌
    if (preferences.avoided.includes(product.company)) {
      score -= 50;
    }

    // 3. 品牌知名度
    const brandRating = this.getBrandRating(product.company);
    score += brandRating * 10;

    // 4. 理赔口碑
    const claimReputation = this.getClaimReputation(product.company);
    score += claimReputation * 20;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 计算灵活性评分
   */
  private calculateFlexibilityScore(product: Product): number {
    let score = 0;

    // 1. 缴费期选择
    const paymentOptions = product.features.payment_period_options || [];
    score += Math.min(20, paymentOptions.length * 5);

    // 2. 保额可调整性
    if (product.features.coverage_amount_range) {
      const range = product.features.coverage_amount_range;
      const flexibility = (range.max - range.min) / range.min;
      score += Math.min(20, flexibility * 10);
    }

    // 3. 保单权益
    const benefits = [
      product.features.convertible, // 可转换
      product.features.dividends, // 有分红
      product.features.cash_value, // 有现金价值
      product.features.loan_available, // 可贷款
      product.features.reducible // 可减保
    ].filter(Boolean).length;

    score += benefits * 12;

    // 4. 退保灵活性
    if (product.features.surrender_period <= 5) {
      score += 20;
    } else if (product.features.surrender_period <= 10) {
      score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * 帕累托前沿筛选
   */
  private findParetoFrontier(
    evaluations: Evaluation[]
  ): Evaluation[] {
    const paretoOptimal: Evaluation[] = [];

    for (const candidate of evaluations) {
      let isDominated = false;

      for (const other of evaluations) {
        if (this.dominates(other, candidate)) {
          isDominated = true;
          break;
        }
      }

      if (!isDominated) {
        paretoOptimal.push(candidate);
      }
    }

    return paretoOptimal;
  }

  /**
   * 判断 a 是否支配 b
   */
  private dominates(a: Evaluation, b: Evaluation): boolean {
    let betterInSome = false;
    let worseInAny = false;

    for (const [key, value] of Object.entries(a.objectives)) {
      const aValue = value;
      const bValue = b.objectives[key];

      const objective = this.getObjective(key);

      if (objective.direction === 'maximize') {
        if (aValue > bValue) betterInSome = true;
        if (aValue < bValue) worseInAny = true;
      } else { // minimize
        if (aValue < bValue) betterInSome = true;
        if (aValue > bValue) worseInAny = true;
      }
    }

    return betterInSome && !worseInAny;
  }

  /**
   * 根据用户偏好排序
   */
  private rankByPreferences(
    paretoFrontier: Evaluation[],
    preferences: UserPreferences
  ): RecommendationResult[] {
    return paretoFrontier.map(evaluation => {
      // 计算加权总分
      let weightedScore = 0;
      for (const [key, value] of Object.entries(evaluation.objectives)) {
        const objective = this.getObjective(key);
        weightedScore += value * objective.weight;
      }

      return {
        product: evaluation.product,
        overall_score: weightedScore,
        objective_scores: evaluation.objectives,
        recommendation_reason: this.generateReason(evaluation)
      };
    }).sort((a, b) => b.overall_score - a.overall_score);
  }
}
```

---

## 产品组合优化

### 1. 问题建模

保险不是买一个产品，而是买一个组合（重疾+医疗+意外+寿险）：

```
目标：
- 在预算约束下，最大化总体保障价值

变量：
- x1, x2, ..., xn ∈ {0, 1}  (是否选择产品i)

约束：
- Σ premium_i * x_i ≤ budget
- Σ coverage_i * x_i ≥ required_coverage
- 避免重复保障
- 产品间相容性
```

### 2. 算法实现

```typescript
class PortfolioOptimizer {
  /**
   * 产品组合优化（使用遗传算法）
   */
  async optimizePortfolio(
    userProfile: UserProfile,
    needs: InsuranceNeeds,
    budget: Budget
  ): Promise<Portfolio[]> {
    // 1. 初始化种群
    let population = this.initializePopulation(
      userProfile,
      needs,
      budget,
      POPULATION_SIZE
    );

    // 2. 迭代进化
    for (let generation = 0; generation < MAX_GENERATIONS; generation++) {
      // 评估适应度
      const fitness = population.map(portfolio =>
        this.calculateFitness(portfolio, userProfile, needs, budget)
      );

      // 选择
      const parents = this.selection(population, fitness);

      // 交叉
      const offspring = this.crossover(parents);

      // 变异
      this.mutation(offspring);

      // 更新种群
      population = this.updatePopulation(population, offspring, fitness);

      // 检查收敛
      if (this.hasConverged(population, generation)) {
        break;
      }
    }

    // 3. 返回最优解
    const bestPortfolios = this.selectBestPortfolios(population, TOP_K);
    return bestPortfolios;
  }

  /**
   * 计算组合适应度（fitness function）
   */
  private calculateFitness(
    portfolio: Portfolio,
    userProfile: UserProfile,
    needs: InsuranceNeeds,
    budget: Budget
  ): number {
    let fitness = 0;

    // 1. 总保费约束（硬约束）
    const totalPremium = this.calculateTotalPremium(portfolio, userProfile);
    if (totalPremium > budget.max) {
      return 0; // 不可行解
    }

    // 2. 保障覆盖度
    const coverageScore = this.calculateCoverageScore(portfolio, needs);
    fitness += coverageScore * 0.4;

    // 3. 成本效益
    const costEfficiency = (budget.max - totalPremium) / budget.max;
    fitness += costEfficiency * 100 * 0.2;

    // 4. 产品协同效应
    const synergyScore = this.calculateSynergyScore(portfolio);
    fitness += synergyScore * 0.2;

    // 5. 风险覆盖平衡性
    const balanceScore = this.calculateBalanceScore(portfolio, needs);
    fitness += balanceScore * 0.2;

    return fitness;
  }

  /**
   * 计算保障覆盖度
   */
  private calculateCoverageScore(
    portfolio: Portfolio,
    needs: InsuranceNeeds
  ): number {
    let score = 0;

    // 重疾险保障
    if (needs.critical_illness_needed) {
      const ciCoverage = portfolio.products
        .filter(p => p.type === 'critical_illness')
        .reduce((sum, p) => sum + p.coverage_amount, 0);

      const ciRatio = ciCoverage / needs.critical_illness_coverage;
      score += this.scoreCoverageRatio(ciRatio) * 0.35;
    }

    // 医疗险保障
    if (needs.medical_needed) {
      const hasMedical = portfolio.products.some(p => p.type === 'medical');
      score += hasMedical ? 25 : 0;
    }

    // 寿险保障
    if (needs.life_insurance_needed) {
      const lifeCoverage = portfolio.products
        .filter(p => p.type === 'term_life')
        .reduce((sum, p) => sum + p.coverage_amount, 0);

      const lifeRatio = lifeCoverage / needs.life_insurance_coverage;
      score += this.scoreCoverageRatio(lifeRatio) * 0.3;
    }

    // 意外险保障
    if (needs.accident_needed) {
      const hasAccident = portfolio.products.some(p => p.type === 'accident');
      score += hasAccident ? 10 : 0;
    }

    return score;
  }

  /**
   * 计算产品协同效应
   */
  private calculateSynergyScore(portfolio: Portfolio): number {
    let score = 0;

    // 1. 重疾+医疗组合（黄金搭配）
    const hasCriticalIllness = portfolio.products.some(p => p.type === 'critical_illness');
    const hasMedical = portfolio.products.some(p => p.type === 'medical');
    if (hasCriticalIllness && hasMedical) {
      score += 30; // 协同加分
    }

    // 2. 寿险+重疾组合（家庭支柱标配）
    const hasLife = portfolio.products.some(p => p.type === 'term_life');
    if (hasCriticalIllness && hasLife) {
      score += 25;
    }

    // 3. 避免重复保障（负面效应）
    const criticalIllnessCount = portfolio.products.filter(p => p.type === 'critical_illness').length;
    if (criticalIllnessCount > 1) {
      score -= 20 * (criticalIllnessCount - 1); // 惩罚重复
    }

    // 4. 同一公司产品可能有优惠
    const companyCounts = this.countByCompany(portfolio.products);
    for (const [company, count] of Object.entries(companyCounts)) {
      if (count >= 2) {
        score += 10; // 多产品优惠
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 计算风险覆盖平衡性
   */
  private calculateBalanceScore(
    portfolio: Portfolio,
    needs: InsuranceNeeds
  ): number {
    // 计算各类风险的覆盖程度
    const coverage = {
      health: 0,
      death: 0,
      accident: 0,
      property: 0
    };

    for (const product of portfolio.products) {
      switch (product.category) {
        case 'health':
          coverage.health += 1;
          break;
        case 'life':
          coverage.death += 1;
          break;
        case 'accident':
          coverage.accident += 1;
          break;
        case 'property':
          coverage.property += 1;
          break;
      }
    }

    // 计算方差（方差越小越平衡）
    const values = Object.values(coverage);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

    // 转换为评分（方差越小分数越高）
    const balanceScore = 100 / (1 + variance);

    return balanceScore;
  }

  /**
   * 遗传算法 - 交叉操作
   */
  private crossover(parents: Portfolio[]): Portfolio[] {
    const offspring: Portfolio[] = [];

    for (let i = 0; i < parents.length - 1; i += 2) {
      const parent1 = parents[i];
      const parent2 = parents[i + 1];

      // 单点交叉
      const crossoverPoint = Math.floor(Math.random() * Math.min(
        parent1.products.length,
        parent2.products.length
      ));

      const child1 = {
        products: [
          ...parent1.products.slice(0, crossoverPoint),
          ...parent2.products.slice(crossoverPoint)
        ]
      };

      const child2 = {
        products: [
          ...parent2.products.slice(0, crossoverPoint),
          ...parent1.products.slice(crossoverPoint)
        ]
      };

      // 去重
      child1.products = this.removeDuplicates(child1.products);
      child2.products = this.removeDuplicates(child2.products);

      offspring.push(child1, child2);
    }

    return offspring;
  }

  /**
   * 遗传算法 - 变异操作
   */
  private mutation(offspring: Portfolio[]): void {
    for (const portfolio of offspring) {
      if (Math.random() < MUTATION_RATE) {
        // 随机添加一个产品
        const randomProduct = this.getRandomProduct();
        portfolio.products.push(randomProduct);
      }

      if (Math.random() < MUTATION_RATE) {
        // 随机删除一个产品
        if (portfolio.products.length > 1) {
          const randomIndex = Math.floor(Math.random() * portfolio.products.length);
          portfolio.products.splice(randomIndex, 1);
        }
      }

      if (Math.random() < MUTATION_RATE) {
        // 随机替换一个产品
        if (portfolio.products.length > 0) {
          const randomIndex = Math.floor(Math.random() * portfolio.products.length);
          portfolio.products[randomIndex] = this.getRandomProduct();
        }
      }
    }
  }
}
```

---

## 协同过滤推荐

### 1. 用户相似度计算

```typescript
class CollaborativeFilteringEngine {
  /**
   * 基于用户的协同过滤
   */
  async recommendBySimilarUsers(
    userId: string,
    topK: number = 5
  ): Promise<Product[]> {
    // 1. 找到相似用户
    const similarUsers = await this.findSimilarUsers(userId, TOP_N_SIMILAR_USERS);

    // 2. 获取相似用户购买的产品
    const theirProducts = await this.getProductsOfUsers(similarUsers);

    // 3. 过滤掉当前用户已有的产品
    const userProducts = await this.getUserProducts(userId);
    const newProducts = theirProducts.filter(
      p => !userProducts.some(up => up.id === p.id)
    );

    // 4. 计算推荐评分
    const scored = newProducts.map(product => ({
      product: product,
      score: this.calculateRecommendationScore(product, similarUsers)
    }));

    // 5. 排序并返回 top-K
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(s => s.product);
  }

  /**
   * 找到相似用户
   */
  private async findSimilarUsers(
    userId: string,
    topN: number
  ): Promise<SimilarUser[]> {
    const targetUser = await this.getUserProfile(userId);
    const allUsers = await this.getAllUsers();

    // 计算相似度
    const similarities = allUsers
      .filter(u => u.user_id !== userId)
      .map(user => ({
        user: user,
        similarity: this.calculateUserSimilarity(targetUser, user)
      }));

    // 排序并返回 top-N
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topN);
  }

  /**
   * 计算用户相似度
   */
  private calculateUserSimilarity(
    user1: UserProfile,
    user2: UserProfile
  ): number {
    let similarity = 0;

    // 1. 人口统计学相似度 (权重 30%)
    const demoSim = this.calculateDemographicSimilarity(user1, user2);
    similarity += demoSim * 0.3;

    // 2. 家庭结构相似度 (权重 20%)
    const familySim = this.calculateFamilySimilarity(user1, user2);
    similarity += familySim * 0.2;

    // 3. 财务状况相似度 (权重 20%)
    const financialSim = this.calculateFinancialSimilarity(user1, user2);
    similarity += financialSim * 0.2;

    // 4. 健康状况相似度 (权重 15%)
    const healthSim = this.calculateHealthSimilarity(user1, user2);
    similarity += healthSim * 0.15;

    // 5. 偏好相似度 (权重 15%)
    const prefSim = this.calculatePreferenceSimilarity(user1, user2);
    similarity += prefSim * 0.15;

    return similarity;
  }

  /**
   * 计算人口统计学相似度
   */
  private calculateDemographicSimilarity(
    user1: UserProfile,
    user2: UserProfile
  ): number {
    let score = 0;

    // 年龄相似度（年龄差越小越相似）
    const ageDiff = Math.abs(user1.identity.age - user2.identity.age);
    score += Math.max(0, 100 - ageDiff * 2) * 0.4;

    // 性别相同
    if (user1.identity.gender === user2.identity.gender) {
      score += 20;
    }

    // 职业类似
    if (user1.professional.occupation === user2.professional.occupation) {
      score += 20;
    } else if (user1.professional.industry === user2.professional.industry) {
      score += 10;
    }

    // 收入水平类似
    const incomeRatio = Math.min(
      user1.professional.income.annual,
      user2.professional.income.annual
    ) / Math.max(
      user1.professional.income.annual,
      user2.professional.income.annual
    );
    score += incomeRatio * 20;

    return Math.min(100, score);
  }

  /**
   * 计算家庭结构相似度
   */
  private calculateFamilySimilarity(
    user1: UserProfile,
    user2: UserProfile
  ): number {
    let score = 0;

    // 婚姻状况
    if (user1.family.marital_status === user2.family.marital_status) {
      score += 30;
    }

    // 子女数量
    const childrenDiff = Math.abs(
      user1.family.children.length - user2.family.children.length
    );
    score += Math.max(0, 40 - childrenDiff * 20);

    // 家庭责任评分
    const responsibilityDiff = Math.abs(
      user1.family.family_responsibility_score -
      user2.family.family_responsibility_score
    );
    score += Math.max(0, 30 - responsibilityDiff * 0.3);

    return Math.min(100, score);
  }
}
```

---

## 场景化推荐

### 1. 场景模板库

```typescript
interface ScenarioTemplate {
  scenario: string;
  characteristics: {
    age_range?: [number, number];
    marital_status?: string[];
    has_children?: boolean;
    has_mortgage?: boolean;
    // ...
  };
  recommended_products: {
    type: string;
    priority: 'must_have' | 'recommended' | 'optional';
    coverage_calculation: string | ((user: UserProfile) => number);
    reasoning: string;
  }[];
  budget_allocation: {
    product_type: string;
    percentage: number;
  }[];
  typical_concerns: string[];
  education_content: string;
}

const SCENARIO_TEMPLATES: Record<string, ScenarioTemplate> = {
  // 场景1: 新婚夫妇
  'newlywed_couple': {
    scenario: '新婚夫妇',
    characteristics: {
      age_range: [25, 35],
      marital_status: ['married'],
      has_children: false
    },
    recommended_products: [
      {
        type: 'term_life',
        priority: 'must_have',
        coverage_calculation: (user) => user.professional.income.annual * 10,
        reasoning: '承担家庭责任，需要高额寿险保障配偶'
      },
      {
        type: 'critical_illness',
        priority: 'must_have',
        coverage_calculation: (user) => user.identity.age * 10000,
        reasoning: '30岁左右重疾风险上升，且价格相对便宜'
      },
      {
        type: 'medical',
        priority: 'recommended',
        coverage_calculation: '3000000',
        reasoning: '覆盖大额医疗费用'
      },
      {
        type: 'accident',
        priority: 'recommended',
        coverage_calculation: '1000000',
        reasoning: '综合意外保障'
      }
    ],
    budget_allocation: [
      { product_type: 'term_life', percentage: 0.3 },
      { product_type: 'critical_illness', percentage: 0.4 },
      { product_type: 'medical', percentage: 0.2 },
      { product_type: 'accident', percentage: 0.1 }
    ],
    typical_concerns: [
      '预算有限，如何配置？',
      '双方都需要买吗？',
      '婚前买还是婚后买？'
    ],
    education_content: `
新婚夫妇保险规划建议：

**优先级排序：**
1️⃣ 定期寿险（保障配偶）
2️⃣ 重疾险（健康保障）
3️⃣ 医疗险（大病医疗）
4️⃣ 意外险（基础保障）

**双方配置原则：**
• 收入高的一方优先、保额更高
• 双方都需要基础保障
• 预算有限先保大人再保孩子（如有）

**预算建议：**
• 总保费控制在家庭年收入的 10% 以内
• 初期 5000-15000 元/年即可建立基础保障
    `
  },

  // 场景2: 新手爸妈
  'new_parents': {
    scenario: '新手爸妈',
    characteristics: {
      age_range: [28, 40],
      marital_status: ['married'],
      has_children: true
    },
    recommended_products: [
      {
        type: 'term_life',
        priority: 'must_have',
        coverage_calculation: (user) => {
          // 覆盖子女抚养到独立的费用
          const yearsToIndependence = 22 - Math.max(...user.family.children.map(c => c.age));
          return user.professional.income.annual * yearsToIndependence;
        },
        reasoning: '父母是孩子最大的保障，高额寿险必不可少'
      },
      {
        type: 'critical_illness',
        priority: 'must_have',
        coverage_calculation: (user) => user.identity.age * 15000,
        reasoning: '确保大病时有足够资金维持家庭运转'
      },
      {
        type: 'childrens_critical_illness',
        priority: 'recommended',
        coverage_calculation: '500000',
        reasoning: '为孩子配置重疾险，越早买越便宜'
      },
      {
        type: 'medical',
        priority: 'must_have',
        coverage_calculation: '3000000',
        reasoning: '父母和孩子都需要医疗险'
      }
    ],
    budget_allocation: [
      { product_type: 'term_life', percentage: 0.35 },
      { product_type: 'critical_illness', percentage: 0.35 },
      { product_type: 'medical', percentage: 0.2 },
      { product_type: 'childrens_critical_illness', percentage: 0.1 }
    ],
    typical_concerns: [
      '父母和孩子谁优先？',
      '孩子需要买多少保额？',
      '预算有限如何配置？'
    ],
    education_content: `
新手爸妈保险配置原则：

**先大人后小孩！**
原因：父母是孩子最大的保障，父母倒了孩子更没保障。

**保额配置：**
• 父母定期寿险：覆盖子女抚养到独立
• 父母重疾险：50-100万
• 孩子重疾险：30-50万即可
• 全家医疗险：必配

**预算分配：**
• 父母保障：70-80%
• 孩子保障：20-30%
    `
  },

  // 场景3: 背负房贷
  'mortgage_holder': {
    scenario: '背负房贷',
    characteristics: {
      has_mortgage: true
    },
    recommended_products: [
      {
        type: 'term_life',
        priority: 'must_have',
        coverage_calculation: (user) => user.professional.financial_status.liabilities.mortgage,
        reasoning: '保额必须覆盖房贷余额，保障期至房贷还清'
      },
      {
        type: 'critical_illness',
        priority: 'must_have',
        coverage_calculation: (user) => Math.max(500000, user.identity.age * 15000),
        reasoning: '大病期间还需要继续还房贷'
      }
    ],
    budget_allocation: [
      { product_type: 'term_life', percentage: 0.5 },
      { product_type: 'critical_illness', percentage: 0.4 },
      { product_type: 'medical', percentage: 0.1 }
    ],
    typical_concerns: [
      '房贷期间寿险必须买吗？',
      '保额多少合适？',
      '保障期选多久？'
    ],
    education_content: `
房贷期间保险配置：

**定期寿险是刚需！**
• 保额 = 房贷余额
• 保障期 = 房贷剩余年限
• 避免身故后家人既失去收入又要还房贷

**真实案例：**
王先生贷款200万买房，30年还清。
不幸3年后去世，妻子和孩子既失去收入来源，
还要继续还每月8000元房贷，最终不得不卖房。

如果王先生买了200万定期寿险，
妻子可以用赔付一次性还清房贷，
保住房子，孩子教育也有保障。
    `
  }
};
```

---

## 总结

智能推荐算法通过：

1. ✅ **多目标优化** - 处理复杂的决策权衡
2. ✅ **产品组合优化** - 找到最优保险组合
3. ✅ **协同过滤** - 从相似用户学习
4. ✅ **场景化推荐** - 针对特定人生阶段
5. ✅ **持续学习** - 基于反馈不断优化

让推荐从"规则匹配"升级到"真正智能"！
