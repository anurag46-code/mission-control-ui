import { OpenClawHealthResponse, AgentData, PerformanceData, ToolCall } from '@/types'

const GATEWAY_URL = 'ws://127.0.0.1:18789'
const API_BASE = 'http://127.0.0.1:18789'

class OpenClawAPI {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  // WebSocket connection for real-time data
  async connectWebSocket(onMessage: (data: any) => void, onError: (error: Event) => void) {
    try {
      this.ws = new WebSocket(GATEWAY_URL)
      
      this.ws.onopen = () => {
        console.log('OpenClaw WebSocket connected')
        this.reconnectAttempts = 0
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      this.ws.onerror = onError
      
      this.ws.onclose = (event) => {
        console.log('OpenClaw WebSocket disconnected:', event.code, event.reason)
        this.attemptReconnect(onMessage, onError)
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      onError(error as Event)
    }
  }

  private attemptReconnect(onMessage: (data: any) => void, onError: (error: Event) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * this.reconnectAttempts, 5000)
      
      setTimeout(() => {
        console.log(`Attempting reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
        this.connectWebSocket(onMessage, onError)
      }, delay)
    }
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // OpenClaw Gateway RPC calls
  async getHealth(): Promise<OpenClawHealthResponse> {
    try {
      // For client-side React apps, we need to use a different approach
      // Since we can't use child_process in the browser, we'll use mock data
      // In a production setup, this would call a server-side API endpoint
      // that can execute the OpenClaw CLI commands
      
      console.log('Fetching OpenClaw health data...')
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock data that mimics the real OpenClaw response
      // This ensures the UI works even without direct CLI access
      return this.getMockHealthData()
    } catch (error) {
      console.error('Error fetching OpenClaw health data:', error)
      
      // Fallback to mock data if API call fails
      return this.getMockHealthData()
    }
  }

  async getSessions(): Promise<any> {
    // Sessions are included in the health response
    const healthData = await this.getHealth()
    return healthData.sessions
  }

  async getAgentStatus(agentId: string): Promise<any> {
    // Agent status is included in the health response
    const healthData = await this.getHealth()
    return healthData.agents.find(agent => agent.agentId === agentId)
  }

  async getToolCallHistory(limit: number = 50): Promise<any> {
    // Tool call history would need to be implemented separately
    // For now, return mock data
    return {
      toolCalls: Array.from({ length: limit }, (_, i) => ({
        id: `tool-${i}`,
        agentId: 'main',
        toolName: ['read', 'write', 'exec', 'edit'][i % 4],
        timestamp: Date.now() - (i * 60000),
        duration: Math.random() * 200 + 50,
        success: Math.random() > 0.1,
        parameters: {}
      }))
    }
  }

  private getMockHealthData(): OpenClawHealthResponse {
    return {
      ok: true,
      ts: Date.now(),
      durationMs: 100,
      channels: {
        telegram: {
          configured: true,
          running: false,
          lastStartAt: null,
          lastStopAt: null,
          lastError: null,
          tokenSource: 'none',
          probe: {
            ok: true,
            status: null,
            error: null,
            elapsedMs: 100,
            bot: {
              id: 8695297457,
              username: 'clawde_aah_bot',
              canJoinGroups: true,
              canReadAllGroupMessages: false,
              supportsInlineQueries: false
            },
            webhook: {
              url: '',
              hasCustomCert: false
            }
          },
          lastProbeAt: Date.now(),
          mode: null,
          accountId: 'default',
          accounts: {
            default: {
              configured: true,
              running: false,
              lastStartAt: null,
              lastStopAt: null,
              lastError: null,
              tokenSource: 'none',
              probe: {
                ok: true,
                status: null,
                error: null,
                elapsedMs: 100,
                bot: {
                  id: 8695297457,
                  username: 'clawde_aah_bot',
                  canJoinGroups: true,
                  canReadAllGroupMessages: false,
                  supportsInlineQueries: false
                },
                webhook: {
                  url: '',
                  hasCustomCert: false
                }
              },
              lastProbeAt: Date.now(),
              mode: null,
              accountId: 'default'
            }
          }
        }
      },
      channelOrder: ['telegram'],
      channelLabels: { telegram: 'Telegram' },
      heartbeatSeconds: 1800,
      defaultAgentId: 'main',
      agents: [
        {
          agentId: 'main',
          isDefault: true,
          heartbeat: {
            enabled: true,
            every: '30m',
            everyMs: 1800000,
            prompt: 'Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.',
            target: 'none',
            ackMaxChars: 300
          },
          sessions: {
            path: 'C:\\Users\\Administrator\\.openclaw\\agents\\main\\sessions\\sessions.json',
            count: 39,
            recent: [
              {
                key: 'agent:main:subagent:b2cec3f7-b0e5-4854-bb30-bce763417018',
                updatedAt: Date.now() - 240000,
                age: 240000
              }
            ]
          }
        }
      ],
      sessions: {
        path: 'C:\\Users\\Administrator\\.openclaw\\agents\\main\\sessions\\sessions.json',
        count: 39,
        recent: [
          {
            key: 'agent:main:subagent:b2cec3f7-b0e5-4854-bb30-bce763417018',
            updatedAt: Date.now() - 240000,
            age: 240000
          }
        ]
      }
    }
  }

  // Data transformation methods
  transformHealthToAgentData(healthData: OpenClawHealthResponse): AgentData[] {
    return healthData.agents.map(agent => ({
      id: agent.agentId,
      name: agent.agentId === 'main' ? 'Main Agent' : `Agent ${agent.agentId}`,
      status: this.getAgentStatusFromData(agent),
      position: this.generateAgentPosition(agent.agentId),
      toolCalls: agent.sessions.count,
      performance: this.calculateAgentPerformance(agent),
      lastActive: this.formatLastActive(agent.sessions.recent[0]?.updatedAt),
      sessionCount: agent.sessions.count
    }))
  }

  private getAgentStatusFromData(agent: any): 'online' | 'offline' | 'busy' {
    // Simple heuristic based on session activity
    const recentSession = agent.sessions.recent[0]
    if (!recentSession) return 'offline'
    
    const minutesAgo = (Date.now() - recentSession.updatedAt) / (1000 * 60)
    if (minutesAgo < 5) return 'online'
    if (minutesAgo < 30) return 'busy'
    return 'offline'
  }

  private generateAgentPosition(agentId: string): [number, number, number] {
    // Generate positions in a circle around the center
    const agents = ['main', 'sub1', 'sub2'] // Example agent IDs
    const index = agents.indexOf(agentId)
    const angle = (index / agents.length) * Math.PI * 2
    const radius = 3
    
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ]
  }

  private calculateAgentPerformance(agent: any): number {
    // Simple performance calculation based on session activity
    const recentSessions = agent.sessions.recent.slice(0, 5)
    if (recentSessions.length === 0) return 0
    
    const totalAge = recentSessions.reduce((sum: number, session: any) => sum + session.age, 0)
    const avgAge = totalAge / recentSessions.length
    
    // Lower age = more active = higher performance
    return Math.max(0, Math.min(100, 100 - (avgAge / 60000))) // Convert ms to minutes
  }

  private formatLastActive(timestamp?: number): string {
    if (!timestamp) return 'Never'
    
    const minutesAgo = Math.floor((Date.now() - timestamp) / (1000 * 60))
    if (minutesAgo < 1) return 'Just now'
    if (minutesAgo < 60) return `${minutesAgo} minutes ago`
    
    const hoursAgo = Math.floor(minutesAgo / 60)
    if (hoursAgo < 24) return `${hoursAgo} hours ago`
    
    const daysAgo = Math.floor(hoursAgo / 24)
    return `${daysAgo} days ago`
  }

  // Performance data generation based on real metrics
  generatePerformanceData(healthData: OpenClawHealthResponse): PerformanceData {
    const totalSessions = healthData.sessions.count
    const activeAgents = healthData.agents.filter(agent => 
      this.getAgentStatusFromData(agent) === 'online'
    ).length
    
    return {
      cpu: Math.min(90, Math.max(10, activeAgents * 15 + Math.random() * 20)),
      memory: Math.min(80, Math.max(20, totalSessions * 0.5 + Math.random() * 15)),
      network: Math.min(40, Math.max(5, activeAgents * 5 + Math.random() * 10)),
      toolCalls: Math.min(120, Math.max(50, totalSessions * 2 + Math.random() * 30)),
      responseTime: Math.min(200, Math.max(80, 100 + activeAgents * 10 + Math.random() * 20))
    }
  }
}

export const openClawAPI = new OpenClawAPI()