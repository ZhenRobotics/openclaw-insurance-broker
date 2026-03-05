# 👤 用户画像与记忆系统 - 详细设计文档

## 目录
- [系统概述](#系统概述)
- [核心价值](#核心价值)
- [架构设计](#架构设计)
- [数据模型](#数据模型)
- [核心算法](#核心算法)
- [实现方案](#实现方案)

---

## 系统概述

用户画像与记忆系统让 AI 保险顾问能够：
1. **认识用户** - 记住用户的基本信息和家庭情况
2. **理解用户** - 学习用户的偏好和决策模式
3. **陪伴用户** - 追踪用户的生命周期，提供长期服务
4. **优化服务** - 基于历史互动不断改进推荐质量

---

## 核心价值

### 传统保险经纪 vs AI 保险顾问（无记忆）vs AI 保险顾问（有记忆）

| 场景 | 传统经纪人 | AI（无记忆） | AI（有记忆）|
|------|-----------|-------------|------------|
| **首次咨询** | "您好，请问您的年龄？" | "您好，请问您的年龄？" | "您好，请问您的年龄？" |
| **第二次咨询** | "张先生您好！上次您提到..." | "您好，请问您的年龄？" 😢 | "张先生您好！看您上次..." ✅ |
| **产品推荐** | 基于了解推荐 | 规则匹配 | 基于偏好学习推荐 ✅ |
| **生命事件** | 主动提醒（结婚、生子） | 无感知 | 自动识别并提醒 ✅ |
| **长期关系** | 定期回访 | 每次都是"新客户" | 长期跟踪服务 ✅ |

**结论：记忆系统是 AI 从"工具"到"顾问"的关键**

---

## 架构设计

```
┌───────────────────────────────────────────────────────────┐
│                用户画像与记忆系统                          │
└───────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 短期记忆     │  │ 长期记忆     │  │ 工作记忆     │
│ (当前会话)   │  │ (跨会话)     │  │ (任务上下文)  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 画像构建器    │  │ 偏好学习器    │  │ 事件追踪器   │
│ (Profile)    │  │ (Learning)   │  │ (Tracking)   │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │        持久化存储层              │
        │  • 用户档案数据库                │
        │  • 对话历史数据库                │
        │  • 行为分析数据库                │
        └─────────────────────────────────┘
```

### 三层记忆架构

#### 1. 短期记忆 (Short-Term Memory)
**作用：** 记住当前会话的上下文

```typescript
interface ShortTermMemory {
  session_id: string;
  start_time: Date;

  // 当前对话轮次
  conversation_turns: {
    turn_id: number;
    timestamp: Date;
    user_message: string;
    agent_response: string;
    intent: string;
    entities: Entity[];
  }[];

  // 当前任务状态
  current_task: {
    type: string; // "needs_analysis" | "product_search" | "claim_assistance"
    status: 'in_progress' | 'completed' | 'abandoned';
    progress: number; // 0-100
    collected_info: Record<string, any>;
    pending_questions: string[];
  };

  // 临时变量
  temp_variables: Record<string, any>;
}
```

**示例：**
```
用户: "我想买保险"
系统: "好的，请问您的年龄？"
用户: "30岁"
系统: "好的，30岁。请问您的职业？"

// 短期记忆保存：
{
  collected_info: { age: 30 },
  pending_questions: ["职业", "收入", "家庭情况"]
}
```

#### 2. 长期记忆 (Long-Term Memory)
**作用：** 记住用户的所有历史信息

```typescript
interface LongTermMemory {
  user_id: string;

  // 基本档案
  profile: UserProfile;

  // 所有对话历史
  all_conversations: Conversation[];

  // 提取的事实
  facts: Fact[];

  // 关系历史
  relationship_timeline: RelationshipEvent[];
}
```

#### 3. 工作记忆 (Working Memory)
**作用：** 为当前任务提供相关上下文

```typescript
interface WorkingMemory {
  // 当前任务
  current_task: Task;

  // 相关的长期记忆
  relevant_facts: Fact[];
  relevant_conversations: Conversation[];

  // 激活的知识
  activated_knowledge: Knowledge[];
}
```

---

## 数据模型

### 1. 完整用户画像

```typescript
interface ComprehensiveUserProfile {
  // ===== 元数据 =====
  user_id: string;
  created_at: Date;
  updated_at: Date;
  profile_version: string;

  // ===== 基础身份信息 =====
  identity: {
    name?: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    birthday?: Date;
    id_number?: string; // 加密存储
    phone?: string;
    email?: string;
    address?: Address;
  };

  // ===== 职业与财务 =====
  professional: {
    occupation: string;
    industry: string;
    occupation_category: '1-6类'; // 职业风险分类
    company_type: 'private' | 'state_owned' | 'foreign' | 'self_employed';
    years_in_industry: number;
    job_stability: 'stable' | 'unstable';

    // 收入信息
    income: {
      annual: number;
      monthly: number;
      sources: IncomeSource[];
      stability: 'stable' | 'volatile';
      growth_trend: 'increasing' | 'stable' | 'decreasing';
    };

    // 资产负债
    financial_status: {
      assets: {
        savings: number;
        real_estate: number;
        investments: number;
        other: number;
        total: number;
      };
      liabilities: {
        mortgage: number;
        car_loan: number;
        consumer_debt: number;
        other: number;
        total: number;
      };
      net_worth: number;
    };
  };

  // ===== 家庭结构 =====
  family: {
    marital_status: 'single' | 'married' | 'divorced' | 'widowed';
    marriage_date?: Date;

    spouse?: {
      name: string;
      age: number;
      occupation: string;
      income: number;
      health_status: string;
      existing_insurance: Policy[];
    };

    children: {
      name: string;
      age: number;
      birthday: Date;
      education_stage: string;
      health_status: string;
      existing_insurance: Policy[];
    }[];

    parents: {
      relation: 'father' | 'mother';
      age: number;
      health_status: string;
      financially_dependent: boolean;
      existing_insurance: Policy[];
    }[];

    // 家庭责任评分
    family_responsibility_score: number; // 0-100
  };

  // ===== 健康档案 ===== (详见 HEALTH_DECLARATION_DESIGN.md)
  health: HealthProfile;

  // ===== 保险现状 =====
  insurance_status: {
    // 已有保单
    policies: Policy[];

    // 保障汇总
    total_coverage: {
      life: number;
      critical_illness: number;
      medical: number;
      accident: number;
      other: number;
    };

    // 保费支出
    annual_premium: number;
    premium_to_income_ratio: number; // 保费/收入比例

    // 保障缺口分析
    coverage_gaps: {
      type: string;
      current_coverage: number;
      recommended_coverage: number;
      gap: number;
      priority: 'high' | 'medium' | 'low';
    }[];
  };

  // ===== 偏好学习 【核心】=====
  preferences: {
    // 品牌偏好
    brands: {
      preferred: string[]; // 喜欢的公司
      avoided: string[]; // 不喜欢的公司
      reasons: { company: string; reason: string; sentiment: number }[];
    };

    // 决策因素权重（动态学习）
    decision_factors: {
      factor: 'price' | 'coverage' | 'brand' | 'service' | 'flexibility';
      weight: number; // 0-1，sum = 1
      confidence: number; // 学习置信度
      last_updated: Date;
    }[];

    // 产品类型偏好
    product_preferences: {
      term_vs_whole_life: 'term' | 'whole' | 'no_preference';
      online_vs_offline: 'online' | 'offline' | 'no_preference';
      standalone_vs_bundled: 'standalone' | 'bundled' | 'no_preference';

      // 风险偏好
      risk_tolerance: 'conservative' | 'moderate' | 'aggressive';

      // 缴费偏好
      payment_period_preference: number[]; // [10, 20, 30]

      // 保障期限偏好
      coverage_period_preference: string[]; // ["至70岁", "终身"]
    };

    // 沟通偏好
    communication: {
      preferred_language: 'zh-CN' | 'en';
      detail_level: 'brief' | 'moderate' | 'detailed';
      technical_level: 'beginner' | 'intermediate' | 'expert';
      preferred_channels: string[];
      response_time_expectation: 'immediate' | 'within_hour' | 'within_day';
      preferred_contact_time: TimeRange[];
    };

    // 价格敏感度（动态学习）
    price_sensitivity: {
      score: number; // 0-1，越高越敏感
      evidence: PriceSensitivityEvidence[];
      last_updated: Date;
    };
  };

  // ===== 决策历史 【核心】=====
  decision_history: {
    // 产品浏览历史
    viewed_products: {
      product_id: string;
      product_name: string;
      viewed_at: Date;
      time_spent: number; // 秒
      sections_viewed: string[]; // 看了哪些部分
      engagement_level: 'low' | 'medium' | 'high';
      bounced: boolean; // 是否很快离开
    }[];

    // 产品对比历史
    comparisons: {
      compared_at: Date;
      products: string[];
      comparison_focus: string[]; // 用户重点对比了什么
      time_spent: number;
      result: string; // 对比后的决策
    }[];

    // 拒绝记录 【重要】
    rejections: {
      product_id: string;
      product_name: string;
      rejected_at: Date;
      rejection_reason: string;
      rejection_category: 'price' | 'coverage' | 'brand' | 'terms' | 'other';
      price_at_rejection: number;
      alternative_sought?: string; // 转而寻找什么
    }[];

    // 购买决策路径
    purchases: {
      policy_id: string;
      product_id: string;
      purchased_at: Date;

      // 决策路径追踪
      decision_journey: {
        step: string;
        timestamp: Date;
        duration: number;
        action: string;
      }[];

      // 决策因素
      key_decision_factors: {
        factor: string;
        importance: number;
      }[];

      // 对比过的其他产品
      alternatives_considered: {
        product_id: string;
        why_not_chosen: string;
      }[];

      // 决策时间
      time_to_decision: number; // 从首次接触到购买的天数
      decision_speed: 'impulsive' | 'moderate' | 'deliberate';
    }[];

    // 咨询历史
    consultations: {
      date: Date;
      topic: string;
      questions_asked: string[];
      concerns_raised: string[];
      solutions_provided: string[];
      satisfaction_score?: number;
      follow_up_needed: boolean;
    }[];
  };

  // ===== 生命周期事件 【核心】=====
  lifecycle: {
    // 已发生的事件
    past_events: {
      event_type: 'graduation' | 'first_job' | 'marriage' | 'childbirth' |
                  'home_purchase' | 'job_change' | 'promotion' | 'illness';
      event_date: Date;
      insurance_action_taken?: string;
      notes: string;
    }[];

    // 预期事件
    upcoming_events: {
      event_type: string;
      expected_date: Date;
      certainty: 'confirmed' | 'likely' | 'possible';
      insurance_implications: string;
      recommended_actions: string[];
    }[];

    // 自动检测的人生阶段
    current_life_stage: {
      stage: 'single_youth' | 'married_no_kids' | 'young_family' |
             'established_family' | 'pre_retirement' | 'retired';
      stage_start_date: Date;
      stage_characteristics: string[];
      typical_insurance_needs: string[];
    };

    // 里程碑追踪
    milestones: {
      milestone: string;
      achieved_date: Date;
      celebration_sent: boolean;
    }[];
  };

  // ===== 行为画像 【核心】=====
  behavioral_insights: {
    // 互动模式
    interaction_patterns: {
      avg_session_duration: number;
      avg_messages_per_session: number;
      preferred_interaction_time: string; // "evenings" | "weekends"
      engagement_score: number; // 0-100
      responsiveness: 'high' | 'medium' | 'low';
    };

    // 信任度
    trust_score: {
      score: number; // 0-100
      factors: {
        factor: string;
        contribution: number;
      }[];
      trend: 'increasing' | 'stable' | 'decreasing';
    };

    // 决策风格
    decision_style: {
      speed: 'impulsive' | 'moderate' | 'deliberate';
      research_depth: 'shallow' | 'moderate' | 'deep';
      influencers: string[]; // "spouse" | "friends" | "online_reviews"
      risk_aversion: number; // 0-100
    };

    // 信息寻求行为
    information_seeking: {
      question_frequency: number;
      question_complexity: 'simple' | 'moderate' | 'complex';
      self_research_level: 'low' | 'medium' | 'high';
      preferred_format: 'text' | 'visual' | 'mixed';
    };

    // AI 学习到的特征
    learned_characteristics: {
      characteristic: string;
      confidence: number; // 0-1
      evidence: string[];
      first_learned: Date;
      last_confirmed: Date;
    }[];
  };

  // ===== 关系管理 =====
  relationship: {
    // 关系阶段
    stage: 'prospect' | 'customer' | 'loyal_customer' | 'at_risk' | 'churned';
    stage_since: Date;

    // 接触点历史
    touchpoints: {
      date: Date;
      type: 'consultation' | 'purchase' | 'claim' | 'complaint' | 'review';
      channel: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      notes: string;
    }[];

    // 满意度追踪
    satisfaction: {
      overall_score: number;
      nps_score?: number; // Net Promoter Score
      feedback_history: {
        date: Date;
        type: 'praise' | 'suggestion' | 'complaint';
        content: string;
        resolution: string;
      }[];
    };

    // 下次接触提醒
    next_contact: {
      scheduled_date: Date;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    };
  };

  // ===== 元认知 （系统对用户认识的认识）=====
  meta: {
    profile_completeness: number; // 0-100
    data_quality_score: number; // 0-100
    confidence_level: number; // 系统对画像准确性的信心
    last_major_update: Date;
    update_frequency: number; // 平均多少天更新一次

    // 数据来源
    data_sources: {
      source: 'user_input' | 'inferred' | 'third_party';
      fields: string[];
      reliability: number;
    }[];

    // 需要更新的信息
    needs_update: {
      field: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  };
}
```

---

## 核心算法

### 1. 偏好学习算法

```typescript
class PreferenceLearningEngine {
  /**
   * 从用户行为中学习偏好
   */
  async learnFromBehavior(
    userId: string,
    interaction: Interaction
  ): Promise<void> {
    const profile = await this.getUserProfile(userId);

    switch (interaction.type) {
      case 'product_view':
        await this.learnFromView(profile, interaction);
        break;
      case 'product_comparison':
        await this.learnFromComparison(profile, interaction);
        break;
      case 'product_rejection':
        await this.learnFromRejection(profile, interaction);
        break;
      case 'product_purchase':
        await this.learnFromPurchase(profile, interaction);
        break;
    }

    await this.saveProfile(profile);
  }

  /**
   * 从产品浏览中学习
   */
  private async learnFromView(
    profile: UserProfile,
    interaction: ProductViewInteraction
  ): Promise<void> {
    const product = await this.getProduct(interaction.product_id);

    // 学习品牌偏好
    if (interaction.time_spent > 60) { // 花了超过1分钟
      await this.increaseBrandPreference(
        profile,
        product.company,
        0.1
      );
    }

    // 学习价格偏好
    if (interaction.bounced && product.pricing > profile.budget.max) {
      await this.increasePriceSensitivity(profile, 0.05);
    }
  }

  /**
   * 从产品对比中学习决策因素权重
   */
  private async learnFromComparison(
    profile: UserProfile,
    interaction: ComparisonInteraction
  ): Promise<void> {
    // 分析用户对比时关注什么
    const focusAreas = interaction.comparison_focus;

    // 更新决策因素权重
    for (const area of focusAreas) {
      const factor = this.mapAreaToFactor(area);
      await this.increaseFactorWeight(profile, factor, 0.05);
    }

    // 归一化权重
    await this.normalizeFactorWeights(profile);
  }

  /**
   * 从拒绝中学习 【重要】
   */
  private async learnFromRejection(
    profile: UserProfile,
    interaction: RejectionInteraction
  ): Promise<void> {
    const product = await this.getProduct(interaction.product_id);

    // 分析拒绝原因
    const reason = interaction.rejection_reason;
    const category = this.categorizeRejectionReason(reason);

    switch (category) {
      case 'too_expensive':
        // 降低价格预算或增加价格敏感度
        await this.adjustBudget(profile, -0.1);
        await this.increasePriceSensitivity(profile, 0.1);
        break;

      case 'insufficient_coverage':
        // 增加保障权重
        await this.increaseFactorWeight(profile, 'coverage', 0.1);
        break;

      case 'dont_trust_company':
        // 添加到避免品牌列表
        await this.addAvoidedBrand(profile, product.company, reason);
        break;

      case 'terms_too_strict':
        // 增加灵活性权重
        await this.increaseFactorWeight(profile, 'flexibility', 0.1);
        break;
    }

    // 记录拒绝模式
    await this.recordRejectionPattern(profile, product, reason);
  }

  /**
   * 从购买中学习 【最重要】
   */
  private async learnFromPurchase(
    profile: UserProfile,
    interaction: PurchaseInteraction
  ): Promise<void> {
    const product = await this.getProduct(interaction.product_id);

    // 1. 强化选择的决策因素
    for (const factor of interaction.key_decision_factors) {
      await this.increaseFactorWeight(
        profile,
        factor.factor,
        factor.importance * 0.2
      );
    }

    // 2. 学习品牌偏好（购买=强烈偏好信号）
    await this.increaseBrandPreference(profile, product.company, 0.3);

    // 3. 更新价格锚点
    profile.preferences.price_anchor = product.pricing;

    // 4. 分析为什么没选其他产品
    for (const alt of interaction.alternatives_considered) {
      await this.learnFromNotChosen(profile, alt);
    }

    // 5. 更新决策风格画像
    if (interaction.time_to_decision < 3) {
      profile.behavioral_insights.decision_style.speed = 'impulsive';
    } else if (interaction.time_to_decision > 14) {
      profile.behavioral_insights.decision_style.speed = 'deliberate';
    }

    // 6. 更新协同过滤数据
    await this.updateCollaborativeFiltering(profile, product);
  }

  /**
   * 归一化决策因素权重
   */
  private async normalizeFactorWeights(profile: UserProfile): Promise<void> {
    const factors = profile.preferences.decision_factors;
    const sum = factors.reduce((acc, f) => acc + f.weight, 0);

    for (const factor of factors) {
      factor.weight = factor.weight / sum;
    }
  }
}
```

### 2. 智能上下文召回算法

```typescript
class ContextRecallEngine {
  /**
   * 智能召回相关上下文
   */
  async recallContext(
    userId: string,
    currentQuery: string,
    conversationHistory: ConversationTurn[]
  ): Promise<RelevantContext> {
    // 1. 分析当前查询的意图和实体
    const queryAnalysis = await this.analyzeQuery(currentQuery);

    // 2. 从长期记忆中检索相关事实
    const relevantFacts = await this.retrieveRelevantFacts(
      userId,
      queryAnalysis
    );

    // 3. 检索相关的历史对话
    const relevantConversations = await this.retrieveRelevantConversations(
      userId,
      queryAnalysis
    );

    // 4. 检索用户画像中的相关部分
    const relevantProfile = await this.retrieveRelevantProfile(
      userId,
      queryAnalysis
    );

    // 5. 构建上下文
    return {
      facts: relevantFacts,
      conversations: relevantConversations,
      profile: relevantProfile,
      suggestions: this.generateContextualSuggestions(
        relevantFacts,
        relevantProfile,
        queryAnalysis
      )
    };
  }

  /**
   * 检索相关事实
   */
  private async retrieveRelevantFacts(
    userId: string,
    queryAnalysis: QueryAnalysis
  ): Promise<Fact[]> {
    const allFacts = await this.getAllFacts(userId);

    // 使用语义搜索找到相关事实
    const scoredFacts = allFacts.map(fact => ({
      fact: fact,
      relevance: this.calculateRelevance(fact, queryAnalysis)
    }));

    // 排序并返回 top-k
    scoredFacts.sort((a, b) => b.relevance - a.relevance);
    return scoredFacts.slice(0, 10).map(sf => sf.fact);
  }

  /**
   * 避免重复提问
   */
  async checkIfAlreadyAsked(
    userId: string,
    question: string
  ): Promise<{ alreadyAsked: boolean; previousAnswer?: any }> {
    // 1. 从对话历史中查找相似问题
    const conversations = await this.getAllConversations(userId);

    for (const conv of conversations) {
      for (const turn of conv.turns) {
        // 使用语义相似度判断
        const similarity = await this.calculateSimilarity(
          question,
          turn.agent_message
        );

        if (similarity > 0.85) {
          // 找到了之前问过的类似问题
          return {
            alreadyAsked: true,
            previousAnswer: turn.user_response
          };
        }
      }
    }

    // 2. 从用户画像中查找
    const profile = await this.getUserProfile(userId);
    const answer = this.extractAnswerFromProfile(profile, question);

    if (answer) {
      return {
        alreadyAsked: true,
        previousAnswer: answer
      };
    }

    return { alreadyAsked: false };
  }
}
```

### 3. 生命周期事件追踪算法

```typescript
class LifecycleTracker {
  /**
   * 自动检测生命周期事件
   */
  async detectLifecycleEvents(
    userId: string
  ): Promise<LifecycleEvent[]> {
    const profile = await this.getUserProfile(userId);
    const detectedEvents: LifecycleEvent[] = [];

    // 1. 检测婚姻事件
    if (profile.family.marital_status === 'married' &&
        !profile.lifecycle.past_events.some(e => e.event_type === 'marriage')) {
      detectedEvents.push({
        event_type: 'marriage',
        detected_at: new Date(),
        confidence: 1.0,
        insurance_implications: [
          '需要增加定期寿险保障',
          '建议为配偶也配置保险',
          '考虑家庭保障整体规划'
        ],
        recommended_actions: [
          '进行家庭保障需求分析',
          '推荐定期寿险产品',
          '设计双人保险方案'
        ]
      });
    }

    // 2. 检测生育事件
    const lastCheck = await this.getLastCheckDate(userId);
    const newChildren = profile.family.children.filter(
      child => child.birthday > lastCheck
    );

    for (const child of newChildren) {
      detectedEvents.push({
        event_type: 'childbirth',
        detected_at: new Date(),
        confidence: 1.0,
        details: { child_name: child.name, birth_date: child.birthday },
        insurance_implications: [
          '家庭责任增加，需提高保额',
          '为新生儿配置保险',
          '考虑教育金储备'
        ],
        recommended_actions: [
          '增加父母定期寿险保额',
          '为孩子配置少儿重疾险和医疗险',
          '了解教育金保险'
        ]
      });
    }

    // 3. 检测购房事件
    const hasNewMortgage = this.detectNewMortgage(profile);
    if (hasNewMortgage) {
      detectedEvents.push({
        event_type: 'home_purchase',
        detected_at: new Date(),
        confidence: 0.9,
        insurance_implications: [
          '房贷期间需要高额寿险保障',
          '保额应覆盖房贷余额',
          '考虑保障至房贷还清'
        ],
        recommended_actions: [
          '推荐定期寿险（保至房贷还清）',
          '保额建议=房贷余额',
          '考虑房贷险/房屋保险'
        ]
      });
    }

    // 4. 检测职业变动
    if (this.detectJobChange(profile)) {
      detectedEvents.push({
        event_type: 'job_change',
        detected_at: new Date(),
        confidence: 0.8,
        insurance_implications: [
          '收入可能变化，需调整保费预算',
          '职业类别可能变化，影响可投保产品',
          '可能失去雇主提供的团体保险'
        ],
        recommended_actions: [
          '重新评估保险预算',
          '检查职业类别是否影响现有保单',
          '补充个人商业保险'
        ]
      });
    }

    // 5. 预测未来事件
    const predictedEvents = await this.predictFutureEvents(profile);
    detectedEvents.push(...predictedEvents);

    return detectedEvents;
  }

  /**
   * 预测未来生命周期事件
   */
  private async predictFutureEvents(
    profile: UserProfile
  ): Promise<PredictedEvent[]> {
    const predicted: PredictedEvent[] = [];

    // 预测生育计划
    if (profile.family.marital_status === 'married' &&
        profile.family.children.length === 0 &&
        profile.identity.age < 35) {
      predicted.push({
        event_type: 'childbirth',
        probability: 0.7,
        expected_timeframe: '1-3年内',
        preparation_suggestions: [
          '提前了解少儿保险产品',
          '考虑增加定期寿险保额',
          '准备孕期相关保险'
        ]
      });
    }

    // 预测购房计划
    if (profile.professional.financial_status.assets.real_estate === 0 &&
        profile.professional.income.annual > 200000) {
      predicted.push({
        event_type: 'home_purchase',
        probability: 0.6,
        expected_timeframe: '2-5年内',
        preparation_suggestions: [
          '提前规划定期寿险',
          '了解房贷险产品',
          '准备充足保障覆盖未来房贷'
        ]
      });
    }

    // 预测退休规划
    if (profile.identity.age >= 40) {
      const yearsToRetirement = 60 - profile.identity.age;
      predicted.push({
        event_type: 'retirement',
        probability: 1.0,
        expected_timeframe: `${yearsToRetirement}年后`,
        preparation_suggestions: [
          '开始养老规划',
          '考虑长期护理保险',
          '评估退休后医疗保障'
        ]
      });
    }

    return predicted;
  }
}
```

---

## 实现方案

### Phase 1: 数据模型与存储 (Week 1)

**任务：**
- [ ] 设计完整的用户画像数据模型
- [ ] 选择存储方案（PostgreSQL + Redis）
  - PostgreSQL: 结构化数据（画像、历史）
  - Redis: 短期记忆、会话状态
- [ ] 实现数据加密（敏感信息）
- [ ] 设计索引和查询优化

**存储架构：**
```
PostgreSQL
├─ users (用户基础表)
├─ user_profiles (用户画像)
├─ conversations (对话历史)
├─ decision_history (决策历史)
├─ lifecycle_events (生命周期事件)
└─ behavioral_data (行为数据)

Redis
├─ session:{session_id} (短期记忆)
├─ working_memory:{user_id} (工作记忆)
└─ cache:profile:{user_id} (画像缓存)
```

### Phase 2: 核心算法实现 (Week 2)

**任务：**
- [ ] 实现 PreferenceLearningEngine
  - 从浏览中学习
  - 从对比中学习
  - 从拒绝中学习
  - 从购买中学习

- [ ] 实现 ContextRecallEngine
  - 语义搜索（使用向量数据库）
  - 相关性计算
  - 避免重复提问

- [ ] 实现 LifecycleTracker
  - 事件检测
  - 事件预测
  - 主动提醒

### Phase 3: 画像更新机制 (Week 2)

**任务：**
- [ ] 实现实时更新
  - 每次互动后更新
  - 增量更新

- [ ] 实现批量更新
  - 定期分析用户行为
  - 重新计算评分和权重

- [ ] 实现画像合并
  - 多渠道数据融合
  - 冲突解决策略

### Phase 4: 个性化应用 (Week 3)

**任务：**
- [ ] 个性化推荐
  - 基于画像的产品推荐
  - 基于偏好的排序

- [ ] 个性化沟通
  - 根据沟通偏好调整话术
  - 根据理解水平调整详细程度

- [ ] 主动服务
  - 生命周期事件提醒
  - 保单检视提醒
  - 续保提醒

---

## 总结

用户画像与记忆系统让 AI 保险顾问实现：

1. ✅ **真正认识用户** - 不再每次都是"新客户"
2. ✅ **学习用户偏好** - 推荐越来越精准
3. ✅ **长期陪伴服务** - 人生重要时刻都在场
4. ✅ **个性化体验** - 千人千面的服务

这是从"工具"到"顾问"的关键！
