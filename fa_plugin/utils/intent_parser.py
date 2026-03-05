"""Intent parsing utilities."""

import logging
import json
import re
from typing import Dict, Any

from fa_plugin.config import FAConfig
from fa_plugin.types.models import UserIntent, IntentType

logger = logging.getLogger(__name__)


class IntentParser:
    """用户意图解析器"""

    # 关键词映射
    KEYWORD_MAP = {
        IntentType.GENERATE_BP: ["bp", "商业计划书", "计划书", "生成bp", "写bp", "business plan"],
        IntentType.BUILD_FINANCIAL_MODEL: [
            "财务模型",
            "三表",
            "财务预测",
            "财务规划",
            "损益表",
            "现金流",
            "资产负债表",
        ],
        IntentType.ANALYZE_VALUATION: ["估值", "估价", "公司价值", "值多少钱", "valuation"],
        IntentType.MATCH_INVESTORS: [
            "推荐投资人",
            "匹配投资",
            "找投资",
            "投资机构",
            "投资人推荐",
        ],
        IntentType.ANALYZE_INVESTOR: ["分析", "投资人画像", "机构分析", "了解"],
        IntentType.FUNDRAISING_STRATEGY: ["融资策略", "融资规划", "怎么融资", "融资建议"],
        IntentType.TERM_SHEET_REVIEW: ["term sheet", "投资条款", "条款解读", "ts"],
        IntentType.DUE_DILIGENCE_PREP: ["尽调", "尽职调查", "材料清单", "dd", "due diligence"],
        IntentType.INDUSTRY_ANALYSIS: ["行业分析", "赛道", "市场分析", "行业趋势"],
    }

    def __init__(self, config: FAConfig):
        """
        初始化意图解析器

        Args:
            config: FA配置
        """
        self.config = config

    async def parse(self, message: str, context: Any) -> UserIntent:
        """
        解析用户意图

        Args:
            message: 用户消息
            context: FA Context

        Returns:
            用户意图
        """
        message_lower = message.lower()

        # 1. 尝试关键词匹配
        for intent_type, keywords in self.KEYWORD_MAP.items():
            if any(keyword.lower() in message_lower for keyword in keywords):
                entities = await self._extract_entities(message, intent_type)
                return UserIntent(
                    type=intent_type,
                    entities=entities,
                    confidence=0.8,
                )

        # 2. 使用LLM进行意图识别
        return await self._parse_with_llm(message, context)

    async def _parse_with_llm(self, message: str, context: Any) -> UserIntent:
        """使用LLM识别意图"""
        system_prompt = """你是一个意图识别助手。分析用户消息并返回意图类型和实体。

可用的意图类型：
- generate_bp: 生成商业计划书
- build_financial_model: 构建财务模型
- analyze_valuation: 估值分析
- match_investors: 匹配投资人
- analyze_investor: 分析投资机构
- fundraising_strategy: 融资策略
- term_sheet_review: Term Sheet 解读
- due_diligence_prep: 尽调准备
- industry_analysis: 行业分析
- general_consultation: 一般咨询

以 JSON 格式返回:
{
  "type": "意图类型",
  "entities": {"实体名": "实体值"},
  "confidence": 0.0-1.0
}"""

        try:
            response = await context.llm.chat(
                system=system_prompt,
                messages=[{"role": "user", "content": message}],
            )

            content = response.get("content", "{}")
            result = json.loads(content)

            return UserIntent(
                type=IntentType(result.get("type", "unknown")),
                entities=result.get("entities", {}),
                confidence=result.get("confidence", 0.5),
            )

        except Exception as e:
            logger.warning(f"LLM意图识别失败: {e}")
            return UserIntent(
                type=IntentType.GENERAL_CONSULTATION,
                entities={},
                confidence=0.5,
            )

    async def _extract_entities(self, message: str, intent_type: IntentType) -> Dict[str, Any]:
        """
        提取实体信息

        Args:
            message: 用户消息
            intent_type: 意图类型

        Returns:
            实体字典
        """
        entities = {}

        if intent_type == IntentType.GENERATE_BP:
            entities["industry"] = self._extract_industry(message)
            entities["stage"] = self._extract_stage(message)

        elif intent_type == IntentType.MATCH_INVESTORS:
            entities["funding_round"] = self._extract_funding_round(message)
            entities["amount"] = self._extract_amount(message)

        elif intent_type == IntentType.ANALYZE_INVESTOR:
            entities["investor_name"] = self._extract_investor_name(message)

        elif intent_type == IntentType.INDUSTRY_ANALYSIS:
            entities["industry"] = self._extract_industry(message)

        return entities

    def _extract_industry(self, message: str) -> str:
        """提取行业信息"""
        industries = [
            "SaaS",
            "企业服务",
            "电商",
            "教育",
            "医疗",
            "金融科技",
            "AI",
            "人工智能",
            "大数据",
            "物联网",
            "新能源",
            "智能硬件",
            "游戏",
            "社交",
        ]

        for industry in industries:
            if industry in message:
                return industry

        return ""

    def _extract_stage(self, message: str) -> str:
        """提取发展阶段"""
        stage_map = {
            "想法": "idea",
            "idea": "idea",
            "mvp": "mvp",
            "产品": "mvp",
            "早期": "early-revenue",
            "增长": "growth",
            "成熟": "mature",
        }

        for keyword, stage in stage_map.items():
            if keyword in message.lower():
                return stage

        return ""

    def _extract_funding_round(self, message: str) -> str:
        """提取融资轮次"""
        rounds = [
            ("天使", "angel"),
            ("angel", "angel"),
            ("pre-a", "pre-a"),
            ("a轮", "a"),
            ("b轮", "b"),
            ("c轮", "c"),
        ]

        message_lower = message.lower()
        for keyword, round_type in rounds:
            if keyword in message_lower:
                return round_type

        return ""

    def _extract_amount(self, message: str) -> float:
        """提取金额"""
        # 匹配 "数字 + 单位" 模式
        pattern = r"(\d+(?:\.\d+)?)\s*(万|百万|千万|亿)"
        match = re.search(pattern, message)

        if match:
            num = float(match.group(1))
            unit = match.group(2)

            unit_map = {"万": 1, "百万": 100, "千万": 1000, "亿": 10000}

            return num * unit_map.get(unit, 1)

        return 0.0

    def _extract_investor_name(self, message: str) -> str:
        """提取投资人名称"""
        # 移除常见关键词
        cleaned = re.sub(r"分析|投资人|机构|画像|的|了解|一下", "", message)
        return cleaned.strip()
