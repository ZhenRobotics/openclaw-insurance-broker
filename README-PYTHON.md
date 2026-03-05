# OpenClaw FA Plugin (Python版)

## 📋 项目概述

这是一个为OpenClaw开发的专业投融资顾问(FA) Plugin，使用**Python**实现。提供全方位的一级市场投融资服务。

## ✨ 核心功能

1. **📝 BP生成与优化** - 智能生成商业计划书
2. **💰 财务建模** - 基于Pandas/NumPy的专业财务模型
3. **🎯 投资人匹配** - AI驱动的智能匹配算法
4. **📊 估值分析** - 多种估值方法（可比公司法、DCF等）
5. **🚀 融资策略** - 轮次规划和策略建议
6. **📋 尽调支持** - 材料清单和准备建议
7. **📈 行业分析** - 赛道趋势和竞品分析

## 🏗️ 项目架构

```
fa_plugin/
├── __init__.py               # 包入口
├── plugin.py                 # Plugin主入口（OpenClaw集成点）
├── config.py                 # 配置管理
│
├── agents/                   # Agent模块
│   ├── base.py              # Agent基类
│   ├── bp_agent.py          # BP生成Agent
│   ├── financial_agent.py   # 财务建模Agent
│   ├── investor_agent.py    # 投资人匹配Agent
│   └── strategy_agent.py    # 融资策略Agent
│
├── tools/                    # 工具模块
│   ├── bp_generator.py      # BP生成工具
│   ├── financial_model.py   # 财务模型（使用pandas）
│   ├── valuation.py         # 估值计算
│   └── investor_db.py       # 投资人数据库
│
├── utils/                    # 辅助工具
│   ├── intent_parser.py     # 意图识别
│   ├── investor_matcher.py  # 投资人匹配算法
│   ├── project_extractor.py # 项目信息提取
│   └── formatters.py        # 输出格式化
│
├── adapters/                 # 适配器
│   └── context_adapter.py   # OpenClaw Context适配
│
└── types/                    # 类型定义
    ├── models.py            # Pydantic数据模型
    └── protocols.py         # Protocol定义
```

## 🔧 技术栈

### 核心依赖
- **Python 3.9+** - 基础运行时
- **Pydantic 2.0+** - 数据验证和类型安全
- **Pandas 2.0+** - 数据处理和财务建模
- **NumPy 1.24+** - 数值计算
- **SciPy 1.11+** - 科学计算（估值等）

### 开发工具
- **pytest** - 测试框架
- **black** - 代码格式化
- **ruff** - 代码检查
- **mypy** - 类型检查

## 🚀 快速开始

### 1. 安装依赖

```bash
# 基础安装
pip install -r requirements.txt

# 或使用pip安装（开发模式）
pip install -e .

# 安装开发依赖
pip install -e ".[dev]"
```

### 2. 配置OpenClaw

在OpenClaw配置文件中添加：

```yaml
plugins:
  - name: fa
    enabled: true
    config:
      defaultCurrency: CNY
      defaultLanguage: zh-CN
      investorDatabasePath: ./data/investors.json
      enableWebSearch: true
      financialProjectionYears: 3
```

### 3. 启动OpenClaw

```bash
# OpenClaw会自动加载FA Plugin
openclaw start
```

### 4. 使用示例

在任何连接的消息渠道中：

```
你: 帮我生成一份 SaaS 产品的 BP
FA: 好的，请告诉我您的项目基本信息...

你: 推荐适合 Pre-A 轮的投资机构
FA: 🎯 为您推荐以下投资机构...

你: 帮我做一个三年期的财务模型
FA: 💰 三年期财务模型...
```

## 📊 数据模型

使用Pydantic定义的类型安全数据模型：

- **ProjectInfo** - 项目信息
- **Investor** - 投资机构
- **FinancialProjection** - 财务预测
- **ValuationAnalysis** - 估值分析
- **FundraisingStrategy** - 融资策略

所有模型都带有完整的类型注解和验证。

## 🔌 OpenClaw集成

### Plugin注册

```python
# fa_plugin/plugin.py
async def register_plugin(api):
    plugin = FAPlugin()
    await plugin.initialize(api)

    # 注册Hook
    api.register_hook({
        "name": "fa-message-handler",
        "on": ["message:preprocessed"],
        "handler": plugin.handle_message,
    })
```

### Hook处理流程

1. 接收 `message:preprocessed` 事件
2. 解析用户意图
3. 路由到相应Agent
4. 返回结果给用户

## 💡 为什么选择Python？

### 优势对比

| 特性 | Python | TypeScript |
|------|--------|------------|
| 财务库数量 | 106+ 项目 | 7 项目 |
| 数据处理 | Pandas（强大） | 基础能力 |
| 数值计算 | NumPy/SciPy | 需手动实现 |
| 金融建模 | QuantLib等专业库 | financial.js（基础） |
| 代码量 | ~1500行 | ~2500行 |
| 学习曲线 | 平缓 | 中等 |

### Python在金融领域的优势

- **QuantLib** - 衍生品定价、固定收益分析
- **Pandas** - 财务数据处理
- **NumPy/SciPy** - 矩阵运算、优化算法
- **Matplotlib** - 数据可视化
- **社区支持** - 金融Python社区非常活跃

## 📦 依赖说明

### 核心依赖
```toml
pydantic>=2.0.0      # 数据验证
pandas>=2.0.0        # 数据处理
numpy>=1.24.0        # 数值计算
scipy>=1.11.0        # 科学计算
python-dateutil>=2.8 # 日期处理
aiohttp>=3.9.0       # 异步HTTP
pyyaml>=6.0          # YAML解析
```

### 可选依赖
```toml
matplotlib>=3.7.0    # 可视化
openpyxl>=3.1.0      # Excel导出
```

## 🧪 测试

```bash
# 运行所有测试
pytest

# 带覆盖率
pytest --cov=fa_plugin

# 特定测试
pytest tests/test_agents.py
```

## 🔍 代码质量

```bash
# 格式化代码
black fa_plugin/

# 检查代码
ruff fa_plugin/

# 类型检查
mypy fa_plugin/
```

## 📝 开发指南

### 添加新Agent

1. 在 `fa_plugin/agents/` 创建新文件
2. 继承 `Agent` Protocol
3. 实现 `initialize()` 和 `handle()` 方法
4. 在 `plugin.py` 中注册路由

### 添加新工具

1. 在 `fa_plugin/tools/` 创建新文件
2. 实现工具函数
3. 在Agent中调用

## 🗺️ 路线图

- [x] Phase 1: 基础架构搭建
- [x] Phase 2: 类型定义和配置
- [ ] Phase 3: Agent实现
- [ ] Phase 4: 工具模块实现
- [ ] Phase 5: 测试覆盖
- [ ] Phase 6: 文档完善
- [ ] Phase 7: 性能优化

## 📄 许可证

MIT License

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 💬 支持

- 📝 [提交 Issue](https://github.com/yourusername/openclaw-fa-plugin/issues)
- 💬 Discord: [加入讨论](https://discord.gg/openclaw)
- 📧 Email: support@example.com

---

Made with ❤️ and 🐍 Python for OpenClaw
