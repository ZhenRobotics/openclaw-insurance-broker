"""Data models using Pydantic for type safety and validation."""

from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


# Enums
class IntentType(str, Enum):
    """用户意图类型"""
    GENERATE_BP = "generate_bp"
    BUILD_FINANCIAL_MODEL = "build_financial_model"
    ANALYZE_VALUATION = "analyze_valuation"
    MATCH_INVESTORS = "match_investors"
    ANALYZE_INVESTOR = "analyze_investor"
    FUNDRAISING_STRATEGY = "fundraising_strategy"
    TERM_SHEET_REVIEW = "term_sheet_review"
    DUE_DILIGENCE_PREP = "due_diligence_prep"
    INDUSTRY_ANALYSIS = "industry_analysis"
    GENERAL_CONSULTATION = "general_consultation"
    UNKNOWN = "unknown"


class ProjectStage(str, Enum):
    """项目发展阶段"""
    IDEA = "idea"
    MVP = "mvp"
    EARLY_REVENUE = "early-revenue"
    GROWTH = "growth"
    MATURE = "mature"


class FundingRoundType(str, Enum):
    """融资轮次"""
    ANGEL = "angel"
    PRE_A = "pre-a"
    A = "a"
    B = "b"
    C = "c"
    PRE_IPO = "pre-ipo"


class InvestorType(str, Enum):
    """投资机构类型"""
    VC = "vc"
    PE = "pe"
    CORPORATE = "corporate"
    ANGEL = "angel"
    GOVERNMENT = "government"


# User Intent
class UserIntent(BaseModel):
    """用户意图"""
    type: IntentType
    entities: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(ge=0.0, le=1.0)


# Project related models
class TeamMember(BaseModel):
    """团队成员"""
    name: str
    role: str
    background: str


class ProductInfo(BaseModel):
    """产品信息"""
    description: str
    features: List[str] = Field(default_factory=list)
    competitive_advantages: List[str] = Field(default_factory=list)
    technology_stack: Optional[List[str]] = None


class Competitor(BaseModel):
    """竞争对手"""
    name: str
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    market_share: Optional[float] = None


class MarketInfo(BaseModel):
    """市场信息"""
    target_market: str
    market_size: Dict[str, float] = Field(
        default_factory=lambda: {"tam": 0.0, "sam": 0.0, "som": 0.0}
    )
    competitors: List[Competitor] = Field(default_factory=list)
    trends: List[str] = Field(default_factory=list)


class RevenueStream(BaseModel):
    """收入来源"""
    name: str
    type: str  # subscription, transaction, licensing, advertising, other
    description: str
    pricing: Optional[Dict[str, Any]] = None


class CostItem(BaseModel):
    """成本项目"""
    category: str  # cogs, sales_marketing, rd, admin, other
    name: str
    description: str
    amount: Optional[float] = None


class UnitEconomics(BaseModel):
    """单位经济模型"""
    cac: float = Field(description="Customer Acquisition Cost")
    ltv: float = Field(description="Lifetime Value")
    ltv_cac_ratio: float
    payback_period: int = Field(description="Payback period in months")


class BusinessInfo(BaseModel):
    """商业模式信息"""
    model: str
    revenue_streams: List[RevenueStream] = Field(default_factory=list)
    cost_structure: List[CostItem] = Field(default_factory=list)
    unit_economics: Optional[UnitEconomics] = None


class FinancialPeriod(BaseModel):
    """财务周期"""
    period: str
    revenue: float
    cost: float
    gross_profit: float
    net_profit: float


class FinancialProjection(BaseModel):
    """财务预测"""
    periods: int
    unit: str  # month or year
    revenue: List[float]
    cost: List[float]
    profit: List[float]
    assumptions: Dict[str, Any] = Field(default_factory=dict)


class FundingRound(BaseModel):
    """融资轮次"""
    round: str
    date: str
    amount: float
    valuation: Optional[float] = None
    investors: List[str] = Field(default_factory=list)
    lead_investor: Optional[str] = None


class FinancialInfo(BaseModel):
    """财务信息"""
    revenue_history: Optional[List[FinancialPeriod]] = None
    projections: Optional[FinancialProjection] = None
    funding_history: Optional[List[FundingRound]] = None
    current_runway: Optional[int] = Field(None, description="Current runway in months")
    burn_rate: Optional[float] = Field(None, description="Monthly burn rate")


class ProjectInfo(BaseModel):
    """项目信息"""
    name: str
    industry: str
    sector: Optional[str] = None
    stage: ProjectStage
    funding_round: FundingRoundType
    description: str
    team: Optional[List[TeamMember]] = None
    product: Optional[ProductInfo] = None
    market: Optional[MarketInfo] = None
    business: Optional[BusinessInfo] = None
    financial: Optional[FinancialInfo] = None


# Investor related models
class ContactInfo(BaseModel):
    """联系信息"""
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    wechat: Optional[str] = None


class PortfolioCompany(BaseModel):
    """投资组合公司"""
    name: str
    industry: str
    round: str
    year: int
    status: str  # active, exited, failed
    exit_type: Optional[str] = None  # ipo, acquisition, other


class Investor(BaseModel):
    """投资机构"""
    id: str
    name: str
    name_en: Optional[str] = None
    type: InvestorType
    stage_preference: List[str] = Field(default_factory=list)
    industry_preference: List[str] = Field(default_factory=list)
    region_preference: List[str] = Field(default_factory=list)
    check_size: Dict[str, float] = Field(
        default_factory=lambda: {"min": 0.0, "max": 0.0, "typical": 0.0}
    )
    investment_count: Optional[int] = None
    notable_investments: Optional[List[str]] = None
    portfolio: Optional[List[PortfolioCompany]] = None
    investment_thesis: Optional[str] = None
    contact: Optional[ContactInfo] = None
    social_media: Optional[Dict[str, str]] = None


class InvestorMatch(BaseModel):
    """投资人匹配结果"""
    investor: Investor
    score: float = Field(ge=0.0, le=1.0)
    reasons: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)


# Valuation models
class ComparableCompany(BaseModel):
    """可比公司"""
    name: str
    industry: str
    stage: str
    latest_round: str
    valuation: float
    revenue: Optional[float] = None
    growth_rate: Optional[float] = None
    multiple: Optional[float] = None


class ValuationAnalysis(BaseModel):
    """估值分析"""
    method: str  # comparable, dcf, venture_capital, market_multiple
    estimated_value: Dict[str, float] = Field(
        default_factory=lambda: {"low": 0.0, "mid": 0.0, "high": 0.0}
    )
    comparables: Optional[List[ComparableCompany]] = None
    assumptions: Dict[str, Any] = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)


# Strategy models
class Milestone(BaseModel):
    """里程碑"""
    title: str
    description: str
    deadline: str
    importance: str  # critical, high, medium, low


class StrategyTimeline(BaseModel):
    """策略时间线"""
    phase: str
    duration: str
    activities: List[str] = Field(default_factory=list)


class FundraisingStrategy(BaseModel):
    """融资策略"""
    recommended_round: str
    target_amount: float
    dilution_estimate: float
    pre_money_valuation: float
    timeline: List[StrategyTimeline] = Field(default_factory=list)
    key_milestones: List[Milestone] = Field(default_factory=list)
    pitch_strategy: List[str] = Field(default_factory=list)
    negotiation_tips: List[str] = Field(default_factory=list)


# Due Diligence models
class DDItem(BaseModel):
    """尽调项目"""
    title: str
    description: str
    required: bool
    documents: List[str] = Field(default_factory=list)


class DDCategory(BaseModel):
    """尽调类别"""
    name: str
    items: List[DDItem] = Field(default_factory=list)


class DueDiligenceChecklist(BaseModel):
    """尽调清单"""
    categories: List[DDCategory] = Field(default_factory=list)
    estimated_time: str
    tips: List[str] = Field(default_factory=list)
