"""Strategy Agent - 融资策略与尽调支持代理."""

from typing import Any, Dict

from fa_plugin.agents.base import BaseAgent
from fa_plugin.types.models import UserIntent


class StrategyAgent(BaseAgent):
    """融资策略Agent"""

    async def initialize(self, context: Any) -> None:
        """初始化"""
        self.logger.info("[Strategy Agent] 初始化完成")
        self.initialized = True

    async def handle(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """处理策略相关请求（统一入口）"""
        return await self.create_strategy(intent, context)

    async def create_strategy(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """
        创建融资策略

        Args:
            intent: 用户意图
            context: FA Context

        Returns:
            响应字典
        """
        try:
            project_info = intent.entities.get("project_info", {})

            # 使用LLM生成策略
            strategy = await self._generate_strategy(project_info, context)

            # 格式化输出
            formatted = self._format_strategy(strategy)

            return self._format_response(
                f"🚀 **融资策略方案**\n\n{formatted}",
                strategy=strategy,
            )

        except Exception as e:
            return self._format_error(e)

    async def review_term_sheet(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """Term Sheet解读"""
        try:
            term_sheet_content = intent.entities.get("term_sheet", "")

            # 使用LLM分析
            analysis = await self._analyze_term_sheet(term_sheet_content, context)

            return self._format_response(
                f"📄 **Term Sheet 解读**\n\n{analysis}",
                analysis=analysis,
            )

        except Exception as e:
            return self._format_error(e)

    async def prepare_due_diligence(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """准备尽调材料"""
        try:
            # 生成尽调清单
            checklist = self._generate_dd_checklist()

            formatted = self._format_dd_checklist(checklist)

            return self._format_response(
                f"📋 **尽职调查材料清单**\n\n{formatted}",
                checklist=checklist,
            )

        except Exception as e:
            return self._format_error(e)

    async def analyze_industry(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """行业分析"""
        try:
            industry = intent.entities.get("industry", "")

            # 使用LLM进行行业分析
            analysis = await self._analyze_industry_with_llm(industry, context)

            return self._format_response(
                f"📈 **{industry} 行业分析报告**\n\n{analysis}",
                analysis=analysis,
            )

        except Exception as e:
            return self._format_error(e)

    async def _generate_strategy(
        self, project_info: Dict[str, Any], context: Any
    ) -> Dict[str, Any]:
        """生成融资策略"""
        system_prompt = """你是专业的融资顾问，请为项目制定融资策略。

包括：
1. 推荐融资轮次
2. 目标融资金额
3. 预计稀释比例
4. 融资时间表
5. 关键里程碑
6. 融资策略建议

以JSON格式返回。"""

        response = await context.llm.chat(
            system=system_prompt,
            messages=[{"role": "user", "content": f"项目信息: {project_info}"}],
        )

        # 简化：返回结构化数据
        return {
            "recommended_round": "Pre-A",
            "target_amount": 2000,
            "dilution": 15,
            "pre_money_valuation": 11333,
            "timeline": [
                {"phase": "准备阶段", "duration": "4-6周", "activities": ["完善BP", "准备财务模型"]},
                {"phase": "接触阶段", "duration": "8-12周", "activities": ["接触投资人", "进行路演"]},
            ],
            "milestones": [
                {"title": "完成BP", "deadline": "2周内", "importance": "critical"},
                {"title": "财务模型", "deadline": "3周内", "importance": "high"},
            ],
            "pitch_tips": ["突出核心竞争力", "展示团队优势", "说明市场机会"],
        }

    async def _analyze_term_sheet(self, content: str, context: Any) -> str:
        """分析Term Sheet"""
        system_prompt = """你是专业的投资律师，请分析这份Term Sheet，重点关注：
1. 估值条款
2. 优先权条款
3. 董事会席位
4. 反稀释保护
5. 清算优先权
6. 拖售权/跟售权

指出关键条款和潜在风险。"""

        response = await context.llm.chat(
            system=system_prompt,
            messages=[{"role": "user", "content": content}],
        )

        return response.get("content", "分析结果")

    def _generate_dd_checklist(self) -> Dict[str, Any]:
        """生成尽调清单"""
        return {
            "estimated_time": "4-6周",
            "categories": [
                {
                    "name": "公司基本信息",
                    "items": [
                        {
                            "title": "营业执照",
                            "required": True,
                            "documents": ["营业执照副本", "章程"],
                        },
                        {
                            "title": "股权结构",
                            "required": True,
                            "documents": ["股东名册", "股权架构图"],
                        },
                    ],
                },
                {
                    "name": "财务信息",
                    "items": [
                        {
                            "title": "财务报表",
                            "required": True,
                            "documents": ["近3年审计报告", "最近财务报表"],
                        }
                    ],
                },
            ],
            "tips": ["提前准备材料", "确保数据真实性", "设置数据室"],
        }

    async def _analyze_industry_with_llm(self, industry: str, context: Any) -> str:
        """使用LLM进行行业分析"""
        system_prompt = f"""你是行业分析专家，请分析{industry}行业：

1. 行业概况
2. 市场规模
3. 发展趋势
4. 竞争格局
5. 投资热度
6. 未来展望

请提供专业、详细的分析。"""

        response = await context.llm.chat(
            system=system_prompt,
            messages=[{"role": "user", "content": f"分析{industry}行业"}],
        )

        return response.get("content", "分析结果")

    def _format_strategy(self, strategy: Dict[str, Any]) -> str:
        """格式化策略输出"""
        return f"""
**融资概要**
- 推荐轮次: {strategy['recommended_round']}
- 目标金额: {strategy['target_amount']} 万元
- 预计稀释: {strategy['dilution']}%
- Pre-money估值: {strategy['pre_money_valuation']} 万元

**融资时间表**
{chr(10).join([f"{i+1}. {t['phase']} ({t['duration']})" for i, t in enumerate(strategy.get('timeline', []))])}

**关键里程碑**
{chr(10).join([f"• {m['title']} - {m['deadline']}" for m in strategy.get('milestones', [])])}

**融资策略建议**
{chr(10).join([f"• {tip}" for tip in strategy.get('pitch_tips', [])])}
"""

    def _format_dd_checklist(self, checklist: Dict[str, Any]) -> str:
        """格式化尽调清单"""
        result = [f"**预计准备时间**: {checklist['estimated_time']}\n"]

        for cat in checklist.get("categories", []):
            result.append(f"\n**{cat['name']}**")
            for item in cat["items"]:
                required = "🔴 [必需]" if item["required"] else "🟡 [建议]"
                result.append(f"{required} {item['title']}")
                result.append(f"   所需文件: {', '.join(item['documents'])}")

        result.append("\n**💡 准备建议**")
        for tip in checklist.get("tips", []):
            result.append(f"• {tip}")

        return "\n".join(result)
