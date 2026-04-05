import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Agent } from '../../types/vertex';

interface AgentNetwork3DProps {
  agents: Agent[];
}

const AgentNetwork3D: React.FC<AgentNetwork3DProps> = ({ agents }) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Generate connections between agents
  const connections = useMemo(() => {
    const conns: Array<{ from: [number, number, number]; to: [number, number, number] }> = [];
    
    // Connect each agent to 2-3 other agents
    agents.forEach((agent, i) => {
      const connectionsCount = Math.floor(Math.random() * 2) + 2;
      const connectedIndices = new Set<number>();
      
      while (connectedIndices.size < connectionsCount && connectedIndices.size < agents.length - 1) {
        const targetIndex = Math.floor(Math.random() * agents.length);
        if (targetIndex !== i && !connectedIndices.has(targetIndex)) {
          connectedIndices.add(targetIndex);
          conns.push({
            from: [agent.position.x, agent.position.y, agent.position.z],
            to: [
              agents[targetIndex].position.x,
              agents[targetIndex].position.y,
              agents[targetIndex].position.z
            ]
          });
        }
      }
    });
    
    return conns;
  }, [agents]);

  // Get color based on agent status
  const getAgentColor = (agent: Agent) => {
    switch (agent.status) {
      case 'active': return '#0066FF'; // VERTEX Blue
      case 'idle': return '#FFAA00';   // Amber
      case 'error': return '#FF3366';  // Danger
      case 'offline': return '#666666'; // Gray
      default: return '#8A2BE2';       // Purple
    }
  };

  // Get size based on agent activity
  const getAgentSize = (agent: Agent) => {
    const baseSize = 0.5;
    const activityFactor = (agent.cpu + agent.memory) / 200; // 0-1 scale
    return baseSize + activityFactor * 0.3;
  };

  // Animation frame
  useFrame((state, delta) => {
    timeRef.current += delta;
    
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = timeRef.current * 0.1;
      
      // Bobbing animation for agents
      groupRef.current.children.forEach((child, i) => {
        if (child.name === 'agent') {
          const agent = agents[i % agents.length];
          const bobHeight = 0.1;
          const bobSpeed = 1 + (agent.cpu / 100);
          child.position.y = agent.position.y + Math.sin(timeRef.current * bobSpeed) * bobHeight;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Grid Floor */}
      <gridHelper args={[20, 20, '#0066FF', '#0066FF']} position={[0, -3, 0]} />
      
      {/* Connections */}
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[conn.from, conn.to]}
          color="#00D4FF"
          lineWidth={1}
          opacity={0.3}
          transparent
        />
      ))}

      {/* Data Flow Particles */}
      {connections.map((conn, i) => {
        const progress = (Math.sin(timeRef.current * 2 + i) + 1) / 2;
        const x = conn.from[0] + (conn.to[0] - conn.from[0]) * progress;
        const y = conn.from[1] + (conn.to[1] - conn.from[1]) * progress;
        const z = conn.from[2] + (conn.to[2] - conn.from[2]) * progress;
        
        return (
          <Sphere
            key={`particle-${i}`}
            position={[x, y, z]}
            args={[0.1, 8, 8]}
          >
            <meshBasicMaterial color="#00D4FF" />
          </Sphere>
        );
      })}

      {/* Agents */}
      {agents.map((agent, i) => (
        <group key={agent.id}>
          <Sphere
            position={[agent.position.x, agent.position.y, agent.position.z]}
            args={[getAgentSize(agent), 16, 16]}
            name="agent"
          >
            <meshStandardMaterial
              color={getAgentColor(agent)}
              emissive={getAgentColor(agent)}
              emissiveIntensity={0.3}
              roughness={0.1}
              metalness={0.8}
            />
          </Sphere>

          {/* Agent Label */}
          <Text
            position={[agent.position.x, agent.position.y + getAgentSize(agent) + 0.5, agent.position.z]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {agent.name}
          </Text>

          {/* Status Ring */}
          <mesh
            position={[agent.position.x, agent.position.y, agent.position.z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[getAgentSize(agent) + 0.2, getAgentSize(agent) + 0.25, 32]} />
            <meshBasicMaterial
              color={getAgentColor(agent)}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Activity Pulse */}
          <mesh
            position={[agent.position.x, agent.position.y, agent.position.z]}
            rotation={[Math.PI / 2, 0, timeRef.current]}
          >
            <ringGeometry args={[getAgentSize(agent) + 0.3, getAgentSize(agent) + 0.35, 32]} />
            <meshBasicMaterial
              color={getAgentColor(agent)}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Central Core */}
      <Sphere position={[0, 0, 0]} args={[1, 32, 32]}>
        <meshStandardMaterial
          color="#0066FF"
          emissive="#0066FF"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>

      {/* Core Glow */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#0066FF" distance={10} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#8A2BE2" distance={8} />

      {/* Ambient Particles */}
      {[...Array(50)].map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 5 + Math.random() * 5;
        const height = Math.random() * 4 - 2;
        const speed = 0.5 + Math.random() * 1;
        
        const x = Math.cos(angle + timeRef.current * speed) * radius;
        const z = Math.sin(angle + timeRef.current * speed) * radius;
        const y = height + Math.sin(timeRef.current * speed + i) * 0.5;
        
        return (
          <Sphere
            key={`ambient-${i}`}
            position={[x, y, z]}
            args={[0.05, 4, 4]}
          >
            <meshBasicMaterial
              color={i % 3 === 0 ? '#0066FF' : i % 3 === 1 ? '#8A2BE2' : '#00D4FF'}
              transparent
              opacity={0.3}
            />
          </Sphere>
        );
      })}
    </group>
  );
};

export default AgentNetwork3D;