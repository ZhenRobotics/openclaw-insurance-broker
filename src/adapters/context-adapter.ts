/**
 * Context 适配器
 * 将 OpenClaw Context 转换为 FA 特定的 Context
 */

import type { OpenClawContext, PluginAPI } from '../plugin-types.js';
import type { SkillContext, SkillConfig, LLMProvider, StorageProvider, ToolsProvider } from '../types.js';

/**
 * 创建 FA Context
 */
export function createFAContext(
  openClawContext: OpenClawContext,
  api: PluginAPI
): SkillContext {
  const config = openClawContext.config.fa || {};

  const faContext: SkillContext = {
    userId: openClawContext.userId,
    channelId: openClawContext.channelId,
    channelType: openClawContext.channelType,
    sessionId: openClawContext.sessionId,

    config: {
      defaultCurrency: config.defaultCurrency || 'CNY',
      defaultLanguage: config.defaultLanguage || 'zh-CN',
      investorDatabasePath: config.investorDatabasePath || './data/investors.json',
      enableWebSearch: config.enableWebSearch !== false,
    },

    llm: createLLMProvider(openClawContext.llm, api),
    storage: createStorageProvider(openClawContext.storage, api),
    tools: createToolsProvider(api),
  };

  return faContext;
}

/**
 * 创建 LLM Provider 适配器
 */
function createLLMProvider(
  openClawLLM: any,
  api: PluginAPI
): LLMProvider {
  return {
    async chat(params) {
      try {
        return await openClawLLM.chat(params);
      } catch (error) {
        api.logger.error('[FA Context] LLM chat 错误:', error);
        throw error;
      }
    },

    async embed(text) {
      try {
        if (openClawLLM.embed) {
          return await openClawLLM.embed(text);
        }
        throw new Error('Embedding not supported');
      } catch (error) {
        api.logger.error('[FA Context] LLM embed 错误:', error);
        throw error;
      }
    },
  };
}

/**
 * 创建 Storage Provider 适配器
 */
function createStorageProvider(
  openClawStorage: any,
  api: PluginAPI
): StorageProvider {
  return {
    async get(key) {
      try {
        return await openClawStorage.get(`fa:${key}`);
      } catch (error) {
        api.logger.error('[FA Context] Storage get 错误:', error);
        return null;
      }
    },

    async set(key, value) {
      try {
        await openClawStorage.set(`fa:${key}`, value);
      } catch (error) {
        api.logger.error('[FA Context] Storage set 错误:', error);
        throw error;
      }
    },

    async delete(key) {
      try {
        await openClawStorage.delete(`fa:${key}`);
      } catch (error) {
        api.logger.error('[FA Context] Storage delete 错误:', error);
        throw error;
      }
    },

    async list(prefix) {
      try {
        if (openClawStorage.list) {
          return await openClawStorage.list(`fa:${prefix}`);
        }
        return [];
      } catch (error) {
        api.logger.error('[FA Context] Storage list 错误:', error);
        return [];
      }
    },
  };
}

/**
 * 创建 Tools Provider 适配器
 */
function createToolsProvider(api: PluginAPI): ToolsProvider {
  return {
    async searchWeb(query) {
      // OpenClaw 可能提供 web search 工具
      // 这里提供一个占位实现
      api.logger.warn('[FA Context] Web search 未实现');
      return [];
    },

    async generateDocument(template, data) {
      // 文档生成工具占位实现
      api.logger.warn('[FA Context] Document generation 未实现');
      return Buffer.from('');
    },

    async analyzeDocument(file) {
      // 文档分析工具占位实现
      api.logger.warn('[FA Context] Document analysis 未实现');
      return {};
    },
  };
}
