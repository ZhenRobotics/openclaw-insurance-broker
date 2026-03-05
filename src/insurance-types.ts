/**
 * Insurance-specific type definitions
 */

// Re-export common types from types.ts
export type { SkillContext, SkillResponse } from './types.js';

export interface UserInfo {
  age: number;
  gender: 'male' | 'female';
  occupation: string;
  income: number;
  income_level?: string;
  familySize: number;
  marital_status?: string;
  hasChildren: boolean;
  has_children?: boolean;
  children_count?: number;
  hasMortgage: boolean;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  health_status?: string;
  smokingStatus: boolean;
  existingInsurance: ExistingPolicy[];
  budget?: {
    min: number;
    max: number;
    recommended?: number;
  };
}

export interface ExistingPolicy {
  type: string;
  provider: string;
  coverage: number;
  premium: number;
}

export interface RiskAssessment {
  healthRisk: {
    level: 'low' | 'medium' | 'high';
    score: number;
    factors: string[];
  };
  deathRisk: {
    level: 'low' | 'medium' | 'high';
    score: number;
    factors: string[];
  };
  accidentRisk: {
    level: 'low' | 'medium' | 'high';
    score: number;
    factors: string[];
  };
  propertyRisk: {
    level: 'low' | 'medium' | 'high';
    score: number;
    factors: string[];
  };
}

export interface InsuranceProduct {
  id: string;
  name: string;
  provider: string;
  type: 'critical_illness' | 'medical' | 'life' | 'accident' | 'cancer' | 'other';
  category: string;
  description: string;
  coverage: {
    amount: number;
    term: string;
    conditions: string[];
  };
  pricing: {
    basePrice: number;
    currency: string;
    ageFactors: Record<string, number>;
  };
  features: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    healthRequirements: string[];
    occupationRestrictions: string[];
  };
  pros: string[];
  cons: string[];
}

export interface RecommendationResult {
  products: InsuranceProduct[];
  reasoning: string;
  alternativeOptions?: InsuranceProduct[];
}

export interface NeedsAnalysisReport {
  userInfo: UserInfo;
  riskAssessment: RiskAssessment;
  recommendations: string[];
  priorityProducts: string[];
  estimatedBudget: {
    min: number;
    max: number;
    recommended: number;
  };
  summary: string;
}
