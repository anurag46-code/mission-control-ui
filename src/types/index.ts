// OpenClaw API Types
export interface OpenClawHealthResponse {
  ok: boolean
  ts: number
  durationMs: number
  channels: Record<string, ChannelStatus>
  channelOrder: string[]
  channelLabels: Record<string, string>
  heartbeatSeconds: number
  defaultAgentId: string
  agents: AgentStatus[]
  sessions: SessionSummary
}

export interface ChannelStatus {
  configured: boolean
  running: boolean
  lastStartAt: number | null
  lastStopAt: number | null
  lastError: string | null
  tokenSource: string
  probe: ChannelProbe
  lastProbeAt: number
  mode: string | null
  accountId: string
  accounts: Record<string, AccountStatus>
}

export interface ChannelProbe {
  ok: boolean
  status: string | null
  error: string | null
  elapsedMs: number
  bot: BotInfo
  webhook: WebhookInfo
}

export interface BotInfo {
  id: number
  username: string
  canJoinGroups: boolean
  canReadAllGroupMessages: boolean
  supportsInlineQueries: boolean
}

export interface WebhookInfo {
  url: string
  hasCustomCert: boolean
}

export interface AccountStatus {
  configured: boolean
  running: boolean
  lastStartAt: number | null
  lastStopAt: number | null
  lastError: string | null
  tokenSource: string
  probe: ChannelProbe
  lastProbeAt: number
  mode: string | null
  accountId: string
}

export interface AgentStatus {
  agentId: string
  isDefault: boolean
  heartbeat: HeartbeatConfig
  sessions: SessionSummary
}

export interface HeartbeatConfig {
  enabled: boolean
  every: string
  everyMs: number
  prompt: string
  target: string
  ackMaxChars: number
}

export interface SessionSummary {
  path: string
  count: number
  recent: RecentSession[]
}

export interface RecentSession {
  key: string
  updatedAt: number
  age: number
}

// Mission Control UI Types
export interface AgentData {
  id: string
  name: string
  status: 'online' | 'offline' | 'busy'
  position: [number, number, number]
  toolCalls: number
  performance: number
  lastActive: string
  sessionCount: number
}

export interface PerformanceData {
  cpu: number
  memory: number
  network: number
  toolCalls: number
  responseTime: number
}

export interface ToolCall {
  id: string
  agentId: string
  toolName: string
  timestamp: number
  duration: number
  success: boolean
  parameters: Record<string, any>
  result?: any
  error?: string
}

export interface RealTimeData {
  agents: AgentData[]
  performance: PerformanceData
  toolCalls: ToolCall[]
  lastUpdate: number
}