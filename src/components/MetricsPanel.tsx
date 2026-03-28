'use client'

import { Activity, Cpu, Clock, AlertCircle } from 'lucide-react'

interface MetricsPanelProps {
  agent: any
}

export default function MetricsPanel({ agent }: MetricsPanelProps) {
  if (!agent) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="text-center">
          <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400">Select an Agent</h3>
          <p className="text-gray-500 text-sm">Click on an agent to view detailed metrics</p>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      label: 'Status',
      value: agent.status,
      icon: Activity,
      color: agent.status === 'active' ? 'text-green-500' : 'text-yellow-500'
    },
    {
      label: 'Tool Calls',
      value: agent.toolCalls,
      icon: Cpu,
      color: 'text-blue-500'
    },
    {
      label: 'Performance',
      value: `${agent.performance}%`,
      icon: Activity,
      color: agent.performance > 90 ? 'text-green-500' : agent.performance > 70 ? 'text-yellow-500' : 'text-red-500'
    },
    {
      label: 'Last Activity',
      value: new Date(agent.lastActivity).toLocaleTimeString(),
      icon: Clock,
      color: 'text-gray-400'
    }
  ]

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
        <p className="text-gray-400">Detailed metrics and performance</p>
      </div>
      
      <div className="p-6 space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <span className="text-gray-300">{metric.label}</span>
            </div>
            <span className="font-medium text-white">{metric.value}</span>
          </div>
        ))}
      </div>
      
      <div className="p-6 border-t border-gray-700">
        <h4 className="font-medium text-white mb-3">Recent Activity</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Tool call: read file</span>
            <span className="text-gray-500">2m ago</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">Tool call: exec command</span>
            <span className="text-gray-500">5m ago</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">Status change: active → idle</span>
            <span className="text-gray-500">10m ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}