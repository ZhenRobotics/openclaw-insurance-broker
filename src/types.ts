/**
 * OpenClaw FA Plugin - 类型定义
 * FA 特定的业务类型
 */

// 导入 Plugin SDK 类型
import type {
  LLMProvider,
  StorageProvider,
} from './plugin-types.js';

// 重新导出 Plugin SDK 类型
export type {
  PluginAPI,
  HookEvent,
  ServiceDefinition,
  OpenClawContext,
  LLMProvider,
  StorageProvider,
  ChatParams,
  ChatMessage,
  ChatResponse,
} from './plugin-types.js';

// FA Context 类型
export interface SkillContext {
  userId: string;
  channelId: string;
  channelType: string;
  sessionId: string;
  config: SkillConfig;
  llm: LLMProvider;
  storage: StorageProvider;
  tools: ToolsProvider;
}

export interface SkillConfig {
  defaultCurrency: 'CNY' | 'USD';
  defaultLanguage: 'zh-CN' | 'en-US';
  investorDatabasePath: string;
  enableWebSearch: boolean;
}

export interface ToolsProvider {
  searchWeb?(query: string): Promise<SearchResult[]>;
  generateDocument?(template: string, data: any): Promise<Buffer>;
  analyzeDocument?(file: Buffer): Promise<any>;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface SkillResponse {
  type: 'text' | 'file' | 'interactive' | 'error';
  content: string | Buffer;
  metadata?: Record<string, any>;
  attachments?: Attachment[];
}

export interface Attachment {
  type: 'file' | 'image' | 'chart';
  name: string;
  data: Buffer;
  mimeType: string;
}

// FA Skill 特定类型

export interface UserIntent {
  type: IntentType;
  entities: Record<string, any>;
  confidence: number;
}

export type IntentType =
  | 'generate_bp'
  | 'build_financial_model'
  | 'analyze_valuation'
  | 'match_investors'
  | 'analyze_investor'
  | 'fundraising_strategy'
  | 'term_sheet_review'
  | 'due_diligence_prep'
  | 'industry_analysis'
  | 'general_consultation'
  | 'unknown';

export interface ProjectInfo {
  name: string;
  industry: string;
  sector?: string;
  stage: 'idea' | 'mvp' | 'early-revenue' | 'growth' | 'mature';
  fundingRound: 'angel' | 'pre-a' | 'a' | 'b' | 'c' | 'pre-ipo';
  description: string;
  team?: TeamMember[];
  product?: ProductInfo;
  market?: MarketInfo;
  business?: BusinessInfo;
  financial?: FinancialInfo;
}

export interface TeamMember {
  name: string;
  role: string;
  background: string;
}

export interface ProductInfo {
  description: string;
  features: string[];
  competitive_advantages: string[];
  technology_stack?: string[];
}

export interface MarketInfo {
  target_market: string;
  market_size: {
    tam: number;  // Total Addressable Market
    sam: number;  // Serviceable Addressable Market
    som: number;  // Serviceable Obtainable Market
  };
  competitors: Competitor[];
  trends: string[];
}

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  market_share?: number;
}

export interface BusinessInfo {
  model: string;
  revenue_streams: RevenueStream[];
  cost_structure: CostItem[];
  unit_economics?: UnitEconomics;
}

export interface RevenueStream {
  name: string;
  type: 'subscription' | 'transaction' | 'licensing' | 'advertising' | 'other';
  description: string;
  pricing?: any;
}

export interface CostItem {
  category: 'cogs' | 'sales_marketing' | 'rd' | 'admin' | 'other';
  name: string;
  description: string;
  amount?: number;
}

export interface UnitEconomics {
  cac: number;      // Customer Acquisition Cost
  ltv: number;      // Lifetime Value
  ltv_cac_ratio: number;
  payback_period: number;  // months
}

export interface FinancialInfo {
  revenue_history?: FinancialPeriod[];
  projections?: FinancialProjection;
  funding_history?: FundingRound[];
  current_runway?: number;  // months
  burn_rate?: number;       // monthly
}

export interface FinancialPeriod {
  period: string;
  revenue: number;
  cost: number;
  gross_profit: number;
  net_profit: number;
}

export interface FinancialProjection {
  periods: number;  // 预测期数（月或年）
  unit: 'month' | 'year';
  revenue: number[];
  cost: number[];
  profit: number[];
  assumptions: Record<string, any>;
}

export interface FundingRound {
  round: string;
  date: string;
  amount: number;
  valuation?: number;
  investors: string[];
  lead_investor?: string;
}

export interface Investor {
  id: string;
  name: string;
  name_en?: string;
  type: 'vc' | 'pe' | 'corporate' | 'angel' | 'government';
  stage_preference: string[];  // angel, pre-a, a, b, c, etc.
  industry_preference: string[];
  region_preference: string[];
  check_size: {
    min: number;
    max: number;
    typical: number;
  };
  investment_count?: number;
  notable_investments?: string[];
  portfolio?: PortfolioCompany[];
  investment_thesis?: string;
  contact?: ContactInfo;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface PortfolioCompany {
  name: string;
  industry: string;
  round: string;
  year: number;
  status: 'active' | 'exited' | 'failed';
  exit_type?: 'ipo' | 'acquisition' | 'other';
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  wechat?: string;
}

export interface InvestorMatch {
  investor: Investor;
  score: number;
  reasons: string[];
  recommendations: string[];
}

export interface ValuationAnalysis {
  method: 'comparable' | 'dcf' | 'venture_capital' | 'market_multiple';
  estimated_value: {
    low: number;
    mid: number;
    high: number;
  };
  comparables?: ComparableCompany[];
  assumptions: Record<string, any>;
  recommendations: string[];
}

export interface ComparableCompany {
  name: string;
  industry: string;
  stage: string;
  latest_round: string;
  valuation: number;
  revenue?: number;
  growth_rate?: number;
  multiple?: number;
}

export interface FundraisingStrategy {
  recommended_round: string;
  target_amount: number;
  dilution_estimate: number;
  pre_money_valuation: number;
  timeline: StrategyTimeline[];
  key_milestones: Milestone[];
  pitch_strategy: string[];
  negotiation_tips: string[];
}

export interface StrategyTimeline {
  phase: string;
  duration: string;
  activities: string[];
}

export interface Milestone {
  title: string;
  description: string;
  deadline: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

export interface DueDiligenceChecklist {
  categories: DDCategory[];
  estimated_time: string;
  tips: string[];
}

export interface DDCategory {
  name: string;
  items: DDItem[];
}

export interface DDItem {
  title: string;
  description: string;
  required: boolean;
  documents: string[];
}

// Main Skill Interface
export interface Skill {
  id: string;
  name: string;
  version: string;
  description: string;
  initialize?(context: SkillContext): Promise<void>;
  handle(input: string, context: SkillContext): Promise<SkillResponse>;
  shutdown?(): Promise<void>;
}
