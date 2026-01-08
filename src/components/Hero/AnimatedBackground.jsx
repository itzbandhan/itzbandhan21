import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PointMaterial, Points } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField({ count = 3000 }) {
    const ref = useRef()
    const mousePosition = useRef({ x: 0, y: 0 })

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
        return positions
    }, [count])

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.02
            ref.current.rotation.y += delta * 0.03

            // Subtle mouse follow
            const targetX = mousePosition.current.x * 0.0002
            const targetY = mousePosition.current.y * 0.0002
            ref.current.rotation.x += (targetY - ref.current.rotation.x) * 0.05
            ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.05
        }
    })

    return (
        <group>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#6366f1"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    )
}

function FloatingGeometry() {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2
            meshRef.current.rotation.y += delta * 0.3
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
        }
    })

    return (
        <mesh ref={meshRef} position={[3, 0, -2]}>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial
                color="#a855f7"
                wireframe
                transparent
                opacity={0.6}
            />
        </mesh>
    )
}

function FloatingTorus() {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.15
            meshRef.current.rotation.z += delta * 0.2
            meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.8) * 0.3 - 1
        }
    })

    return (
        <mesh ref={meshRef} position={[-3.5, -1, -3]}>
            <torusGeometry args={[0.8, 0.3, 16, 50]} />
            <meshStandardMaterial
                color="#ec4899"
                wireframe
                transparent
                opacity={0.5}
            />
        </mesh>
    )
}

export default function AnimatedBackground() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)'
        }}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
                <ParticleField />
                <FloatingGeometry />
                <FloatingTorus />
            </Canvas>
        </div>
    )
}
