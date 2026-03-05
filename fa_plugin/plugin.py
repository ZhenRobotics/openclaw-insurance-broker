"""
FA Plugin - OpenClaw Plugin主入口
集成到OpenClaw的Plugin系统
"""

import logging
from typing import Any, Dict, Optional

from fa_plugin.config import FAConfig
from fa_plugin.adapters.context_adapter import FAContextAdapter
from fa_plugin.utils.intent_parser import IntentParser
from fa_plugin.agents.bp_agent import BPAgent
from fa_plugin.agents.financial_agent import FinancialAgent
from fa_plugin.agents.investor_agent import InvestorMatchAgent
from fa_plugin.agents.strategy_agent import StrategyAgent
from fa_plugin.types.models import IntentType

logger = logging.getLogger(__name__)


class FAPlugin:
    """FA Plugin主类"""

    def __init__(self):
        """初始化Plugin"""
        self.config: Optional[FAConfig] = None
        self.intent_parser: Optional[IntentParser] = None

        # Agents（延迟初始化）
        self.bp_agent: Optional[BPAgent] = None
        self.financial_agent: Optional[FinancialAgent] = None
        self.investor_agent: Optional[InvestorMatchAgent] = None
        self.strategy_agent: Optional[StrategyAgent] = None

        self._initialized = False
        self._agents_initialized = {}

    async def initialize(self, api: Any) -> None:
        """
        Plugin初始化

        Args:
            api: OpenClaw Plugin API
        """
        logger.info("[FA Plugin] 正在初始化...")

        # 获取配置
        openclaw_config = api.get_config() if hasattr(api, "get_config") else {}
        self.config = FAConfig.from_dict(openclaw_config)

        # 初始化意图解析器
        self.intent_parser = IntentParser(self.config)

        # 创建Agent实例（延迟初始化）
        self.bp_agent = BPAgent()
        self.financial_agent = FinancialAgent()
        self.investor_agent = InvestorMatchAgent()
        self.strategy_agent = StrategyAgent()

        self._initialized = True
        logger.info("[FA Plugin] 初始化完成")

    async def _ensure_agent_initialized(
        self, agent: Any, agent_name: str, context: FAContextAdapter
    ) -> None:
        """确保Agent已初始化（延迟初始化）"""
        if agent_name in self._agents_initialized:
            return

        if hasattr(agent, "initialize"):
            await agent.initialize(context)
            self._agents_initialized[agent_name] = True
            logger.debug(f"[FA Plugin] {agent_name} 已初始化")

    async def handle_message(self, event: Dict[str, Any]) -> None:
        """
        处理消息Hook

        Args:
            event: Hook事件
        """
        try:
            # 检查事件类型
            if event.get("type") != "message:preprocessed":
                return

            message = event.get("message", {})
            text = message.get("text", "")
            if not text:
                return

            # 创建FA Context
            openclaw_context = event.get("context", {})
            fa_context = FAContextAdapter(openclaw_context, self.config)

            # 解析用户意图
            intent = await self.intent_parser.parse(text, fa_context)

            # 如果不是FA相关意图或置信度太低，跳过
            if intent.type == IntentType.UNKNOWN or intent.confidence < 0.6:
                logger.debug(f"[FA Plugin] 跳过处理: {intent.type}, 置信度: {intent.confidence}")
                return

            logger.info(f"[FA Plugin] 检测到意图: {intent.type}, 置信度: {intent.confidence}")

            # 路由到相应的Agent
            response = await self._route_to_agent(intent, fa_context)

            # 发送响应
            if response and response.get("content"):
                messages = event.get("messages", [])
                messages.append(str(response["content"]))

                # 标记消息已处理（如果OpenClaw支持）
                if "stopPropagation" in event:
                    event["stopPropagation"] = True

        except Exception as e:
            logger.error(f"[FA Plugin] 处理消息时出错: {e}", exc_info=True)

    async def _route_to_agent(
        self, intent: Any, context: FAContextAdapter
    ) -> Optional[Dict[str, Any]]:
        """
        将意图路由到相应的Agent

        Args:
            intent: 用户意图
            context: FA Context

        Returns:
            Agent响应
        """
        try:
            intent_type = intent.type

            if intent_type == IntentType.GENERATE_BP:
                await self._ensure_agent_initialized(self.bp_agent, "BPAgent", context)
                return await self.bp_agent.handle(intent, context)

            elif intent_type == IntentType.BUILD_FINANCIAL_MODEL:
                await self._ensure_agent_initialized(
                    self.financial_agent, "FinancialAgent", context
                )
                return await self.financial_agent.build_model(intent, context)

            elif intent_type == IntentType.ANALYZE_VALUATION:
                await self._ensure_agent_initialized(
                    self.financial_agent, "FinancialAgent", context
                )
                return await self.financial_agent.analyze_valuation(intent, context)

            elif intent_type == IntentType.MATCH_INVESTORS:
                await self._ensure_agent_initialized(
                    self.investor_agent, "InvestorMatchAgent", context
                )
                return await self.investor_agent.match_investors(intent, context)

            elif intent_type == IntentType.ANALYZE_INVESTOR:
                await self._ensure_agent_initialized(
                    self.investor_agent, "InvestorMatchAgent", context
                )
                return await self.investor_agent.analyze_investor(intent, context)

            elif intent_type == IntentType.FUNDRAISING_STRATEGY:
                await self._ensure_agent_initialized(
                    self.strategy_agent, "StrategyAgent", context
                )
                return await self.strategy_agent.create_strategy(intent, context)

            elif intent_type == IntentType.TERM_SHEET_REVIEW:
                await self._ensure_agent_initialized(
                    self.strategy_agent, "StrategyAgent", context
                )
                return await self.strategy_agent.review_term_sheet(intent, context)

            elif intent_type == IntentType.DUE_DILIGENCE_PREP:
                await self._ensure_agent_initialized(
                    self.strategy_agent, "StrategyAgent", context
                )
                return await self.strategy_agent.prepare_due_diligence(intent, context)

            elif intent_type == IntentType.INDUSTRY_ANALYSIS:
                await self._ensure_agent_initialized(
                    self.strategy_agent, "StrategyAgent", context
                )
                return await self.strategy_agent.analyze_industry(intent, context)

            elif intent_type == IntentType.GENERAL_CONSULTATION:
                return await self._handle_general_consultation(text, context)

            else:
                logger.warning(f"[FA Plugin] 未知意图类型: {intent_type}")
                return None

        except Exception as e:
            logger.error(f"[FA Plugin] 路由Agent时出错: {e}", exc_info=True)
            return {
                "type": "error",
                "content": f"处理您的请求时出错: {str(e)}",
            }

    async def _handle_general_consultation(
        self, text: str, context: FAContextAdapter
    ) -> Dict[str, Any]:
        """处理通用咨询"""
        system_prompt = """你是一位经验丰富的投融资顾问（FA），专注于一级市场。

你的职责包括：
- 帮助创业者准备融资材料
- 匹配合适的投资机构
- 提供融资策略建议
- 解答融资相关问题

请以专业、友好的方式回答用户的问题。"""

        response = await context.llm.chat(
            system=system_prompt,
            messages=[{"role": "user", "content": text}],
        )

        return {
            "type": "text",
            "content": response.get("content", "抱歉，无法生成回复"),
        }


# OpenClaw Plugin导出函数
async def register_plugin(api: Any) -> None:
    """
    OpenClaw Plugin注册函数

    这是OpenClaw调用的入口点

    Args:
        api: OpenClaw Plugin API
    """
    logger.info("[FA Plugin] 正在注册...")

    # 创建Plugin实例
    plugin = FAPlugin()
    await plugin.initialize(api)

    # 注册FA Service
    if hasattr(api, "register_service"):
        api.register_service({
            "id": "fa",
            "display_name": "FA - 投融资顾问",
            "start": lambda: logger.info("[FA Service] 启动"),
            "stop": lambda: logger.info("[FA Service] 停止"),
        })

    # 注册消息处理Hook
    if hasattr(api, "register_hook"):
        api.register_hook({
            "name": "fa-message-handler",
            "on": ["message:preprocessed"],
            "handler": plugin.handle_message,
        })

    logger.info("[FA Plugin] 注册完成")


# 默认导出（用于 `from fa_plugin.plugin import default`）
default = register_plugin
