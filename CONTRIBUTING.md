# 贡献指南

感谢你考虑为 OpenClaw FA Skill 做贡献！

## 如何贡献

### 报告 Bug

如果你发现了 bug，请在 GitHub Issues 中创建一个新 issue，包含：

1. **清晰的标题**: 简要描述问题
2. **重现步骤**: 详细说明如何重现
3. **预期行为**: 你期望发生什么
4. **实际行为**: 实际发生了什么
5. **环境信息**:
   - OpenClaw 版本
   - Node.js 版本
   - 操作系统

### 提交功能请求

我们欢迎新功能建议！创建 issue 时请说明：

1. **功能描述**: 你想要什么功能
2. **使用场景**: 这个功能解决什么问题
3. **实现建议**: （可选）你认为应该如何实现

### 贡献代码

#### 1. Fork 和 Clone

```bash
# Fork 项目到你的 GitHub 账号
# 然后 clone 到本地
git clone https://github.com/your-username/openclaw-fa-skill.git
cd openclaw-fa-skill
```

#### 2. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

#### 3. 设置开发环境

```bash
pnpm install
pnpm build
```

#### 4. 进行更改

- 遵循现有代码风格
- 添加必要的注释
- 更新相关文档

#### 5. 测试

```bash
pnpm test
pnpm lint
```

#### 6. 提交更改

```bash
git add .
git commit -m "feat: add new feature"
# 或
git commit -m "fix: resolve issue with X"
```

提交信息格式请遵循 [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

#### 7. Push 和创建 Pull Request

```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

### Pull Request 指南

**好的 PR 应该**:

1. **单一职责**: 一个 PR 只做一件事
2. **清晰描述**: 说明改动的内容和原因
3. **测试覆盖**: 添加或更新相关测试
4. **文档更新**: 如需要，更新 README 或其他文档
5. **代码风格**: 通过 lint 检查

**PR 描述模板**:

```markdown
## 改动类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 性能优化
- [ ] 其他

## 改动说明
简要描述这个 PR 做了什么改动

## 相关 Issue
Closes #issue_number

## 测试
描述你如何测试这些改动

## 检查清单
- [ ] 代码遵循项目风格指南
- [ ] 已添加/更新测试
- [ ] 所有测试通过
- [ ] 已更新相关文档
- [ ] 提交信息遵循规范
```

## 代码风格

### TypeScript

- 使用 TypeScript 严格模式
- 优先使用 `const`，需要时才用 `let`
- 使用有意义的变量和函数名
- 复杂逻辑添加注释

```typescript
// ✅ 好的例子
const calculateMatchScore = (project: ProjectInfo, investor: Investor): number => {
  // 计算阶段匹配得分
  const stageScore = investor.stage_preference.includes(project.fundingRound) ? 0.3 : 0;

  // 计算行业匹配得分
  const industryScore = calculateIndustryMatch(project.industry, investor.industry_preference);

  return stageScore + industryScore;
};

// ❌ 不好的例子
const calc = (p: any, i: any) => {
  const s = i.sp.includes(p.fr) ? 0.3 : 0;
  return s + calcIM(p.i, i.ip);
};
```

### 文件组织

```
src/
├── agents/          # Agent 实现
│   ├── bp-agent.ts
│   └── ...
├── tools/           # 工具函数
│   ├── bp-generator.ts
│   └── ...
├── utils/           # 通用工具
│   ├── intent-parser.ts
│   └── ...
├── types.ts         # 类型定义
└── index.ts         # 主入口
```

### 命名约定

- **文件名**: kebab-case (`bp-agent.ts`)
- **类名**: PascalCase (`BPAgent`)
- **函数/变量**: camelCase (`generateBP`)
- **常量**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG`)
- **类型/接口**: PascalCase (`ProjectInfo`, `SkillContext`)

## 添加新功能

### 1. 新增 Agent

```typescript
// 1. 在 src/agents/ 创建新文件
// src/agents/new-agent.ts

import type { SkillContext, SkillResponse, UserIntent } from '../types.js';

export class NewAgent {
  async initialize(context: SkillContext): Promise<void> {
    console.log('[New Agent] 初始化完成');
  }

  async handle(intent: UserIntent, context: SkillContext): Promise<SkillResponse> {
    // 实现逻辑
    return {
      type: 'text',
      content: '结果',
    };
  }
}

// 2. 在 src/index.ts 中注册
import { NewAgent } from './agents/new-agent.js';

// 在构造函数中初始化
this.newAgent = new NewAgent();

// 在 activate 中初始化
await this.newAgent.initialize(context);

// 在 handleMessage 中添加路由
case 'new_intent':
  return await this.newAgent.handle(intent, context);
```

### 2. 新增工具函数

```typescript
// src/tools/new-tool.ts

import type { SkillContext } from '../types.js';

/**
 * 工具函数说明
 */
export async function newTool(
  input: any,
  context: SkillContext
): Promise<any> {
  // 实现逻辑
  return result;
}

// 在需要的地方导入使用
import { newTool } from '../tools/new-tool.js';
```

### 3. 扩展类型定义

```typescript
// src/types.ts

// 添加新的意图类型
export type IntentType =
  | 'generate_bp'
  | 'new_intent'  // 新增
  | ...;

// 添加新的数据类型
export interface NewDataType {
  field1: string;
  field2: number;
}
```

## 测试

### 单元测试

```typescript
// tests/unit/bp-agent.test.ts

import { describe, it, expect } from 'vitest';
import { BPAgent } from '../../src/agents/bp-agent';

describe('BPAgent', () => {
  it('should generate BP content', async () => {
    const agent = new BPAgent();
    const result = await agent.handle(mockIntent, mockContext);
    expect(result.type).toBe('text');
  });
});
```

### 集成测试

```typescript
// tests/integration/fa-skill.test.ts

import { FASkill } from '../../src/index';

describe('FA Skill Integration', () => {
  it('should handle full BP generation workflow', async () => {
    const skill = new FASkill();
    await skill.activate(mockContext);
    const result = await skill.handleMessage('生成BP', mockContext);
    expect(result).toBeDefined();
  });
});
```

## 文档

### 代码注释

- 所有公共 API 必须有 JSDoc 注释
- 复杂逻辑添加行内注释
- 类型定义添加说明注释

```typescript
/**
 * 生成商业计划书内容
 *
 * @param project - 项目信息
 * @param context - Skill 上下文
 * @returns BP 内容对象
 *
 * @example
 * ```typescript
 * const bp = await generateBPContent(projectInfo, context);
 * console.log(bp.executive_summary);
 * ```
 */
export async function generateBPContent(
  project: ProjectInfo,
  context: SkillContext
): Promise<any> {
  // ...
}
```

### 更新文档

如果你的改动影响了用户使用方式，请更新：

- `README.md` - 主文档
- `docs/USAGE.md` - 使用指南
- `docs/ARCHITECTURE.md` - 架构说明（如有架构变更）

## 开发工作流

### 日常开发

```bash
# 监听文件变化，自动编译
pnpm dev

# 在另一个终端运行测试
pnpm test --watch
```

### 代码检查

```bash
# 运行 linter
pnpm lint

# 自动修复
pnpm lint --fix

# 格式化代码
pnpm format
```

### 构建

```bash
# 生产构建
pnpm build

# 清理构建产物
rm -rf dist
```

## 发布流程

（仅维护者）

1. 更新版本号（`package.json`, `skill.json`）
2. 更新 CHANGELOG.md
3. 提交更改：`git commit -m "chore: release v0.2.0"`
4. 创建 tag：`git tag v0.2.0`
5. 推送：`git push origin main --tags`
6. 发布到 npm：`npm publish`

## 社区

- **Discord**: [加入我们的 Discord](https://discord.gg/openclaw)
- **GitHub Discussions**: 提问和讨论
- **Twitter**: [@OpenClaw](https://twitter.com/openclaw)

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

## 感谢

感谢所有贡献者让这个项目变得更好！ 🎉
