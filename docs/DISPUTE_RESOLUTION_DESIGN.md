# ⚖️ 理赔争议处理系统 - 详细设计文档

## 目录
- [系统概述](#系统概述)
- [核心功能](#核心功能)
- [案例知识库](#案例知识库)
- [争议分析引擎](#争议分析引擎)
- [法律支持系统](#法律支持系统)
- [实现方案](#实现方案)

---

## 系统概述

### 为什么需要争议处理系统？

理赔纠纷是保险行业的核心痛点：

| 统计数据 | 说明 |
|---------|------|
| **70%** | 理赔纠纷源于健康告知问题 |
| **30%** | 保险投诉涉及理赔纠纷 |
| **45天** | 平均纠纷解决时间 |
| **60%** | 纠纷通过调解可解决 |

**传统保险经纪人的核心价值之一就是理赔协助和争议调解！**

### 系统目标

1. ✅ **分析拒赔原因** - 帮助用户理解为什么被拒赔
2. ✅ **评估争议合理性** - 判断是否有申诉空间
3. ✅ **提供解决方案** - 调解、申诉、投诉、诉讼
4. ✅ **准备申诉材料** - 生成申诉文件和证据清单
5. ✅ **法律支持** - 提供法律依据和案例参考

---

## 核心功能

### 1. 功能架构

```
┌─────────────────────────────────────────────────────────┐
│              理赔争议处理系统                            │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 争议分析     │  │ 解决方案     │  │ 文档生成     │
│ • 拒赔分析   │  │ • 协商调解   │  │ • 申诉信     │
│ • 合理性评估 │  │ • 监管投诉   │  │ • 证据清单   │
│ • 胜诉概率   │  │ • 法律诉讼   │  │ • 起诉状     │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │        案例与知识库              │
        │  • 理赔争议案例 (1000+)         │
        │  • 法院判决书 (500+)            │
        │  • 监管处罚案例                 │
        │  • 调解成功案例                 │
        └─────────────────────────────────┘
```

---

## 案例知识库

### 1. 争议案例数据模型

```typescript
interface DisputeCase {
  case_id: string;
  created_at: Date;

  // ===== 基本信息 =====
  case_info: {
    case_name: string;
    policy_type: 'critical_illness' | 'medical' | 'life' | 'accident';
    insurance_company: string;
    claim_amount: number;
    dispute_date: Date;
  };

  // ===== 案情描述 =====
  case_details: {
    // 投保信息
    policy_info: {
      policy_date: Date;
      coverage_amount: number;
      premium: number;
      insured_person: PersonInfo;
    };

    // 出险情况
    claim_info: {
      incident_date: Date;
      diagnosis: string;
      hospital: string;
      treatment: string;
      claim_date: Date;
    };

    // 拒赔情况
    denial_info: {
      denial_date: Date;
      denial_reason: string;
      denial_category: 'health_disclosure' | 'policy_exclusion' |
                       'waiting_period' | 'fraud_suspicion' | 'other';
      company_statement: string;
    };

    // 争议焦点
    dispute_focus: string[];
  };

  // ===== 证据材料 =====
  evidence: {
    // 保险公司证据
    company_evidence: {
      type: string;
      description: string;
      strength: 'strong' | 'medium' | 'weak';
    }[];

    // 投保人证据
    insured_evidence: {
      type: string;
      description: string;
      strength: 'strong' | 'medium' | 'weak';
    }[];
  };

  // ===== 解决过程 =====
  resolution_process: {
    steps: {
      date: Date;
      action: string;
      actor: 'insured' | 'company' | 'mediator' | 'regulator' | 'court';
      result: string;
    }[];

    // 调解/仲裁/诉讼
    formal_proceedings?: {
      type: 'mediation' | 'arbitration' | 'litigation';
      venue: string;
      start_date: Date;
      end_date: Date;
      case_number?: string;
    };
  };

  // ===== 最终结果 =====
  outcome: {
    status: 'fully_paid' | 'partially_paid' | 'denied' | 'settled';
    final_amount: number;
    resolution_method: 'negotiation' | 'mediation' | 'regulatory_intervention' | 'court_judgment';
    resolution_date: Date;
    time_taken_days: number;

    // 判决/裁决
    judgment?: {
      ruling: string;
      reasoning: string;
      legal_basis: string[];
    };
  };

  // ===== 分析与教训 =====
  analysis: {
    // 争议焦点分析
    key_issues: {
      issue: string;
      insured_position: string;
      company_position: string;
      final_determination: string;
    }[];

    // 关键证据
    decisive_evidence: {
      evidence: string;
      importance: string;
      impact_on_outcome: string;
    }[];

    // 法律要点
    legal_points: {
      law: string;
      article: string;
      interpretation: string;
      application: string;
    }[];

    // 经验教训
    lessons_learned: {
      for_insured: string[];
      for_company: string[];
      for_industry: string[];
    };
  };

  // ===== 相似案例 =====
  similar_cases: string[]; // 相似案例ID
  precedent_value: 'high' | 'medium' | 'low'; // 先例价值

  // ===== 元数据 =====
  meta: {
    case_source: 'court_database' | 'news_report' | 'regulatory_disclosure' | 'user_submission';
    public: boolean;
    verified: boolean;
    tags: string[];
  };
}
```

### 2. 案例分类

#### 按拒赔原因分类：

```typescript
const DENIAL_CATEGORIES = {
  // 1. 健康告知问题（70%）
  health_disclosure: {
    name: '健康告知不实',
    subcategories: [
      '未告知既往病史',
      '未告知体检异常',
      '未告知住院记录',
      '未告知手术记录',
      '未告知家族病史'
    ],
    typical_cases: [
      '甲状腺结节未告知案',
      '高血压未告知案',
      '乙肝未告知案'
    ]
  },

  // 2. 保单除外责任（15%）
  policy_exclusion: {
    name: '属于除外责任',
    subcategories: [
      '既往症除外',
      '特定疾病除外',
      '职业除外',
      '高风险活动除外'
    ]
  },

  // 3. 等待期（5%）
  waiting_period: {
    name: '等待期内出险',
    subcategories: [
      '疾病等待期',
      '意外无等待期'
    ]
  },

  // 4. 骗保嫌疑（5%）
  fraud_suspicion: {
    name: '涉嫌骗保',
    subcategories: [
      '带病投保',
      '伪造病历',
      '夸大病情'
    ]
  },

  // 5. 其他（5%）
  other: {
    name: '其他原因',
    subcategories: [
      '不符合理赔条件',
      '材料不齐全',
      '超过理赔时效'
    ]
  }
};
```

### 3. 典型案例库

```typescript
const TYPICAL_CASES: DisputeCase[] = [
  {
    case_id: 'thyroid_nodule_001',
    case_info: {
      case_name: '甲状腺结节未告知重疾险拒赔案',
      policy_type: 'critical_illness',
      insurance_company: 'XX人寿',
      claim_amount: 500000,
      dispute_date: new Date('2023-05-15')
    },
    case_details: {
      // 投保信息
      policy_info: {
        policy_date: new Date('2020-03-01'),
        coverage_amount: 500000,
        premium: 6500,
        insured_person: {
          name: '王女士',
          age: 32,
          gender: 'female'
        }
      },

      // 出险情况
      claim_info: {
        incident_date: new Date('2023-04-10'),
        diagnosis: '甲状腺乳头状癌',
        hospital: '某三甲医院',
        treatment: '甲状腺全切手术',
        claim_date: new Date('2023-05-01')
      },

      // 拒赔情况
      denial_info: {
        denial_date: new Date('2023-05-15'),
        denial_reason: '投保前已有甲状腺结节未如实告知',
        denial_category: 'health_disclosure',
        company_statement: `
经调查，被保险人王女士于2019年7月体检发现甲状腺结节（TI-RADS 4类），
但在2020年3月投保时未告知。根据《保险法》第16条，
投保人故意或者因重大过失未履行如实告知义务，
足以影响保险人决定是否同意承保或者提高保险费率的，
保险人有权解除合同。本次拒赔并退还保费。
        `
      },

      // 争议焦点
      dispute_focus: [
        '王女士是否知道体检发现结节？',
        '结节是否足以影响承保决定？',
        '健康告知问题是否明确询问了结节？',
        '是否构成"故意"或"重大过失"？'
      ]
    },

    // 证据材料
    evidence: {
      company_evidence: [
        {
          type: '2019年体检报告',
          description: '显示甲状腺结节 TI-RADS 4类，建议进一步检查',
          strength: 'strong'
        },
        {
          type: '健康告知问题',
          description: '问卷中询问"是否有甲状腺疾病"',
          strength: 'medium'
        }
      ],
      insured_evidence: [
        {
          type: '体检报告签收记录',
          description: '王女士证明从未收到2019年体检报告',
          strength: 'weak'
        },
        {
          type: '医生证言',
          description: '体检医生证明当时告知"小结节，问题不大"',
          strength: 'medium'
        },
        {
          type: '投保咨询记录',
          description: '投保时询问过代理人"小结节需要告知吗"，代理人称"不用"',
          strength: 'strong'
        }
      ]
    },

    // 解决过程
    resolution_process: {
      steps: [
        {
          date: new Date('2023-05-20'),
          action: '向保险公司提交申诉',
          actor: 'insured',
          result: '公司维持拒赔决定'
        },
        {
          date: new Date('2023-06-01'),
          action: '向银保监会投诉',
          actor: 'insured',
          result: '监管要求公司重新审核'
        },
        {
          date: new Date('2023-06-15'),
          action: '协商调解',
          actor: 'mediator',
          result: '达成和解协议'
        }
      ],
      formal_proceedings: {
        type: 'mediation',
        venue: '保险行业协会',
        start_date: new Date('2023-06-10'),
        end_date: new Date('2023-06-15')
      }
    },

    // 最终结果
    outcome: {
      status: 'partially_paid',
      final_amount: 300000,
      resolution_method: 'mediation',
      resolution_date: new Date('2023-06-15'),
      time_taken_days: 31,
      judgment: {
        ruling: '保险公司赔付60%（30万元）',
        reasoning: `
1. 王女士确实在投保前体检发现结节，但证据显示她咨询了代理人且被告知无需告知
2. 代理人作为保险公司的代表，其不当指导应由公司承担部分责任
3. 王女士存在一定的不如实告知，但不构成"故意"，属于"一般过失"
4. 综合考虑双方责任，判定保险公司承担60%赔付责任
        `,
        legal_basis: [
          '《保险法》第16条：如实告知义务',
          '《保险法》第116条：保险代理人职责',
          '最高法保险法司法解释三第5条：不实告知的认定'
        ]
      }
    },

    // 分析与教训
    analysis: {
      key_issues: [
        {
          issue: '是否履行如实告知义务',
          insured_position: '咨询了代理人，被告知无需告知',
          company_position: '健康告知问卷明确询问了甲状腺疾病',
          final_determination: '投保人有一定过失，但代理人不当指导减轻了责任'
        }
      ],

      decisive_evidence: [
        {
          evidence: '投保咨询记录（代理人称"不用告知"）',
          importance: '关键证据',
          impact_on_outcome: '证明投保人不构成"故意"隐瞒，减轻了责任'
        }
      ],

      legal_points: [
        {
          law: '保险法',
          article: '第16条',
          interpretation: '投保人故意或因重大过失未如实告知，保险人可解除合同',
          application: '本案中投保人咨询了代理人，不构成"故意"，仅为"一般过失"'
        }
      ],

      lessons_learned: {
        for_insured: [
          '体检异常一定要如实告知，不能听信代理人"没事"的说法',
          '保留投保过程中的沟通记录（录音、微信聊天等）',
          '拿不准是否需要告知时，应询问保险公司客服而非代理人'
        ],
        for_company: [
          '加强代理人培训，规范告知指导',
          '健康告知问题应更加明确具体',
          '建立代理人行为监督机制'
        ],
        for_industry: [
          '推广智能核保，减少人为误导',
          '建立投保咨询录音制度',
          '完善争议调解机制'
        ]
      }
    },

    similar_cases: ['thyroid_nodule_002', 'thyroid_nodule_003'],
    precedent_value: 'high',

    meta: {
      case_source: 'regulatory_disclosure',
      public: true,
      verified: true,
      tags: ['甲状腺结节', '健康告知', '代理人责任', '部分赔付']
    }
  },

  // 更多典型案例...
];
```

---

## 争议分析引擎

### 1. 拒赔原因分析

```typescript
class DenialAnalysisEngine {
  /**
   * 分析拒赔原因
   */
  async analyzeDenial(
    claimCase: ClaimCase,
    denialNotice: DenialNotice
  ): Promise<DenialAnalysis> {
    // 1. 识别拒赔类型
    const denialType = this.identifyDenialType(denialNotice);

    // 2. 分析拒赔理由的合理性
    const reasonability = await this.assessReasonability(
      claimCase,
      denialNotice,
      denialType
    );

    // 3. 找到争议焦点
    const disputePoints = this.identifyDisputePoints(
      claimCase,
      denialNotice
    );

    // 4. 评估证据强度
    const evidenceAssessment = await this.assessEvidence(
      claimCase,
      denialNotice
    );

    // 5. 预测结果
    const prediction = await this.predictOutcome(
      denialType,
      reasonability,
      evidenceAssessment
    );

    return {
      denial_type: denialType,
      reasonability: reasonability,
      dispute_points: disputePoints,
      evidence_assessment: evidenceAssessment,
      prediction: prediction,
      recommendations: this.generateRecommendations(prediction)
    };
  }

  /**
   * 识别拒赔类型
   */
  private identifyDenialType(denialNotice: DenialNotice): DenialType {
    const reason = denialNotice.denial_reason.toLowerCase();

    if (reason.includes('告知') || reason.includes('隐瞒') || reason.includes('病史')) {
      return 'health_disclosure';
    } else if (reason.includes('除外') || reason.includes('不在保障范围')) {
      return 'policy_exclusion';
    } else if (reason.includes('等待期')) {
      return 'waiting_period';
    } else if (reason.includes('骗保') || reason.includes('伪造')) {
      return 'fraud_suspicion';
    } else {
      return 'other';
    }
  }

  /**
   * 评估拒赔理由的合理性
   */
  private async assessReasonability(
    claimCase: ClaimCase,
    denialNotice: DenialNotice,
    denialType: DenialType
  ): Promise<ReasonabilityAssessment> {
    switch (denialType) {
      case 'health_disclosure':
        return this.assessHealthDisclosureReason(claimCase, denialNotice);

      case 'policy_exclusion':
        return this.assessExclusionReason(claimCase, denialNotice);

      case 'waiting_period':
        return this.assessWaitingPeriodReason(claimCase, denialNotice);

      default:
        return { is_reasonable: 'unclear', confidence: 0.5 };
    }
  }

  /**
   * 评估健康告知类拒赔的合理性
   */
  private async assessHealthDisclosureReason(
    claimCase: ClaimCase,
    denialNotice: DenialNotice
  ): Promise<ReasonabilityAssessment> {
    const analysis = {
      is_reasonable: 'unclear' as 'reasonable' | 'unreasonable' | 'unclear',
      confidence: 0.5,
      reasoning: [] as string[],
      key_factors: [] as string[]
    };

    // 1. 检查时间关系
    const timeBetween = this.calculateDaysBetween(
      claimCase.undisclosed_condition_date,
      claimCase.policy_date
    );

    if (timeBetween < 0) {
      // 投保前确实有此病症
      analysis.key_factors.push('投保前确有未告知病症');
      analysis.is_reasonable = 'reasonable';
      analysis.confidence += 0.2;
    } else {
      // 投保后才有的病症
      analysis.key_factors.push('病症发生在投保之后');
      analysis.is_reasonable = 'unreasonable';
      analysis.confidence = 0.9;
      analysis.reasoning.push('投保后发生的病症不属于未如实告知');
      return analysis; // 直接返回，明显不合理
    }

    // 2. 检查因果关系
    const hasDirectCausation = await this.checkCausation(
      claimCase.undisclosed_condition,
      claimCase.diagnosed_disease
    );

    if (hasDirectCausation) {
      analysis.key_factors.push('未告知病症与理赔疾病有直接因果关系');
      analysis.confidence += 0.2;
    } else {
      analysis.key_factors.push('未告知病症与理赔疾病无直接因果关系');
      analysis.confidence -= 0.2;
      analysis.reasoning.push('根据保险法第16条第3款，不影响保险事故的，仍应承担赔偿责任');
    }

    // 3. 检查是否在健康告知问卷中询问了此病症
    const wasAsked = await this.checkIfAskedInQuestionnaire(
      claimCase.health_questionnaire,
      claimCase.undisclosed_condition
    );

    if (!wasAsked) {
      analysis.key_factors.push('健康告知问卷未询问此病症');
      analysis.is_reasonable = 'unreasonable';
      analysis.confidence += 0.3;
      analysis.reasoning.push('询问告知原则：未询问到的无需主动告知');
    }

    // 4. 检查投保人是否知情
    if (claimCase.evidence.includes('投保人证明不知情')) {
      analysis.key_factors.push('投保人可能确实不知情');
      analysis.confidence -= 0.1;
      analysis.reasoning.push('如投保人确实不知情，不构成"故意"隐瞒');
    }

    // 5. 检查是否有代理人不当指导
    if (claimCase.evidence.includes('代理人称无需告知')) {
      analysis.key_factors.push('存在代理人不当指导');
      analysis.confidence -= 0.2;
      analysis.reasoning.push('代理人不当指导应由保险公司承担部分责任');
    }

    // 综合判断
    if (analysis.confidence >= 0.7) {
      analysis.is_reasonable = 'reasonable';
    } else if (analysis.confidence <= 0.3) {
      analysis.is_reasonable = 'unreasonable';
    }

    return analysis;
  }

  /**
   * 预测争议结果
   */
  private async predictOutcome(
    denialType: DenialType,
    reasonability: ReasonabilityAssessment,
    evidence: EvidenceAssessment
  ): Promise<OutcomePrediction> {
    // 1. 基于相似案例预测
    const similarCases = await this.findSimilarCases({
      denial_type: denialType,
      reasonability: reasonability.is_reasonable,
      evidence_strength: evidence.overall_strength
    });

    // 2. 计算各种结果的概率
    const outcomes = {
      fully_paid: 0,
      partially_paid: 0,
      denied: 0
    };

    for (const case_ of similarCases) {
      outcomes[case_.outcome.status] += 1;
    }

    const total = similarCases.length;
    const probabilities = {
      fully_paid: outcomes.fully_paid / total,
      partially_paid: outcomes.partially_paid / total,
      denied: outcomes.denied / total
    };

    // 3. 根据本案特点调整概率
    if (reasonability.is_reasonable === 'unreasonable') {
      // 拒赔理由不合理，赔付概率更高
      probabilities.fully_paid += 0.2;
      probabilities.denied -= 0.2;
    }

    if (evidence.overall_strength === 'strong') {
      // 投保人证据充分
      probabilities.fully_paid += 0.15;
      probabilities.denied -= 0.15;
    }

    // 归一化
    const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
    for (const key in probabilities) {
      probabilities[key] = probabilities[key] / sum;
    }

    // 4. 确定最可能的结果
    const mostLikely = Object.entries(probabilities)
      .sort(([, a], [, b]) => b - a)[0][0];

    // 5. 预估时间和成本
    const avgTimeToResolve = this.calculateAverageTime(similarCases);
    const estimatedCost = this.estimateCost(mostLikely, claimCase.claim_amount);

    return {
      probabilities: probabilities,
      most_likely_outcome: mostLikely as OutcomeStatus,
      win_probability: probabilities.fully_paid + probabilities.partially_paid * 0.5,
      estimated_time_days: avgTimeToResolve,
      estimated_cost: estimatedCost,
      confidence: this.calculateConfidence(similarCases.length),
      similar_cases: similarCases.slice(0, 5).map(c => c.case_id)
    };
  }

  /**
   * 生成建议
   */
  private generateRecommendations(
    prediction: OutcomePrediction
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (prediction.win_probability >= 0.7) {
      recommendations.push({
        action: 'pursue_claim',
        priority: 'high',
        reasoning: `胜诉概率较高（${(prediction.win_probability * 100).toFixed(0)}%），建议积极争取`,
        next_steps: [
          '收集补充证据',
          '向保险公司提交申诉',
          '准备调解或诉讼材料'
        ]
      });
    } else if (prediction.win_probability >= 0.4) {
      recommendations.push({
        action: 'negotiate',
        priority: 'medium',
        reasoning: '胜负难料，建议尝试协商和解',
        next_steps: [
          '分析争议焦点',
          '准备谈判策略',
          '寻求第三方调解'
        ]
      });
    } else {
      recommendations.push({
        action: 'accept_or_reconsider',
        priority: 'low',
        reasoning: `胜诉概率较低（${(prediction.win_probability * 100).toFixed(0)}%），建议谨慎评估`,
        next_steps: [
          '咨询专业律师',
          '评估诉讼成本收益',
          '考虑接受拒赔结果'
        ]
      });
    }

    return recommendations;
  }
}
```

---

## 法律支持系统

### 1. 法律知识库

```typescript
interface LegalKnowledgeBase {
  // 法律法规
  laws: {
    law_name: string;
    articles: {
      article_number: string;
      content: string;
      interpretation: string;
      application_scenarios: string[];
      related_cases: string[];
    }[];
  }[];

  // 司法解释
  judicial_interpretations: {
    name: string;
    issuing_body: string;
    effective_date: Date;
    articles: /* 同上 */[];
  }[];

  // 典型判例
  court_cases: {
    case_number: string;
    court: string;
    date: Date;
    case_summary: string;
    legal_issues: string[];
    judgment: string;
    reasoning: string;
    precedent_value: 'high' | 'medium' | 'low';
  }[];
}

// 核心法律条文
const KEY_LAWS = {
  insurance_law: {
    name: '中华人民共和国保险法',
    key_articles: [
      {
        article_number: '第16条',
        content: `
订立保险合同，保险人就保险标的或者被保险人的有关情况提出询问的，
投保人应当如实告知。

投保人故意或者因重大过失未履行前款规定的如实告知义务，
足以影响保险人决定是否同意承保或者提高保险费率的，保险人有权解除合同。

...

投保人故意不履行如实告知义务的，保险人对于合同解除前发生的保险事故，
不承担赔偿或者给付保险金的责任，并不退还保险费。

投保人因重大过失未履行如实告知义务，
对保险事故的发生有严重影响的，保险人对于合同解除前发生的保险事故，
不承担赔偿或者给付保险金的责任，但应当退还保险费。
        `,
        interpretation: `
如实告知义务的核心要点：
1. **询问告知原则**：仅需告知保险人询问的内容
2. **主观要件**：区分"故意"和"重大过失"
3. **客观要件**：足以影响承保决定
4. **因果关系**：第3款规定了与保险事故的因果关系要求
5. **后果区分**：故意不退保费，重大过失退保费
        `,
        application_scenarios: [
          '健康告知不实',
          '职业告知不实',
          '财务状况告知不实'
        ],
        related_cases: ['case_001', 'case_002']
      },
      {
        article_number: '第17条',
        content: `
订立保险合同，采用保险人提供的格式条款的，
保险人向投保人提供的投保单应当附格式条款，
保险人应当向投保人说明合同的内容。

对保险合同中免除保险人责任的条款，
保险人在订立合同时应当在投保单、保险单或者其他保险凭证上作出足以引起投保人注意的提示，
并对该条款的内容以书面或者口头形式向投保人作出明确说明；
未作提示或者明确说明的，该条款不产生效力。
        `,
        interpretation: `
明确说明义务的要点：
1. **提示义务**：免责条款需作出醒目提示（加粗、特殊字体等）
2. **明确说明**：需向投保人解释免责条款的含义和后果
3. **举证责任**：保险公司需举证已履行明确说明义务
4. **不履行后果**：免责条款不生效
        `,
        application_scenarios: [
          '免责条款效力争议',
          '保险人说明义务争议'
        ]
      }
    ]
  }
};
```

### 2. 文档生成系统

```typescript
class LegalDocumentGenerator {
  /**
   * 生成申诉信
   */
  async generateAppealLetter(
    claimCase: ClaimCase,
    denialAnalysis: DenialAnalysis
  ): Promise<string> {
    const template = `
申 诉 书

申诉人：${claimCase.insured_person.name}
保单号：${claimCase.policy_number}
拒赔日期：${claimCase.denial_date}

尊敬的${claimCase.insurance_company}：

我是保单号为${claimCase.policy_number}的投保人${claimCase.insured_person.name}，
现就贵司于${claimCase.denial_date}作出的拒赔决定提出申诉。

一、基本案情

${this.generateCaseSummary(claimCase)}

二、拒赔理由及我方异议

贵司拒赔理由：${claimCase.denial_reason}

我方异议：

${this.generateObjections(claimCase, denialAnalysis)}

三、事实与证据

${this.generateFactsAndEvidence(claimCase)}

四、法律依据

${this.generateLegalBasis(denialAnalysis)}

五、诉求

综上所述，申诉人认为贵司拒赔决定缺乏事实和法律依据，
特此申诉，请求贵司：

1. 撤销拒赔决定
2. 按保险合同约定支付理赔金${claimCase.claim_amount}元
3. 承担本次理赔所产生的合理费用

申诉人：${claimCase.insured_person.name}
日期：${new Date().toLocaleDateString('zh-CN')}
    `;

    return template;
  }

  /**
   * 生成监管投诉书
   */
  async generateRegulatoryComplaint(
    claimCase: ClaimCase,
    denialAnalysis: DenialAnalysis
  ): Promise<string> {
    const template = `
投 诉 书

投诉人：${claimCase.insured_person.name}
被投诉公司：${claimCase.insurance_company}
保单号：${claimCase.policy_number}

中国银保监会：

我是${claimCase.insurance_company}保单号为${claimCase.policy_number}的投保人，
现就该公司的不当拒赔行为向贵局投诉。

一、投诉事项

${this.generateComplaintItems(claimCase)}

二、事实与理由

${this.generateComplaintReasons(claimCase, denialAnalysis)}

三、投诉请求

请求贵局：
1. 责令${claimCase.insurance_company}纠正不当拒赔行为
2. 依法查处${claimCase.insurance_company}的违规行为
3. 维护投保人合法权益

投诉人：${claimCase.insured_person.name}
联系电话：${claimCase.insured_person.phone}
日期：${new Date().toLocaleDateString('zh-CN')}

附件：
1. 保险合同复印件
2. 理赔申请材料
3. 拒赔通知书
4. 其他证据材料
    `;

    return template;
  }

  /**
   * 生成起诉状
   */
  async generateLawsuit(
    claimCase: ClaimCase,
    denialAnalysis: DenialAnalysis
  ): Promise<string> {
    // 起诉状模板...
  }

  /**
   * 生成证据清单
   */
  async generateEvidenceList(
    claimCase: ClaimCase
  ): Promise<string> {
    return `
证 据 清 单

案号：_____________

序号 | 证据名称 | 证据来源 | 证明目的
----|---------|---------|--------
${claimCase.evidence.map((e, i) => `
${i + 1} | ${e.name} | ${e.source} | ${e.purpose}
`).join('')}

提交人：${claimCase.insured_person.name}
日期：${new Date().toLocaleDateString('zh-CN')}
    `;
  }
}
```

---

## 实现方案

### Phase 1: 案例库构建 (Week 1-2)

**任务：**
- [ ] 收集理赔争议案例 (目标: 500+)
  - 法院判决书数据库
  - 监管处罚公告
  - 新闻报道案例
  - 用户提交案例

- [ ] 案例标注与分类
  - 拒赔原因分类
  - 争议焦点提取
  - 结果统计

- [ ] 构建案例数据库

### Phase 2: 分析引擎开发 (Week 2-3)

**任务：**
- [ ] 实现 DenialAnalysisEngine
  - 拒赔原因识别
  - 合理性评估
  - 证据强度分析

- [ ] 实现案例匹配算法
  - 语义相似度
  - 特征匹配

- [ ] 实现结果预测模型

### Phase 3: 文档生成系统 (Week 1)

**任务：**
- [ ] 设计文档模板
  - 申诉信
  - 投诉书
  - 起诉状
  - 证据清单

- [ ] 实现文档生成引擎
- [ ] 生成个性化建议

### Phase 4: Agent 集成与测试 (Week 1)

**任务：**
- [ ] 实现 DisputeResolutionAgent
- [ ] 与其他 Agent 集成
- [ ] 端到端测试

---

## 总结

理赔争议处理系统通过：

1. ✅ **案例知识库** - 500+ 真实争议案例
2. ✅ **智能分析** - 评估拒赔合理性和胜诉概率
3. ✅ **解决方案** - 协商、调解、投诉、诉讼
4. ✅ **文档生成** - 自动生成法律文书
5. ✅ **法律支持** - 提供法律依据和判例参考

真正帮助用户解决理赔纠纷，体现AI保险顾问的核心价值！
