# 🏗️ 保险经纪 Skill - 高级架构设计

## 目录
- [架构概览](#架构概览)
- [5大核心增强功能](#5大核心增强功能)
- [Multi-Agent 协作机制](#multi-agent-协作机制)
- [数据层设计](#数据层设计)
- [技术实现路线](#技术实现路线)

---

## 架构概览

### 完整系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     用户交互层                                │
│  (WhatsApp / Telegram / Slack / Discord / Web)              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  对话管理与上下文层                            │
│  • 意图识别 (Intent Recognition)                             │
│  • 对话状态管理 (Conversation State)                         │
│  • 上下文记忆 (Context Memory) ←────【新增】                │
│  • 会话持久化 (Session Persistence)                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Multi-Agent 协作层                         │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────────┐             │
│  │ NeedsAnalysis   │  │ HealthDeclaration    │ ←【新增】  │
│  │ Agent           │  │ Agent                │             │
│  └─────────────────┘  └──────────────────────┘             │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────────┐             │
│  │ ProductRecom    │  │ DisputeResolution    │ ←【新增】  │
│  │ mendationAgent  │  │ Agent                │             │
│  └─────────────────┘  └──────────────────────┘             │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────────┐             │
│  │ PlanDesign      │  │ Relationship         │ ←【新增】  │
│  │ Agent           │  │ Agent                │             │
│  └─────────────────┘  └──────────────────────┘             │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────────┐             │
│  │ Comparison      │  │ KnowledgeBase        │             │
│  │ Agent           │  │ Agent                │             │
│  └─────────────────┘  └──────────────────────┘             │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────────┐             │
│  │ ClaimsAssistant │  │ PolicyManagement     │             │
│  │ Agent           │  │ Agent                │             │
│  └─────────────────┘  └──────────────────────┘             │
│                                                              │
│  ┌─────────────────┐                                        │
│  │ PremiumCalc     │                                        │
│  │ ulator Agent    │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        工具层                                │
│                                                              │
│  ┌──────────────────┐  ┌───────────────────────┐           │
│  │ SmartProduct     │  │ HealthDeclaration     │ ←【新增】│
│  │ Matcher          │  │ Assistant             │           │
│  │ (多目标优化)      │  │ (智能告知辅助)         │           │
│  └──────────────────┘  └───────────────────────┘           │
│                                                              │
│  ┌──────────────────┐  ┌───────────────────────┐           │
│  │ UserProfile      │  │ DisputeMediator       │ ←【新增】│
│  │ Manager          │  │ (争议调解工具)         │           │
│  │ (用户画像) ←【新】│  └───────────────────────┘           │
│  └──────────────────┘                                       │
│                                                              │
│  ┌──────────────────┐  ┌───────────────────────┐           │
│  │ Premium          │  │ MarketData            │ ←【新增】│
│  │ Calculator       │  │ Crawler               │           │
│  └──────────────────┘  │ (市场数据爬虫)         │           │
│                        └───────────────────────┘           │
│  ┌──────────────────┐  ┌───────────────────────┐           │
│  │ PlanDesigner     │  │ LifecycleTracker      │ ←【新增】│
│  └──────────────────┘  │ (生命周期跟踪)         │           │
│                        └───────────────────────┘           │
│  ┌──────────────────┐                                       │
│  │ CoverageAnalyzer │                                       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        数据层                                │
│                                                              │
│  ┌──────────────────────────────────────────┐               │
│  │ 产品数据库 (Product Database)             │               │
│  │ • 版本控制 (Version Control) ←【新增】   │               │
│  │ • 停售管理 (Discontinuation)             │               │
│  │ • 更新追踪 (Update Tracking)             │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  ┌──────────────────────────────────────────┐               │
│  │ 用户画像数据库 (User Profile DB) ←【新增】│               │
│  │ • 基础信息 (Demographics)                │               │
│  │ • 偏好学习 (Preferences)                 │               │
│  │ • 决策历史 (Decision History)            │               │
│  │ • 健康档案 (Health Records)              │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  ┌──────────────────────────────────────────┐               │
│  │ 对话历史数据库 (Conversation History)     │               │
│  │ • 会话记录                                │               │
│  │ • 上下文状态                              │               │
│  │ • 反馈收集                                │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  ┌──────────────────────────────────────────┐               │
│  │ 市场数据库 (Market Data) ←【新增】        │               │
│  │ • 实时产品信息                            │               │
│  │ • 价格变动追踪                            │               │
│  │ • 竞品分析                                │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  ┌──────────────────────────────────────────┐               │
│  │ 知识库 (Knowledge Base)                   │               │
│  │ • 理赔案例库 (Claims Cases) ←【新增】    │               │
│  │ • 争议解决案例 (Dispute Cases)           │               │
│  │ • 健康告知指南 (Health Declaration)      │               │
│  │ • 法规政策 (Regulations)                 │               │
│  └──────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 5大核心增强功能

### 1. 🔥 健康告知智能辅助系统

#### 核心价值
解决保险购买的最大痛点：**如何正确进行健康告知，避免理赔纠纷**

#### 功能模块

```typescript
/**
 * 健康告知智能辅助 Agent
 */
class HealthDeclarationAgent {
  /**
   * 1. 健康状况评估
   * 分析用户的健康状况，判断投保风险
   */
  async assessHealthStatus(
    medicalHistory: MedicalHistory
  ): Promise<HealthAssessment> {
    return {
      risk_level: 'standard' | 'substandard' | 'declined',
      conditions: ConditionAnalysis[],
      underwriting_suggestion: string,
      suitable_products: ProductMatch[]
    };
  }

  /**
   * 2. 智能告知指导
   * 逐条指导用户如何填写健康告知
   */
  async guideDeclaration(
    questions: HealthQuestion[],
    userHistory: MedicalHistory
  ): Promise<DeclarationGuide> {
    return {
      questions_analysis: {
        question: string,
        what_it_means: string,
        should_declare: boolean,
        declaration_tips: string,
        examples: string[]
      }[],
      risk_warnings: string[],
      recommended_actions: string[]
    };
  }

  /**
   * 3. 既往病史匹配
   * 根据健康状况匹配可投保的产品
   */
  async matchProductsByHealth(
    conditions: MedicalCondition[]
  ): Promise<ProductMatch[]> {
    // 匹配逻辑：
    // - 标准体可投保：所有产品
    // - 糖尿病：防癌险、部分医疗险
    // - 高血压：部分重疾险（需加费）
    // - 甲状腺结节：需智能核保
    return filteredProducts;
  }

  /**
   * 4. 智能核保建议
   * 提供核保策略建议
   */
  async suggestUnderwritingStrategy(
    health: HealthProfile
  ): Promise<UnderwritingStrategy> {
    return {
      strategy: 'standard' | 'smart_underwriting' | 'manual_review',
      steps: string[],
      required_documents: string[],
      approval_probability: number,
      alternative_products: Product[]
    };
  }

  /**
   * 5. 如实告知教育
   * 教育用户正确理解"如实告知"义务
   */
  async educateOnDisclosure(): Promise<EducationContent> {
    return {
      principles: [
        '询问到的必须告知',
        '未询问到的无需主动告知',
        '隐瞒或虚假告知的后果',
        '如实告知的法律依据'
      ],
      case_studies: DisputeCase[], // 因隐瞒导致拒赔的真实案例
      best_practices: string[]
    };
  }
}
```

#### 数据支持

```typescript
/**
 * 健康告知知识库
 */
interface HealthDeclarationKnowledgeBase {
  // 1. 常见疾病投保指南
  common_conditions: {
    condition: string; // 如"糖尿病"
    severity_levels: {
      level: string;
      insurability: 'standard' | 'rated' | 'excluded' | 'declined';
      suitable_products: string[];
      underwriting_notes: string;
    }[];
    declaration_guide: string;
    case_examples: Case[];
  }[];

  // 2. 健康告知问题库
  declaration_questions: {
    question: string;
    explanation: string; // 这个问题在问什么
    common_misunderstandings: string[]; // 常见误解
    correct_interpretation: string;
    examples: {
      scenario: string;
      should_declare: boolean;
      reason: string;
    }[];
  }[];

  // 3. 产品健康要求矩阵
  product_health_requirements: {
    product_id: string;
    health_questions: HealthQuestion[];
    exclusions: string[];
    underwriting_rules: Rule[];
  }[];

  // 4. 理赔争议案例库（因健康告知问题）
  dispute_cases: {
    case_id: string;
    condition: string;
    what_happened: string;
    declaration_issue: string; // 告知哪里出了问题
    outcome: 'approved' | 'denied';
    lesson: string;
  }[];
}
```

#### 使用场景

```
场景 1: 有既往病史的用户
─────────────────────────
用户: "我有高血压，能买重疾险吗？"

系统:
1. 评估高血压严重程度
   • 血压控制情况？
   • 是否有并发症？
   • 服药情况？

2. 根据评估结果推荐产品
   • 标准体（血压≤140/90）：所有重疾险
   • 需加费（140-160/90-100）：部分重疾险
   • 可能拒保（>160/100 或有并发症）：建议防癌险

3. 智能核保指导
   • 准备材料：近3个月血压记录、体检报告
   • 推荐智能核保产品：XX重疾险、YY医疗险
   • 预估核保结果：标准体承保概率 60%

4. 如实告知指导
   • 健康告知中关于高血压的问题如何回答
   • 需要披露的信息清单
   • 注意事项
```

---

### 2. 🔥 理赔争议处理系统

#### 核心价值
解决理赔纠纷，提供专业的争议调解和法律支持

#### 功能模块

```typescript
/**
 * 理赔争议处理 Agent
 */
class DisputeResolutionAgent {
  /**
   * 1. 拒赔原因分析
   */
  async analyzeDenialReason(
    claimCase: ClaimCase
  ): Promise<DenialAnalysis> {
    return {
      denial_reason: string,
      is_reasonable: boolean,
      counter_arguments: string[],
      supporting_evidence: string[],
      win_probability: number,
      recommended_action: 'accept' | 'negotiate' | 'appeal' | 'litigate'
    };
  }

  /**
   * 2. 申诉材料准备
   */
  async prepareAppealDocuments(
    case: ClaimCase
  ): Promise<AppealPackage> {
    return {
      appeal_letter: string, // 申诉信模板
      supporting_documents: Document[], // 需要提供的证明材料
      legal_basis: LegalReference[], // 法律依据
      timeline: AppealTimeline,
      submission_guide: string
    };
  }

  /**
   * 3. 协商谈判策略
   */
  async suggestNegotiationStrategy(
    case: ClaimCase
  ): Promise<NegotiationStrategy> {
    return {
      negotiation_points: string[], // 谈判要点
      bottom_line: number, // 最低接受金额
      alternative_solutions: Solution[], // 替代方案
      communication_templates: Template[]
    };
  }

  /**
   * 4. 监管投诉指导
   */
  async guideRegulatoryComplaint(
    case: ClaimCase
  ): Promise<ComplaintGuide> {
    return {
      complaint_channels: [
        {
          name: '保险公司总部投诉',
          contact: string,
          process: string[]
        },
        {
          name: '银保监会投诉',
          website: 'https://www.cbirc.gov.cn',
          hotline: '12378',
          process: string[]
        },
        {
          name: '保险行业协会调解',
          process: string[]
        }
      ],
      complaint_letter_template: string,
      evidence_checklist: string[],
      expected_timeline: string
    };
  }

  /**
   * 5. 法律诉讼建议
   */
  async suggestLegalAction(
    case: ClaimCase
  ): Promise<LegalAdvice> {
    return {
      is_worth_suing: boolean,
      win_probability: number,
      estimated_cost: CostEstimate,
      litigation_steps: string[],
      lawyer_recommendations: LawyerInfo[],
      case_precedents: CourtCase[] // 类似案例判决
    };
  }
}
```

#### 争议案例库

```typescript
/**
 * 理赔争议案例数据库
 */
interface DisputeCaseDatabase {
  cases: {
    case_id: string;
    product_type: string;
    claim_type: string;

    // 案情
    background: string;
    claim_amount: number;
    denial_reason: string;

    // 争议焦点
    dispute_focus: string[];

    // 解决过程
    resolution_process: {
      step: string;
      action: string;
      result: string;
    }[];

    // 最终结果
    outcome: {
      status: 'fully_paid' | 'partially_paid' | 'denied' | 'settled';
      final_amount: number;
      resolution_method: 'negotiation' | 'mediation' | 'litigation';
      time_taken: number; // 天数
    };

    // 经验教训
    lessons_learned: string[];
    key_evidence: string[];

    // 法律依据
    legal_basis: string[];
  }[];
}
```

#### 使用场景

```
场景: 重疾险拒赔
─────────────────
用户: "我确诊癌症，保险公司说我隐瞒病史拒赔，但我当时真的不知道！"

系统分析:
1. 拒赔原因分析
   • 保险公司主张：投保前已有甲状腺结节未告知
   • 用户主张：不知道有结节，体检没发现
   • 关键证据：投保前的体检报告、病历记录

2. 是否合理？
   • 分析：如果用户确实不知情（无体检记录显示），
            则不构成"故意隐瞒"
   • 胜诉概率：70%（基于类似案例）

3. 建议行动
   Step 1: 收集证据
   • 投保前所有体检报告
   • 门诊/住院病历
   • 证明"不知情"的材料

   Step 2: 向保险公司申诉
   • 提供申诉信模板
   • 列明法律依据（保险法第16条）

   Step 3: 同时向银保监会投诉
   • 投诉信模板
   • 12378 热线投诉流程

   Step 4: 准备诉讼（如申诉失败）
   • 律师推荐
   • 类似案例判决书（10个参考案例）
   • 预估诉讼成本和时间

4. 类似案例参考
   【案例1】某投保人甲状腺结节未告知案
   • 法院判决：保险公司败诉
   • 理由：投保人确实不知情，保险公司未尽明确说明义务
   • 判赔全额
```

---

### 3. 🔥 用户画像与记忆系统

#### 核心价值
**让 AI 保险顾问真正"认识"用户，提供个性化长期服务**

#### 架构设计

```typescript
/**
 * 用户画像管理器
 */
class UserProfileManager {
  /**
   * 用户画像数据结构
   */
  interface UserProfile {
    // ===== 1. 基础信息层 =====
    demographics: {
      user_id: string;
      age: number;
      gender: string;
      occupation: string;
      income_level: string;
      location: string;
      education: string;
    };

    // ===== 2. 家庭信息层 =====
    family: {
      marital_status: string;
      spouse: PersonInfo;
      children: PersonInfo[];
      parents: PersonInfo[];
      dependents_count: number;
    };

    // ===== 3. 财务状况层 =====
    financial: {
      annual_income: number;
      monthly_income: number;
      assets: Asset[];
      liabilities: Liability[];
      monthly_expenses: number;
      insurance_budget: {
        min: number;
        max: number;
        preferred: number;
      };
    };

    // ===== 4. 健康档案层 【新增】=====
    health: {
      current_conditions: MedicalCondition[];
      past_conditions: MedicalCondition[];
      family_history: FamilyMedicalHistory[];
      lifestyle: {
        smoking: boolean;
        drinking: boolean;
        exercise_frequency: string;
        bmi: number;
      };
      recent_checkups: MedicalCheckup[];
      medications: Medication[];
    };

    // ===== 5. 保险持有情况 =====
    existing_insurance: {
      policies: Policy[];
      total_coverage: {
        life: number;
        critical_illness: number;
        medical: number;
        accident: number;
      };
      total_premium: number;
      coverage_gaps: GapAnalysis[];
    };

    // ===== 6. 偏好学习层 【核心新增】=====
    preferences: {
      // 品牌偏好
      brand_preference: {
        preferred_companies: string[];
        avoided_companies: string[];
        preference_reasons: { company: string; reason: string }[];
      };

      // 决策偏好
      decision_factors: {
        factor: 'price' | 'coverage' | 'brand' | 'service' | 'flexibility';
        weight: number; // 0-1，权重
      }[];

      // 产品类型偏好
      product_preferences: {
        prefer_term_over_whole_life: boolean;
        prefer_online_over_offline: boolean;
        prefer_standalone_over_bundled: boolean;
        risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
      };

      // 沟通偏好
      communication: {
        preferred_language: string;
        detail_level: 'brief' | 'moderate' | 'detailed';
        preferred_channels: string[];
        response_time_expectation: string;
      };
    };

    // ===== 7. 决策历史层 【核心新增】=====
    decision_history: {
      // 产品查看历史
      viewed_products: {
        product_id: string;
        viewed_at: Date;
        time_spent: number; // 秒
        engagement_level: 'low' | 'medium' | 'high';
      }[];

      // 拒绝记录（为什么不买）
      rejections: {
        product_id: string;
        rejected_at: Date;
        reason: string; // "太贵了" | "保障不够" | "不信任这个公司"
        price_sensitivity: number;
      }[];

      // 购买决策路径
      purchase_decisions: {
        policy_id: string;
        decision_path: DecisionNode[]; // 从需求分析到购买的完整路径
        key_factors: string[]; // 最终购买的关键因素
        alternatives_considered: string[]; // 对比过的其他产品
      }[];

      // 咨询历史
      consultations: {
        date: Date;
        topic: string;
        questions_asked: string[];
        solutions_provided: string[];
        satisfaction: number;
      }[];
    };

    // ===== 8. 生命周期事件 【新增】=====
    lifecycle_events: {
      past_events: LifecycleEvent[];
      upcoming_events: LifecycleEvent[];
      event_tracking: {
        event: 'marriage' | 'childbirth' | 'home_purchase' | 'job_change' | 'retirement';
        date: Date;
        insurance_impact: string;
        action_taken: string;
      }[];
    };

    // ===== 9. 风险画像 【新增】=====
    risk_profile: {
      health_risk_score: number; // 0-100
      death_risk_score: number;
      accident_risk_score: number;
      financial_risk_score: number;
      overall_risk_level: 'low' | 'medium' | 'high';
      risk_factors: {
        factor: string;
        impact: number;
        mitigation: string;
      }[];
    };

    // ===== 10. 互动行为分析 【新增】=====
    behavioral_insights: {
      engagement_score: number; // 用户活跃度
      trust_score: number; // 信任度（基于互动质量）
      price_sensitivity: number; // 价格敏感度
      decision_speed: 'impulsive' | 'moderate' | 'deliberate'; // 决策速度
      information_seeking_level: 'low' | 'medium' | 'high'; // 信息查询深度

      // AI 学到的用户特征
      learned_characteristics: {
        characteristic: string;
        confidence: number;
        evidence: string[];
      }[];
    };

    // ===== 元数据 =====
    metadata: {
      created_at: Date;
      updated_at: Date;
      last_interaction: Date;
      profile_completeness: number; // 0-100%
      data_quality_score: number;
    };
  }

  /**
   * 智能画像更新
   */
  async updateProfile(
    userId: string,
    interaction: Interaction
  ): Promise<void> {
    // 1. 从对话中提取信息
    const extracted = await this.extractFromConversation(interaction);

    // 2. 学习用户偏好
    await this.learnPreferences(userId, interaction);

    // 3. 更新决策历史
    await this.trackDecision(userId, interaction);

    // 4. 重新计算风险评分
    await this.recalculateRiskScores(userId);
  }

  /**
   * 偏好学习算法
   */
  async learnPreferences(
    userId: string,
    interaction: Interaction
  ): Promise<void> {
    // 示例：学习价格敏感度
    if (interaction.type === 'product_rejection') {
      if (interaction.reason.includes('贵') || interaction.reason.includes('价格')) {
        // 增加价格敏感度权重
        await this.updatePriceSensitivity(userId, +0.1);
      }
    }

    // 示例：学习品牌偏好
    if (interaction.type === 'product_selection') {
      const company = interaction.product.company;
      await this.addBrandPreference(userId, company);
    }

    // 示例：学习决策因素权重
    if (interaction.type === 'comparison') {
      // 分析用户在对比时关注什么
      const factors = this.analyzeComparisonFocus(interaction);
      await this.updateDecisionFactorWeights(userId, factors);
    }
  }

  /**
   * 个性化推荐
   */
  async getPersonalizedRecommendations(
    userId: string,
    context: Context
  ): Promise<Recommendation[]> {
    const profile = await this.getProfile(userId);

    // 1. 基于历史拒绝，过滤掉不喜欢的产品
    let products = await this.filterByRejectionHistory(profile);

    // 2. 基于偏好排序
    products = await this.rankByPreferences(products, profile.preferences);

    // 3. 基于生命周期事件调整
    products = await this.adjustForLifecycleEvents(products, profile.lifecycle_events);

    // 4. 基于决策历史优化
    products = await this.optimizeByDecisionHistory(products, profile.decision_history);

    return products;
  }
}
```

#### 记忆系统设计

```typescript
/**
 * 上下文记忆系统
 */
class ContextMemorySystem {
  /**
   * 短期记忆（当前会话）
   */
  shortTermMemory: {
    session_id: string;
    conversation_turns: ConversationTurn[];
    current_intent: string;
    pending_questions: Question[];
    collected_info: Partial<UserInfo>;
  };

  /**
   * 长期记忆（跨会话）
   */
  longTermMemory: {
    user_id: string;
    all_conversations: Conversation[];
    extracted_facts: Fact[]; // 从对话中提取的事实
    relationship_history: RelationshipEvent[];
  };

  /**
   * 智能上下文召回
   */
  async recallRelevantContext(
    userId: string,
    currentQuery: string
  ): Promise<Context> {
    // 1. 从长期记忆中召回相关信息
    const relevantFacts = await this.searchLongTermMemory(userId, currentQuery);

    // 2. 召回相关的历史对话
    const relevantConversations = await this.findSimilarConversations(userId, currentQuery);

    // 3. 召回用户画像中的关键信息
    const profile = await this.userProfileManager.getProfile(userId);

    return {
      facts: relevantFacts,
      history: relevantConversations,
      profile: profile,
      suggestions: this.generateSuggestions(relevantFacts, profile)
    };
  }

  /**
   * 避免重复收集信息
   */
  async avoidRedundantQuestions(
    userId: string,
    questionToAsk: string
  ): Promise<{ shouldAsk: boolean; existingAnswer?: any }> {
    // 检查是否已经问过这个问题
    const existing = await this.checkIfAlreadyAsked(userId, questionToAsk);

    if (existing) {
      return {
        shouldAsk: false,
        existingAnswer: existing.answer
      };
    }

    return { shouldAsk: true };
  }
}
```

#### 使用场景

```
场景: 老用户回访
─────────────────
用户: "我想再看看医疗险"

【没有记忆系统】
系统: "好的，请问您的年龄？"
（每次都要重新收集信息）

【有记忆系统】
系统: "张先生您好！看到您上次对XX百万医疗险比较感兴趣，
      但担心600万保额用不到。现在有一款300万保额的产品，
      价格便宜30%，要不要了解一下？

      另外，您提到的孩子今年9月要上小学了，
      建议同时考虑给孩子配置少儿医疗险。"

（系统记住了：
 1. 用户姓名
 2. 之前看过的产品
 3. 拒绝原因（保额太高）
 4. 家庭情况（孩子上小学）
 5. 用户偏好（注重性价比）
）
```

---

### 4. 📊 更智能的推荐算法

#### 核心价值
**从"规则匹配"升级到"多目标优化+机器学习"**

#### 算法架构

```typescript
/**
 * 智能产品推荐引擎
 */
class SmartRecommendationEngine {
  /**
   * 多目标优化推荐
   */
  async recommendWithMultiObjective(
    userProfile: UserProfile,
    context: Context
  ): Promise<Recommendation[]> {
    // 定义优化目标
    const objectives = {
      maximize_coverage: {
        weight: userProfile.preferences.decision_factors.find(f => f.factor === 'coverage')?.weight || 0.3,
        calculate: (product) => this.calculateCoverageScore(product, userProfile)
      },

      minimize_cost: {
        weight: userProfile.preferences.decision_factors.find(f => f.factor === 'price')?.weight || 0.4,
        calculate: (product) => this.calculateCostScore(product, userProfile)
      },

      maximize_flexibility: {
        weight: userProfile.preferences.decision_factors.find(f => f.factor === 'flexibility')?.weight || 0.2,
        calculate: (product) => this.calculateFlexibilityScore(product)
      },

      match_brand_preference: {
        weight: userProfile.preferences.decision_factors.find(f => f.factor === 'brand')?.weight || 0.1,
        calculate: (product) => this.calculateBrandScore(product, userProfile)
      }
    };

    // 帕累托最优解
    const candidates = await this.getAllProducts();
    const paretoOptimal = this.findParetoOptimal(candidates, objectives);

    return paretoOptimal;
  }

  /**
   * 产品组合协同优化
   */
  async optimizeProductPortfolio(
    userNeeds: InsuranceNeeds,
    budget: Budget
  ): Promise<Portfolio> {
    // 问题建模：
    // 在预算约束下，最大化保障覆盖

    const problem = {
      // 决策变量：选择哪些产品
      variables: this.getAllProducts(),

      // 约束条件
      constraints: [
        {
          type: 'budget',
          condition: (portfolio) => this.getTotalPremium(portfolio) <= budget.max
        },
        {
          type: 'no_duplicate',
          condition: (portfolio) => this.noDuplicateCoverage(portfolio)
        },
        {
          type: 'coverage_minimum',
          condition: (portfolio) => this.meetsMinimumCoverage(portfolio, userNeeds)
        }
      ],

      // 目标函数
      objective: (portfolio) => {
        return this.calculatePortfolioValue(portfolio, userNeeds);
      }
    };

    // 使用遗传算法求解
    const optimalPortfolio = await this.geneticAlgorithmSolver(problem);

    return optimalPortfolio;
  }

  /**
   * 协同过滤推荐
   */
  async collaborativeFiltering(
    userId: string
  ): Promise<Recommendation[]> {
    // 1. 找到相似用户
    const similarUsers = await this.findSimilarUsers(userId, {
      factors: ['age', 'income', 'family_structure', 'health_status'],
      similarity_threshold: 0.8
    });

    // 2. 找到相似用户购买的产品
    const theirChoices = await this.getUserChoices(similarUsers);

    // 3. 过滤掉当前用户已有的产品
    const newRecommendations = theirChoices.filter(
      product => !this.userAlreadyHas(userId, product)
    );

    // 4. 按相似度和评分排序
    return this.rankBySimilarityAndRating(newRecommendations);
  }

  /**
   * 基于场景的推荐
   */
  async scenarioBasedRecommendation(
    scenario: LifecycleEvent,
    userProfile: UserProfile
  ): Promise<Recommendation[]> {
    // 场景模板
    const templates = {
      'marriage': {
        recommended_types: ['term_life', 'critical_illness'],
        coverage_multiplier: { term_life: 10 }, // 年收入的10倍
        urgency: 'high',
        explanation: '结婚后承担家庭责任，需要高额寿险保障'
      },

      'childbirth': {
        recommended_types: ['childrens_critical_illness', 'childrens_medical', 'education_fund'],
        coverage_amounts: { critical_illness: 500000 },
        urgency: 'high',
        explanation: '新生儿建议尽早配置健康保障'
      },

      'home_purchase': {
        recommended_types: ['term_life', 'mortgage_protection'],
        coverage_multiplier: { term_life: 'mortgage_amount' },
        urgency: 'critical',
        explanation: '房贷期间必须配置定期寿险，覆盖贷款余额'
      }
    };

    const template = templates[scenario.type];
    return this.generateRecommendationsFromTemplate(template, userProfile);
  }

  /**
   * 动态调整推荐（基于反馈学习）
   */
  async adjustRecommendationsBasedOnFeedback(
    userId: string,
    feedback: Feedback
  ): Promise<void> {
    if (feedback.type === 'rejection') {
      // 学习：用户为什么拒绝这个产品？
      await this.learnFromRejection(userId, feedback);

      // 调整推荐策略
      if (feedback.reason === 'too_expensive') {
        // 降低价格区间
        await this.adjustPriceSensitivity(userId, +0.1);
      } else if (feedback.reason === 'insufficient_coverage') {
        // 提高保额偏好
        await this.adjustCoveragePreference(userId, +0.1);
      }
    } else if (feedback.type === 'purchase') {
      // 学习：用户最终选择了什么？
      await this.learnFromPurchase(userId, feedback);

      // 更新相似用户的推荐
      await this.updateCollaborativeFiltering(userId, feedback.product);
    }
  }
}
```

#### 推荐算法对比

| 算法 | 适用场景 | 优点 | 局限 |
|------|---------|------|------|
| **规则匹配** | 简单需求 | 透明、可解释 | 不够智能 |
| **多目标优化** | 复杂权衡 | 找到最优解 | 计算复杂 |
| **协同过滤** | 个性化推荐 | 发现隐藏偏好 | 需要大量数据 |
| **场景推荐** | 生命周期事件 | 及时性强 | 需要事件触发 |
| **强化学习** | 长期优化 | 持续改进 | 需要反馈循环 |

---

### 5. 🔄 产品数据动态更新系统

#### 核心价值
**解决静态数据过时问题，保证推荐产品的准确性**

#### 架构设计

```typescript
/**
 * 市场数据爬虫系统
 */
class MarketDataCrawler {
  /**
   * 数据源配置
   */
  dataSources = [
    {
      name: '保险公司官网',
      type: 'official',
      urls: [
        'https://www.pingan.com/products',
        'https://www.cpic.com.cn/products',
        // ... 其他公司
      ],
      crawler: this.crawlOfficialSite,
      frequency: 'weekly'
    },
    {
      name: '第三方平台',
      type: 'aggregator',
      urls: [
        'https://www.700du.cn', // 700度保险
        'https://www.jimilife.com', // 吉米计划
      ],
      crawler: this.crawlAggregatorSite,
      frequency: 'daily'
    },
    {
      name: '保险资讯网站',
      type: 'news',
      urls: [
        'https://www.13611.com', // 沃保网
      ],
      crawler: this.crawlNewsSite,
      frequency: 'daily'
    }
  ];

  /**
   * 自动爬取产品信息
   */
  async crawlProductData(): Promise<ProductUpdate[]> {
    const updates = [];

    for (const source of this.dataSources) {
      try {
        const data = await source.crawler(source.urls);
        updates.push(...data);
      } catch (error) {
        logger.error(`Failed to crawl ${source.name}:`, error);
      }
    }

    return updates;
  }

  /**
   * 产品变更检测
   */
  async detectProductChanges(
    newData: ProductData,
    existingData: ProductData
  ): Promise<ProductChange[]> {
    const changes = [];

    // 1. 检测新产品上市
    const newProducts = newData.filter(
      p => !existingData.find(e => e.id === p.id)
    );
    changes.push(...newProducts.map(p => ({
      type: 'new_product',
      product: p,
      impact: 'may_replace_existing_recommendations'
    })));

    // 2. 检测产品停售
    const discontinuedProducts = existingData.filter(
      p => !newData.find(n => n.id === p.id)
    );
    changes.push(...discontinuedProducts.map(p => ({
      type: 'discontinued',
      product: p,
      impact: 'remove_from_recommendations'
    })));

    // 3. 检测价格变动
    for (const newProduct of newData) {
      const existing = existingData.find(e => e.id === newProduct.id);
      if (existing && this.priceChanged(existing, newProduct)) {
        changes.push({
          type: 'price_change',
          product: newProduct,
          old_price: existing.pricing,
          new_price: newProduct.pricing,
          change_percentage: this.calculatePriceChange(existing, newProduct)
        });
      }
    }

    // 4. 检测保障内容变更
    for (const newProduct of newData) {
      const existing = existingData.find(e => e.id === newProduct.id);
      if (existing && this.coverageChanged(existing, newProduct)) {
        changes.push({
          type: 'coverage_change',
          product: newProduct,
          changes: this.diffCoverage(existing, newProduct)
        });
      }
    }

    return changes;
  }

  /**
   * 自动更新数据库
   */
  async updateProductDatabase(changes: ProductChange[]): Promise<void> {
    for (const change of changes) {
      switch (change.type) {
        case 'new_product':
          await this.addProduct(change.product);
          break;

        case 'discontinued':
          await this.markAsDiscontinued(change.product);
          // 通知已推荐此产品的用户
          await this.notifyAffectedUsers(change.product);
          break;

        case 'price_change':
          await this.updatePrice(change.product, change.new_price);
          // 如果价格下降，通知感兴趣的用户
          if (change.change_percentage < 0) {
            await this.notifyPriceDrop(change.product);
          }
          break;

        case 'coverage_change':
          await this.updateCoverage(change.product, change.changes);
          break;
      }
    }
  }

  /**
   * 用户通知系统
   */
  async notifyAffectedUsers(product: Product): Promise<void> {
    // 1. 找到已购买此产品的用户
    const purchasedUsers = await this.findUsersByPolicy(product.id);

    // 2. 找到在观望此产品的用户
    const interestedUsers = await this.findUsersInterestedIn(product.id);

    // 3. 发送通知
    for (const user of [...purchasedUsers, ...interestedUsers]) {
      await this.sendNotification(user, {
        type: 'product_update',
        product: product,
        message: this.generateNotificationMessage(product)
      });
    }
  }
}

/**
 * 产品版本控制系统
 */
class ProductVersionControl {
  /**
   * 版本化的产品数据
   */
  interface VersionedProduct {
    product_id: string;
    versions: {
      version: string;
      valid_from: Date;
      valid_until: Date | null;
      status: 'active' | 'discontinued' | 'archived';
      data: ProductData;
      changes_from_previous: Change[];
    }[];
    current_version: string;
  }

  /**
   * 获取历史版本
   */
  async getProductVersion(
    productId: string,
    date: Date
  ): Promise<ProductData> {
    const product = await this.getVersionedProduct(productId);

    // 找到在指定日期有效的版本
    const version = product.versions.find(
      v => v.valid_from <= date && (v.valid_until === null || v.valid_until >= date)
    );

    return version?.data;
  }

  /**
   * 追踪产品演化
   */
  async trackProductEvolution(productId: string): Promise<Evolution> {
    const product = await this.getVersionedProduct(productId);

    return {
      product_id: productId,
      first_launch: product.versions[0].valid_from,
      major_changes: product.versions.map(v => ({
        version: v.version,
        date: v.valid_from,
        changes: v.changes_from_previous
      })),
      current_status: product.versions[product.versions.length - 1].status
    };
  }
}
```

#### 数据更新工作流

```
┌─────────────────────────────────────────────────────────┐
│ 1. 定时爬取 (Scheduled Crawling)                        │
│    • 每日: 爬取价格和可售状态                            │
│    • 每周: 爬取产品详情                                  │
│    • 触发: 监测到新产品上市公告                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 数据清洗与验证 (Data Cleaning)                       │
│    • 去重                                                │
│    • 格式统一                                            │
│    • 数据完整性检查                                      │
│    • 异常值检测                                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 变更检测 (Change Detection)                          │
│    • 对比新旧数据                                        │
│    • 识别变更类型                                        │
│    • 评估影响范围                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. 人工审核 (Manual Review) - 可选                      │
│    • 重大变更需要人工确认                                │
│    • 可疑数据标记                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 数据库更新 (Database Update)                         │
│    • 版本控制                                            │
│    • 更新产品信息                                        │
│    • 保留历史版本                                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 6. 影响分析 (Impact Analysis)                           │
│    • 查找受影响的推荐                                    │
│    • 查找受影响的用户                                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 7. 用户通知 (User Notification)                         │
│    • 产品停售通知                                        │
│    • 价格下降提醒                                        │
│    • 更优产品推荐                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Multi-Agent 协作机制

### Agent 间通信协议

```typescript
/**
 * Agent 间消息传递
 */
interface AgentMessage {
  from: string; // 发送方 Agent
  to: string; // 接收方 Agent
  type: 'request' | 'response' | 'notification';
  payload: any;
  context: Context; // 共享上下文
}

/**
 * Agent 协作示例
 */
async function handleUserQuery(query: string) {
  // 1. NeedsAnalysisAgent 分析需求
  const needs = await needsAnalysisAgent.analyze(query, context);

  // 2. 如果涉及健康问题，咨询 HealthDeclarationAgent
  if (needs.has_health_concerns) {
    const healthAdvice = await healthDeclarationAgent.assess(needs.health_info);
    needs.suitable_products = healthAdvice.suitable_products;
  }

  // 3. ProductRecommendationAgent 推荐产品
  const recommendations = await productRecommendationAgent.recommend(needs);

  // 4. PlanDesignAgent 设计方案
  const plans = await planDesignAgent.design(recommendations, needs.budget);

  // 5. 返回给用户
  return plans;
}
```

---

## 技术实现路线

### Phase 1: 核心增强功能 (2-3 周)

**Week 1-2: 健康告知 + 用户画像**
- [ ] 实现 HealthDeclarationAgent
- [ ] 构建健康告知知识库
- [ ] 实现 UserProfileManager
- [ ] 实现上下文记忆系统

**Week 3: 推荐算法优化**
- [ ] 实现多目标优化算法
- [ ] 实现产品组合优化
- [ ] 实现协同过滤

### Phase 2: 争议处理 + 数据更新 (2 周)

**Week 4: 争议处理**
- [ ] 实现 DisputeResolutionAgent
- [ ] 构建案例数据库
- [ ] 法律知识库集成

**Week 5: 数据更新系统**
- [ ] 实现爬虫框架
- [ ] 实现版本控制
- [ ] 实现变更检测和通知

### Phase 3: 集成测试与优化 (1 周)

**Week 6:**
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 文档完善

---

## 总结

通过这5大核心功能的增强，保险经纪 Skill 将从"基础 MVP"升级到"真正可替代传统保险经纪人"的水平：

1. ✅ **健康告知** - 解决最大痛点
2. ✅ **争议处理** - 提供完整服务闭环
3. ✅ **用户画像** - 实现个性化和长期服务
4. ✅ **智能推荐** - 提高推荐质量
5. ✅ **数据更新** - 保证信息准确性

**预期效果：**
- 功能完整度：7.3/10 → **9.5/10**
- 用户体验：6/10 → **9/10**
- 实用性：7/10 → **9.5/10**

---

## 附录

详细技术文档见：
- [健康告知系统详细设计](./HEALTH_DECLARATION_DESIGN.md)
- [用户画像系统详细设计](./USER_PROFILE_DESIGN.md)
- [推荐算法详细设计](./RECOMMENDATION_ALGORITHM.md)
- [数据爬虫详细设计](./DATA_CRAWLER_DESIGN.md)
- [争议处理系统详细设计](./DISPUTE_RESOLUTION_DESIGN.md)
