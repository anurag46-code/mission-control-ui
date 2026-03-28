'use client'

import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

interface AgentAvatarProps {
  id: string
  name: string
  status: 'online' | 'busy' | 'offline'
  position: [number, number, number]
  type: 'robot' | 'drone' | 'hologram'
  selected: boolean
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({
  id,
  name,
  status,
  position,
  type,
  selected
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  // Status colors
  const statusColors = {
    online: '#00D4FF',
    busy: '#FF6B6B',
    offline: '#666666'
  }

  // Agent type configurations
  const agentConfigs = {
    robot: { scale: 1.2, rotationSpeed: 0.5 },
    drone: { scale: 1, rotationSpeed: 1 },
    hologram: { scale: 0.8, rotationSpeed: 0.3 }
  }

  const config = agentConfigs[type]

  useFrame((state, delta) => {
    if (groupRef.current && status !== 'offline') {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      // Rotation animation
      groupRef.current.rotation.y += delta * config.rotationSpeed
    }
  })

  const handleClick = () => {
    // This would typically trigger a callback to select the agent
    console.log(`Agent ${name} clicked`)
  }

  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Agent Model */}
      <mesh castShadow receiveShadow>
        {type === 'robot' && (
          <boxGeometry args={[1, 1.5, 1]} />
        )}
        {type === 'drone' && (
          <cylinderGeometry args={[0.5, 0.8, 0.3, 8]} />
        )}
        {type === 'hologram' && (
          <octahedronGeometry args={[0.8, 0]} />
        )}
        <meshStandardMaterial 
          color={statusColors[status]}
          emissive={statusColors[status]}
          emissiveIntensity={status === 'offline' ? 0 : 0.3}
          transparent
          opacity={type === 'hologram' ? 0.7 : 1}
        />
      </mesh>

      {/* Status Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <ringGeometry args={[1.2, 1.3, 32]} />
        <meshBasicMaterial 
          color={statusColors[status]} 
          transparent 
          opacity={hovered || selected ? 0.8 : 0.3}
        />
      </mesh>

      {/* Selection Highlight */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
          <ringGeometry args={[1.4, 1.5, 32]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Name Label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/orbitron-bold.woff"
      >
        {name}
      </Text>

      {/* Status Indicator */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={statusColors[status]} />
      </mesh>
    </group>
  )
}

export default AgentAvatar