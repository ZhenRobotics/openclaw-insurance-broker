"""Configuration management for FA Plugin."""

from typing import Dict, Any, Optional
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class FAConfig:
    """FA Plugin配置"""

    # 基础配置
    default_currency: str = "CNY"
    default_language: str = "zh-CN"

    # 数据路径
    investor_database_path: str = "./data/investors.json"
    templates_path: str = "./data/templates"

    # 功能开关
    enable_web_search: bool = True
    enable_document_generation: bool = False

    # LLM配置
    llm_temperature: float = 0.7
    llm_max_tokens: int = 2000

    # 投资人匹配配置
    match_min_score: float = 0.5
    match_max_results: int = 10

    # 财务模型配置
    financial_projection_years: int = 3
    financial_projection_unit: str = "year"  # year or month

    # 其他配置
    custom: Dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, config_dict: Optional[Dict[str, Any]] = None) -> "FAConfig":
        """从字典创建配置"""
        if not config_dict:
            return cls()

        # 提取FA相关配置
        fa_config = config_dict.get("fa", {})

        return cls(
            default_currency=fa_config.get("defaultCurrency", "CNY"),
            default_language=fa_config.get("defaultLanguage", "zh-CN"),
            investor_database_path=fa_config.get(
                "investorDatabasePath", "./data/investors.json"
            ),
            templates_path=fa_config.get("templatesPath", "./data/templates"),
            enable_web_search=fa_config.get("enableWebSearch", True),
            enable_document_generation=fa_config.get("enableDocumentGeneration", False),
            llm_temperature=fa_config.get("llmTemperature", 0.7),
            llm_max_tokens=fa_config.get("llmMaxTokens", 2000),
            match_min_score=fa_config.get("matchMinScore", 0.5),
            match_max_results=fa_config.get("matchMaxResults", 10),
            financial_projection_years=fa_config.get("financialProjectionYears", 3),
            financial_projection_unit=fa_config.get("financialProjectionUnit", "year"),
            custom=fa_config.get("custom", {}),
        )

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            "defaultCurrency": self.default_currency,
            "defaultLanguage": self.default_language,
            "investorDatabasePath": self.investor_database_path,
            "templatesPath": self.templates_path,
            "enableWebSearch": self.enable_web_search,
            "enableDocumentGeneration": self.enable_document_generation,
            "llmTemperature": self.llm_temperature,
            "llmMaxTokens": self.llm_max_tokens,
            "matchMinScore": self.match_min_score,
            "matchMaxResults": self.match_max_results,
            "financialProjectionYears": self.financial_projection_years,
            "financialProjectionUnit": self.financial_projection_unit,
            "custom": self.custom,
        }

    def get_data_path(self, filename: str) -> Path:
        """获取数据文件路径"""
        return Path(self.investor_database_path).parent / filename

    def get_template_path(self, template_name: str) -> Path:
        """获取模板路径"""
        return Path(self.templates_path) / template_name
