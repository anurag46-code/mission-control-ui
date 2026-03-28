'use client'

import { Clock, Activity, Cpu, AlertCircle } from 'lucide-react'

interface AgentCardProps {
  agent: any
  isSelected: boolean
  onSelect: () => void
}

export default function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />
      case 'idle': return <Clock className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const formatLastActivity = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div 
      className={`p-4 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-600/20 border-l-4 border-blue-500' : 'hover:bg-gray-700/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
          <div>
            <h3 className="font-medium text-white">{agent.name}</h3>
            <p className="text-sm text-gray-400">ID: {agent.id}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            {getStatusIcon(agent.status)}
            <span className="capitalize">{agent.status}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Cpu className="h-4 w-4" />
            <span>{agent.toolCalls}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatLastActivity(agent.lastActivity)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${agent.performance}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-400 ml-3">{agent.performance}%</span>
      </div>
    </div>
  )
}