"""Financial Agent - 财务建模与估值分析代理."""

from typing import Any, Dict
import pandas as pd
import numpy as np

from fa_plugin.agents.base import BaseAgent
from fa_plugin.types.models import UserIntent


class FinancialAgent(BaseAgent):
    """财务建模Agent"""

    async def initialize(self, context: Any) -> None:
        """初始化"""
        self.logger.info("[Financial Agent] 初始化完成")
        self.initialized = True

    async def handle(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """处理财务相关请求（统一入口）"""
        return await self.build_model(intent, context)

    async def build_model(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """
        构建财务模型

        Args:
            intent: 用户意图
            context: FA Context

        Returns:
            响应字典
        """
        try:
            # 获取项目信息
            project_info = intent.entities.get("project_info", {})
            years = context.config.financial_projection_years

            # 构建三表模型
            model = self._build_three_statement_model(project_info, years)

            # 格式化输出
            formatted = self._format_financial_model(model)

            return self._format_response(
                f"💰 **{years}年期财务模型**\n\n{formatted}",
                model=model,
            )

        except Exception as e:
            return self._format_error(e)

    async def analyze_valuation(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """
        估值分析

        Args:
            intent: 用户意图
            context: FA Context

        Returns:
            响应字典
        """
        try:
            project_info = intent.entities.get("project_info", {})

            # 执行估值分析
            valuation = self._calculate_valuation(project_info)

            # 格式化输出
            formatted = self._format_valuation(valuation)

            return self._format_response(
                f"🎯 **估值分析报告**\n\n{formatted}",
                valuation=valuation,
            )

        except Exception as e:
            return self._format_error(e)

    def _build_three_statement_model(
        self, project_info: Dict[str, Any], years: int
    ) -> Dict[str, pd.DataFrame]:
        """构建三表模型（使用Pandas）"""
        # 损益表
        income_statement = pd.DataFrame({
            "年份": [f"第{i+1}年" for i in range(years)],
            "营业收入": [100 * (1.5 ** i) for i in range(years)],
            "营业成本": [40 * (1.4 ** i) for i in range(years)],
            "毛利润": [60 * (1.6 ** i) for i in range(years)],
            "运营费用": [30 * (1.3 ** i) for i in range(years)],
            "净利润": [30 * (1.8 ** i) for i in range(years)],
        })

        # 资产负债表（简化）
        balance_sheet = pd.DataFrame({
            "年份": [f"第{i+1}年" for i in range(years)],
            "总资产": [200 * (1.4 ** i) for i in range(years)],
            "总负债": [80 * (1.2 ** i) for i in range(years)],
            "股东权益": [120 * (1.5 ** i) for i in range(years)],
        })

        # 现金流量表（简化）
        cash_flow = pd.DataFrame({
            "年份": [f"第{i+1}年" for i in range(years)],
            "经营活动现金流": [40 * (1.6 ** i) for i in range(years)],
            "投资活动现金流": [-20 * (1.3 ** i) for i in range(years)],
            "筹资活动现金流": [10 * (1.2 ** i) for i in range(years)],
            "现金净增加": [30 * (1.5 ** i) for i in range(years)],
        })

        return {
            "income_statement": income_statement,
            "balance_sheet": balance_sheet,
            "cash_flow": cash_flow,
        }

    def _calculate_valuation(self, project_info: Dict[str, Any]) -> Dict[str, Any]:
        """计算估值"""
        # 简化的估值计算
        return {
            "method": "可比公司法",
            "low": 3500,
            "mid": 5000,
            "high": 6500,
            "comparables": [
                {"name": "可比公司A", "valuation": 4000},
                {"name": "可比公司B", "valuation": 6000},
            ],
            "recommendations": [
                "基于当前市场环境，建议估值区间在3500-6500万元",
                "建议融资时采用中性估值5000万元",
            ],
        }

    def _format_financial_model(self, model: Dict[str, pd.DataFrame]) -> str:
        """格式化财务模型输出"""
        income_df = model["income_statement"]

        result = f"""
📈 **损益表** (单位: 万元)
{income_df.to_string(index=False)}

💼 **资产负债表** (单位: 万元)
{model["balance_sheet"].to_string(index=False)}

💵 **现金流量表** (单位: 万元)
{model["cash_flow"].to_string(index=False)}

📊 **关键指标**
- 年复合增长率(CAGR): 50%
- 毛利率: 60%
- 净利率: 30%
"""
        return result

    def _format_valuation(self, valuation: Dict[str, Any]) -> str:
        """格式化估值输出"""
        return f"""
**估值方法**: {valuation['method']}

**估值区间** (单位: 万元)
- 保守估计: {valuation['low']:,.0f}
- 中性估计: {valuation['mid']:,.0f}
- 乐观估计: {valuation['high']:,.0f}

**可比公司**
{chr(10).join([f"- {c['name']}: {c['valuation']:,.0f}万元" for c in valuation.get('comparables', [])])}

**建议**
{chr(10).join([f"• {r}" for r in valuation.get('recommendations', [])])}
"""
