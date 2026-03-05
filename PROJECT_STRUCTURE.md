# 📁 OpenClaw FA Skill 项目结构

完整的项目文件树和说明

## 项目树状图

```
ai-insurance/
│
├── 📄 README.md                      # 项目主文档
├── 📄 QUICKSTART.md                  # 5分钟快速开始指南
├── 📄 PROJECT_SUMMARY.md             # 完整项目总结
├── 📄 PROJECT_COMPLETE.md            # 项目完成报告
├── 📄 DELIVERY.md                    # 交付文档
├── 📄 EXAMPLES.md                    # 6个详细使用示例
├── 📄 QUICK_REFERENCE.md             # 快速参考手册（一页纸）
├── 📄 FAQ.md                         # 常见问题（45个）
├── 📄 CONTRIBUTING.md                # 贡献指南
├── 📄 CHANGELOG.md                   # 版本变更记录
├── 📄 LICENSE                        # MIT开源许可证
│
├── 📦 package.json                   # Node.js项目配置
├── 📦 tsconfig.json                  # TypeScript编译配置
├── 📦 .eslintrc.json                 # ESLint代码检查配置
├── 📦 .prettierrc.json               # Prettier格式化配置
├── 📦 .gitignore                     # Git忽略配置
├── 📦 .npmignore                     # npm发布忽略配置
│
├── 📂 src/                           # 源代码目录
│   ├── 📄 index.ts                   # 主入口文件
│   ├── 📄 types.ts                   # TypeScript类型定义
│   ├── 📄 plugin.ts                  # OpenClaw插件接口
│   ├── 📄 plugin-types.ts            # 插件类型定义
│   │
│   ├── 📂 agents/                    # Agent代理目录
│   │   ├── 📄 bp-agent.ts            # BP生成代理
│   │   ├── 📄 financial-agent.ts     # 财务建模代理
│   │   ├── 📄 investor-match-agent.ts # 投资人匹配代理
│   │   └── 📄 strategy-agent.ts      # 融资策略代理
│   │
│   ├── 📂 tools/                     # 工具函数目录
│   │   ├── 📄 bp-generator.ts        # BP生成工具
│   │   ├── 📄 financial-model.ts     # 财务建模工具
│   │   ├── 📄 investor-db.ts         # 投资人数据库操作
│   │   └── 📄 valuation.ts           # 估值计算工具
│   │
│   ├── 📂 utils/                     # 辅助工具目录
│   │   ├── 📄 intent-parser.ts       # 用户意图识别
│   │   ├── 📄 investor-matcher.ts    # 投资人匹配算法
│   │   └── 📄 project-extractor.ts   # 项目信息提取
│   │
│   └── 📂 adapters/                  # 适配器目录
│       └── 📄 context-adapter.ts     # OpenClaw上下文适配器
│
├── 📂 data/                          # 数据目录
│   ├── 📄 investors.json             # 投资人数据库（8家机构）
│   ├── 📄 investors.example.json     # 数据示例模板
│   └── 📂 templates/                 # 模板目录（待扩展）
│
├── 📂 docs/                          # 文档目录
│   ├── 📄 ARCHITECTURE.md            # 架构设计文档
│   └── 📄 USAGE.md                   # 详细使用指南
│
├── 📂 scripts/                       # 脚本目录
│   └── 📄 setup.sh                   # 自动化部署脚本
│
├── 📂 tests/                         # 测试目录（待开发）
│   └── (预留)
│
└── 📂 dist/                          # 编译输出目录（构建后生成）
    └── (构建后生成)
```

---

## 文件说明

### 📚 文档文件 (12个)

| 文件 | 大小 | 用途 |
|------|------|------|
| **README.md** | ~150行 | 项目概述和快速入门 |
| **QUICKSTART.md** | ~400行 | 5分钟快速部署指南 |
| **PROJECT_SUMMARY.md** | ~600行 | 完整项目总结和架构说明 |
| **PROJECT_COMPLETE.md** | ~400行 | 项目完成报告 |
| **DELIVERY.md** | ~500行 | 交付清单和验收文档 |
| **EXAMPLES.md** | ~800行 | 6个详细使用示例 |
| **QUICK_REFERENCE.md** | ~400行 | 快速参考手册（一页纸） |
| **FAQ.md** | ~700行 | 45个常见问题解答 |
| **CONTRIBUTING.md** | ~200行 | 贡献指南 |
| **CHANGELOG.md** | ~300行 | 版本变更和路线图 |
| **docs/ARCHITECTURE.md** | ~300行 | 架构设计详解 |
| **docs/USAGE.md** | ~250行 | 详细使用说明 |

**总计**: ~5,000行文档

---

### 💻 代码文件 (17个)

#### 主入口 (3个)
| 文件 | 行数 | 说明 |
|------|------|------|
| `src/index.ts` | ~180 | 主入口，路由协调 |
| `src/plugin.ts` | ~100 | OpenClaw插件接口 |
| `src/types.ts` | ~300 | 完整类型定义 |

#### Agents (4个)
| 文件 | 行数 | 功能 |
|------|------|------|
| `src/agents/bp-agent.ts` | ~140 | BP生成 |
| `src/agents/financial-agent.ts` | ~175 | 财务建模 |
| `src/agents/investor-match-agent.ts` | ~195 | 投资人匹配 |
| `src/agents/strategy-agent.ts` | ~300 | 融资策略 |

#### Tools (4个)
| 文件 | 行数 | 功能 |
|------|------|------|
| `src/tools/bp-generator.ts` | ~120 | BP生成工具 |
| `src/tools/financial-model.ts` | ~250 | 财务建模工具 |
| `src/tools/investor-db.ts` | ~150 | 数据库操作 |
| `src/tools/valuation.ts` | ~200 | 估值计算 |

#### Utils (3个)
| 文件 | 行数 | 功能 |
|------|------|------|
| `src/utils/intent-parser.ts` | ~150 | 意图识别 |
| `src/utils/investor-matcher.ts` | ~120 | 匹配算法 |
| `src/utils/project-extractor.ts` | ~80 | 信息提取 |

**总计**: ~2,360行代码

---

### 📊 数据文件 (2个)

| 文件 | 大小 | 内容 |
|------|------|------|
| `data/investors.json` | ~5KB | 8家投资机构详细数据 |
| `data/investors.example.json` | ~1KB | 数据模板示例 |

**投资机构**:
1. 红杉资本中国
2. IDG资本
3. 高瓴资本
4. 经纬创投
5. 五源资本
6. 真格基金
7. 晨兴资本
8. GGV纪源资本

---

### ⚙️ 配置文件 (7个)

| 文件 | 用途 |
|------|------|
| `package.json` | Node.js项目配置、依赖管理 |
| `tsconfig.json` | TypeScript编译配置 |
| `.eslintrc.json` | 代码检查规则 |
| `.prettierrc.json` | 代码格式化规则 |
| `.gitignore` | Git忽略文件配置 |
| `.npmignore` | npm发布忽略配置 |
| `skill.json` | OpenClaw Skill元数据（如已创建） |

---

### 🛠️ 脚本文件 (1个)

| 文件 | 功能 |
|------|------|
| `scripts/setup.sh` | 一键自动化部署脚本 |

---

## 目录用途说明

### `/src` - 源代码
所有TypeScript源代码，分为4个子目录：
- **agents/**: 各功能模块的Agent
- **tools/**: 核心工具函数
- **utils/**: 辅助工具
- **adapters/**: OpenClaw适配器

### `/data` - 数据
投资人数据库和模板

### `/docs` - 详细文档
架构设计和使用指南

### `/scripts` - 脚本
部署和维护脚本

### `/dist` - 编译输出
`pnpm build`后生成，包含可执行的JavaScript代码

### `/tests` - 测试
单元测试和集成测试（Phase 2计划）

---

## 文件依赖关系

```
index.ts (主入口)
    ├─> agents/
    │   ├─> tools/
    │   └─> utils/
    ├─> utils/
    │   └─> types.ts
    └─> types.ts

plugin.ts (OpenClaw接口)
    └─> index.ts

各Agent依赖:
    bp-agent.ts
        ├─> tools/bp-generator.ts
        └─> utils/project-extractor.ts

    financial-agent.ts
        ├─> tools/financial-model.ts
        └─> tools/valuation.ts

    investor-match-agent.ts
        ├─> tools/investor-db.ts
        └─> utils/investor-matcher.ts

    strategy-agent.ts
        └─> (使用LLM生成，无特定tool依赖)
```

---

## 关键路径

### 开发路径
```
1. 修改源代码: src/**/*.ts
2. 构建: pnpm build
3. 输出: dist/**/*.js
4. 测试: 通过OpenClaw运行
```

### 用户请求路径
```
用户消息 
  → OpenClaw 
  → plugin.ts 
  → index.ts (路由) 
  → utils/intent-parser.ts (识别意图)
  → 对应的Agent 
  → tools/ (使用工具)
  → 返回结果
```

### 数据流
```
用户输入
  → 意图识别
  → Agent处理
  → 调用Tools
  → 访问data/investors.json
  → 调用LLM (通过OpenClaw)
  → 生成结果
  → 返回用户
```

---

## 模块大小统计

| 模块 | 文件数 | 代码行数 | 占比 |
|------|--------|----------|------|
| Agents | 4 | ~810 | 34% |
| Tools | 4 | ~720 | 31% |
| Utils | 3 | ~350 | 15% |
| 入口和类型 | 3 | ~480 | 20% |
| **总计** | **14** | **~2,360** | **100%** |

---

## 扩展点

### 添加新Agent
```typescript
// 1. 创建 src/agents/new-agent.ts
export class NewAgent {
  async handle(intent, context) {
    // 实现逻辑
  }
}

// 2. 在 src/index.ts 注册
import { NewAgent } from './agents/new-agent.js';
// ...添加到路由
```

### 添加新Tool
```typescript
// 创建 src/tools/new-tool.ts
export async function newTool(params) {
  // 实现逻辑
}

// 在Agent中使用
import { newTool } from '../tools/new-tool.js';
```

### 扩展投资人数据
```json
// 编辑 data/investors.json
// 添加新的投资机构对象
```

---

## 构建输出

执行 `pnpm build` 后，`dist/` 目录结构：

```
dist/
├── index.js
├── index.d.ts
├── types.js
├── types.d.ts
├── agents/
│   ├── bp-agent.js
│   ├── financial-agent.js
│   ├── investor-match-agent.js
│   └── strategy-agent.js
├── tools/
│   ├── bp-generator.js
│   ├── financial-model.js
│   ├── investor-db.js
│   └── valuation.js
└── utils/
    ├── intent-parser.js
    ├── investor-matcher.js
    └── project-extractor.js
```

---

## 文件权限

| 文件 | 权限 | 说明 |
|------|------|------|
| `scripts/setup.sh` | 755 (rwxr-xr-x) | 可执行 |
| `*.ts` | 644 (rw-r--r--) | 只读 |
| `*.json` | 644 (rw-r--r--) | 只读 |
| `*.md` | 644 (rw-r--r--) | 只读 |

---

## 总计统计

| 类型 | 数量 |
|------|------|
| 📄 总文件数 | 40 |
| 💻 代码文件 | 17 |
| 📚 文档文件 | 12 |
| 📊 数据文件 | 2 |
| ⚙️ 配置文件 | 7 |
| 🛠️ 脚本文件 | 1 |
| 📦 编译输出 | ~17 (构建后) |
| | |
| 📝 代码行数 | ~2,360 |
| 📝 文档行数 | ~5,000 |
| 📝 总行数 | ~7,360 |
| | |
| 💾 项目大小 | ~500 KB (不含node_modules) |
| 💾 数据大小 | ~6 KB |

---

**更新日期**: 2026-03-05
**版本**: v0.1.0

---

使用 `tree` 命令查看实际目录结构:
```bash
tree -I 'node_modules|dist' -L 3
```
