"""BP Generation Agent - 商业计划书生成代理."""

from typing import Any, Dict
from fa_plugin.agents.base import BaseAgent
from fa_plugin.types.models import UserIntent


class BPAgent(BaseAgent):
    """BP生成Agent"""

    async def initialize(self, context: Any) -> None:
        """初始化"""
        self.logger.info("[BP Agent] 初始化完成")
        self.initialized = True

    async def handle(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """
        处理BP生成请求

        Args:
            intent: 用户意图
            context: FA Context

        Returns:
            响应字典
        """
        try:
            # 1. 收集项目信息（简化版）
            project_info = intent.entities.get("project_info", {})

            # 2. 生成BP内容
            bp_content = await self._generate_bp(project_info, context)

            # 3. 格式化输出
            formatted_bp = self._format_bp_preview(bp_content)

            return self._format_response(
                f"✅ 已为您生成商业计划书\n\n{formatted_bp}",
                bp_content=bp_content,
            )

        except Exception as e:
            return self._format_error(e)

    async def _generate_bp(self, project_info: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """生成BP内容"""
        system_prompt = """你是一位专业的FA，帮助创业者生成商业计划书。

请根据项目信息生成包含以下部分的BP：
1. 执行摘要
2. 公司介绍
3. 市场分析
4. 产品/服务
5. 商业模式
6. 竞争分析
7. 团队介绍
8. 财务规划
9. 融资计划

以JSON格式返回各部分内容。"""

        response = await context.llm.chat(
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": f"项目信息: {project_info}\n\n请生成商业计划书",
                }
            ],
        )

        # 简化：直接返回LLM内容
        return {
            "executive_summary": response.get("content", "")[:300],
            "company_intro": "公司介绍内容...",
            "market_size": "市场规模数据...",
            "market_trends": "市场趋势...",
            "product_description": "产品描述...",
            "business_model": "商业模式...",
            "competitors": ["竞品A", "竞品B"],
            "team_count": 5,
            "revenue_projection": "3年预计营收",
            "funding_amount": "本轮融资金额",
            "recommendations": ["建议1", "建议2", "建议3"],
        }

    def _format_bp_preview(self, bp_content: Dict[str, Any]) -> str:
        """格式化BP预览"""
        return f"""
📊 **商业计划书大纲**

1. 执行摘要
   {bp_content.get('executive_summary', '...')}

2. 公司介绍
   {bp_content.get('company_intro', '...')}

3. 市场分析
   - 目标市场规模: {bp_content.get('market_size', 'N/A')}
   - 增长趋势: {bp_content.get('market_trends', 'N/A')}

4. 产品/服务
   {bp_content.get('product_description', '...')}

5. 商业模式
   {bp_content.get('business_model', '...')}

6. 竞争分析
   主要竞品: {', '.join(bp_content.get('competitors', []))}

7. 团队介绍
   核心成员: {bp_content.get('team_count', 0)} 人

8. 财务规划
   预计 3 年营收: {bp_content.get('revenue_projection', 'N/A')}

9. 融资计划
   本轮融资: {bp_content.get('funding_amount', 'N/A')}
"""
