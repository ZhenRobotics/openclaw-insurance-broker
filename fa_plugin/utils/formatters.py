"""Output formatting utilities."""

from typing import Any, Dict, List


def format_bp_preview(bp_content: Dict[str, Any]) -> str:
    """格式化BP预览"""
    return f"""
📊 **商业计划书大纲**

1. 执行摘要
   {bp_content.get('executive_summary', '...')}

2. 公司介绍
   {bp_content.get('company_intro', '...')}

3. 市场分析
   {bp_content.get('market_analysis', '...')}
"""


def format_financial_model(model: Dict[str, Any]) -> str:
    """格式化财务模型"""
    return "财务模型格式化输出"


def format_valuation(valuation: Dict[str, Any]) -> str:
    """格式化估值分析"""
    return f"""
**估值方法**: {valuation.get('method', 'N/A')}
**估值区间**: {valuation.get('low', 0)} - {valuation.get('high', 0)} 万元
"""


def format_investor_matches(matches: List[Dict[str, Any]]) -> str:
    """格式化投资人匹配结果"""
    return "投资人匹配结果"


def format_strategy(strategy: Dict[str, Any]) -> str:
    """格式化融资策略"""
    return "融资策略输出"
