import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Thermometer, 
  Droplet, 
  Cpu, 
  ShieldAlert, 
  Zap, 
  Wind, 
  Radio 
} from "lucide-react";

/* ================================================================
   3D COMPONENT: GLOWING RAILWAY TRACKS
   ================================================================ */
function RailwayTracks({ progress }: { progress: number }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  // Track parameters
  const trackLength = 40;
  const trackWidth = 1.6;
  const numSleeper = 40;
  
  // Create sleeper geometries
  const sleepers: THREE.Vector3[] = [];
  for (let i = 0; i < numSleeper; i++) {
    const z = -trackLength / 2 + (i / numSleeper) * trackLength;
    sleepers.push(new THREE.Vector3(-trackWidth / 2, -0.8, z));
    sleepers.push(new THREE.Vector3(trackWidth / 2, -0.8, z));
  }

  useFrame((state) => {
    if (!lineRef.current) return;
    // Animate texture offset or line parameters if needed
    // Move track texture offset for a feeling of speed if the train is moving, 
    // but here we want pulse lines traveling along rails.
  });

  // Pulse particles traveling along the tracks
  const pulseCount = 3;
  return (
    <group>
      {/* Left Rail */}
      <mesh position={[-trackWidth / 2, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, trackLength, 6]} />
        <meshBasicMaterial color="#1d4ed8" transparent opacity={0.6} />
      </mesh>
      
      {/* Right Rail */}
      <mesh position={[trackWidth / 2, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, trackLength, 6]} />
        <meshBasicMaterial color="#1d4ed8" transparent opacity={0.6} />
      </mesh>

      {/* Sleepers / Ties */}
      {Array.from({ length: numSleeper }).map((_, i) => {
        const z = -trackLength / 2 + (i / numSleeper) * trackLength;
        return (
          <mesh key={i} position={[0, -0.82, z]} rotation={[0, 0, 0]}>
            <boxGeometry args={[trackWidth + 0.3, 0.02, 0.08]} />
            <meshBasicMaterial color="#1e293b" transparent opacity={0.4} />
          </mesh>
        );
      })}

      {/* Glowing Track Pulse Waves (triggered after arrival) */}
      <TrackPulse trackWidth={trackWidth} trackLength={trackLength} trigger={progress > 0.5} />
    </group>
  );
}

function TrackPulse({ trackWidth, trackLength, trigger }: { trackWidth: number; trackLength: number; trigger: boolean }) {
  const pulseRef1 = useRef<THREE.Mesh>(null);
  const pulseRef2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!trigger) return;
    const time = state.clock.getElapsedTime();
    const speed = 12;
    
    // Left rail pulse
    if (pulseRef1.current) {
      pulseRef1.current.position.z = -trackLength / 2 + ((time * speed) % trackLength);
    }
    // Right rail pulse
    if (pulseRef2.current) {
      pulseRef2.current.position.z = -trackLength / 2 + (((time * speed) + 5) % trackLength);
    }
  });

  if (!trigger) return null;

  return (
    <group>
      <mesh ref={pulseRef1} position={[-trackWidth / 2, -0.8, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
      <mesh ref={pulseRef2} position={[trackWidth / 2, -0.8, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
    </group>
  );
}

/* ================================================================
   3D COMPONENT: HOLOGRAPHIC TRAIN
   ================================================================ */
interface TrainPartProps {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
  phase: "assembly" | "arrival" | "idle";
  time: number;
  partIndex: number;
  hovered: boolean;
}

function HolographicPart({ geometry, position, rotation = [0, 0, 0], phase, time, partIndex, hovered }: TrainPartProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const initialPos = useRef<THREE.Vector3>(new THREE.Vector3(...position));

  // Determine positions and offsets based on phases
  useFrame((state) => {
    if (!meshRef.current || !pointsRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    
    let targetX = initialPos.current.x;
    let targetY = initialPos.current.y;
    let targetZ = initialPos.current.z;

    if (phase === "assembly") {
      // Assemble phase: parts fly in from random spreads
      // partIndex determines stagger order
      const assemblyStart = partIndex * 0.3;
      const progress = Math.max(0, Math.min(1, (time - assemblyStart) / 1.2));
      
      // Visual noise offset
      const noiseFactor = (1 - progress) * 6;
      const angle = partIndex * 1.5;
      
      meshRef.current.position.x = initialPos.current.x + Math.sin(angle) * noiseFactor;
      meshRef.current.position.y = initialPos.current.y + Math.cos(angle) * noiseFactor + (1 - progress) * 4;
      meshRef.current.position.z = initialPos.current.z - (1 - progress) * 8;
      
      // Wireframe fade-in
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = progress * 0.22;
      
      const ptMat = pointsRef.current.material as THREE.PointsMaterial;
      if (ptMat) ptMat.opacity = progress * 0.7;

    } else if (phase === "arrival") {
      // Train moves forward between 2.5s and 5.0s
      const progress = Math.min(1, Math.max(0, (time - 2.5) / 2.5));
      // Start z offset at -8 and slide to 0
      const zOffset = -8 * (1 - progress);
      
      meshRef.current.position.set(targetX, targetY, targetZ + zOffset);
      
      // Smooth out opacity to nominal
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.22;
      
      const ptMat = pointsRef.current.material as THREE.PointsMaterial;
      if (ptMat) ptMat.opacity = 0.7;

    } else {
      // Idle State: gentle float and heartbeat animations
      const floatY = Math.sin(elapsed * 1.8 + partIndex * 0.4) * 0.025;
      meshRef.current.position.set(targetX, targetY + floatY, targetZ);
      
      // Micro pulse scale
      const scalePulse = 1 + Math.sin(elapsed * 2.5 + partIndex) * 0.005;
      meshRef.current.scale.set(scalePulse, scalePulse, scalePulse);

      // Hover glow behavior
      const ptMat = pointsRef.current.material as THREE.PointsMaterial;
      if (ptMat) {
        ptMat.opacity = hovered 
          ? 0.9 + Math.sin(elapsed * 8) * 0.1 
          : 0.6 + Math.sin(elapsed * 2) * 0.08;
        ptMat.size = hovered ? 0.08 : 0.06;
      }
    }
    
    // Copy transformation to the particles points mesh
    pointsRef.current.position.copy(meshRef.current.position);
    pointsRef.current.rotation.copy(meshRef.current.rotation);
    pointsRef.current.scale.copy(meshRef.current.scale);
  });

  return (
    <group>
      {/* 1. Translucent solid block for depth occlusion */}
      <mesh ref={meshRef} geometry={geometry} rotation={rotation}>
        <meshBasicMaterial 
          color="#0f172a" 
          transparent 
          opacity={0} 
          wireframe={true} 
          wireframeLinewidth={1}
        />
      </mesh>

      {/* 2. Electric Blue Wireframe lines overlay */}
      <mesh geometry={geometry} rotation={rotation} position={position}>
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.4} 
          wireframe={true} 
        />
      </mesh>

      {/* 3. Glowing orange data particles on vertices */}
      <points ref={pointsRef} geometry={geometry} rotation={rotation}>
        <pointsMaterial 
          color={hovered ? "#f97316" : "#f59e0b"} 
          size={0.06} 
          transparent 
          opacity={0.7} 
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}

function TrainLocomotive({ phase, time, hovered, activeSensor }: { 
  phase: "assembly" | "arrival" | "idle"; 
  time: number; 
  hovered: boolean;
  activeSensor: string | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Geometries for Locomotive components
  const bodyGeo = React.useMemo(() => new THREE.BoxGeometry(1.2, 0.8, 3.4), []);
  const cabinGeo = React.useMemo(() => new THREE.BoxGeometry(1.15, 1.1, 1.1), []);
  const noseGeo = React.useMemo(() => new THREE.CylinderGeometry(0.5, 0.5, 2.2, 8), []);
  const wheelGeo = React.useMemo(() => new THREE.CylinderGeometry(0.32, 0.32, 0.2, 8), []);
  const coachGeo = React.useMemo(() => new THREE.BoxGeometry(1.2, 1.1, 4.2), []);

  useEffect(() => {
    return () => {
      bodyGeo.dispose();
      cabinGeo.dispose();
      noseGeo.dispose();
      wheelGeo.dispose();
      coachGeo.dispose();
    };
  }, [bodyGeo, cabinGeo, noseGeo, wheelGeo, coachGeo]);

  // Animate headlights during arrival/idle phases
  const lightIntensity = phase === "assembly" 
    ? 0 
    : phase === "arrival" 
      ? ((time - 2.5) / 2.5) * 5 
      : 5 + Math.sin(time * 3) * 0.4; // breathing headlights

  return (
    <group ref={groupRef}>
      {/* LOCOMOTIVE PARTS */}
      {/* Body chassis */}
      <HolographicPart 
        geometry={bodyGeo} 
        position={[0, -0.2, 0.2]} 
        phase={phase} 
        time={time} 
        partIndex={0} 
        hovered={hovered || activeSensor !== null} 
      />
      
      {/* Cabin cockpit */}
      <HolographicPart 
        geometry={cabinGeo} 
        position={[0, 0.45, -0.8]} 
        phase={phase} 
        time={time} 
        partIndex={1} 
        hovered={hovered || activeSensor === "mcb" || activeSensor === "iot"} 
      />

      {/* Front Nose (cylinder rotated) */}
      <HolographicPart 
        geometry={noseGeo} 
        position={[0, 0.1, 1.2]} 
        rotation={[Math.PI / 2, 0, 0]} 
        phase={phase} 
        time={time} 
        partIndex={2} 
        hovered={hovered || activeSensor === "fsd"} 
      />

      {/* Six Locomotive wheels */}
      <HolographicPart 
        geometry={wheelGeo} 
        position={[-0.62, -0.6, 0.9]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={3} 
        hovered={hovered || activeSensor === "brake"} 
      />
      <HolographicPart 
        geometry={wheelGeo} 
        position={[0.62, -0.6, 0.9]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={4} 
        hovered={hovered || activeSensor === "brake"} 
      />
      <HolographicPart 
        geometry={wheelGeo} 
        position={[-0.62, -0.6, 0]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={5} 
        hovered={hovered || activeSensor === "brake"} 
      />
      <HolographicPart 
        geometry={wheelGeo} 
        position={[0.62, -0.6, 0]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={6} 
        hovered={hovered || activeSensor === "brake"} 
      />
      <HolographicPart 
        geometry={wheelGeo} 
        position={[-0.62, -0.6, -0.9]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={7} 
        hovered={hovered || activeSensor === "brake"} 
      />
      <HolographicPart 
        geometry={wheelGeo} 
        position={[0.62, -0.6, -0.9]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={8} 
        hovered={hovered || activeSensor === "brake"} 
      />

      {/* COACH 1 (Assembles slightly later) */}
      <HolographicPart 
        geometry={coachGeo} 
        position={[0, 0.05, -4.4]} 
        phase={phase} 
        time={time} 
        partIndex={4} 
        hovered={hovered || activeSensor === "acp" || activeSensor === "water" || activeSensor === "odour"} 
      />
      
      {/* Coach wheels */}
      <HolographicPart 
        geometry={wheelGeo} 
        position={[-0.62, -0.6, -3.2]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={9} 
        hovered={hovered} 
      />
      <HolographicPart 
        geometry={wheelGeo} 
        position={[0.62, -0.6, -3.2]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={10} 
        hovered={hovered} 
      />
      <HolographicPart 
        geometry={wheelGeo} 
        position={[-0.62, -0.6, -5.6]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={11} 
        hovered={hovered} 
      />
      <HolographicPart 
        geometry={wheelGeo} 
        position={[0.62, -0.6, -5.6]} 
        rotation={[0, 0, Math.PI / 2]} 
        phase={phase} 
        time={time} 
        partIndex={12} 
        hovered={hovered} 
      />

      {/* HEADLIGHT CONES */}
      {phase !== "assembly" && (
        <group>
          {/* Left Headlight beam */}
          <mesh position={[-0.3, 0.1, 2.3]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 4.0, 16, 1, true]} />
            <meshBasicMaterial 
              color="#ffeedd" 
              transparent 
              opacity={lightIntensity * 0.05} 
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Right Headlight beam */}
          <mesh position={[0.3, 0.1, 2.3]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 4.0, 16, 1, true]} />
            <meshBasicMaterial 
              color="#ffeedd" 
              transparent 
              opacity={lightIntensity * 0.05} 
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* SENSOR INDICATOR HOTSPOTS (Blinking nodes) */}
      {phase === "idle" && (
        <group>
          {/* ACP Sensor Node - Coach */}
          <SensorHotspot position={[0, 0.7, -4.0]} color="#f97316" active={activeSensor === "acp"} />
          {/* Brake Sensor Node - Wheel */}
          <SensorHotspot position={[0.68, -0.6, 0]} color="#ef4444" active={activeSensor === "brake"} />
          {/* Water Sensor Node - Coach bottom */}
          <SensorHotspot position={[0, -0.5, -5.2]} color="#06b6d4" active={activeSensor === "water"} />
          {/* Loco Robot Node - Locomotive bottom */}
          <SensorHotspot position={[0, -0.65, 0.8]} color="#10b981" active={activeSensor === "robot"} />
          {/* FSD Bypass Node - Nose */}
          <SensorHotspot position={[0, 0.5, 2.1]} color="#f59e0b" active={activeSensor === "fsd"} />
          {/* MCB Trip Node - Cabin */}
          <SensorHotspot position={[0, 0.5, -0.6]} color="#eab308" active={activeSensor === "mcb"} />
          {/* Odour Sensor Node - Restroom */}
          <SensorHotspot position={[0, 0.2, -5.8]} color="#a855f7" active={activeSensor === "odour"} />
          {/* IoT Antenna Node - Cabin top */}
          <SensorHotspot position={[0, 1.1, -0.8]} color="#3b82f6" active={activeSensor === "iot"} />
        </group>
      )}
    </group>
  );
}

function SensorHotspot({ position, color, active }: { position: [number, number, number]; color: string; active: boolean }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!sphereRef.current) return;
    const t = state.clock.getElapsedTime();
    // Pulse scale
    const s = (active ? 2.0 : 1.0) + Math.sin(t * (active ? 12 : 5)) * 0.25;
    sphereRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={sphereRef} position={position}>
      <sphereGeometry args={[active ? 0.12 : 0.08, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}

/* ================================================================
   3D COMPONENT: SCENE CONTROLLER & PARTICLE FIELD
   ================================================================ */
function SceneController({ phase, time, mouseRef }: { 
  phase: "assembly" | "arrival" | "idle"; 
  time: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();

  // Setup camera parallax and lighting angles
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;

    // Normalizing screen coordinates to camera offsets
    const targetX = mx * 2.0;
    const targetY = 2.4 - my * 1.5;
    const targetZ = 6.2;

    if (phase === "assembly") {
      // Sweeping camera on initial load
      const sweepProgress = Math.min(1, time / 2.5);
      camera.position.x = THREE.MathUtils.lerp(3.5, 0, sweepProgress);
      camera.position.y = THREE.MathUtils.lerp(4.0, 2.4, sweepProgress);
      camera.position.z = THREE.MathUtils.lerp(10.0, 6.2, sweepProgress);
    } else {
      // Lerp to interactive camera position
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    }

    camera.lookAt(0, -0.1, -1.0);
  });

  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.12} />
      
      {/* Directional tech cyan light */}
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#06b6d4" />
      
      {/* Backlight orange to highlight contour */}
      <directionalLight position={[-8, 4, -10]} intensity={0.4} color="#f97316" />
      
      {/* Volumetric spot light on track center */}
      <spotLight 
        position={[0, 8, 2]} 
        angle={0.6} 
        penumbra={1} 
        intensity={1.2} 
        color="#3b82f6" 
      />

      {/* Cybernetic Starfield / Data Grid */}
      <FloatingDataField phase={phase} />
    </group>
  );
}

function FloatingDataField({ phase }: { phase: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const [positions, speeds] = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    const speedArr = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20; // x
      arr[i * 3 + 1] = Math.random() * 8 - 3;   // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
      speedArr[i] = Math.random() * 0.05 + 0.02; // speed
    }
    return [arr, speedArr];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      // Flow particles along Z direction (simulating movement)
      arr[i * 3 + 2] += speeds[i];
      if (arr[i * 3 + 2] > 15) {
        arr[i * 3 + 2] = -15; // wrap around
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#3b82f6" 
        size={0.035} 
        transparent 
        opacity={phase === "assembly" ? 0.2 : 0.45} 
        sizeAttenuation={true} 
      />
    </points>
  );
}

/* ================================================================
   HTML: TELEMETRY OVERLAY COMPONENT
   ================================================================ */
interface TelemetryItem {
  id: string;
  label: string;
  value: string;
  status: "Normal" | "Secure" | "Optimal" | "Calibrated" | "Active" | "Clear" | "Excellent";
  icon: any;
  metric: string;
}

const TELEMETRY_DATA: TelemetryItem[] = [
  { id: "acp", label: "ACP Monitor", value: "Nominal", status: "Secure", icon: ShieldAlert, metric: "5.0 kg/cm²" },
  { id: "brake", label: "Brake Binding", value: "Thermal Check", status: "Normal", icon: Thermometer, metric: "42.3 °C" },
  { id: "water", label: "Aux Water", value: "92% Full", status: "Optimal", icon: Droplet, metric: "1420 L" },
  { id: "robot", label: "Loco Robot", value: "Scanning", status: "Calibrated", icon: Cpu, metric: "Standby" },
  { id: "fsd", label: "FSD Bypass", value: "Failsafe", status: "Secure", icon: Zap, metric: "Inactive" },
  { id: "mcb", label: "MCB Cabinet", value: "Operational", status: "Active", icon: Activity, metric: "Closed" },
  { id: "odour", label: "Odour Index", value: "Clear Air", status: "Clear", icon: Wind, metric: "0.12 VOC" },
  { id: "iot", label: "IoT Gateway", value: "Linked", status: "Excellent", icon: Radio, metric: "-68 dBm" },
];

function TelemetryOverlay({ activeSensor, setActiveSensor, isBooted }: {
  activeSensor: string | null;
  setActiveSensor: (id: string | null) => void;
  isBooted: boolean;
}) {
  const [data, setData] = useState<TelemetryItem[]>(TELEMETRY_DATA);

  // Simulate live data fluctuations
  useEffect(() => {
    if (!isBooted) return;
    const interval = setInterval(() => {
      setData((prev) => 
        prev.map((item) => {
          if (item.id === "brake") {
            const nextTemp = (41 + Math.random() * 2.8).toFixed(1);
            return { ...item, metric: `${nextTemp} °C` };
          }
          if (item.id === "acp") {
            const nextPress = (4.9 + Math.random() * 0.3).toFixed(2);
            return { ...item, metric: `${nextPress} kg/cm²` };
          }
          if (item.id === "odour") {
            const nextVoc = (0.10 + Math.random() * 0.05).toFixed(2);
            return { ...item, metric: `${nextVoc} VOC` };
          }
          return item;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isBooted]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none">
      
      {/* Top row: Digital twin title */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl px-4 py-2 border border-white/[0.07] bg-black/40 backdrop-blur"
        >
          <div className="text-[10px] uppercase tracking-[0.18em] text-orange font-bold">Systems Diagnostic</div>
          <h3 className="text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Connected Railway Digital Twin
          </h3>
        </motion.div>

        {/* Status code indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="hidden sm:block glass rounded-xl px-3 py-1.5 border border-white/[0.07] bg-black/40 text-right text-[10px] font-mono text-muted-foreground"
        >
          <div>TWIN_ID: VS-LOC-9922</div>
          <div>BAUD: 115200 // SAT_LINK</div>
        </motion.div>
      </div>

      {/* Bottom Panel: Horizontal scroll telemetry stats */}
      <div className="w-full overflow-hidden mt-auto pt-4">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 px-1">
          Live Telemetry Node Overlay (Hover to inspect)
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none pointer-events-auto">
          {data.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSensor === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.06 }}
                onMouseEnter={() => isBooted && setActiveSensor(item.id)}
                onMouseLeave={() => setActiveSensor(null)}
                className={`flex-shrink-0 flex items-center gap-3 rounded-xl border p-3 min-w-[170px] cursor-pointer transition-all duration-300 backdrop-blur-md ${
                  isActive 
                    ? "bg-orange/[0.12] border-orange shadow-[0_0_15px_rgba(249,115,22,0.18)]" 
                    : "bg-black/35 border-white/[0.06] hover:border-white/20 hover:bg-black/50"
                }`}
              >
                <div className={`p-1.5 rounded-lg border ${isActive ? "bg-orange/20 border-orange/40 text-orange" : "bg-white/[0.04] border-white/10 text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-medium text-muted-foreground">{item.label}</div>
                  <div className="text-xs font-bold text-foreground mt-0.5">{item.metric}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    <span className="text-[9px] text-green-400/90 font-mono tracking-wider uppercase">{item.status}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("WebGL Canvas Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="w-full h-full flex items-center justify-center bg-black/40 text-muted-foreground text-xs p-4 text-center">
          <div>
            <p className="font-semibold text-orange mb-1">3D Twin Offline</p>
            <p className="text-[10px]">WebGL canvas rendering failed</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ================================================================
   MAIN CONTAINER COMPONENT
   ================================================================ */
export default function RailwayDigitalTwin() {
  const [phase, setPhase] = useState<"assembly" | "arrival" | "idle">("assembly");
  const [time, setTime] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [activeSensor, setActiveSensor] = useState<string | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Handle phase progression
  useEffect(() => {
    let start = performance.now();
    let animId: number;

    const tick = () => {
      const current = (performance.now() - start) / 1000;
      setTime(current);

      if (current < 2.5) {
        setPhase("assembly");
      } else if (current < 5.0) {
        setPhase("arrival");
      } else {
        setPhase("idle");
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Track mouse coordinates for camera rotation
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const isBooted = phase === "idle";

  return (
    <div 
      className="relative w-full h-[520px] md:h-[600px] lg:h-[660px] rounded-2xl overflow-hidden border border-white/[0.06] bg-black/10 transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.06)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActiveSensor(null);
      }}
    >
      {/* 3D R3F Canvas */}
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 2.4, 6.2], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full z-10"
        >
          <SceneController phase={phase} time={time} mouseRef={mouseRef} />
          
          {/* Procedural Track System */}
          <RailwayTracks progress={time / 5.0} />

          {/* 3D Train Monolith */}
          <TrainLocomotive 
            phase={phase} 
            time={time} 
            hovered={hovered} 
            activeSensor={activeSensor} 
          />
        </Canvas>
      </CanvasErrorBoundary>

      {/* Floating telemetries card overlay */}
      <TelemetryOverlay 
        activeSensor={activeSensor} 
        setActiveSensor={setActiveSensor} 
        isBooted={isBooted} 
      />

      {/* Grid Scan Lines overlays for Sci-fi tech feel */}
      <div 
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(18, 100, 255, 0.1) 50%, transparent 50%)",
          backgroundSize: "100% 4px",
        }}
      />
      
      {/* Ambient vignetting */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-background via-transparent to-background/50" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-20 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
