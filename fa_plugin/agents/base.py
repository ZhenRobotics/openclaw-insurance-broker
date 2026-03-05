"""Base Agent class."""

from abc import ABC, abstractmethod
from typing import Any, Dict
import logging

from fa_plugin.types.models import UserIntent

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """Agent基类"""

    def __init__(self):
        """初始化Agent"""
        self.initialized = False
        self.logger = logger

    @abstractmethod
    async def initialize(self, context: Any) -> None:
        """
        初始化Agent

        Args:
            context: FA Context
        """
        pass

    @abstractmethod
    async def handle(self, intent: UserIntent, context: Any) -> Dict[str, Any]:
        """
        处理用户意图

        Args:
            intent: 用户意图
            context: FA Context

        Returns:
            响应字典
        """
        pass

    def _format_response(self, content: str, **metadata: Any) -> Dict[str, Any]:
        """
        格式化响应

        Args:
            content: 响应内容
            **metadata: 元数据

        Returns:
            格式化的响应字典
        """
        return {
            "type": "text",
            "content": content,
            "metadata": metadata,
        }

    def _format_error(self, error: Exception) -> Dict[str, Any]:
        """
        格式化错误响应

        Args:
            error: 异常对象

        Returns:
            错误响应字典
        """
        self.logger.error(f"Agent error: {error}", exc_info=True)
        return {
            "type": "error",
            "content": f"处理您的请求时出错: {str(error)}",
        }
