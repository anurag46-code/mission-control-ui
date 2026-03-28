'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/Dashboard'
import AgentVisualization from '@/components/AgentVisualization'
import Header from '@/components/Header'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'visualization'>('dashboard')
  const [agents, setAgents] = useState<any[]>([])

  // Mock data for development
  useEffect(() => {
    const mockAgents = [
      {
        id: 'agent-1',
        name: 'Main Agent',
        status: 'active',
        lastActivity: new Date(),
        toolCalls: 42,
        performance: 95,
        location: { x: 0, y: 0, z: 0 }
      },
      {
        id: 'agent-2', 
        name: 'Subagent Alpha',
        status: 'idle',
        lastActivity: new Date(Date.now() - 300000),
        toolCalls: 15,
        performance: 87,
        location: { x: 2, y: 1, z: 0 }
      }
    ]
    setAgents(mockAgents)
  }, [])

  return (
    <main className="min-h-screen bg-gray-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' ? (
          <Dashboard agents={agents} />
        ) : (
          <AgentVisualization agents={agents} />
        )}
      </div>
    </main>
  )
}