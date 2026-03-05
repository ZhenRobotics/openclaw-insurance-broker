# 🔄 产品数据动态更新系统 - 详细设计文档

## 目录
- [系统概述](#系统概述)
- [爬虫架构](#爬虫架构)
- [数据源设计](#数据源设计)
- [版本控制系统](#版本控制系统)
- [变更检测与通知](#变更检测与通知)
- [实现方案](#实现方案)

---

## 系统概述

### 为什么需要动态更新？

静态 JSON 文件的问题：

| 问题 | 影响 | 后果 |
|------|------|------|
| **产品停售** | 推荐已停售产品 | 用户无法购买，体验差 |
| **价格变动** | 显示错误价格 | 误导用户决策 |
| **保障变更** | 介绍过时保障 | 用户期望与实际不符 |
| **新品上市** | 错过更优产品 | 推荐非最优方案 |
| **数据过时** | 整体信息陈旧 | 失去竞争力 |

### 系统目标

1. ✅ **自动化** - 无需人工维护产品数据
2. ✅ **实时性** - 每日更新保证数据新鲜
3. ✅ **准确性** - 多数据源交叉验证
4. ✅ **追溯性** - 版本控制保留历史
5. ✅ **及时通知** - 变更影响用户及时告知

---

## 爬虫架构

```
┌─────────────────────────────────────────────────────────┐
│              产品数据动态更新系统                        │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 官方渠道爬虫  │  │ 第三方平台    │  │ 资讯网站     │
│ (一手数据)    │  │ (聚合数据)    │  │ (行业动态)    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                ┌──────────────────┐
                │  数据清洗与整合   │
                │  • 去重           │
                │  • 格式统一       │
                │  • 数据验证       │
                └──────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  变更检测引擎     │
                │  • 新品检测       │
                │  • 停售检测       │
                │  • 价格变动       │
                │  • 条款变更       │
                └──────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  版本控制系统     │
                │  • 版本管理       │
                │  • 历史追溯       │
                │  • 变更日志       │
                └──────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  影响分析与通知   │
                │  • 用户影响分析   │
                │  • 推荐更新       │
                │  • 消息推送       │
                └──────────────────┘
```

---

## 数据源设计

### 1. 官方渠道爬虫

**目标网站：**
- 平安人寿: https://www.pingan.com
- 中国人寿: https://www.e-chinalife.com
- 太平洋保险: https://www.cpic.com.cn
- 泰康人寿: https://www.taikang.com
- ... (20+ 主流保险公司)

**爬取内容：**
```typescript
interface OfficialDataSource {
  company: string;
  website: string;
  product_list_url: string;
  product_detail_url_pattern: string;

  // 爬取配置
  crawl_config: {
    frequency: 'daily' | 'weekly';
    selectors: {
      product_list: string;
      product_name: string;
      product_price: string;
      product_features: string;
      // ...
    };
    anti_scraping: {
      use_proxy: boolean;
      user_agent_rotation: boolean;
      rate_limit: number; // 请求间隔(ms)
    };
  };
}
```

**实现示例：**
```typescript
class OfficialWebsiteCrawler {
  /**
   * 爬取保险公司官网产品数据
   */
  async crawl(config: OfficialDataSource): Promise<ProductData[]> {
    const products: ProductData[] = [];

    // 1. 获取产品列表页
    const listPage = await this.fetchWithRetry(config.product_list_url);
    const $ = cheerio.load(listPage);

    // 2. 提取产品链接
    const productLinks = $(config.crawl_config.selectors.product_list)
      .map((i, el) => $(el).attr('href'))
      .get();

    // 3. 爬取每个产品详情
    for (const link of productLinks) {
      await this.sleep(config.crawl_config.anti_scraping.rate_limit);

      const productData = await this.crawlProductDetail(link, config);
      if (productData) {
        products.push(productData);
      }
    }

    return products;
  }

  /**
   * 爬取产品详情页
   */
  private async crawlProductDetail(
    url: string,
    config: OfficialDataSource
  ): Promise<ProductData | null> {
    try {
      const html = await this.fetchWithRetry(url);
      const $ = cheerio.load(html);

      // 提取产品信息
      const productData: ProductData = {
        source: 'official',
        company: config.company,
        url: url,
        scraped_at: new Date(),

        // 基础信息
        name: $(config.crawl_config.selectors.product_name).text().trim(),
        type: this.inferProductType(/* ... */),

        // 价格信息
        pricing: this.extractPricing($, config),

        // 保障信息
        features: this.extractFeatures($, config),

        // 其他信息
        // ...
      };

      return productData;
    } catch (error) {
      logger.error(`Failed to crawl ${url}:`, error);
      return null;
    }
  }

  /**
   * 提取价格信息
   */
  private extractPricing($: CheerioAPI, config: OfficialDataSource): Pricing {
    // 保险价格通常以表格形式展示
    // 需要解析表格提取不同年龄/性别/保额的价格

    const pricingTable = $('.pricing-table');
    const rows = pricingTable.find('tr');

    const pricing: Pricing = {};

    rows.each((i, row) => {
      const cells = $(row).find('td');
      // 解析逻辑...
    });

    return pricing;
  }

  /**
   * 带重试的请求
   */
  private async fetchWithRetry(
    url: string,
    maxRetries: number = 3
  ): Promise<string> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': this.getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'zh-CN,zh;q=0.9',
          },
          timeout: 30000
        });

        return response.data;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.sleep(1000 * (i + 1)); // 指数退避
      }
    }

    throw new Error('Max retries exceeded');
  }
}
```

### 2. 第三方平台爬虫

**目标平台：**
- 700度保险: https://www.700du.cn
- 慧择保险: https://www.huize.com
- 小雨伞保险: https://www.xiaoyusan.com
- 蚂蚁保险: https://render.alipay.com/p/c/antbaoxian

**优势：**
- 数据已经结构化整理
- 包含多家公司产品对比
- 更新及时

**实现示例：**
```typescript
class AggregatorPlatformCrawler {
  /**
   * 爬取第三方聚合平台
   */
  async crawl(platform: string): Promise<ProductData[]> {
    switch (platform) {
      case '700du':
        return this.crawl700du();
      case 'huize':
        return this.crawlHuize();
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  /**
   * 爬取700度保险
   */
  private async crawl700du(): Promise<ProductData[]> {
    const products: ProductData[] = [];

    // 700度保险的产品分类页
    const categories = [
      '/critical-illness',
      '/medical',
      '/term-life',
      '/accident'
    ];

    for (const category of categories) {
      const url = `https://www.700du.cn${category}`;
      const categoryProducts = await this.crawlCategory(url);
      products.push(...categoryProducts);
    }

    return products;
  }

  /**
   * 爬取某个分类下的所有产品
   */
  private async crawlCategory(url: string): Promise<ProductData[]> {
    // 实现细节...
  }
}
```

### 3. 资讯网站爬虫

**目标网站：**
- 沃保网: https://www.13611.com
- 保险岛: https://www.bxd365.com

**用途：**
- 获取行业动态
- 新品上市通知
- 产品停售公告

```typescript
class InsuranceNewsCrawler {
  /**
   * 爬取保险资讯
   */
  async crawlNews(): Promise<NewsItem[]> {
    const news: NewsItem[] = [];

    // 爬取新品上市新闻
    const newProductNews = await this.crawlNewProducts();
    news.push(...newProductNews);

    // 爬取产品停售新闻
    const discontinuedNews = await this.crawlDiscontinuedProducts();
    news.push(...discontinuedNews);

    return news;
  }

  /**
   * 从新闻中提取产品信息
   */
  private extractProductFromNews(news: NewsItem): ProductEvent | null {
    // 使用 NLP 提取产品名称、公司、事件类型等
    const text = news.title + ' ' + news.content;

    // 识别事件类型
    const eventType = this.identifyEventType(text);

    // 提取产品名称
    const productName = this.extractProductName(text);

    // 提取公司名称
    const company = this.extractCompany(text);

    if (productName && company) {
      return {
        event_type: eventType,
        product_name: productName,
        company: company,
        source: news.url,
        detected_at: new Date()
      };
    }

    return null;
  }

  /**
   * 识别事件类型
   */
  private identifyEventType(text: string): 'new_launch' | 'discontinued' | 'price_change' {
    if (/上市|推出|发布|新品/.test(text)) {
      return 'new_launch';
    } else if (/停售|下架|退市/.test(text)) {
      return 'discontinued';
    } else if (/调价|降价|涨价/.test(text)) {
      return 'price_change';
    }

    return null;
  }
}
```

---

## 版本控制系统

### 1. 版本化数据模型

```typescript
interface VersionedProduct {
  product_id: string;
  product_name: string;
  company: string;

  // 版本历史
  versions: ProductVersion[];

  // 当前版本
  current_version: string;
}

interface ProductVersion {
  version: string; // "v1.0", "v1.1", "v2.0"
  valid_from: Date;
  valid_until: Date | null; // null 表示当前版本
  status: 'active' | 'discontinued' | 'archived';

  // 产品数据快照
  data: ProductSnapshot;

  // 变更记录
  changes: Change[];

  // 变更原因
  change_reason?: string;

  // 数据来源
  data_sources: DataSource[];
}

interface ProductSnapshot {
  // 完整的产品数据
  pricing: Pricing;
  features: Features;
  eligibility: Eligibility;
  // ...
}

interface Change {
  field: string; // 变更的字段
  old_value: any;
  new_value: any;
  change_type: 'add' | 'update' | 'delete';
  significance: 'major' | 'minor' | 'patch';
}
```

### 2. 版本管理器

```typescript
class ProductVersionManager {
  /**
   * 创建新版本
   */
  async createNewVersion(
    productId: string,
    newData: ProductData,
    changes: Change[]
  ): Promise<ProductVersion> {
    const product = await this.getVersionedProduct(productId);
    const currentVersion = product.versions.find(v => v.valid_until === null);

    // 1. 关闭当前版本
    if (currentVersion) {
      currentVersion.valid_until = new Date();
      currentVersion.status = 'archived';
    }

    // 2. 创建新版本
    const newVersion: ProductVersion = {
      version: this.generateVersionNumber(product, changes),
      valid_from: new Date(),
      valid_until: null,
      status: 'active',
      data: newData,
      changes: changes,
      change_reason: this.summarizeChanges(changes),
      data_sources: newData.sources
    };

    // 3. 保存
    product.versions.push(newVersion);
    product.current_version = newVersion.version;

    await this.saveVersionedProduct(product);

    return newVersion;
  }

  /**
   * 生成版本号（语义化版本）
   */
  private generateVersionNumber(
    product: VersionedProduct,
    changes: Change[]
  ): string {
    const current = product.current_version || 'v0.0.0';
    const [major, minor, patch] = current.substring(1).split('.').map(Number);

    // 判断变更级别
    const hasMajorChange = changes.some(c => c.significance === 'major');
    const hasMinorChange = changes.some(c => c.significance === 'minor');

    if (hasMajorChange) {
      return `v${major + 1}.0.0`; // 主版本号+1
    } else if (hasMinorChange) {
      return `v${major}.${minor + 1}.0`; // 次版本号+1
    } else {
      return `v${major}.${minor}.${patch + 1}`; // 修订号+1
    }
  }

  /**
   * 获取历史版本
   */
  async getVersionAtDate(
    productId: string,
    date: Date
  ): Promise<ProductVersion | null> {
    const product = await this.getVersionedProduct(productId);

    return product.versions.find(
      v => v.valid_from <= date && (v.valid_until === null || v.valid_until >= date)
    );
  }

  /**
   * 对比两个版本
   */
  async compareVersions(
    productId: string,
    version1: string,
    version2: string
  ): Promise<VersionComparison> {
    const v1 = await this.getVersion(productId, version1);
    const v2 = await this.getVersion(productId, version2);

    return {
      product_id: productId,
      from_version: version1,
      to_version: version2,
      changes: this.diffVersions(v1.data, v2.data),
      summary: this.summarizeDiff(v1, v2)
    };
  }

  /**
   * 对比两个版本的数据
   */
  private diffVersions(v1: ProductSnapshot, v2: ProductSnapshot): Change[] {
    const changes: Change[] = [];

    // 对比价格
    const pricingChanges = this.diffPricing(v1.pricing, v2.pricing);
    changes.push(...pricingChanges);

    // 对比保障
    const featureChanges = this.diffFeatures(v1.features, v2.features);
    changes.push(...featureChanges);

    // 对比其他字段
    // ...

    return changes;
  }

  /**
   * 对比价格
   */
  private diffPricing(p1: Pricing, p2: Pricing): Change[] {
    const changes: Change[] = [];

    // 深度对比价格结构
    // 例如：age_30.male.coverage_500k.pay_20_years

    const flatP1 = this.flattenObject(p1);
    const flatP2 = this.flattenObject(p2);

    for (const [key, value] of Object.entries(flatP2)) {
      if (flatP1[key] !== value) {
        changes.push({
          field: `pricing.${key}`,
          old_value: flatP1[key],
          new_value: value,
          change_type: flatP1[key] === undefined ? 'add' : 'update',
          significance: Math.abs((value - flatP1[key]) / flatP1[key]) > 0.1 ? 'major' : 'minor'
        });
      }
    }

    return changes;
  }
}
```

---

## 变更检测与通知

### 1. 变更检测引擎

```typescript
class ChangeDetectionEngine {
  /**
   * 检测产品变更
   */
  async detectChanges(
    newData: ProductData[],
    existingData: ProductData[]
  ): Promise<ProductChange[]> {
    const changes: ProductChange[] = [];

    // 1. 检测新产品
    const newProducts = this.detectNewProducts(newData, existingData);
    changes.push(...newProducts.map(p => ({
      type: 'new_product',
      product: p,
      significance: 'major',
      impact: {
        affects_users: false,
        requires_recommendation_update: true,
        notification_required: false
      }
    })));

    // 2. 检测停售产品
    const discontinued = this.detectDiscontinuedProducts(newData, existingData);
    changes.push(...discontinued.map(p => ({
      type: 'discontinued',
      product: p,
      significance: 'major',
      impact: {
        affects_users: true,
        requires_recommendation_update: true,
        notification_required: true
      }
    })));

    // 3. 检测价格变动
    const priceChanges = this.detectPriceChanges(newData, existingData);
    changes.push(...priceChanges);

    // 4. 检测保障变更
    const coverageChanges = this.detectCoverageChanges(newData, existingData);
    changes.push(...coverageChanges);

    return changes;
  }

  /**
   * 检测新产品
   */
  private detectNewProducts(
    newData: ProductData[],
    existingData: ProductData[]
  ): ProductData[] {
    return newData.filter(
      np => !existingData.some(ep => this.isSameProduct(np, ep))
    );
  }

  /**
   * 检测停售产品
   */
  private detectDiscontinuedProducts(
    newData: ProductData[],
    existingData: ProductData[]
  ): ProductData[] {
    return existingData.filter(
      ep => !newData.some(np => this.isSameProduct(ep, np))
    );
  }

  /**
   * 检测价格变动
   */
  private detectPriceChanges(
    newData: ProductData[],
    existingData: ProductData[]
  ): ProductChange[] {
    const changes: ProductChange[] = [];

    for (const newProduct of newData) {
      const existing = existingData.find(p => this.isSameProduct(p, newProduct));

      if (existing && this.isPriceChanged(existing, newProduct)) {
        const changePercentage = this.calculatePriceChangePercentage(
          existing,
          newProduct
        );

        changes.push({
          type: 'price_change',
          product: newProduct,
          old_price: existing.pricing,
          new_price: newProduct.pricing,
          change_percentage: changePercentage,
          significance: Math.abs(changePercentage) > 10 ? 'major' : 'minor',
          impact: {
            affects_users: changePercentage > 0, // 涨价影响用户
            requires_recommendation_update: true,
            notification_required: changePercentage > 5 // 变动超过5%通知
          }
        });
      }
    }

    return changes;
  }

  /**
   * 判断是否为同一产品
   */
  private isSameProduct(p1: ProductData, p2: ProductData): boolean {
    // 可以通过产品ID、名称+公司等方式判断
    if (p1.id && p2.id) {
      return p1.id === p2.id;
    }

    return p1.name === p2.name && p1.company === p2.company;
  }
}
```

### 2. 用户通知系统

```typescript
class UserNotificationService {
  /**
   * 处理产品变更通知
   */
  async handleProductChange(change: ProductChange): Promise<void> {
    if (!change.impact.notification_required) {
      return; // 不需要通知
    }

    // 1. 找到受影响的用户
    const affectedUsers = await this.findAffectedUsers(change);

    // 2. 为每个用户生成个性化通知
    for (const user of affectedUsers) {
      const notification = await this.generateNotification(user, change);

      // 3. 发送通知
      await this.sendNotification(user, notification);
    }
  }

  /**
   * 找到受影响的用户
   */
  private async findAffectedUsers(
    change: ProductChange
  ): Promise<UserProfile[]> {
    const affectedUsers: UserProfile[] = [];

    switch (change.type) {
      case 'discontinued':
        // 找到已购买此产品的用户
        const purchasedUsers = await this.findUsersByPolicy(change.product.id);
        affectedUsers.push(...purchasedUsers);

        // 找到收藏/关注此产品的用户
        const interestedUsers = await this.findInterestedUsers(change.product.id);
        affectedUsers.push(...interestedUsers);
        break;

      case 'price_change':
        // 价格下降：通知感兴趣但未购买的用户
        if (change.change_percentage < 0) {
          const interested = await this.findInterestedUsers(change.product.id);
          affectedUsers.push(...interested);
        }
        break;

      case 'new_product':
        // 新产品：通知相关需求的用户
        const potentialUsers = await this.findUsersByNeeds(change.product.type);
        affectedUsers.push(...potentialUsers);
        break;
    }

    return affectedUsers;
  }

  /**
   * 生成个性化通知
   */
  private async generateNotification(
    user: UserProfile,
    change: ProductChange
  ): Promise<Notification> {
    switch (change.type) {
      case 'discontinued':
        return {
          title: '重要提醒：您关注的产品即将停售',
          content: `
您好，${user.identity.name}！

您之前关注的 ${change.product.company} ${change.product.name} 即将停售。

如果您仍有投保意向，建议尽快行动。

我们也为您准备了同类型的替代产品推荐：
${await this.getAlternativeProducts(change.product)}

点击查看详情 >
          `,
          priority: 'high',
          action_url: `/products/alternatives/${change.product.id}`
        };

      case 'price_change':
        if (change.change_percentage < 0) {
          return {
            title: '好消息：您关注的产品降价了！',
            content: `
您好，${user.identity.name}！

您之前关注的 ${change.product.company} ${change.product.name} 降价了！

价格下降：${Math.abs(change.change_percentage).toFixed(1)}%

原价：${change.old_price} 元/年
现价：${change.new_price} 元/年
节省：${change.old_price - change.new_price} 元/年

现在是投保的好时机！

查看产品详情 >
            `,
            priority: 'medium',
            action_url: `/products/${change.product.id}`
          };
        }
        break;

      case 'new_product':
        return {
          title: '新品推荐：可能更适合您的产品',
          content: `
您好，${user.identity.name}！

${change.product.company} 刚刚推出了新产品：${change.product.name}

根据您的需求分析，这款产品可能更适合您：
• ${change.product.highlights[0]}
• ${change.product.highlights[1]}
• ${change.product.highlights[2]}

点击了解详情 >
          `,
          priority: 'low',
          action_url: `/products/${change.product.id}`
        };
    }
  }

  /**
   * 发送通知
   */
  private async sendNotification(
    user: UserProfile,
    notification: Notification
  ): Promise<void> {
    // 根据用户偏好选择通知渠道
    const channels = user.preferences.communication.preferred_channels;

    for (const channel of channels) {
      switch (channel) {
        case 'email':
          await this.sendEmail(user.identity.email, notification);
          break;
        case 'sms':
          await this.sendSMS(user.identity.phone, notification);
          break;
        case 'push':
          await this.sendPushNotification(user.user_id, notification);
          break;
        case 'in_app':
          await this.createInAppNotification(user.user_id, notification);
          break;
      }
    }
  }
}
```

---

## 实现方案

### Phase 1: 爬虫框架搭建 (Week 1)

**任务：**
- [ ] 设计爬虫架构
- [ ] 实现通用爬虫基类
- [ ] 实现反爬虫策略
  - User-Agent 轮换
  - IP代理池
  - 请求频率控制
  - Cookie管理
- [ ] 实现数据清洗模块

**技术栈：**
- Puppeteer / Playwright (动态网站)
- Cheerio (静态网站)
- Axios (HTTP 请求)
- Redis (请求队列)

### Phase 2: 数据源对接 (Week 2)

**任务：**
- [ ] 对接 5+ 保险公司官网
- [ ] 对接 3+ 第三方平台
- [ ] 对接 2+ 资讯网站
- [ ] 实现数据标准化

### Phase 3: 版本控制与变更检测 (Week 2)

**任务：**
- [ ] 实现版本控制系统
- [ ] 实现变更检测引擎
- [ ] 实现数据对比算法
- [ ] 生成变更日志

### Phase 4: 通知与更新 (Week 1)

**任务：**
- [ ] 实现用户影响分析
- [ ] 实现通知生成
- [ ] 实现多渠道推送
- [ ] 实现推荐更新

### 定时任务设计

```typescript
// 使用 node-cron 设置定时任务
import cron from 'node-cron';

class CrawlerScheduler {
  start() {
    // 每天凌晨3点：爬取所有数据源
    cron.schedule('0 3 * * *', async () => {
      await this.runFullCrawl();
    });

    // 每天中午12点：爬取价格数据（价格变动较快）
    cron.schedule('0 12 * * *', async () => {
      await this.runPriceCrawl();
    });

    // 每小时：爬取资讯网站（新品/停售公告）
    cron.schedule('0 * * * *', async () => {
      await this.runNewsCrawl();
    });

    // 每天早上9点：检测变更并发送通知
    cron.schedule('0 9 * * *', async () => {
      await this.detectChangesAndNotify();
    });
  }

  private async runFullCrawl() {
    logger.info('Starting full crawl...');

    // 并行爬取所有数据源
    const results = await Promise.all([
      this.crawlOfficialSites(),
      this.crawlAggregatorPlatforms(),
      this.crawlNewsSites()
    ]);

    // 数据整合
    const allData = results.flat();

    // 保存到临时表
    await this.saveTemporaryData(allData);

    logger.info(`Full crawl completed. ${allData.length} products scraped.`);
  }

  private async detectChangesAndNotify() {
    logger.info('Detecting changes...');

    // 1. 获取新旧数据
    const newData = await this.getTemporaryData();
    const oldData = await this.getCurrentData();

    // 2. 检测变更
    const changes = await this.changeDetector.detectChanges(newData, oldData);

    logger.info(`Detected ${changes.length} changes.`);

    // 3. 更新数据库（版本控制）
    for (const change of changes) {
      await this.versionManager.handleChange(change);
    }

    // 4. 通知用户
    for (const change of changes) {
      if (change.impact.notification_required) {
        await this.notificationService.handleProductChange(change);
      }
    }

    logger.info('Change detection and notification completed.');
  }
}
```

---

## 总结

产品数据动态更新系统通过：

1. ✅ **自动化爬虫** - 多数据源自动抓取
2. ✅ **版本控制** - 完整的历史追溯
3. ✅ **变更检测** - 智能识别产品变化
4. ✅ **及时通知** - 影响用户及时告知
5. ✅ **推荐更新** - 自动调整推荐策略

确保保险产品数据始终准确、及时！
