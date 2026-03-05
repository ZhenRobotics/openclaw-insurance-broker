# ❓ 常见问题解答 (FAQ)

OpenClaw FA Skill 使用过程中的常见问题和解决方案。

---

## 📦 安装和部署

### Q1: 系统要求是什么？

**A:**
- **操作系统**: Linux / macOS / Windows (WSL2)
- **Node.js**: >= 22.0.0
- **包管理器**: pnpm (推荐) 或 npm >= 9.0.0
- **OpenClaw**: >= 2024.0.0
- **内存**: 至少 2GB 可用内存
- **磁盘**: 至少 500MB 可用空间

---

### Q2: 如何检查 Node.js 版本？

**A:**
```bash
node -v
# 应该显示 v22.x.x 或更高

# 如果版本过低，使用 nvm 升级
nvm install 22
nvm use 22
```

---

### Q3: pnpm 和 npm 有什么区别？为什么推荐 pnpm？

**A:**
- **pnpm** 更快、更省磁盘空间、依赖管理更严格
- **npm** 更通用、兼容性更好

两者都可以使用，但 pnpm 在大型项目中表现更好。

安装 pnpm:
```bash
npm install -g pnpm
```

---

### Q4: 安装时遇到权限错误怎么办？

**A:**
```bash
# Linux/macOS 如果遇到权限问题
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.pnpm-store

# 或者使用 sudo（不推荐）
sudo pnpm install
```

---

### Q5: 构建时出现 TypeScript 错误？

**A:**
```bash
# 确保 TypeScript 版本正确
pnpm add -D typescript@5.3.3

# 清理并重新构建
rm -rf dist node_modules
pnpm install
pnpm build
```

---

### Q6: 如何验证安装成功？

**A:**
```bash
# 1. 检查构建输出
ls -la dist/

# 2. 检查 OpenClaw skill 列表
openclaw skill list

# 3. 发送测试消息
# 在已连接的消息渠道发送: "帮我生成一份 BP"

# 4. 查看日志
openclaw logs --follow
```

---

## 🚀 使用问题

### Q7: 如何触发 FA Skill？

**A:**
FA Skill 会自动识别相关意图。只需在任何已连接的消息渠道（WhatsApp、Telegram、Slack 等）发送包含以下关键词的消息：

- BP、商业计划书
- 投资人、VC、融资
- 财务模型、财务预测
- 估值、值多少钱
- 融资策略、怎么融资
- Term Sheet、条款
- 尽调、材料清单
- 行业分析、赛道

示例:
```
"帮我生成一份商业计划书"
"推荐适合 Pre-A 轮的投资机构"
"做个三年期的财务模型"
```

---

### Q8: 生成的 BP 质量不满意怎么办？

**A:**
1. **提供更详细的信息**
   - 具体的业务数据
   - 团队背景
   - 竞品分析
   - 客户案例

2. **多轮优化**
   ```
   "BP 的市场分析部分可以更详细一些"
   "增加竞品对比表格"
   "补充财务预测的假设说明"
   ```

3. **分段生成**
   ```
   "先帮我写执行摘要部分"
   "现在写市场分析部分"
   ```

---

### Q9: 投资人推荐不准确？

**A:**
**可能原因和解决方案**:

1. **信息不够具体**
   ```
   ❌ "推荐投资人"
   ✅ "推荐投企业服务 SaaS、Pre-A 轮、2000 万的投资机构"
   ```

2. **数据库限制**
   - 当前仅包含 8 家机构
   - 可以手动添加更多投资人到 `data/investors.json`

3. **更新数据库**
   ```bash
   # 编辑数据文件
   vim data/investors.json

   # 重启 OpenClaw
   openclaw gateway restart
   ```

---

### Q10: 财务模型的数据从哪里来？

**A:**
财务模型基于：
1. **你提供的历史数据**（如有）
2. **业务假设**（增长率、毛利率等）
3. **行业标准**（如 SaaS 毛利率通常 70-80%）
4. **LLM 智能推断**

**提高准确性**:
```
提供: "当前月收入 10 万，毛利率 75%，
      销售费用占比 35%，研发 20%，管理 15%"
```

---

### Q11: 估值结果可靠吗？

**A:**
估值分析提供**参考区间**，不是精确值。

**3 种方法交叉验证**:
- 可比公司法（最常用）
- VC 估值法（投资人视角）
- DCF 法（现金流折现）

**建议**:
- 将估值作为谈判起点
- 结合市场行情调整
- 咨询专业 FA 或投资人
- 准备好估值依据和数据支撑

---

### Q12: 如何保存生成的文档？

**A:**
**当前版本**:
- 输出为文本格式
- 需要手动复制粘贴到文档工具

**保存方式**:
1. 复制到 Google Docs / Notion / Word
2. 截图保存
3. 转发到邮箱

**未来版本** (v0.2.0):
- [ ] 支持 PDF 导出
- [ ] 支持 Excel 导出
- [ ] 直接发送到邮箱

---

### Q13: 支持英文吗？

**A:**
**当前支持程度**:
- ✅ 中文: 完整支持
- ⚠️ 英文: 部分支持（可以识别英文输入，但输出以中文为主）

**切换语言**:
```yaml
# ~/.openclaw/config.yaml
config:
  defaultLanguage: en-US
```

**未来计划**:
- v0.3.0: 完整英文支持
- v0.4.0: 日语、韩语支持

---

### Q14: 可以自定义 BP 模板吗？

**A:**
**当前版本**: 使用固定的 9 章节模板

**未来版本** (v0.4.0): 支持自定义模板

**临时方案**:
生成后手动调整结构和格式

---

### Q15: 多轮对话的信息会被记住吗？

**A:**
✅ **会的**！FA Skill 支持会话状态管理。

**示例**:
```
第1轮: "我有一个 SaaS 项目"
第2轮: "月收入 10 万"
第3轮: "帮我生成 BP"
→ 系统会综合前面的信息生成 BP
```

**清除历史**:
会话会在一段时间后自动清除，或者你可以明确说"重新开始"。

---

## 🔧 配置问题

### Q16: 如何修改配置？

**A:**
编辑配置文件:
```bash
vim ~/.openclaw/config.yaml
```

修改后重启 Gateway:
```bash
openclaw gateway restart
```

---

### Q17: 如何禁用网络搜索？

**A:**
```yaml
# ~/.openclaw/config.yaml
skills:
  - name: fa
    config:
      enableWebSearch: false
```

禁用后，行业分析等功能将仅使用本地数据。

---

### Q18: 如何更换货币单位？

**A:**
```yaml
# ~/.openclaw/config.yaml
skills:
  - name: fa
    config:
      defaultCurrency: USD  # 或 CNY
```

---

### Q19: 可以在多个 OpenClaw 实例中使用吗？

**A:**
可以。每个实例独立配置:

```bash
# 实例 1
~/.openclaw/config.yaml

# 实例 2（自定义配置路径）
~/.openclaw-instance2/config.yaml
```

---

## 📊 数据问题

### Q20: 如何添加更多投资人？

**A:**
编辑 `data/investors.json`:

```json
{
  "id": "unique-id",
  "name": "投资机构名称",
  "type": "vc",
  "stage_preference": ["pre-a", "a"],
  "industry_preference": ["SaaS", "AI"],
  "region_preference": ["北京", "上海"],
  "check_size": {
    "min": 500,
    "max": 5000,
    "typical": 2000
  },
  "investment_count": 100,
  "notable_investments": ["项目1", "项目2"],
  "investment_thesis": "投资理念"
}
```

添加后重启 Gateway。

---

### Q21: 投资人数据从哪里获取？

**A:**
**当前数据来源**:
- 公开信息整理
- 投资机构官网
- IT 桔子、36氪等平台

**建议补充渠道**:
- 投资机构年度报告
- FA 行业报告
- 亲身接触的投资人

---

### Q22: 可以导入 Excel 格式的投资人数据吗？

**A:**
**当前版本**: 仅支持 JSON 格式

**未来版本** (v0.3.0): 支持 CSV/Excel 导入

**临时方案**:
使用在线工具转换 Excel → JSON:
- https://www.convertcsv.com/csv-to-json.htm
- https://csvjson.com/csv2json

---

### Q23: 数据存储在哪里？安全吗？

**A:**
**数据位置**:
- 投资人数据: `data/investors.json`
- 对话历史: `~/.openclaw/storage/fa-*`
- 用户配置: `~/.openclaw/config.yaml`

**安全性**:
- ✅ 所有数据存储在本地
- ✅ 不上传到外部服务器
- ✅ 遵循 OpenClaw 安全策略
- ✅ 可随时删除数据

---

## 🐛 故障排查

### Q24: Skill 没有响应？

**A:**
**诊断步骤**:

1. **检查 skill 是否启用**
   ```bash
   openclaw skill list
   # 应该看到 fa skill 的状态为 enabled
   ```

2. **检查日志**
   ```bash
   openclaw logs --follow
   # 发送测试消息，观察日志输出
   ```

3. **验证配置**
   ```bash
   cat ~/.openclaw/config.yaml | grep -A 10 fa
   ```

4. **重启 Gateway**
   ```bash
   openclaw gateway restart
   ```

---

### Q25: 响应很慢？

**A:**
**可能原因和解决方案**:

1. **网络搜索导致延迟**
   ```yaml
   config:
     enableWebSearch: false
   ```

2. **LLM 模型响应慢**
   - 检查 OpenClaw 使用的模型
   - 考虑升级到更快的模型

3. **系统资源不足**
   ```bash
   # 检查内存使用
   free -h

   # 检查 CPU 使用
   top
   ```

---

### Q26: 出现 "意图识别失败" 错误？

**A:**
**原因**: 用户输入过于模糊

**解决方案**:
```
❌ "帮我"
❌ "分析一下"
✅ "帮我生成商业计划书"
✅ "分析企业服务 SaaS 行业"
```

使用明确的关键词：BP、投资人、财务、估值、融资、尽调、行业等。

---

### Q27: TypeScript 编译错误？

**A:**
```bash
# 清理并重新安装
rm -rf node_modules dist
pnpm install

# 检查 TypeScript 版本
pnpm list typescript
# 应该是 5.3.3

# 重新构建
pnpm build

# 如果还有问题，检查 tsconfig.json
cat tsconfig.json
```

---

### Q28: 如何查看详细的错误日志？

**A:**
```bash
# 实时查看日志
openclaw logs --follow

# 查看最近 100 行
openclaw logs --tail 100

# 保存日志到文件
openclaw logs > fa-skill-logs.txt

# 搜索特定错误
openclaw logs | grep "ERROR"
```

---

## 🔐 安全和隐私

### Q29: 我的数据会被上传到哪里？

**A:**
**不会上传**。所有数据都存储在本地:
- ✅ 对话历史 → 本地
- ✅ 生成的文档 → 本地
- ✅ 投资人数据 → 本地

**LLM 调用**:
- OpenClaw 会调用配置的 LLM（如 Claude）
- 仅发送当前对话内容
- 不存储你的数据

---

### Q30: 如何删除历史数据？

**A:**
```bash
# 删除所有 FA skill 的数据
rm -rf ~/.openclaw/storage/fa-*

# 删除特定会话
rm ~/.openclaw/storage/fa-session-<session-id>

# 重新开始对话
# 在消息渠道发送: "重新开始" 或 "清除历史"
```

---

### Q31: 可以设置数据保留期吗？

**A:**
当前 OpenClaw 的数据保留策略由全局配置控制。

查看和修改:
```yaml
# ~/.openclaw/config.yaml
storage:
  retentionDays: 30  # 保留 30 天
```

---

### Q32: 如何保护敏感信息？

**A:**
**建议**:
1. ❌ 不要输入具体的客户名称、联系方式
2. ✅ 使用代号（如"客户A"、"客户B"）
3. ✅ 财务数据可以按比例缩放
4. ✅ 生成后手动修改敏感部分

---

## 💡 高级使用

### Q33: 可以批量处理多个项目吗？

**A:**
**当前版本**: 一次处理一个项目

**未来版本** (v0.4.0): 支持多项目管理

**临时方案**:
- 为每个项目开启独立对话
- 手动记录和管理

---

### Q34: 可以与团队协作吗？

**A:**
**当前版本**: 单用户使用

**未来计划**:
- v0.4.0: 团队协作功能
- v1.0.0: 完整的多用户支持

**临时方案**:
- 导出结果到共享文档（Google Docs、Notion）
- 使用共享的 OpenClaw 实例

---

### Q35: 可以自定义 prompt 吗？

**A:**
**高级用户**可以修改源代码:

```typescript
// src/agents/bp-agent.ts
private buildExtractionPrompt() {
  return {
    system: `你是一位专业的 FA...
    [修改这里的 prompt]`
  };
}
```

修改后重新构建:
```bash
pnpm build
openclaw gateway restart
```

---

### Q36: 可以接入自己的数据源吗？

**A:**
可以！修改对应的 tool:

```typescript
// src/tools/investor-db.ts
export async function loadInvestors() {
  // 修改为你的数据源
  // 例如: 从 API、数据库、CSV 等加载
}
```

---

### Q37: 如何贡献代码？

**A:**
查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

**流程**:
1. Fork 项目
2. 创建 feature 分支
3. 提交代码
4. 发起 Pull Request

**贡献方向**:
- 添加新功能
- 修复 bug
- 完善文档
- 扩充投资人数据库

---

## 📚 学习资源

### Q38: 哪里可以学习 FA 相关知识？

**A:**
**推荐资源**:
- 📘 书籍: 《风险投资》、《创业融资指南》
- 🎓 课程: Coursera Venture Capital 课程
- 📰 媒体: 36氪、IT桔子、投资界
- 👥 社群: 加入创业者社群、FA 社群

---

### Q39: 如何学习使用 OpenClaw？

**A:**
**官方资源**:
- 📖 [OpenClaw Docs](https://openclaw.com/docs)
- 💬 [Discord 社区](https://discord.gg/openclaw)
- 📺 视频教程（开发中）

---

### Q40: 有案例分享或最佳实践吗？

**A:**
查看 [EXAMPLES.md](./EXAMPLES.md) 获取 6 个详细示例。

**社区案例**（开发中）:
- 真实创业者的使用经验
- FA 从业者的实践分享
- 成功融资的案例

---

## 🚀 功能请求

### Q41: 如何提交功能建议？

**A:**
1. **GitHub Issues**: 提交 Feature Request
2. **Discord**: 在社区讨论
3. **Email**: support@example.com

**当前 Roadmap**: 查看 [CHANGELOG.md](./CHANGELOG.md)

---

### Q42: 什么时候支持 PDF 导出？

**A:**
计划在 **v0.2.0** (Q2 2026) 支持:
- [ ] PDF 格式 BP
- [ ] Excel 格式财务模型
- [ ] 自定义模板

---

### Q43: 会支持移动端吗？

**A:**
**当前**: 通过 WhatsApp、Telegram 等移动应用使用

**未来**:
- v0.4.0: 优化移动端体验
- v1.0.0: 独立移动 App

---

## 📞 获取支持

### Q44: 遇到问题如何获取帮助？

**A:**
**支持渠道**（按优先级）:

1. **查看文档**
   - README.md
   - QUICKSTART.md
   - 本 FAQ

2. **搜索已知问题**
   - GitHub Issues
   - Discord 历史讨论

3. **提交新问题**
   - GitHub Issue（技术问题）
   - Discord（使用问题）
   - Email（商务合作）

---

### Q45: 如何报告 Bug？

**A:**
**GitHub Issues**:
https://github.com/yourusername/openclaw-fa-skill/issues/new

**包含信息**:
- OpenClaw 版本
- FA Skill 版本
- 操作系统
- 复现步骤
- 错误日志
- 截图（如有）

---

**最后更新**: 2026-03-05 | **版本**: v0.1.0

还有问题？欢迎联系我们！💬
