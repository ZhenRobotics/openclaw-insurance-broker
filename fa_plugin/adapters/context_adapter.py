"""Context adapter to convert OpenClaw context to FA context."""

from typing import Dict, Any, List, Optional
import logging

from fa_plugin.config import FAConfig

logger = logging.getLogger(__name__)


class FAContextAdapter:
    """FA Context适配器 - 将OpenClaw Context转换为FA特定格式"""

    def __init__(self, openclaw_context: Any, fa_config: FAConfig):
        """
        初始化适配器

        Args:
            openclaw_context: OpenClaw原始context
            fa_config: FA配置
        """
        self._openclaw_context = openclaw_context
        self._fa_config = fa_config

    @property
    def user_id(self) -> str:
        """用户ID"""
        return getattr(self._openclaw_context, "user_id", "unknown")

    @property
    def channel_id(self) -> str:
        """频道ID"""
        return getattr(self._openclaw_context, "channel_id", "unknown")

    @property
    def channel_type(self) -> str:
        """频道类型"""
        return getattr(self._openclaw_context, "channel_type", "unknown")

    @property
    def session_id(self) -> str:
        """会话ID"""
        return getattr(self._openclaw_context, "session_id", "unknown")

    @property
    def config(self) -> FAConfig:
        """FA配置"""
        return self._fa_config

    @property
    def llm(self) -> "LLMProviderAdapter":
        """LLM Provider"""
        openclaw_llm = getattr(self._openclaw_context, "llm", None)
        return LLMProviderAdapter(openclaw_llm, self._fa_config)

    @property
    def storage(self) -> "StorageProviderAdapter":
        """Storage Provider"""
        openclaw_storage = getattr(self._openclaw_context, "storage", None)
        return StorageProviderAdapter(openclaw_storage)

    @property
    def tools(self) -> "ToolsProviderAdapter":
        """Tools Provider"""
        openclaw_tools = getattr(self._openclaw_context, "tools", None)
        return ToolsProviderAdapter(openclaw_tools, self._fa_config)


class LLMProviderAdapter:
    """LLM Provider适配器"""

    def __init__(self, openclaw_llm: Any, config: FAConfig):
        self._openclaw_llm = openclaw_llm
        self._config = config

    async def chat(
        self,
        system: Optional[str] = None,
        messages: Optional[List[Dict[str, str]]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        **kwargs: Any
    ) -> Dict[str, Any]:
        """Chat completion"""
        if not self._openclaw_llm:
            logger.warning("LLM provider not available")
            return {"content": "LLM服务暂不可用", "usage": {}}

        try:
            params = {
                "temperature": temperature or self._config.llm_temperature,
                "max_tokens": max_tokens or self._config.llm_max_tokens,
                **kwargs,
            }

            if system:
                params["system"] = system

            if messages:
                params["messages"] = messages

            response = await self._openclaw_llm.chat(**params)
            return response

        except Exception as e:
            logger.error(f"LLM chat error: {e}")
            return {"content": f"LLM调用出错: {str(e)}", "usage": {}}

    async def embed(self, text: str) -> List[float]:
        """Generate embeddings"""
        if not self._openclaw_llm or not hasattr(self._openclaw_llm, "embed"):
            logger.warning("Embedding not supported")
            return []

        try:
            return await self._openclaw_llm.embed(text)
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            return []


class StorageProviderAdapter:
    """Storage Provider适配器"""

    def __init__(self, openclaw_storage: Any):
        self._openclaw_storage = openclaw_storage

    async def get(self, key: str) -> Any:
        """Get value"""
        if not self._openclaw_storage:
            return None

        try:
            return await self._openclaw_storage.get(f"fa:{key}")
        except Exception as e:
            logger.error(f"Storage get error: {e}")
            return None

    async def set(self, key: str, value: Any) -> None:
        """Set value"""
        if not self._openclaw_storage:
            logger.warning("Storage not available")
            return

        try:
            await self._openclaw_storage.set(f"fa:{key}", value)
        except Exception as e:
            logger.error(f"Storage set error: {e}")

    async def delete(self, key: str) -> None:
        """Delete key"""
        if not self._openclaw_storage:
            return

        try:
            await self._openclaw_storage.delete(f"fa:{key}")
        except Exception as e:
            logger.error(f"Storage delete error: {e}")

    async def list(self, prefix: str) -> List[str]:
        """List keys"""
        if not self._openclaw_storage or not hasattr(self._openclaw_storage, "list"):
            return []

        try:
            keys = await self._openclaw_storage.list(f"fa:{prefix}")
            # 移除前缀
            return [k.replace("fa:", "", 1) for k in keys]
        except Exception as e:
            logger.error(f"Storage list error: {e}")
            return []


class ToolsProviderAdapter:
    """Tools Provider适配器"""

    def __init__(self, openclaw_tools: Any, config: FAConfig):
        self._openclaw_tools = openclaw_tools
        self._config = config

    async def search_web(self, query: str) -> List[Dict[str, str]]:
        """Web search"""
        if not self._config.enable_web_search:
            logger.info("Web search disabled")
            return []

        if not self._openclaw_tools or not hasattr(self._openclaw_tools, "search_web"):
            logger.warning("Web search not available")
            return []

        try:
            return await self._openclaw_tools.search_web(query)
        except Exception as e:
            logger.error(f"Web search error: {e}")
            return []

    async def generate_document(self, template: str, data: Dict[str, Any]) -> bytes:
        """Generate document"""
        if not self._config.enable_document_generation:
            logger.info("Document generation disabled")
            return b""

        if not self._openclaw_tools or not hasattr(
            self._openclaw_tools, "generate_document"
        ):
            logger.warning("Document generation not available")
            return b""

        try:
            return await self._openclaw_tools.generate_document(template, data)
        except Exception as e:
            logger.error(f"Document generation error: {e}")
            return b""

    async def analyze_document(self, file: bytes) -> Dict[str, Any]:
        """Analyze document"""
        if not self._openclaw_tools or not hasattr(self._openclaw_tools, "analyze_document"):
            logger.warning("Document analysis not available")
            return {}

        try:
            return await self._openclaw_tools.analyze_document(file)
        except Exception as e:
            logger.error(f"Document analysis error: {e}")
            return {}
