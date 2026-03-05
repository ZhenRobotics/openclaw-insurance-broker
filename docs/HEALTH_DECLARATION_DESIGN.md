# 🏥 健康告知智能辅助系统 - 详细设计文档

## 目录
- [背景与痛点](#背景与痛点)
- [系统架构](#系统架构)
- [数据模型](#数据模型)
- [核心算法](#核心算法)
- [知识库设计](#知识库设计)
- [实现路径](#实现路径)

---

## 背景与痛点

### 为什么健康告知如此重要？

健康告知是保险购买过程中**最容易出问题**的环节：

1. **用户痛点**
   - 不知道什么病需要告知
   - 不理解健康告知问题的真实含义
   - 担心如实告知会被拒保
   - 害怕将来理赔被拒

2. **行业痛点**
   - 70% 的理赔纠纷源于健康告知问题
   - "带病投保"导致大量拒赔案例
   - 用户对健康告知严重缺乏认识

3. **真实案例**

```
案例1: 甲状腺结节未告知
─────────────────────────
王女士 2020 年投保重疾险，2023 年确诊甲状腺癌申请理赔。
保险公司调查发现，王女士 2019 年体检发现甲状腺结节，
但投保时未告知。保险公司以"隐瞒病史"为由拒赔。

王女士辩解："我不知道结节需要告知，而且结节和癌症不一样啊！"

结果：法院判决保险公司拒赔合理。王女士损失50万保额。

教训：不了解"询问告知"原则，导致巨额损失。
```

```
案例2: 乙肝携带者如实告知
─────────────────────────
李先生是乙肝携带者，投保时如实告知。
保险公司要求提供肝功能检查报告，结果显示正常。
最终以"除外责任"承保（肝部疾病不赔）。

李先生疑问："我如实告知反而被除外承保，那我为什么要告知？"

正确做法：
1. 尝试智能核保（部分产品可标准体承保）
2. 对比多家保险公司的核保政策
3. 选择对乙肝友好的产品

结果：李先生通过智能核保找到了可标准体承保的产品。
```

### 系统设计目标

本系统旨在：

1. ✅ **教育用户**正确理解健康告知义务
2. ✅ **指导用户**如何填写健康告知
3. ✅ **匹配产品**找到适合用户健康状况的产品
4. ✅ **优化核保**提供智能核保策略
5. ✅ **预防纠纷**避免因告知问题导致理赔纠纷

---

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│              健康告知智能辅助系统                        │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 健康评估模块  │  │ 告知指导模块  │  │ 产品匹配模块  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  智能核保建议模块 │
                └──────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  教育与预防模块   │
                └──────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │     健康告知知识库               │
        │  • 疾病库 (3000+)               │
        │  • 产品健康要求库 (100+)        │
        │  • 核保规则库                   │
        │  • 案例库 (500+)                │
        │  • 健康告知问题库 (500+)        │
        └─────────────────────────────────┘
```

---

## 数据模型

### 1. 用户健康档案

```typescript
interface HealthProfile {
  user_id: string;
  created_at: Date;
  updated_at: Date;

  // ===== 基础健康信息 =====
  basic_health: {
    height: number; // cm
    weight: number; // kg
    bmi: number;
    blood_pressure: {
      systolic: number; // 收缩压
      diastolic: number; // 舒张压
      measured_at: Date;
    };
    blood_sugar: {
      fasting: number; // 空腹血糖
      postprandial: number; // 餐后血糖
      hba1c: number; // 糖化血红蛋白
      measured_at: Date;
    };
  };

  // ===== 生活方式 =====
  lifestyle: {
    smoking: {
      status: 'never' | 'former' | 'current';
      cigarettes_per_day?: number;
      years_smoking?: number;
      quit_date?: Date;
    };
    drinking: {
      status: 'never' | 'occasional' | 'regular' | 'heavy';
      drinks_per_week?: number;
    };
    exercise: {
      frequency: 'sedentary' | 'light' | 'moderate' | 'active';
      hours_per_week: number;
    };
    occupation_risk: {
      category: '1-6类'; // 职业风险分类
      special_hazards: string[]; // 特殊危险
    };
  };

  // ===== 当前健康状况 =====
  current_conditions: MedicalCondition[];

  // ===== 既往病史 =====
  medical_history: {
    past_conditions: MedicalCondition[];
    surgeries: Surgery[];
    hospitalizations: Hospitalization[];
    chronic_medications: Medication[];
  };

  // ===== 家族病史 =====
  family_history: {
    condition: string;
    relation: 'father' | 'mother' | 'sibling' | 'grandparent';
    age_of_onset?: number;
  }[];

  // ===== 体检记录 =====
  checkups: MedicalCheckup[];

  // ===== 健康评分 =====
  health_score: {
    overall: number; // 0-100
    cardiovascular: number;
    metabolic: number;
    respiratory: number;
    digestive: number;
    musculoskeletal: number;
    mental: number;
  };

  // ===== 可保性评估 =====
  insurability: {
    overall_rating: 'standard' | 'substandard' | 'high_risk' | 'uninsurable';
    by_product_type: {
      critical_illness: InsurabilityRating;
      medical: InsurabilityRating;
      life: InsurabilityRating;
      accident: InsurabilityRating;
    };
    risk_factors: {
      factor: string;
      severity: 'low' | 'medium' | 'high';
      impact_on_insurability: string;
    }[];
  };
}

interface MedicalCondition {
  condition: string;
  icd_code?: string; // 国际疾病分类代码
  diagnosed_date: Date;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'controlled';
  treatment: {
    medications: string[];
    procedures: string[];
    ongoing: boolean;
  };
  complications: string[];
  impact_on_insurability: {
    critical_illness: 'standard' | 'rated' | 'excluded' | 'declined';
    medical: 'standard' | 'rated' | 'excluded' | 'declined';
    life: 'standard' | 'rated' | 'excluded' | 'declined';
  };
}
```

### 2. 健康告知问题库

```typescript
interface HealthDeclarationQuestion {
  question_id: string;
  question_text: string;
  question_category: 'basic' | 'disease' | 'treatment' | 'lifestyle' | 'family';

  // 问题解释
  explanation: {
    what_it_asks: string; // 这个问题在问什么
    why_it_matters: string; // 为什么要问这个
    who_should_answer_yes: string[]; // 哪些情况应该回答"是"
    who_should_answer_no: string[]; // 哪些情况应该回答"否"
  };

  // 常见误解
  common_misunderstandings: {
    misconception: string;
    correct_understanding: string;
    example: string;
  }[];

  // 关键词匹配
  keywords: string[]; // 用于智能匹配用户病史

  // 时间范围
  time_frame?: {
    years: number; // 询问过去多少年
    specific_period?: string; // "近2年内" | "确诊后" 等
  };

  // 示例场景
  scenarios: {
    scenario: string;
    should_declare: boolean;
    reason: string;
  }[];
}
```

### 3. 疾病数据库

```typescript
interface DiseaseKnowledgeBase {
  disease_id: string;
  name: string;
  aliases: string[]; // 别名（如"高血压"="血压高"）
  icd_code: string;
  category: string;

  // 严重程度分级
  severity_levels: {
    level: string;
    criteria: string;
    insurability: {
      critical_illness: {
        rating: 'standard' | 'rated' | 'excluded' | 'declined';
        notes: string;
        typical_extra_premium?: number; // 加费比例
      };
      medical: { /* 同上 */ };
      life: { /* 同上 */ };
    };
  }[];

  // 核保指南
  underwriting_guide: {
    required_info: string[]; // 核保需要的信息
    required_documents: string[]; // 需要的材料
    typical_outcome: string;
    special_considerations: string[];
  };

  // 投保建议
  insurance_advice: {
    best_products: string[]; // 对此疾病最友好的产品
    smart_underwriting_products: string[]; // 支持智能核保的产品
    alternative_products: string[]; // 替代产品（如买不了重疾险，可买防癌险）
  };

  // 健康告知指南
  declaration_guide: {
    must_declare_if: string[]; // 必须告知的情况
    no_need_to_declare_if: string[]; // 无需告知的情况
    gray_areas: string[]; // 灰色地带（建议咨询）
  };

  // 真实案例
  real_cases: {
    case_type: 'approved' | 'denied' | 'disputed';
    summary: string;
    outcome: string;
    lesson: string;
  }[];
}
```

### 4. 产品健康要求

```typescript
interface ProductHealthRequirements {
  product_id: string;
  product_name: string;
  company: string;

  // 健康告知问题
  health_questions: {
    question_id: string;
    question_text: string;
    must_answer_truthfully: boolean;
  }[];

  // 核保政策
  underwriting_policy: {
    // 自动承保条件
    auto_approval: {
      age_range: { min: number; max: number };
      bmi_range: { min: number; max: number };
      no_conditions: string[]; // 没有这些疾病可自动承保
    };

    // 智能核保
    smart_underwriting: {
      available: boolean;
      supported_conditions: string[]; // 支持智能核保的疾病
      turnaround_time: string; // "即时" | "1-3天"
    };

    // 人工核保
    manual_underwriting: {
      required_for: string[]; // 哪些情况需要人工核保
      turnaround_time: string;
      required_documents: string[];
    };

    // 核保结果分布（基于历史数据）
    approval_statistics: {
      standard_rate: number; // 标准体承保比例
      rated_rate: number; // 加费承保比例
      excluded_rate: number; // 除外承保比例
      declined_rate: number; // 拒保比例
    };
  };

  // 健康友好度评分
  health_friendliness: {
    overall_score: number; // 0-100，越高越友好
    by_condition: {
      condition: string;
      friendliness: 'high' | 'medium' | 'low';
      notes: string;
    }[];
  };

  // 除外责任
  common_exclusions: {
    condition: string;
    exclusion_scope: string;
    example: string;
  }[];
}
```

---

## 核心算法

### 1. 健康状况评估算法

```typescript
class HealthAssessmentEngine {
  /**
   * 综合评估用户健康状况和可保性
   */
  async assessHealth(
    healthProfile: HealthProfile
  ): Promise<HealthAssessment> {
    // 1. 计算健康评分
    const healthScore = this.calculateHealthScore(healthProfile);

    // 2. 识别风险因素
    const riskFactors = this.identifyRiskFactors(healthProfile);

    // 3. 评估可保性
    const insurability = this.assessInsurability(healthProfile, riskFactors);

    // 4. 生成建议
    const recommendations = this.generateRecommendations(insurability);

    return {
      health_score: healthScore,
      risk_factors: riskFactors,
      insurability: insurability,
      recommendations: recommendations,
      assessment_date: new Date(),
      confidence_level: this.calculateConfidence(healthProfile)
    };
  }

  /**
   * 计算健康评分
   */
  private calculateHealthScore(profile: HealthProfile): HealthScore {
    let score = 100; // 基准分

    // 年龄影响
    if (profile.demographics.age > 40) {
      score -= (profile.demographics.age - 40) * 0.5;
    }

    // BMI 影响
    const bmi = profile.basic_health.bmi;
    if (bmi < 18.5 || bmi > 24) {
      score -= Math.abs(bmi - 21) * 2;
    }

    // 血压影响
    const bp = profile.basic_health.blood_pressure;
    if (bp.systolic > 140 || bp.diastolic > 90) {
      score -= 10;
    }

    // 血糖影响
    const bs = profile.basic_health.blood_sugar;
    if (bs.fasting > 6.1 || bs.hba1c > 6.5) {
      score -= 15;
    }

    // 生活方式影响
    if (profile.lifestyle.smoking.status === 'current') {
      score -= 20;
    }
    if (profile.lifestyle.drinking.status === 'heavy') {
      score -= 10;
    }
    if (profile.lifestyle.exercise.frequency === 'sedentary') {
      score -= 5;
    }

    // 现有疾病影响
    for (const condition of profile.current_conditions) {
      score -= this.getConditionImpact(condition);
    }

    return {
      overall: Math.max(0, Math.min(100, score)),
      breakdown: this.calculateSubScores(profile)
    };
  }

  /**
   * 识别风险因素
   */
  private identifyRiskFactors(profile: HealthProfile): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // 检查血压
    const bp = profile.basic_health.blood_pressure;
    if (bp.systolic >= 140 || bp.diastolic >= 90) {
      factors.push({
        type: 'hypertension',
        severity: this.categorizeBP(bp),
        impact_on_insurability: 'medium_to_high',
        mitigation: '控制血压至正常范围，3个月后重新评估'
      });
    }

    // 检查血糖
    if (profile.basic_health.blood_sugar.fasting > 6.1) {
      factors.push({
        type: 'hyperglycemia',
        severity: this.categorizeBloodSugar(profile.basic_health.blood_sugar),
        impact_on_insurability: 'high',
        mitigation: '血糖控制达标，可尝试智能核保'
      });
    }

    // 检查 BMI
    if (profile.basic_health.bmi > 28) {
      factors.push({
        type: 'obesity',
        severity: 'medium',
        impact_on_insurability: 'medium',
        mitigation: '减重后重新投保可获得更优费率'
      });
    }

    // 检查吸烟
    if (profile.lifestyle.smoking.status === 'current') {
      factors.push({
        type: 'smoking',
        severity: 'high',
        impact_on_insurability: 'high',
        mitigation: '戒烟1年后可申请费率调整'
      });
    }

    // 检查现有疾病
    for (const condition of profile.current_conditions) {
      const diseaseInfo = await this.getDiseaseInfo(condition.condition);
      factors.push({
        type: condition.condition,
        severity: condition.severity,
        impact_on_insurability: diseaseInfo.insurability_impact,
        mitigation: diseaseInfo.insurance_advice.best_approach
      });
    }

    return factors;
  }

  /**
   * 评估可保性
   */
  private assessInsurability(
    profile: HealthProfile,
    riskFactors: RiskFactor[]
  ): InsurabilityAssessment {
    const assessment: InsurabilityAssessment = {
      critical_illness: this.assessForCriticalIllness(profile, riskFactors),
      medical: this.assessForMedical(profile, riskFactors),
      life: this.assessForLife(profile, riskFactors),
      accident: this.assessForAccident(profile, riskFactors)
    };

    return assessment;
  }

  /**
   * 重疾险可保性评估
   */
  private assessForCriticalIllness(
    profile: HealthProfile,
    riskFactors: RiskFactor[]
  ): ProductInsurability {
    let rating: InsurabilityRating = 'standard';
    const issues: string[] = [];
    const recommendations: string[] = [];

    // 检查重大风险因素
    for (const factor of riskFactors) {
      if (factor.type === 'cancer' || factor.type === 'heart_disease') {
        rating = 'declined';
        issues.push(`有${factor.type}病史，重疾险通常拒保`);
        recommendations.push('建议购买防癌医疗险作为替代');
        break;
      }

      if (factor.type === 'hypertension' && factor.severity === 'high') {
        rating = 'rated';
        issues.push('高血压可能需要加费承保');
        recommendations.push('建议先控制血压，再申请智能核保');
      }

      if (factor.type === 'diabetes') {
        rating = 'excluded';
        issues.push('糖尿病通常会除外胰腺等相关疾病');
        recommendations.push('可尝试智能核保，部分产品可能接受');
      }
    }

    return {
      rating: rating,
      approval_probability: this.estimateApprovalProbability(rating),
      issues: issues,
      recommendations: recommendations,
      suitable_products: this.findSuitableProducts('critical_illness', profile),
      estimated_premium_impact: this.estimatePremiumImpact(rating)
    };
  }
}
```

### 2. 健康告知指导算法

```typescript
class DeclarationGuideEngine {
  /**
   * 生成个性化的健康告知指导
   */
  async generateGuide(
    productId: string,
    healthProfile: HealthProfile
  ): Promise<DeclarationGuide> {
    // 1. 获取产品的健康告知问题
    const product = await this.getProduct(productId);
    const questions = product.health_questions;

    // 2. 逐个问题分析
    const questionGuidance = [];
    for (const question of questions) {
      const guidance = await this.analyzeQuestion(question, healthProfile);
      questionGuidance.push(guidance);
    }

    // 3. 识别潜在风险点
    const riskPoints = this.identifyRiskPoints(questionGuidance);

    // 4. 生成整体建议
    const overallAdvice = this.generateOverallAdvice(questionGuidance, riskPoints);

    return {
      product_id: productId,
      questions_guidance: questionGuidance,
      risk_points: riskPoints,
      overall_advice: overallAdvice,
      estimated_outcome: this.predictOutcome(questionGuidance)
    };
  }

  /**
   * 分析单个健康告知问题
   */
  private async analyzeQuestion(
    question: HealthDeclarationQuestion,
    profile: HealthProfile
  ): Promise<QuestionGuidance> {
    // 1. 理解问题
    const explanation = question.explanation;

    // 2. 匹配用户健康档案
    const matchedConditions = this.matchConditionsToQuestion(
      question,
      profile.current_conditions,
      profile.medical_history
    );

    // 3. 判断应该如何回答
    let recommendedAnswer: 'yes' | 'no' | 'consult';
    let reasoning: string;

    if (matchedConditions.length === 0) {
      recommendedAnswer = 'no';
      reasoning = '您的健康档案中没有此问题涉及的情况';
    } else {
      // 复杂情况，需要详细分析
      const analysis = await this.analyzeMatchedConditions(
        question,
        matchedConditions
      );
      recommendedAnswer = analysis.answer;
      reasoning = analysis.reasoning;
    }

    // 4. 提供具体指导
    const specificGuidance = this.generateSpecificGuidance(
      question,
      matchedConditions,
      recommendedAnswer
    );

    return {
      question: question,
      matched_conditions: matchedConditions,
      recommended_answer: recommendedAnswer,
      reasoning: reasoning,
      specific_guidance: specificGuidance,
      examples: this.findRelevantExamples(question, matchedConditions),
      common_mistakes: this.getCommonMistakes(question),
      important_notes: this.getImportantNotes(question)
    };
  }

  /**
   * 匹配用户病史与问题
   */
  private matchConditionsToQuestion(
    question: HealthDeclarationQuestion,
    currentConditions: MedicalCondition[],
    medicalHistory: MedicalHistory
  ): MatchedCondition[] {
    const matched: MatchedCondition[] = [];

    // 检查关键词匹配
    const keywords = question.keywords;

    // 检查当前疾病
    for (const condition of currentConditions) {
      if (this.isMatch(condition.condition, keywords)) {
        matched.push({
          condition: condition,
          match_type: 'current',
          match_reason: `当前患有 ${condition.condition}`,
          should_declare: true
        });
      }
    }

    // 检查既往病史（考虑时间范围）
    if (question.time_frame) {
      const cutoffDate = this.calculateCutoffDate(question.time_frame);
      for (const condition of medicalHistory.past_conditions) {
        if (condition.diagnosed_date >= cutoffDate &&
            this.isMatch(condition.condition, keywords)) {
          matched.push({
            condition: condition,
            match_type: 'past',
            match_reason: `在询问时间范围内（${question.time_frame.years}年内）患过 ${condition.condition}`,
            should_declare: true
          });
        }
      }
    }

    return matched;
  }

  /**
   * 生成具体指导
   */
  private generateSpecificGuidance(
    question: HealthDeclarationQuestion,
    matchedConditions: MatchedCondition[],
    recommendedAnswer: 'yes' | 'no' | 'consult'
  ): string {
    if (recommendedAnswer === 'no') {
      return `✅ 建议回答：否\n\n您的情况不涉及此问题，可以放心回答"否"。`;
    }

    if (recommendedAnswer === 'yes') {
      let guidance = `⚠️ 建议回答：是\n\n以下情况需要告知：\n`;
      for (const matched of matchedConditions) {
        guidance += `• ${matched.match_reason}\n`;
      }
      guidance += `\n如实告知的好处：\n`;
      guidance += `• 避免将来理赔纠纷\n`;
      guidance += `• 保险公司会根据您的情况核保，可能标准体承保、加费承保或除外承保\n`;
      guidance += `• 即使加费或除外，也比拒赔好\n`;
      return guidance;
    }

    // consult
    return `❓ 建议咨询\n\n这个情况比较复杂，建议：\n1. 联系保险公司客服咨询\n2. 或者尝试智能核保（提供详细信息后系统自动判断）\n3. 或者联系专业保险顾问`;
  }
}
```

### 3. 产品匹配算法（基于健康状况）

```typescript
class HealthBasedProductMatcher {
  /**
   * 根据健康状况匹配最适合的产品
   */
  async matchProducts(
    healthProfile: HealthProfile,
    productType: 'critical_illness' | 'medical' | 'life'
  ): Promise<HealthMatchedProduct[]> {
    // 1. 获取所有产品
    const allProducts = await this.getAllProducts(productType);

    // 2. 过滤掉不可投保的产品
    const eligibleProducts = [];
    for (const product of allProducts) {
      const eligibility = await this.checkEligibility(product, healthProfile);
      if (eligibility.is_eligible) {
        eligibleProducts.push({
          product: product,
          eligibility: eligibility
        });
      }
    }

    // 3. 评分排序
    const scoredProducts = eligibleProducts.map(p => ({
      ...p,
      score: this.calculateHealthFriendlinessScore(p.product, healthProfile),
      expected_outcome: this.predictUnderwritingOutcome(p.product, healthProfile)
    }));

    // 4. 按评分排序
    scoredProducts.sort((a, b) => b.score - a.score);

    // 5. 生成推荐理由
    return scoredProducts.map(p => ({
      ...p,
      recommendation_reason: this.generateRecommendationReason(p, healthProfile),
      pros_for_your_health: this.analyzeHealthPros(p.product, healthProfile),
      cons_for_your_health: this.analyzeHealthCons(p.product, healthProfile)
    }));
  }

  /**
   * 计算产品对特定健康状况的友好度
   */
  private calculateHealthFriendlinessScore(
    product: Product,
    healthProfile: HealthProfile
  ): number {
    let score = 50; // 基准分

    // 因素1: 健康告知问题数量（越少越好）
    score += (10 - product.health_questions.length) * 2;

    // 因素2: 智能核保可用性
    if (product.underwriting_policy.smart_underwriting.available) {
      score += 15;
    }

    // 因素3: 对用户现有疾病的友好度
    for (const condition of healthProfile.current_conditions) {
      const friendliness = this.getProductFriendliness(product, condition);
      if (friendliness === 'high') score += 10;
      else if (friendliness === 'medium') score += 5;
      else if (friendliness === 'low') score -= 10;
    }

    // 因素4: 历史承保数据
    const stats = product.underwriting_policy.approval_statistics;
    score += stats.standard_rate * 30; // 标准体承保率越高越好

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 预测核保结果
   */
  private predictUnderwritingOutcome(
    product: Product,
    healthProfile: HealthProfile
  ): UnderwritingPrediction {
    const riskFactors = this.identifyRiskFactors(healthProfile);

    // 基于风险因素和产品核保政策预测
    let standardProb = 70; // 基础概率
    let ratedProb = 20;
    let excludedProb = 5;
    let declinedProb = 5;

    for (const factor of riskFactors) {
      const impact = this.getFactorImpact(factor, product);
      standardProb -= impact.standard_reduction;
      ratedProb += impact.rated_increase;
      excludedProb += impact.excluded_increase;
      declinedProb += impact.declined_increase;
    }

    // 归一化
    const total = standardProb + ratedProb + excludedProb + declinedProb;
    return {
      standard_body: standardProb / total,
      rated_premium: ratedProb / total,
      exclusion: excludedProb / total,
      decline: declinedProb / total,
      most_likely_outcome: this.getMostLikely([
        ['standard', standardProb],
        ['rated', ratedProb],
        ['excluded', excludedProb],
        ['declined', declinedProb]
      ]),
      estimated_premium_range: this.estimatePremiumRange(product, healthProfile)
    };
  }
}
```

---

## 知识库设计

### 1. 疾病知识库 (3000+ 疾病)

**数据来源：**
- ICD-10 国际疾病分类
- 各保险公司核保手册
- 理赔案例分析
- 医学文献

**数据结构：**
```json
{
  "disease_id": "hypertension_001",
  "name": "高血压",
  "aliases": ["血压高", "高血压病", "原发性高血压"],
  "icd_code": "I10",
  "category": "心血管系统疾病",

  "severity_levels": [
    {
      "level": "1级（轻度）",
      "criteria": "收缩压 140-159 或舒张压 90-99",
      "insurability": {
        "critical_illness": {
          "rating": "standard_to_rated",
          "notes": "血压控制良好（≤140/90）可标准体承保",
          "typical_extra_premium": 0.2
        },
        "medical": {
          "rating": "standard",
          "notes": "通常可标准体承保"
        },
        "life": {
          "rating": "standard_to_rated",
          "notes": "可能需要加费 20%-50%"
        }
      }
    },
    {
      "level": "2级（中度）",
      "criteria": "收缩压 160-179 或舒张压 100-109",
      "insurability": {
        "critical_illness": {
          "rating": "rated_to_declined",
          "notes": "通常需要加费或拒保",
          "typical_extra_premium": 0.5
        }
      }
    }
  ],

  "underwriting_guide": {
    "required_info": [
      "确诊时间",
      "最高血压值",
      "目前血压控制情况",
      "是否有并发症（心脏、肾脏、眼底）",
      "服药情况"
    ],
    "required_documents": [
      "近3个月血压记录",
      "近期体检报告",
      "心电图",
      "肾功能检查"
    ],
    "typical_outcome": "血压控制良好（≤140/90）通常可标准体承保或轻度加费",
    "special_considerations": [
      "有并发症通常会除外或拒保",
      "年龄 < 40 核保会更严格",
      "建议先控制血压再投保"
    ]
  },

  "insurance_advice": {
    "best_products": [
      "XX医疗险（健康告知宽松）",
      "YY重疾险（支持智能核保）"
    ],
    "smart_underwriting_products": [
      "product_001",
      "product_005"
    ],
    "alternative_products": [
      "防癌险（通常不问血压）"
    ]
  },

  "declaration_guide": {
    "must_declare_if": [
      "确诊高血压",
      "正在服用降压药",
      "体检发现血压超过 140/90"
    ],
    "no_need_to_declare_if": [
      "偶尔一次测量血压偏高（如紧张、运动后）",
      "没有确诊，也从未服药"
    ],
    "gray_areas": [
      "白大衣高血压（医院测高，家里正常）",
      "妊娠期高血压（已恢复正常）"
    ]
  },

  "real_cases": [
    {
      "case_type": "approved",
      "summary": "35岁，1级高血压，血压控制良好",
      "outcome": "标准体承保",
      "lesson": "血压控制达标是标准体承保的关键"
    },
    {
      "case_type": "denied",
      "summary": "42岁，高血压未告知，后确诊心梗申请理赔",
      "outcome": "拒赔，退还保费",
      "lesson": "隐瞒高血压导致理赔纠纷"
    }
  ]
}
```

### 2. 健康告知问题库 (500+ 问题)

**覆盖范围：**
- 所有主流保险公司的健康告知问题
- 不同产品类型的特定问题
- 常见问题的标准化表述

**示例：**
```json
{
  "question_id": "hq_001",
  "question_text": "过去两年内，是否因病住院或手术？",
  "question_category": "treatment",

  "explanation": {
    "what_it_asks": "询问您过去2年内是否有住院或手术经历",
    "why_it_matters": "住院和手术通常意味着严重疾病，保险公司需要评估风险",
    "who_should_answer_yes": [
      "因疾病住院治疗",
      "进行过任何手术（含微创）",
      "住院检查（即使未确诊疾病）"
    ],
    "who_should_answer_no": [
      "门诊治疗（未住院）",
      "体检（非住院）",
      "2年前的住院"
    ]
  },

  "common_misunderstandings": [
    {
      "misconception": "小手术不算手术",
      "correct_understanding": "所有手术都需要告知，包括拔智齿、痔疮手术等",
      "example": "李先生认为痔疮手术是小手术不用说，但理赔时被发现，差点被拒赔"
    },
    {
      "misconception": "住院检查不算住院",
      "correct_understanding": "只要办理住院手续就算住院，即使只是检查",
      "example": "住院3天做全面体检，也需要告知"
    }
  ],

  "keywords": [
    "住院", "手术", "住院检查", "手术治疗", "入院"
  ],

  "time_frame": {
    "years": 2,
    "specific_period": "过去2年内"
  },

  "scenarios": [
    {
      "scenario": "1年前因阑尾炎住院手术",
      "should_declare": true,
      "reason": "在2年询问范围内"
    },
    {
      "scenario": "3年前因骨折住院",
      "should_declare": false,
      "reason": "超过2年询问范围"
    },
    {
      "scenario": "上个月拔智齿（门诊）",
      "should_declare": false,
      "reason": "门诊不算住院"
    },
    {
      "scenario": "半年前住院做体检",
      "should_declare": true,
      "reason": "住院即需告知，即使是体检"
    }
  ]
}
```

---

## 实现路径

### Phase 1: 基础数据准备 (Week 1)

- [ ] 构建疾病知识库
  - [ ] 收集常见疾病清单 (100 种)
  - [ ] 为每种疾病补充核保信息
  - [ ] 添加真实案例

- [ ] 构建健康告知问题库
  - [ ] 收集主流产品的健康告知问题
  - [ ] 为每个问题添加解释和示例
  - [ ] 整理常见误解

### Phase 2: 核心算法实现 (Week 2)

- [ ] 实现 HealthAssessmentEngine
  - [ ] 健康评分算法
  - [ ] 风险因素识别
  - [ ] 可保性评估

- [ ] 实现 DeclarationGuideEngine
  - [ ] 问题分析算法
  - [ ] 病史匹配算法
  - [ ] 指导生成算法

### Phase 3: 产品匹配与核保建议 (Week 2)

- [ ] 实现 HealthBasedProductMatcher
  - [ ] 产品友好度评分
  - [ ] 核保结果预测
  - [ ] 个性化推荐

- [ ] 实现智能核保建议
  - [ ] 核保策略生成
  - [ ] 材料准备指导
  - [ ] 核保成功率评估

### Phase 4: Agent 集成与测试 (Week 3)

- [ ] 实现 HealthDeclarationAgent
- [ ] 与其他 Agent 集成
- [ ] 端到端测试
- [ ] 优化用户交互体验

---

## 总结

健康告知智能辅助系统是保险经纪 Skill 的**最核心功能**，因为它解决了用户最大的痛点：

1. ✅ 不懂如何正确进行健康告知
2. ✅ 担心告知后被拒保
3. ✅ 不知道自己能买什么产品
4. ✅ 害怕将来理赔纠纷

通过本系统，用户可以：
- 🎯 清楚了解每个健康告知问题的真实含义
- 🎯 获得个性化的填写指导
- 🎯 找到最适合自己健康状况的产品
- 🎯 预测核保结果，心里有底
- 🎯 避免理赔纠纷

这才是真正的"AI 保险顾问"！
