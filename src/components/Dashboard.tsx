'use client'

import { useState } from 'react'
import { Clock, Activity, Cpu, Zap, AlertCircle } from 'lucide-react'
import AgentCard from './AgentCard'
import MetricsPanel from './MetricsPanel'

interface DashboardProps {
  agents: any[]
}

export default function Dashboard({ agents }: DashboardProps) {
  const [selectedAgent, setSelectedAgent] = useState<any>(null)

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    totalToolCalls: agents.reduce((sum, agent) => sum + agent.toolCalls, 0),
    avgPerformance: agents.length > 0 
      ? Math.round(agents.reduce((sum, agent) => sum + agent.performance, 0) / agents.length)
      : 0
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Overview */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Agents</p>
              <p className="text-2xl font-bold text-white">{stats.totalAgents}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Agents</p>
              <p className="text-2xl font-bold text-white">{stats.activeAgents}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tool Calls</p>
              <p className="text-2xl font-bold text-white">{stats.totalToolCalls}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Performance</p>
              <p className="text-2xl font-bold text-white">{stats.avgPerformance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="lg:col-span-2">
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Active Agents</h2>
            <p className="text-gray-400">Monitor your OpenClaw agents in real-time</p>
          </div>
          
          <div className="divide-y divide-gray-700">
            {agents.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                isSelected={selectedAgent?.id === agent.id}
                onSelect={() => setSelectedAgent(agent)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="lg:col-span-1">
        <MetricsPanel agent={selectedAgent} />
      </div>
    </div>
  )
}