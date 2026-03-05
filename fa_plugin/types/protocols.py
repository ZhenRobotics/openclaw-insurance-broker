"""Protocol definitions for FA Plugin interfaces."""

from typing import Protocol, Any, Dict, List, Optional
from fa_plugin.types.models import UserIntent


class LLMProvider(Protocol):
    """LLM服务提供者协议"""

    async def chat(
        self,
        system: Optional[str] = None,
        messages: Optional[List[Dict[str, str]]] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs: Any
    ) -> Dict[str, Any]:
        """
        Chat completion

        Returns:
            {"content": str, "usage": {...}}
        """
        ...

    async def embed(self, text: str) -> List[float]:
        """Generate embeddings"""
        ...


class StorageProvider(Protocol):
    """存储服务提供者协议"""

    async def get(self, key: str) -> Any:
        """Get value by key"""
        ...

    async def set(self, key: str, value: Any) -> None:
        """Set value for key"""
        ...

    async def delete(self, key: str) -> None:
        """Delete key"""
        ...

    async def list(self, prefix: str) -> List[str]:
        """List keys with prefix"""
        ...


class ToolsProvider(Protocol):
    """工具服务提供者协议"""

    async def search_web(self, query: str) -> List[Dict[str, str]]:
        """Web search"""
        ...

    async def generate_document(self, template: str, data: Dict[str, Any]) -> bytes:
        """Generate document"""
        ...

    async def analyze_document(self, file: bytes) -> Dict[str, Any]:
        """Analyze document"""
        ...


class FAContext(Protocol):
    """FA Plugin Context协议"""

    @property
    def user_id(self) -> str:
        """User ID"""
        ...

    @property
    def channel_id(self) -> str:
        """Channel ID"""
        ...

    @property
    def channel_type(self) -> str:
        """Channel type"""
        ...

    @property
    def session_id(self) -> str:
        """Session ID"""
        ...

    @property
    def config(self) -> Dict[str, Any]:
        """Configuration"""
        ...

    @property
    def llm(self) -> LLMProvider:
        """LLM provider"""
        ...

    @property
    def storage(self) -> StorageProvider:
        """Storage provider"""
        ...

    @property
    def tools(self) -> ToolsProvider:
        """Tools provider"""
        ...


class Agent(Protocol):
    """Agent基础协议"""

    async def initialize(self, context: FAContext) -> None:
        """Initialize agent"""
        ...

    async def handle(self, intent: UserIntent, context: FAContext) -> Dict[str, Any]:
        """Handle user intent"""
        ...
