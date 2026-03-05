"""Investor Match Agent - 投资人匹配代理."""

from typing import Any, Dict, List
import json
from pathlib import Path

from fa_plugin.agents.base import BaseAgent
from fa_plugin.types.models import UserIntent, Investor, InvestorMatch


class InvestorMatchAgent(BaseAgent):
    """投资人匹配Agent"""

    def __init__(self):
        super().__init__()
        self.investor_db: List[Investor] = []

    async def initialize(self, context: Any) -> None:
        """初始化 - 加载投资人数据库"""
        try:
            # 加载投资人数据
            db_path = Path(context.config.investor_database_path)
            if db_path.exists():
                with open(db_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.investor_db = [Investor(**inv) for inv in data]

            self.logger.info(f"[Investor Agent] 已加载 {len(self.investor_db)} 个投资机构")
            self.initialized = True

        except Exception as e:
            self.logger.error(f"[Investor Agent] 初始化失败: {e}")
            self.investor_db = []
            self.initialized = True

    async def handle(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """处理投资人相关请求（统一入口）"""
        return await self.match_investors(intent, context)

    async def match_investors(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """
        匹配投资人

        Args:
            intent: 用户意图
            context: FA Context

        Returns:
            响应字典
        """
        try:
            project_info = intent.entities.get("project_info", {})

            # 执行匹配
            matches = self._match_logic(project_info, context)

            # 取前N个结果
            top_matches = matches[: context.config.match_max_results]

            # 格式化输出
            formatted = self._format_matches(top_matches)

            return self._format_response(
                f"🎯 **为您推荐以下投资机构**\n\n{formatted}",
                matches=top_matches,
            )

        except Exception as e:
            return self._format_error(e)

    async def analyze_investor(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """
        分析单个投资人

        Args:
            intent: 用户意图
            context: FA Context

        Returns:
            响应字典
        """
        try:
            investor_name = intent.entities.get("investor_name", "")

            # 查找投资人
            investor = next(
                (
                    inv
                    for inv in self.investor_db
                    if inv.name == investor_name or inv.name_en == investor_name
                ),
                None,
            )

            if not investor:
                return self._format_response(
                    f"未找到投资机构: {investor_name}\n\n您可以尝试：\n• 检查机构名称\n• 使用英文名称搜索"
                )

            # 格式化投资人信息
            formatted = self._format_investor_profile(investor)

            return self._format_response(
                f"📊 **{investor.name} 机构分析**\n\n{formatted}",
                investor=investor.dict(),
            )

        except Exception as e:
            return self._format_error(e)

    def _match_logic(self, project_info: Dict[str, Any], context: Any) -> List[InvestorMatch]:
        """执行匹配逻辑"""
        matches = []

        for investor in self.investor_db:
            score = self._calculate_match_score(project_info, investor)

            if score >= context.config.match_min_score:
                matches.append(
                    InvestorMatch(
                        investor=investor,
                        score=score,
                        reasons=self._generate_match_reasons(project_info, investor),
                        recommendations=["建议通过温暖介绍接触", "准备针对性的BP"],
                    )
                )

        # 按分数排序
        matches.sort(key=lambda x: x.score, reverse=True)
        return matches

    def _calculate_match_score(self, project_info: Dict[str, Any], investor: Investor) -> float:
        """计算匹配分数"""
        score = 0.0

        # 行业匹配 (40%)
        project_industry = project_info.get("industry", "")
        if project_industry in investor.industry_preference:
            score += 0.4

        # 阶段匹配 (30%)
        funding_round = project_info.get("funding_round", "")
        if funding_round in investor.stage_preference:
            score += 0.3

        # 金额匹配 (20%)
        amount = project_info.get("amount", 0)
        if investor.check_size["min"] <= amount <= investor.check_size["max"]:
            score += 0.2

        # 地域匹配 (10%)
        region = project_info.get("region", "")
        if region in investor.region_preference:
            score += 0.1

        return min(score, 1.0)

    def _generate_match_reasons(
        self, project_info: Dict[str, Any], investor: Investor
    ) -> List[str]:
        """生成匹配理由"""
        reasons = []

        if project_info.get("industry") in investor.industry_preference:
            reasons.append(f"专注{project_info.get('industry')}赛道")

        if project_info.get("funding_round") in investor.stage_preference:
            reasons.append(f"投资{project_info.get('funding_round')}轮次")

        return reasons

    def _format_matches(self, matches: List[InvestorMatch]) -> str:
        """格式化匹配结果"""
        result = []

        for i, match in enumerate(matches, 1):
            inv = match.investor
            stars = "⭐" * int(match.score * 5)

            result.append(
                f"""**{i}. {inv.name}**
   匹配度: {match.score*100:.0f}% {stars}
   类型: {inv.type.value.upper()}
   偏好阶段: {', '.join(inv.stage_preference)}
   投资金额: {inv.check_size['min']}-{inv.check_size['max']} 万元
   投资数量: {inv.investment_count or 'N/A'} 个项目

   匹配理由:
{chr(10).join([f'   • {r}' for r in match.reasons])}
"""
            )

        return "\n".join(result)

    def _format_investor_profile(self, investor: Investor) -> str:
        """格式化投资人画像"""
        return f"""
**基本信息**
- 类型: {investor.type.value.upper()}
- 偏好阶段: {', '.join(investor.stage_preference)}
- 偏好行业: {', '.join(investor.industry_preference)}
- 偏好地域: {', '.join(investor.region_preference)}

**投资规模**
- 最小: {investor.check_size['min']} 万元
- 典型: {investor.check_size['typical']} 万元
- 最大: {investor.check_size['max']} 万元

**投资数量**: {investor.investment_count or 'N/A'} 个项目

**投资理念**
{investor.investment_thesis or '暂无数据'}

**代表案例**
{chr(10).join([f'• {inv}' for inv in (investor.notable_investments or [])])}
"""
