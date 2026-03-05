/**
 * OpenClaw Plugin API 类型定义
 * 基于 OpenClaw Plugin SDK
 */

export interface PluginAPI {
  logger: Logger;
  registerService(service: ServiceDefinition): void;
  registerHook(hook: HookDefinition): void;
  registerChannel?(channel: ChannelDefinition): void;
  registerGatewayMethod?(method: GatewayMethodDefinition): void;
  getConfig(): PluginConfig;
}

export interface Logger {
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  debug(...args: any[]): void;
}

export interface ServiceDefinition {
  id: string;
  displayName?: string;
  start(api: PluginAPI): Promise<void> | void;
  stop(api: PluginAPI): Promise<void> | void;
}

export interface HookDefinition {
  name: string;
  on: HookType[];
  handler(event: HookEvent): Promise<void> | void;
}

export type HookType =
  | 'gateway:starting'
  | 'gateway:started'
  | 'gateway:stopping'
  | 'message:received'
  | 'message:transcribed'
  | 'message:preprocessed'
  | 'message:sent'
  | 'agent:executing'
  | 'agent:executed'
  | 'command:new'
  | 'command:reset';

export interface HookEvent {
  type: HookType;
  action?: string;
  sessionKey?: string;
  timestamp: number;
  message?: Message;
  context?: OpenClawContext;
  messages: string[];
  stopPropagation?: boolean;
  [key: string]: any;
}

export interface Message {
  text: string;
  from?: string;
  channel?: string;
  timestamp?: number;
  metadata?: Record<string, any>;
}

export interface OpenClawContext {
  sessionId: string;
  userId: string;
  channelId: string;
  channelType: string;
  config: PluginConfig;
  storage: StorageProvider;
  llm: LLMProvider;
  [key: string]: any;
}

export interface StorageProvider {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  list?(prefix: string): Promise<string[]>;
}

export interface LLMProvider {
  chat(params: ChatParams): Promise<ChatResponse>;
  embed?(text: string): Promise<number[]>;
}

export interface ChatParams {
  system?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface PluginConfig {
  fa?: FAPluginConfig;
  [key: string]: any;
}

export interface FAPluginConfig {
  defaultCurrency?: 'CNY' | 'USD';
  defaultLanguage?: 'zh-CN' | 'en-US';
  investorDatabasePath?: string;
  enableWebSearch?: boolean;
}

export interface ChannelDefinition {
  id: string;
  meta: ChannelMeta;
  capabilities: ChannelCapabilities;
  config: ChannelConfig;
  outbound: OutboundHandlers;
  inbound?: InboundHandlers;
}

export interface ChannelMeta {
  id: string;
  label: string;
  selectionLabel: string;
  icon?: string;
}

export interface ChannelCapabilities {
  chatTypes: ('direct' | 'group')[];
  supportsMedia?: boolean;
  supportsVoice?: boolean;
}

export interface ChannelConfig {
  listAccountIds(cfg: any): string[];
  resolveAccount(cfg: any, accountId: string): any;
}

export interface OutboundHandlers {
  deliveryMode: 'direct' | 'queued';
  sendText(params: SendTextParams): Promise<SendResult>;
  sendMedia?(params: SendMediaParams): Promise<SendResult>;
}

export interface InboundHandlers {
  start(api: PluginAPI): Promise<void> | void;
  stop(api: PluginAPI): Promise<void> | void;
}

export interface SendTextParams {
  text: string;
  chatId?: string;
  replyTo?: string;
  [key: string]: any;
}

export interface SendMediaParams {
  media: Buffer;
  type: 'image' | 'audio' | 'video' | 'file';
  caption?: string;
  chatId?: string;
  [key: string]: any;
}

export interface SendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export interface GatewayMethodDefinition {
  name: string;
  handler(params: any): Promise<any>;
}
