# 📦 ClawHub 发布资源

本目录包含发布到 ClawHub.ai 所需的资源文件。

## 📁 目录结构

```
assets/
├── README.md              # 本文件
├── icon.png              # Skill 图标（512x512）
└── screenshots/          # 功能截图目录
    ├── bp-generation.png          # BP 生成截图
    ├── investor-matching.png      # 投资人匹配截图
    └── financial-model.png        # 财务模型截图
```

---

## 🎨 图标要求

### 基本规格
- **尺寸**: 512x512 像素
- **格式**: PNG（推荐透明背景）
- **文件大小**: < 500KB
- **文件名**: `icon.png`

### 设计建议
- **主色调**: #4F46E5（靛蓝色）或金融相关颜色
- **风格**: 简洁、专业、现代
- **元素**: 
  - 💼 公文包（商务）
  - 📊 图表（数据分析）
  - 💰 金钱（融资）
  - 🎯 靶心（精准匹配）

### 设计工具
- **在线工具**: Canva、Figma（免费）
- **专业工具**: Adobe Illustrator、Photoshop
- **简单方案**: 使用 Emoji（💼）生成 PNG

### 快速生成图标（使用 Emoji）

**macOS/Linux:**
```bash
# 需要安装 ImageMagick
brew install imagemagick  # macOS
# sudo apt-get install imagemagick  # Linux

# 生成图标
convert -size 512x512 xc:#4F46E5 \
  -font "Apple-Color-Emoji" \
  -pointsize 400 \
  -fill white \
  -gravity center \
  -annotate +0+0 "💼" \
  assets/icon.png
```

**在线生成**:
- https://favicon.io/emoji-favicons/
- https://www.iconfinder.com/
- https://www.flaticon.com/

---

## 📸 截图要求

### 基本规格
- **尺寸**: 至少 1280x720（推荐 1920x1080）
- **格式**: PNG 或 JPG
- **文件大小**: 每张 < 2MB
- **数量**: 3-5 张

### 需要的截图

#### 1. BP 生成截图 (bp-generation.png)

**内容要求**:
- 显示用户输入项目信息的对话
- 显示生成的 BP 大纲
- 显示 BP 内容片段
- 显示优化建议

**示例场景**:
```
用户: "我有一个 SaaS 项目，需要写个 BP"
系统: [引导收集信息...]
系统: [生成 BP 大纲...]
```

#### 2. 投资人匹配截图 (investor-matching.png)

**内容要求**:
- 显示匹配算法工作过程
- 显示推荐的投资机构列表
- 显示匹配度评分（如 92%）
- 显示匹配理由和建议

**示例场景**:
```
用户: "推荐适合 Pre-A 轮的投资机构"
系统: 🎯 为您推荐以下投资机构
      1. 经纬创投 - 匹配度 92% ⭐⭐⭐⭐⭐
      ...
```

#### 3. 财务模型截图 (financial-model.png)

**内容要求**:
- 显示三表数据（损益表、资产负债表、现金流量表）
- 显示关键指标（毛利率、净利率、增长率）
- 显示财务建议
- 可选：图表可视化

**示例场景**:
```
用户: "帮我做一个三年期的财务模型"
系统: 💰 三年期财务模型
      [显示表格数据...]
      [显示关键指标...]
```

### 制作步骤

#### 方法一：实际运行截图（推荐）

1. **部署并运行 skill**
   ```bash
   cd /home/justin/ai-insurance
   bash scripts/setup.sh
   ```

2. **通过消息渠道使用**
   - 在 Telegram/WhatsApp/Slack 等发送测试消息
   - 截取完整的对话流程
   - 确保信息清晰可读

3. **编辑截图**
   - 裁剪到合适大小
   - 脱敏敏感信息（如有）
   - 添加标注说明关键功能
   - 保存为 PNG 格式

#### 方法二：模拟界面（快速方案）

如果暂时无法运行，可以创建模拟截图：

1. 使用截图工具截取现有文档中的示例
2. 从 EXAMPLES.md 中复制对话内容
3. 使用设计工具排版成对话界面

### 截图工具

**截图**:
- macOS: Command + Shift + 4
- Windows: Windows + Shift + S
- Linux: Flameshot / Spectacle

**编辑**:
- 简单编辑: Preview (macOS) / Paint (Windows)
- 专业编辑: Photoshop / GIMP
- 注释工具: Skitch / Snagit / Annotate

**在线工具**:
- https://www.photopea.com/ (类 Photoshop)
- https://www.canva.com/
- https://figma.com/

---

## ✅ 检查清单

在提交到 ClawHub 前，确保：

### 图标
- [ ] icon.png 存在
- [ ] 尺寸为 512x512
- [ ] 文件大小 < 500KB
- [ ] 图像清晰专业
- [ ] 符合品牌调性

### 截图
- [ ] 至少有 3 张截图
- [ ] 每张都展示了关键功能
- [ ] 尺寸符合要求（>= 1280x720）
- [ ] 文件大小合理（< 2MB）
- [ ] 信息已脱敏
- [ ] 清晰可读

---

## 🎯 快速开始

### 最简方案（5 分钟）

如果时间紧迫，可以：

1. **使用 Emoji 作为图标**
   - 在 clawhub.json 中已设置 `"icon": "💼"`
   - ClawHub 会自动生成图标

2. **从文档中提取截图**
   - 打开 EXAMPLES.md
   - 截取对话示例
   - 简单编辑后使用

### 完整方案（30 分钟）

1. **设计专业图标** (10 分钟)
   - 使用 Figma/Canva
   - 参考同类 skill
   - 导出 512x512 PNG

2. **运行并截图** (15 分钟)
   - 部署 skill
   - 测试各功能
   - 截取精彩片段

3. **编辑优化** (5 分钟)
   - 裁剪和调整
   - 添加必要注释
   - 优化文件大小

---

## 📞 需要帮助？

如果在准备资源时遇到问题：

1. **查看示例**: 浏览 EXAMPLES.md 中的使用场景
2. **参考文档**: 阅读 CLAWHUB_PUBLISH.md
3. **社区求助**: 在 Discord 提问
4. **专业服务**: 可以考虑找设计师帮忙

---

## 💡 小技巧

1. **复用现有资源**
   - 如果有演示视频，可以从中截取画面
   - 文档中的示例可以直接可视化

2. **保持一致性**
   - 截图使用相同的主题和配色
   - 字体和排版保持统一

3. **突出重点**
   - 使用箭头或高亮标注关键功能
   - 简短的文字说明

4. **考虑国际化**
   - 如果有英文版，准备英文截图
   - 或在截图中使用图标代替文字

---

**更新日期**: 2026-03-05
**需要帮助？** 查看 [CLAWHUB_PUBLISH.md](../CLAWHUB_PUBLISH.md)
