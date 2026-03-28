import { DashboardData, AgentStatus, ToolCall, PerformanceMetrics } from '@/types/openclaw';
import { openClawAPI } from './openclaw-api';

export class OpenClawAPI {
  private static instance: OpenClawAPI;
  private ws: WebSocket | null = null;
  private listeners: ((data: DashboardData) => void)[] = [];

  static getInstance(): OpenClawAPI {
    if (!OpenClawAPI.instance) {
      OpenClawAPI.instance = new OpenClawAPI();
    }
    return OpenClawAPI.instance;
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const healthData = await openClawAPI.getHealth();
      
      // Transform OpenClaw health data to DashboardData
      const agents: AgentStatus[] = openClawAPI.transformHealthToAgentData(healthData).map(agent => ({
        id: agent.id,
        name: agent.name,
        status: agent.status,
        lastHeartbeat: new Date().toISOString(),
        currentTask: agent.status === 'busy' ? 'Processing requests' : undefined,
        performance: {
          cpu: Math.min(100, Math.max(0, agent.performance)),
          memory: Math.min(100, Math.max(0, agent.performance * 0.7)),
          responseTime: Math.max(50, 200 - agent.performance * 1.5)
        }
      }));

      const metrics: PerformanceMetrics = {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status !== 'offline').length,
        toolCallsPerMinute: Math.floor(agents.reduce((sum, agent) => sum + agent.performance.cpu / 10, 0)),
        averageResponseTime: Math.floor(agents.reduce((sum, agent) => sum + agent.performance.responseTime, 0) / agents.length),
        errorRate: 0.2, // TODO: Calculate from actual error data
        uptime: 99.8 // TODO: Calculate from actual uptime data
      };

      const recentToolCalls: ToolCall[] = [
        {
          id: '1',
          agentId: 'main',
          toolName: 'health_check',
          timestamp: new Date().toISOString(),
          duration: healthData.durationMs,
          status: 'success',
          parameters: { endpoint: '/api/health' }
        }
      ];

      return {
        agents,
        recentToolCalls,
        metrics,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching OpenClaw dashboard data:', error);
      
      // Fallback to mock data if API call fails
      return this.getMockDashboardData();
    }
  }

  private getMockDashboardData(): DashboardData {
    const mockAgents: AgentStatus[] = [
      {
        id: '1',
        name: 'Main Agent',
        status: 'online',
        lastHeartbeat: new Date().toISOString(),
        currentTask: 'Processing user request',
        performance: {
          cpu: 45,
          memory: 32,
          responseTime: 120
        }
      },
      {
        id: '2',
        name: 'Frontend Developer',
        status: 'busy',
        lastHeartbeat: new Date().toISOString(),
        currentTask: 'Building mission control UI',
        performance: {
          cpu: 78,
          memory: 45,
          responseTime: 85
        }
      },
      {
        id: '3',
        name: 'Health Monitor',
        status: 'idle',
        lastHeartbeat: new Date().toISOString(),
        performance: {
          cpu: 12,
          memory: 18,
          responseTime: 200
        }
      }
    ];

    const mockToolCalls: ToolCall[] = [
      {
        id: '1',
        agentId: '2',
        toolName: 'write',
        timestamp: new Date().toISOString(),
        duration: 120,
        status: 'success',
        parameters: { path: 'dashboard.tsx' }
      },
      {
        id: '2',
        agentId: '1',
        toolName: 'read',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        duration: 45,
        status: 'success',
        parameters: { path: 'package.json' }
      },
      {
        id: '3',
        agentId: '2',
        toolName: 'exec',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        duration: 200,
        status: 'running',
        parameters: { command: 'npm run dev' }
      }
    ];

    return {
      agents: mockAgents,
      recentToolCalls: mockToolCalls,
      metrics: {
        totalAgents: mockAgents.length,
        activeAgents: mockAgents.filter(a => a.status !== 'offline').length,
        toolCallsPerMinute: 45,
        averageResponseTime: 135,
        errorRate: 0.2,
        uptime: 99.8
      },
      lastUpdated: new Date().toISOString()
    };
  }

  connectWebSocket(url: string) {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach(listener => listener(data));
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt reconnection after 5 seconds
      setTimeout(() => this.connectWebSocket(url), 5000);
    };
  }

  subscribe(listener: (data: DashboardData) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners = [];
  }
}