'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

interface AgentVisualizationProps {
  agents: any[]
}

function AgentNode({ agent, position }: { agent: any; position: [number, number, number] }) {
  const getColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'idle': return '#f59e0b'
      case 'error': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <group position={position}>
      {/* Agent sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color={getColor(agent.status)} />
      </mesh>
      
      {/* Performance ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshStandardMaterial 
          color={agent.performance > 90 ? '#10b981' : agent.performance > 70 ? '#f59e0b' : '#ef4444'}
          transparent 
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

function Scene({ agents }: { agents: any[] }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Grid floor */}
      <gridHelper args={[10, 10, '#374151', '#374151']} />
      
      {/* Central hub */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Agent nodes */}
      {agents.map((agent, index) => {
        const angle = (index / agents.length) * Math.PI * 2
        const radius = 3
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ]
        
        return <AgentNode key={agent.id} agent={agent} position={position} />
      })}
      
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  )
}

export default function AgentVisualization({ agents }: AgentVisualizationProps) {
  return (
    <div className="h-[600px] bg-gray-900 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">3D Agent Visualization</h2>
        <p className="text-gray-400">Interactive 3D view of your OpenClaw agents</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {agents.map(agent => (
            <div key={agent.id} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: agent.status === 'active' ? '#10b981' : agent.status === 'idle' ? '#f59e0b' : '#ef4444' }}
              ></div>
              <span className="text-sm text-gray-300">{agent.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-full">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading 3D visualization...</div>
          </div>
        }>
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <Scene agents={agents} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  )
}