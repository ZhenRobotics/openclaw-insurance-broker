# 📦 安装指南

## 环境要求

- **Python**: 3.9 或更高版本
- **pip**: 最新版本
- **OpenClaw**: 2026.0.0 或更高版本

## 安装步骤

### 1. 克隆项目

```bash
git clone <this-repo>
cd openclaw-fa-plugin
```

### 2. 创建虚拟环境（推荐）

```bash
# 使用 venv
python -m venv venv

# 激活虚拟环境
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### 3. 安装依赖

```bash
# 基础安装
pip install -r requirements.txt

# 或者使用 pip 安装（开发模式）
pip install -e .

# 安装开发依赖
pip install -e ".[dev]"
```

### 4. 准备数据

```bash
# 复制投资人数据示例
cp data/investors.example.json data/investors.json

# 编辑并添加你的投资人数据
vim data/investors.json
```

### 5. 配置OpenClaw

编辑OpenClaw配置文件（通常在 `~/.openclaw/config.yaml`）:

```yaml
plugins:
  - name: fa
    enabled: true
    path: /path/to/openclaw-fa-plugin
    config:
      defaultCurrency: CNY
      defaultLanguage: zh-CN
      investorDatabasePath: ./data/investors.json
      enableWebSearch: true
      financialProjectionYears: 3
      llmTemperature: 0.7
      llmMaxTokens: 2000
      matchMinScore: 0.5
      matchMaxResults: 10
```

### 6. 验证安装

```bash
# 检查Python版本
python --version

# 验证依赖安装
pip list | grep -E "(pydantic|pandas|numpy)"

# 运行测试（如果有）
pytest tests/
```

## 常见问题

### Q1: 安装依赖时出现编译错误

**A:** 某些包（如numpy, pandas）需要编译。确保安装了编译工具：

```bash
# Ubuntu/Debian
sudo apt-get install python3-dev build-essential

# macOS
xcode-select --install

# Windows
# 安装 Microsoft Visual C++ Build Tools
```

### Q2: OpenClaw无法加载Plugin

**A:** 检查以下几点：
1. Plugin路径配置正确
2. Python虚拟环境激活
3. 依赖完整安装
4. 查看OpenClaw日志

```bash
# 查看OpenClaw日志
openclaw logs --follow
```

### Q3: 投资人数据库加载失败

**A:** 确保：
1. `data/investors.json` 文件存在
2. JSON格式正确
3. 文件路径在配置中正确

```bash
# 验证JSON格式
python -m json.tool data/investors.json
```

## 开发模式

如果你要修改代码：

```bash
# 安装开发依赖
pip install -e ".[dev]"

# 运行代码格式化
black fa_plugin/

# 运行代码检查
ruff fa_plugin/

# 运行类型检查
mypy fa_plugin/

# 运行测试
pytest
```

## 卸载

```bash
# 停用虚拟环境
deactivate

# 删除虚拟环境
rm -rf venv/

# 从OpenClaw配置中移除Plugin配置
```

## 下一步

安装完成后，查看：
- [README-PYTHON.md](./README-PYTHON.md) - 项目概述
- [使用指南](./docs/USAGE.md) - 详细使用说明
- [架构文档](./docs/ARCHITECTURE.md) - 技术架构

## 技术支持

遇到问题？
- 📝 [提交 Issue](https://github.com/yourusername/openclaw-fa-plugin/issues)
- 💬 [Discord社区](https://discord.gg/openclaw)
- 📧 Email: support@example.com
