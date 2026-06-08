import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  BellRing, 
  Flame, 
  Droplets, 
  Bot, 
  Shuffle, 
  Cpu, 
  Wind, 
  Radio, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

/* ================================================================
   ANIMATED SENSOR WAVE CHART (Procedural SVG Graph)
   ================================================================ */
function SensorWave({ hovered, color }: { hovered: boolean; color: string }) {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setPhase((prev) => (prev + (hovered ? 0.28 : 0.08)) % (Math.PI * 2));
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [hovered]);

  // Generate SVG path for a sine wave combined with some noise
  const width = 280;
  const height = 45;
  const points = [];
  const step = 8;
  
  for (let x = 0; x <= width; x += step) {
    // Amplitude increases if hovered
    const amplitude = hovered ? 12 : 4;
    const frequency = hovered ? 0.04 : 0.02;
    // Combine two waves for complex sensor-like stream look
    const y = 
      height / 2 + 
      Math.sin(x * frequency + phase) * amplitude +
      Math.cos(x * 0.08 - phase * 0.5) * (amplitude * 0.3);
    points.push(`${x},${y}`);
  }
  
  const pathD = `M ${points.join(" L ")}`;

  return (
    <div className="relative h-12 w-full mt-4 overflow-hidden rounded-lg bg-black/40 border border-white/[0.04] p-1">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Shadow wave */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5" 
          opacity="0.25" 
          style={{ transform: "translateY(2px)" }}
        />
        {/* Primary wave */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round"
          opacity={hovered ? "0.85" : "0.5"} 
        />
        {/* Dynamic points at hover */}
        {hovered && (
          <circle 
            cx={width - 20} 
            cy={height / 2 + Math.sin((width - 20) * 0.04 + phase) * 12} 
            r="3" 
            fill={color} 
            className="animate-ping"
          />
        )}
      </svg>
    </div>
  );
}

/* ================================================================
   INNOVATIONS DIRECTORY DATA & CARD
   ================================================================ */
interface InnovationItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: any;
  metricLabel: string;
  metricVal: string;
  color: string; // Tailwind tint color or hex
  glowColor: string;
  spec: string; // Engineering standard
}

const INNOVATIONS: InnovationItem[] = [
  {
    id: "acp",
    title: "ACP Monitoring System",
    subtitle: "Alarm Chain Pull Detection",
    desc: "Provides immediate electronic detection of coach brake cylinder pressure drops (ACP pulling), sending instantaneous cab alerts with coach IDs to eliminate delay-inducing manual searches.",
    icon: BellRing,
    metricLabel: "Cab Latency",
    metricVal: "< 250ms",
    color: "text-orange-400",
    glowColor: "rgba(249,115,22,0.22)",
    spec: "RDSO Specification Compliant"
  },
  {
    id: "brake",
    title: "Brake Binding Detection",
    subtitle: "Thermal Overheat Prevention",
    desc: "Uses ruggedized thermal profiling units and wheel sensors to monitor brake shoe binding in real time, preventing wheel lockups, flat tires, and high-risk derailment hazards.",
    icon: Flame,
    metricLabel: "Detection Temp Limit",
    metricVal: "+75°C Delta",
    color: "text-red-400",
    glowColor: "rgba(239,68,68,0.20)",
    spec: "IP67 Ruggedized Sensors"
  },
  {
    id: "water",
    title: "Smart Water Level Indicator",
    subtitle: "Ultrasonic Coach Tank Monitoring",
    desc: "Ultrasonic sensors continuously log water status in passenger coaches and locomotives, transmitting levels to station controllers for predictive en-route refills, preventing dry-runs.",
    icon: Droplets,
    metricLabel: "Measurement Precision",
    metricVal: "± 5mm Delta",
    color: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.18)",
    spec: "IEC 60571 Rail Grade"
  },
  {
    id: "robot",
    title: "Loco Information Robot",
    subtitle: "Undercarriage Diagnostics Unit",
    desc: "An autonomous inspection crawler that navigates pits and locomotive undercarriages to scan brake assemblies, traction gearboxes, and suspension systems for fatigue wear.",
    icon: Bot,
    metricLabel: "Scan Cycle Speed",
    metricVal: "4.5 min/Loco",
    color: "text-emerald-400",
    glowColor: "rgba(16,185,129,0.18)",
    spec: "AI Fatigue Diagnostic Model"
  },
  {
    id: "fsd",
    title: "FSD Bypass Monitoring",
    subtitle: "Flasher Safety Device Auditing",
    desc: "Ensures the integrity of locomotive Flasher Light safety circuits by tracking unauthorized bypasses, guaranteeing driver visual warnings trigger automatically in emergency drops.",
    icon: Shuffle,
    metricLabel: "Audit Resolution",
    metricVal: "100% Events Logged",
    color: "text-amber-400",
    glowColor: "rgba(245,158,11,0.18)",
    spec: "Failsafe Design Standard"
  },
  {
    id: "mcb",
    title: "MCB Trip Monitoring",
    subtitle: "Electrical Cabinet Supervision",
    desc: "Provides continuous electrical monitoring of Miniature Circuit Breakers (MCB) inside main locomotive panels, delivering remote trip notifications to maintenance crews.",
    icon: Cpu,
    metricLabel: "Alert Trigger",
    metricVal: "< 100ms",
    color: "text-yellow-400",
    glowColor: "rgba(234,179,8,0.16)",
    spec: "IEC 60068 Environmental Test"
  },
  {
    id: "odour",
    title: "Bad Odour Management",
    subtitle: "Air Quality Restroom Controls",
    desc: "Integrated VOC and ammonia sensing hubs in train passenger coach washrooms trigger high-frequency exhaust loops and active organic neutralizers when safety levels cross thresholds.",
    icon: Wind,
    metricLabel: "Air Refresh Latency",
    metricVal: "15s Cycle",
    color: "text-purple-400",
    glowColor: "rgba(168,85,247,0.16)",
    spec: "VOC / NH3 Calibrated Sensors"
  },
  {
    id: "iot",
    title: "Railway IoT Edge Systems",
    subtitle: "Rugged Loco Uplink Hub",
    desc: "The central nervous system of modern rolling stock. Connects cabin sensors, controls, and telemetry boards via secure LTE/5G and satellite backhauls to railway command centers.",
    icon: Radio,
    metricLabel: "Uplink Frequency",
    metricVal: "10Hz Continuous",
    color: "text-blue-400",
    glowColor: "rgba(59,130,246,0.20)",
    spec: "EN 50155 Locomotive Standard"
  }
];

function InnovationCard({ item }: { item: InnovationItem }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Card 3D tilt coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range [-0.5, 0.5]
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Max 10 deg rotation
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const IconComponent = item.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(${hovered ? 1.02 : 1}, ${hovered ? 1.02 : 1}, 1)`,
        transition: hovered ? "none" : "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        background: hovered ? "oklch(0.12 0.04 260 / 0.85)" : "oklch(0.10 0.04 260 / 0.65)",
        boxShadow: hovered 
          ? `0 12px 40px -15px ${item.glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`
          : "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)"
      }}
      className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20"
    >
      {/* Dynamic top gradient line */}
      <div 
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity" 
        style={{ backgroundImage: hovered ? `linear-gradient(90deg, transparent, ${item.glowColor.replace("0.18", "0.8").replace("0.16", "0.8").replace("0.20", "0.8").replace("0.22", "0.8")}, transparent)` : "" }}
      />

      <div>
        {/* Card Header: Icon and status */}
        <div className="flex items-center justify-between">
          <div className={`grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors ${hovered ? "border-orange/20 bg-orange/[0.06]" : ""}`}>
            <IconComponent className={`h-5 w-5 ${item.color}`} />
          </div>
          
          <div className="flex items-center gap-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 text-[10px] font-mono font-medium text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            SYS_ACTIVE
          </div>
        </div>

        {/* Title and descriptions */}
        <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">{item.title}</h3>
        <p className="text-[11px] font-semibold text-orange tracking-wider uppercase mt-1">{item.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
      </div>

      {/* Sensor stream Wave chart */}
      <SensorWave hovered={hovered} color={item.id === "acp" ? "#f97316" : item.id === "brake" ? "#ef4444" : item.id === "water" ? "#06b6d4" : item.id === "robot" ? "#10b981" : item.id === "fsd" ? "#f59e0b" : item.id === "mcb" ? "#eab308" : item.id === "odour" ? "#a855f7" : "#3b82f6"} />

      {/* Footer statistics and standards */}
      <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-[10px] text-muted-foreground block">{item.metricLabel}</span>
          <span className="text-foreground font-bold">{item.metricVal}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground block">Engineering Compliance</span>
          <span className="text-muted-foreground/80 flex items-center justify-end gap-1">
            <ShieldCheck className="h-3 w-3 text-orange inline" />
            <span className="text-[9px] uppercase tracking-wide">{item.spec.substring(0, 16)}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function InnovationsGrid() {
  return (
    <section id="innovations" className="relative py-24 border-y border-white/[0.06] overflow-hidden bg-black/10">
      {/* Decorative track background element */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)",
        }}
      />
      
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.20em] text-orange flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
              Railway-Grade Solutions
            </span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Operational Safety & IoT Systems
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              VASP Systemic develops, manufactures, and integrates specialized fail-safe systems for locomotives and passenger coaches, approved and verified for extreme railway environments.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-foreground backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/25 hover:text-white"
            >
              Request Hardware Specsheets
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* 8-Card Grid Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INNOVATIONS.map((item) => (
            <InnovationCard key={item.id} item={item} />
          ))}
        </div>

        {/* Technical standards footer pill */}
        <div className="mt-14 glass flex flex-wrap justify-center items-center gap-6 rounded-2xl p-5 border border-white/[0.06] bg-black/30 text-center md:text-left">
          <div className="text-xs font-mono text-muted-foreground max-w-lg">
            All devices conform to safety-critical railway norms including <strong>IEC 60571</strong> (electronics on vehicles), <strong>EN 50155</strong>, and carry <strong>RDSO standards compliance</strong> certifications.
          </div>
          <div className="h-px w-12 bg-white/10 hidden md:block" />
          <div className="flex gap-4">
            <span className="rounded-full bg-orange/10 border border-orange/20 px-3 py-1 text-[10px] font-bold text-orange tracking-widest uppercase">
              IEC 60571
            </span>
            <span className="rounded-full bg-orange/10 border border-orange/20 px-3 py-1 text-[10px] font-bold text-orange tracking-widest uppercase">
              EN 50155
            </span>
            <span className="rounded-full bg-orange/10 border border-orange/20 px-3 py-1 text-[10px] font-bold text-orange tracking-widest uppercase">
              RDSO SPEC
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
