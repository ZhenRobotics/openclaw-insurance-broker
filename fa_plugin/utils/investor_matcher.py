"""Investor matching utilities."""

from typing import List, Dict, Any


class InvestorMatcher:
    """投资人匹配工具"""

    @staticmethod
    def calculate_similarity(project: Dict[str, Any], investor: Dict[str, Any]) -> float:
        """
        计算项目和投资人的相似度

        Args:
            project: 项目信息
            investor: 投资人信息

        Returns:
            相似度分数 (0-1)
        """
        score = 0.0

        # 行业匹配
        if project.get("industry") in investor.get("industry_preference", []):
            score += 0.4

        # 阶段匹配
        if project.get("stage") in investor.get("stage_preference", []):
            score += 0.3

        # 金额匹配
        amount = project.get("amount", 0)
        check_size = investor.get("check_size", {})
        if check_size.get("min", 0) <= amount <= check_size.get("max", float("inf")):
            score += 0.2

        # 地域匹配
        if project.get("region") in investor.get("region_preference", []):
            score += 0.1

        return min(score, 1.0)

    @staticmethod
    def rank_investors(
        project: Dict[str, Any], investors: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        对投资人进行排序

        Args:
            project: 项目信息
            investors: 投资人列表

        Returns:
            排序后的投资人列表
        """
        scored = []
        for inv in investors:
            score = InvestorMatcher.calculate_similarity(project, inv)
            scored.append({"investor": inv, "score": score})

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored
