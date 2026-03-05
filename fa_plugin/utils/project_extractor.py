"""Project information extraction utilities."""

import json
from typing import Dict, Any, Optional


class ProjectExtractor:
    """项目信息提取工具"""

    @staticmethod
    async def extract_from_text(text: str, context: Any) -> Dict[str, Any]:
        """
        从文本中提取项目信息

        Args:
            text: 用户输入文本
            context: FA Context

        Returns:
            项目信息字典
        """
        system_prompt = """你是一个信息提取助手。从用户描述中提取项目信息。

提取以下字段：
- name: 项目名称
- industry: 行业
- stage: 发展阶段 (idea/mvp/early-revenue/growth/mature)
- funding_round: 融资轮次 (angel/pre-a/a/b/c)
- description: 项目描述
- team_size: 团队规模

以JSON格式返回。如果某些字段无法提取，则省略。"""

        try:
            response = await context.llm.chat(
                system=system_prompt,
                messages=[{"role": "user", "content": text}],
            )

            content = response.get("content", "{}")
            return json.loads(content)

        except Exception:
            return {}

    @staticmethod
    def validate_project_info(project_info: Dict[str, Any]) -> bool:
        """
        验证项目信息完整性

        Args:
            project_info: 项目信息

        Returns:
            是否有效
        """
        required_fields = ["name", "industry", "stage", "funding_round", "description"]
        return all(field in project_info for field in required_fields)

    @staticmethod
    def get_missing_fields(project_info: Dict[str, Any]) -> list:
        """
        获取缺失的字段

        Args:
            project_info: 项目信息

        Returns:
            缺失字段列表
        """
        required_fields = ["name", "industry", "stage", "funding_round", "description"]
        return [field for field in required_fields if field not in project_info]
