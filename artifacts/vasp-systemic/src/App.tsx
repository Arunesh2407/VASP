import { Shield, Train, Cpu, CheckCircle, Boxes, Code2, Workflow, Globe, ArrowRight, ChevronDown, ChevronRight, Activity } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, type Variants, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import RailwayDigitalTwin from "./components/RailwayDigitalTwin";
import InnovationsGrid from "./components/InnovationsGrid";
import { Route, Switch, useLocation } from "wouter";
import NotFound from "./pages/not-found";

const EASE_SPRING = [0.16, 1, 0.3, 1] as const;

function VaspLogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-5 w-5 text-orange">
      <path d="M4 3L12 21L20 3" />
      <path d="M7 8H17" />
      <path d="M9 13H15" />
    </svg>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, delay: i * 0.09, ease: EASE_SPRING },
  }),
};

function useMouse() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const on = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", on, { passive: true });
    return () => window.removeEventListener("mousemove", on);
  }, [x, y]);
  return { x, y };
}

/* ================================================================
   CURSOR GLOW
================================================================ */
function CursorGlow() {
  const { x, y } = useMouse();
  const sx = useSpring(x, { stiffness: 55, damping: 20 });
  const sy = useSpring(y, { stiffness: 55, damping: 20 });
  return (
    <motion.div aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.10] blur-[100px] will-change-transform"
      style={{ x: sx, y: sy, background: "radial-gradient(circle, oklch(0.70 0.20 50) 0%, oklch(0.60 0.18 240) 60%, transparent 80%)" }}
    />
  );
}

/* ================================================================
   MESH BACKGROUND
================================================================ */
function MeshBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 160% 160% at 60% 15%, oklch(0.16 0.06 240 / 0.7) 0%, oklch(0.06 0.03 262) 90%)" }} />
      <div className="absolute h-[700px] w-[700px] -right-[180px] -top-[180px] rounded-full opacity-20 blur-[110px]"
        style={{ background: "radial-gradient(circle, oklch(0.60 0.18 240), transparent 70%)", animation: "meshDrift1 30s ease-in-out infinite" }} />
      <div className="absolute h-[500px] w-[500px] -bottom-[120px] -left-[80px] rounded-full opacity-15 blur-[90px]"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.20 50), transparent 70%)", animation: "meshDrift2 36s ease-in-out infinite" }} />
      <div className="absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: "linear-gradient(oklch(0.97 0.005 250 / 0.6) 1px, transparent 1px), linear-gradient(90deg, oklch(0.97 0.005 250 / 0.6) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    </div>
  );
}

/* ================================================================
   BACKGROUND PARTICLES (star field)
================================================================ */
function StarField({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const N = 90;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.2 + 0.3, op: Math.random() * 0.35 + 0.08,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${p.op})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [mouseRef]);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden />;
}

/* ================================================================
   SCROLL PROGRESS
================================================================ */
function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <div className="fixed left-0 top-0 z-40 h-full w-0.5 origin-top" aria-hidden>
      <div className="h-full w-full bg-white/[0.04]" />
      <motion.div className="absolute inset-x-0 top-0 origin-top rounded-full"
        style={{ scaleY, height: "100%", background: "linear-gradient(to bottom, oklch(0.70 0.20 50), oklch(0.60 0.18 240))", boxShadow: "0 0 8px 1px oklch(0.70 0.20 50 / 0.5)" }} />
    </div>
  );
}

/* ================================================================
   MAGNETIC BUTTON
================================================================ */
function MagneticButton({ children, href, className, variant = "orange" }: {
  children: React.ReactNode; href: string; className?: string; variant?: "orange" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.3 });
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.32);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  if (variant === "ghost") {
    return (
      <motion.a ref={ref} href={href} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ x: sx, y: sy }} whileHover={{ scale: 1.04 }} transition={{ ease: EASE_SPRING }}
        className={`relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-all hover:border-white/25 hover:bg-white/10 ${className ?? ""}`}
      >{children}</motion.a>
    );
  }
  return (
    <motion.a ref={ref} href={href} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy, boxShadow: "0 0 28px oklch(0.70 0.20 50 / 0.4)" }} whileHover={{ scale: 1.05 }} transition={{ ease: EASE_SPRING }}
      className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-white ${className ?? ""}`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.20), transparent 60%)" }} />
      {children}
    </motion.a>
  );
}

/* ================================================================
   TILT CARD
================================================================ */
function TiltCard({ children, className, glowColor }: {
  children: React.ReactNode; className?: string; glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0); const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 280, damping: 24 });
  const sRotY = useSpring(rotY, { stiffness: 280, damping: 24 });
  const [mp, setMp] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rotY.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 9);
    rotX.set(-((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 9);
    setMp({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { rotX.set(0); rotY.set(0); setHovered(false); }}
      style={{ rotateX: sRotX, rotateY: sRotY, transformPerspective: 900 }}
      className={`will-change-transform ${className ?? ""}`}
    >
      {hovered && <div aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-none"
        style={{ background: `radial-gradient(circle at ${mp.x}% ${mp.y}%, ${glowColor ?? "rgba(96,165,250,0.25)"}, transparent 55%)`, opacity: 0.4 }} />}
      {children}
    </motion.div>
  );
}

/* ================================================================
   COUNT-UP
================================================================ */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView) return;
    let start = 0; const step = target / 55;
    const iv = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(iv); }
      else setValue(Math.floor(start));
    }, 26);
    return () => clearInterval(iv);
  }, [inView, target]);
  return <span ref={ref}>{value}{suffix}</span>;
}

/* ================================================================
   HEADER
================================================================ */
function Header({ onRequestDemo }: { onRequestDemo?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 50);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed top-4 inset-x-0 z-50 px-4">
      <motion.header initial={{ y: -28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55, ease: EASE_SPRING }}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 md:px-7 ${scrolled ? "glass border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "border border-white/[0.07] bg-white/[0.02]"}`}
      >
        <div className="absolute inset-x-4 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-70" />

        {/* Logo */}
        <motion.a href="#" className="flex items-center gap-3" whileHover={{ scale: 1.02 }} transition={{ ease: EASE_SPRING }}>
          <img src="/logo.png" alt="VASP Logo" className="h-9 w-9 object-contain rounded-lg bg-white p-0.5 border border-white/10" />
          <div className="hidden leading-tight sm:block text-left">
            <div className="text-[12px] font-black tracking-[0.14em] text-foreground">VASP SYSTEMIC</div>
            <div className="text-[8px] tracking-[0.12em] font-mono text-muted-foreground">RAIL SYSTEM ENGINE</div>
          </div>
        </motion.a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {[
            { name: "About Us", href: "/#about" },
            { name: "Services", href: "/#services" },
            { name: "Hackathon", href: "/hackathon" },
            { name: "Contact", href: "/#contact" }
          ].map((item) => (
            <motion.a key={item.name} href={item.href} className="transition-colors hover:text-foreground relative group py-1" whileHover={{ y: -1 }} transition={{ ease: EASE_SPRING, duration: 0.2 }}>
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-orange transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground">
            <Globe className="h-3.5 w-3.5" />
            <span>EN</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          <motion.button onClick={onRequestDemo} whileHover={{ scale: 1.04 }} transition={{ ease: EASE_SPRING }}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-white transition-all hover:shadow-[0_0_24px_oklch(0.70_0.20_50_/_0.55)] cursor-pointer"
            style={{ boxShadow: "0 0 18px oklch(0.70 0.20 50 / 0.30)" }}>
            Request Demo <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </motion.header>
    </div>
  );
}

/* ================================================================
   HERO
================================================================ */
function Hero({ onRequestDemo }: { onRequestDemo?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 55]);

  const [initPhase, setInitPhase] = useState<"initializing" | "loading" | "ready">("initializing");
  useEffect(() => {
    const t1 = setTimeout(() => setInitPhase("loading"), 1800);
    const t2 = setTimeout(() => setInitPhase("ready"), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const on = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", on, { passive: true });
    return () => window.removeEventListener("mousemove", on);
  }, []);

  const { x: mx, y: my } = useMouse();
  const parallaxX = useSpring(useTransform(mx, [0, typeof window !== "undefined" ? window.innerWidth : 1440], [8, -8]), { stiffness: 25, damping: 18 });
  const parallaxY = useSpring(useTransform(my, [0, typeof window !== "undefined" ? window.innerHeight : 900], [6, -6]), { stiffness: 25, damping: 18 });

  const statusLabel = {
    initializing: "Train initializing",
    loading: "System loading",
    ready: "System ready",
  }[initPhase];
  const statusSub = {
    initializing: "Please wait...",
    loading: "Calibrating sensors...",
    ready: "All systems nominal",
  }[initPhase];

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center pt-28 md:pt-36 pb-12">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 120% at 65% 45%, oklch(0.18 0.07 240 / 0.55) 0%, transparent 100%)" }} />

      {/* Track lines — decorative */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 opacity-20"
        style={{ background: "linear-gradient(to top, oklch(0.70 0.20 50 / 0.08), transparent)", backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(249,115,22,0.06) 120px, rgba(249,115,22,0.06) 121px)" }} />

      <motion.div style={{ opacity, y: heroY }} className="relative mx-auto grid max-w-7xl grid-cols-1 items-center px-6 md:grid-cols-12 gap-8 py-10 md:py-6 w-full">

        {/* ── LEFT: text content ── */}
        <motion.div className="relative z-20 md:col-span-5 flex flex-col justify-center text-left py-10 md:py-0"
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Tagline pill */}
          <motion.div variants={fadeUp} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <span className="text-orange font-bold uppercase tracking-wider">RDSO Standards Compliant</span>
            <span className="text-muted-foreground">• Industrial IoT</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="mt-6 text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight">
            Engineering<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--orange) 0%, oklch(0.78 0.13 60) 100%)" }}>
              Intelligence
            </span><br />
            for Modern Railways
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-muted-foreground">
            Deploying ruggedized edge hardware, real-time IoT monitoring, and predictive analytics to solve safety-critical challenges in modern rail operations — from brake binding detection to smart automation.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton href="#innovations" variant="orange">Explore Solutions <ArrowRight className="h-4 w-4" /></MagneticButton>
            <button onClick={onRequestDemo}
              className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-all hover:border-white/25 hover:bg-white/10 cursor-pointer hover:scale-[1.04] active:scale-[0.98]"
            >Request Demo <ChevronRight className="h-4 w-4" /></button>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: 3D digital twin railway experience ── */}
        <div className="relative col-span-1 md:col-span-7 flex items-center justify-center z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE_SPRING, delay: 0.2 }}
            className="w-full h-full"
          >
            <RailwayDigitalTwin />
          </motion.div>
        </div>


        {/* ── Scroll indicator ── */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 hidden md:block">
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================================================================
   STATS / METRICS
================================================================ */
function Metrics() {
  const stats = [
    { icon: Shield, value: 10, suffix: "+", label: "Years Rail Expertise", sub: "A decade of core railway systems engineering." },
    { icon: Train, value: 450, suffix: "+", label: "Locomotives Equipped", sub: "Ruggedized IoT devices deployed in active operations." },
    { icon: Activity, value: 12000, suffix: "+", label: "Railway Assets Monitored", sub: "Real-time parameters tracked by cloud telemetry." },
    { icon: CheckCircle, value: 99.9, suffix: "%", label: "Failsafe Reliability", sub: "Maximum operational uptime under harsh environments." },
  ];
  return (
    <section id="compliance" className="relative py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.0 } } }}>
          <motion.div variants={fadeUp}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 md:p-0"
            style={{ background: "oklch(0.10 0.04 250 / 0.85)", backdropFilter: "blur(16px)", boxShadow: "0 4px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="grid grid-cols-2 divide-white/[0.07] md:grid-cols-4 md:divide-x">
              {stats.map(({ icon: Icon, value, suffix, label, sub }, i) => (
                <div key={label} className={`group flex flex-col items-center p-6 text-center md:p-8 ${i % 2 === 1 ? "border-l border-white/[0.07] md:border-0" : ""} ${i >= 2 ? "border-t border-white/[0.07] md:border-t-0" : ""}`}>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] transition-all duration-300 group-hover:border-orange/30 group-hover:bg-orange/[0.08]">
                    <Icon className="h-4.5 w-4.5 text-orange" style={{ height: "18px", width: "18px" }} />
                  </div>
                  <div className="text-4xl font-bold text-orange md:text-5xl">
                    <CountUp target={typeof value === "number" ? Math.floor(value) : 0} suffix={suffix === "%" && value === 99.9 ? ".9%" : suffix} />
                  </div>
                  <div className="mt-1.5 text-sm font-semibold text-foreground">{label}</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   SERVICES
================================================================ */
function Services() {
  const items = [
    { icon: Cpu, title: "IoT Solutions", desc: "Connected sensors and edge gateways purpose-built for trackside and onboard deployment.", glowColor: "rgba(96,165,250,0.25)", accent: "text-electric" },
    { icon: Boxes, title: "Hardware", desc: "Ruggedized industrial hardware engineered for the demanding railway environment.", glowColor: "rgba(249,115,22,0.22)", accent: "text-orange" },
    { icon: Code2, title: "Software", desc: "Real-time monitoring, analytics, and control software powering operational decisions.", glowColor: "rgba(234,179,8,0.18)", accent: "text-gold" },
    { icon: Workflow, title: "System Design", desc: "End-to-end architecture and integration for safety-critical railway systems.", glowColor: "rgba(168,85,247,0.2)", accent: "text-purple-400" },
  ];
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="max-w-2xl">
          <motion.span variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.15em] text-electric">What we do</motion.span>
          <motion.h2 variants={fadeUp} className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Our Core Services</motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-muted-foreground">A vertically-integrated stack tuned for the realities of modern rail.</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc, glowColor, accent }, i) => (
            <motion.div key={title} custom={i} variants={fadeUp} className="h-full">
              <TiltCard className="relative h-full" glowColor={glowColor}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] p-6 transition-all duration-500"
                  style={{ background: "oklch(0.11 0.04 260 / 0.65)", backdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
                  <div className={`grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition-all group-hover:border-orange/30 group-hover:bg-orange/[0.08]`}>
                    <Icon className={`h-5 w-5 ${accent}`} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-orange opacity-0 transition-all group-hover:opacity-100">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   ABOUT US
================================================================ */
function AboutUs() {
  return (
    <section id="about" className="py-24 border-t border-white/[0.06] overflow-hidden bg-black/10">
      <div className="mx-auto max-w-6xl px-6 relative z-10">

        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.20em] text-orange flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
            Who We Are
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            About VASP Systemic
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A technology leader dedicated to solving safety-critical and operational challenges in modern railway networks through advanced IoT engineering.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">

          {/* Left: Vision & Mission & Founder */}
          <div className="md:col-span-7 flex flex-col gap-6">

            {/* Vision Card */}
            <div className="rounded-2xl border border-white/[0.08] p-6 backdrop-blur-md bg-white/[0.02] hover:border-white/15 transition-all duration-300">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-electric block mb-2">Our Vision</span>
              <h3 className="text-xl font-bold text-foreground">World-Class Rail Innovation</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                To be the world leader in IOT / Innovation for railways, engineering the future of intelligent public transport systems.
              </p>
            </div>

            {/* Mission Card */}
            <div className="rounded-2xl border border-white/[0.08] p-6 backdrop-blur-md bg-white/[0.02] hover:border-white/15 transition-all duration-300">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-orange block mb-2">Our Mission</span>
              <h3 className="text-xl font-bold text-foreground">Failsafe Engineering</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                To build rugged, failsafe, and intelligent IoT systems that transform rail safety, maximize uptime, and accelerate the modernization of transit networks worldwide.
              </p>
            </div>

            {/* Founder Card */}
            <div className="rounded-2xl border border-white/[0.08] p-6 backdrop-blur-md bg-white/[0.02] hover:border-white/15 transition-all duration-300">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gold block mb-2">Leadership</span>
              <h3 className="text-xl font-bold text-foreground">Founder</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground/50 italic">
                Founder details will be shared soon.
              </p>
            </div>

          </div>

          {/* Right: Contact Card */}
          <div className="md:col-span-5 h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.08] p-8 backdrop-blur-md transition-all duration-300 bg-white/[0.02]"
              style={{ background: "radial-gradient(circle at 100% 100%, oklch(0.12 0.04 260 / 0.85) 0%, oklch(0.10 0.04 260 / 0.65) 100%)" }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <h3 className="text-xl font-bold tracking-tight mb-6 text-foreground">Contact Details</h3>

              <div className="flex flex-col gap-6">

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4.5 w-4.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">Address</span>
                    <span className="text-sm font-medium text-foreground leading-relaxed">7th floor prakash tower indore mp india</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4.5 w-4.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">Phone</span>
                    <a href="tel:8446636550" className="text-sm font-medium text-foreground hover:text-orange transition-colors">8446636550</a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4.5 w-4.5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">Email</span>
                    <a href="mailto:VASP@gmail.com" className="text-sm font-medium text-foreground hover:text-orange transition-colors">VASP@gmail.com</a>
                  </div>
                </div>

              </div>

              {/* Mini Contact Form */}
              <div className="mt-8 pt-6 border-t border-white/[0.05]">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-electric mb-4">Send a Message</h4>
                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                  <textarea
                    placeholder="Your message..."
                    rows={3}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="rounded-lg bg-orange py-2 text-xs font-semibold text-white hover:bg-orange/90 active:scale-[0.98] transition-all shadow-[0_0_15px_oklch(0.70_0.20_50_/_0.3)]"
                  >
                    Send Message
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ================================================================
   HACKATHON PAGE
================================================================ */
function HackathonPage() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6 py-20">
      {/* Decorative center glow */}
      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.20 50), transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_SPRING }}
        className="relative max-w-2xl w-full text-center glass border border-white/[0.08] rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(249,115,22,0.15)] bg-white/[0.01]"
      >
        {/* Animated tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange"></span>
          </span>
          VASP Hackathon 2026
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
          Engineering the <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--orange) 0%, oklch(0.78 0.13 60) 100%)" }}>
            Railways of Tomorrow
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
          An elite, hands-on arena where engineers, developers, and visionaries build failsafe technology for the future of rail logistics and mass transit.
          <br /><strong className="text-orange">Coming soon...</strong>
        </p>

        {/* Notify Me Form */}
        <div className="mt-10 max-w-md mx-auto">
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert("You will be notified!"); }}>
            <input
              type="email"
              required
              placeholder="Enter your email for early access"
              className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all"
            />
            <button
              type="submit"
              className="rounded-full bg-orange px-6 py-3 text-xs font-semibold text-white hover:bg-orange/90 active:scale-[0.98] transition-all shadow-[0_0_15px_oklch(0.70_0.20_50_/_0.3)]"
            >
              Notify Me
            </button>
          </form>
        </div>

        {/* Back Home Link */}
        <div className="mt-10">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </a>
        </div>

      </motion.div>
    </div>
  );
}



/* ================================================================
   FOOTER
================================================================ */
function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/[0.07]">
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 90% 50% at 50% 100%, oklch(0.70 0.20 50 / 0.06), transparent 65%)" }} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="VASP Logo" className="h-10 w-10 object-contain rounded-lg bg-white p-0.5 border border-white/10" />
              <div className="text-left">
                <div className="text-sm font-bold tracking-wider text-foreground">VASP SYSTEMIC</div>
                <div className="text-[10px] tracking-wider text-muted-foreground">PRIVATE LIMITED</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Engineering the next generation of intelligent railway systems — from IoT to infrastructure.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Intelligent", "Connected", "Reliable"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted-foreground">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-left md:text-right">
            <motion.a href="mailto:VASP@gmail.com" whileHover={{ scale: 1.03 }} transition={{ ease: EASE_SPRING }}
              className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-3 text-xs font-semibold text-white transition-all hover:shadow-[0_0_24px_oklch(0.70_0.20_50_/_0.55)]"
              style={{ boxShadow: "0 0 20px oklch(0.70 0.20 50 / 0.3)" }}>
              VASP@gmail.com <ArrowRight className="h-3.5 w-3.5" />
            </motion.a>
            <div className="text-xs leading-relaxed text-muted-foreground mt-1.5 font-sans">
              <span className="block font-medium text-foreground">Phone: <a href="tel:8446636550" className="text-orange hover:underline transition-all">+91 8446636550</a></span>
              <span className="block mt-1">7th floor prakash tower, Indore, MP, India</span>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} VASP Systemic Pvt. Ltd. All rights reserved.</span>
          <span>Built for the Railways of Tomorrow</span>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   SCROLL TO HASH COMPONENT
================================================================ */
function ScrollToHash() {
  const [pathname] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 50);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const timer = setTimeout(handleScroll, 100);

    window.addEventListener("hashchange", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleScroll);
    };
  }, [pathname]);

  return null;
}

/* ================================================================
   REQUEST DEMO MODAL COMPONENT
================================================================ */
interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function RequestDemoModal({ isOpen, onClose }: RequestDemoModalProps) {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", company: "", phone: "", message: "" });
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, ease: EASE_SPRING }}
          className="relative max-w-lg w-full overflow-hidden rounded-3xl border border-white/[0.1] bg-background/95 p-8 md:p-10 shadow-[0_24px_60px_-15px_oklch(0.70_0.20_50_/_0.2)] backdrop-blur-xl z-10"
          style={{ background: "radial-gradient(circle at top right, oklch(0.14 0.04 260 / 0.95), oklch(0.08 0.04 262 / 0.95))" }}
        >
          {/* Top border line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>

          {status !== "success" ? (
            <>
              <div className="text-left mb-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-orange font-bold">VASP SYSTEMIC</span>
                <h3 className="text-2xl font-black text-foreground mt-1">Request a Systems Demo</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Submit your details below to schedule an interactive digital twin simulation and technical walkthrough with our systems engineering team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Business Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@company.com"
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Railway Systems Ltd"
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 8446636550"
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Operational Requirements / Notes</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="E.g., interest in ACP monitoring, Loco diagnostics, etc."
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-orange focus:bg-white/[0.05] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="rounded-xl bg-orange py-3 text-xs font-semibold text-white hover:bg-orange/90 active:scale-[0.98] transition-all shadow-[0_0_24px_oklch(0.70_0.20_50_/_0.3)] disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === "submitting" ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Scheduling Demo...</span>
                    </>
                  ) : (
                    <span>Schedule Technical Demo</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-10"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <h3 className="text-2xl font-black text-foreground">Demo Scheduled!</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-3 leading-relaxed">
                Thank you for your request. Our principal systems architect will contact you to finalize dates and times.
              </p>
              <button
                onClick={() => { setStatus("idle"); onClose(); }}
                className="mt-8 rounded-full border border-white/10 bg-white/[0.03] px-8 py-2.5 text-xs font-semibold text-foreground hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                Close Window
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ================================================================
   APP ROOT
================================================================ */
export default function App() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const on = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", on, { passive: true });
    return () => window.removeEventListener("mousemove", on);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollToHash />
      <MeshBackground />
      <CursorGlow />
      <StarField mouseRef={mouseRef} />
      <ScrollProgressLine />
      <div className="relative z-10">
        <Header onRequestDemo={() => setIsDemoModalOpen(true)} />
        <main>
          <Switch>
            <Route path="/">
              <Hero onRequestDemo={() => setIsDemoModalOpen(true)} />
              <Metrics />
              <AboutUs />
              <InnovationsGrid />
              <Services />
            </Route>
            <Route path="/hackathon">
              <HackathonPage />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
      <RequestDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}
