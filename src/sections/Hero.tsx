import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion';
import {
  ArrowRight,
  Play,
  Sparkles,
  Award,
  Truck,
  Leaf,
  Copy,
  Check,
  Gift,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Cherry,
  PackageCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { toast } from 'sonner';

const VERTEX_SHADER_300 = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_300 = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_quality;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float starLayer(vec2 uv, float scale, float seed, float time) {
  vec2 gv = fract(uv * scale) - 0.5;
  vec2 id = floor(uv * scale) + seed;
  float n = hash21(id);
  if (n < 0.945) return 0.0;
  vec2 offset = vec2(fract(n * 19.3) - 0.5, fract(n * 73.7) - 0.5) * 0.6;
  float d = length(gv - offset);
  float twinkle = 0.65 + 0.35 * sin(time * (0.9 + fract(n * 11.0) * 1.4) + n * 62.8);
  float star = smoothstep(0.045, 0.0, d) * twinkle;
  return star * smoothstep(0.945, 0.999, n);
}

float auroraBand(vec2 uv, float time, float offset, float freq, float speed) {
  float wave = sin(uv.x * freq + time * speed + offset) * 0.09
             + sin(uv.x * (freq * 1.9) - time * (speed * 0.75) + offset * 1.7) * 0.045
             + (noise(vec2(uv.x * 2.5 + time * 0.06, offset)) - 0.5) * 0.08;

  float centerY = 0.56 + wave;
  float dist = uv.y - centerY;

  float lowerEdge = smoothstep(-0.08, 0.02, dist);
  float upperFade = exp(-max(dist, 0.0) * 5.2);
  float profile = lowerEdge * upperFade;

  float rays = noise(vec2(uv.x * 18.0 + sin(uv.y * 4.0 + time * 0.15) * 1.4, uv.y * 2.2 - time * 0.12));
  float fineRays = noise(vec2(uv.x * 38.0 - time * 0.18, uv.y * 3.5));
  float curtain = mix(0.55, 1.25, rays * 0.7 + fineRays * 0.3);

  return profile * curtain;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);

  vec2 mouseShift = (u_mouse - 0.5) * vec2(0.055, 0.035);
  vec2 auroraUV = uv + mouseShift * smoothstep(0.15, 0.95, uv.y);

  vec3 zenithColor = vec3(0.024, 0.059, 0.118);
  vec3 midSkyColor = vec3(0.047, 0.118, 0.216);
  vec3 horizonColor = vec3(0.078, 0.192, 0.318);

  vec3 sky = mix(horizonColor, midSkyColor, smoothstep(0.12, 0.58, uv.y));
  sky = mix(sky, zenithColor, smoothstep(0.52, 1.0, uv.y));

  float skyMask = smoothstep(0.32, 0.72, uv.y);
  float stars = starLayer(p + mouseShift * 0.15, 22.0, 1.3, u_time);
  if (u_quality > 0.6) {
    stars += starLayer(p + mouseShift * 0.08, 36.0, 7.1, u_time * 0.85) * 0.65;
  }
  sky += vec3(0.85, 0.93, 1.0) * stars * skyMask * 0.75;

  float t = u_time * 0.42;
  float band1 = auroraBand(auroraUV, t, 0.0, 2.6, 0.38);
  float band2 = auroraBand(auroraUV + vec2(0.12, 0.07), t * 0.9, 2.4, 3.3, -0.29);
  float band3 = u_quality > 0.6
    ? auroraBand(auroraUV + vec2(-0.18, 0.13), t * 0.75, 4.8, 2.1, 0.22)
    : 0.0;

  vec3 softEmerald = vec3(0.18, 0.78, 0.56);
  vec3 softCyanBlue = vec3(0.20, 0.63, 0.86);
  vec3 softViolet = vec3(0.56, 0.38, 0.84);

  vec3 auroraColor = vec3(0.0);
  auroraColor += mix(softEmerald, softCyanBlue, smoothstep(0.35, 0.8, uv.y)) * band1 * 0.52;
  auroraColor += mix(softCyanBlue, softViolet, smoothstep(0.42, 0.88, uv.y + 0.05 * sin(uv.x * 3.0))) * band2 * 0.44;
  auroraColor += mix(softViolet, softEmerald, 0.35) * band3 * 0.32;

  float horizonGlow = exp(-pow((uv.y - 0.24) * 4.2, 2.0));
  auroraColor += mix(softCyanBlue, softEmerald, 0.5) * horizonGlow * 0.14;

  float auroraHeightMask = smoothstep(0.14, 0.34, uv.y) * smoothstep(1.02, 0.82, uv.y);
  vec3 finalColor = sky + auroraColor * auroraHeightMask;

  float leftReadability = smoothstep(-0.1, 0.62, uv.x);
  finalColor = mix(finalColor * 0.82, finalColor, leftReadability);

  fragColor = vec4(finalColor, 1.0);
}
`;

export function Hero() {
  const { t, i18n } = useTranslation();
  const { applyPromoCode } = useAppStore();
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isMascotJumping, setIsMascotJumping] = useState(false);
  const [activePose, setActivePose] = useState<'velmorHero' | 'cutout' | 'warrior' | 'sunset'>('velmorHero');
  const [webglReady, setWebglReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const heroViewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerTargetRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const pointerCurrentRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Multi-layer scroll parallax for cinematic depth (Lycka / Pressed Juicery / Graza style)
  const { scrollYProgress } = useScroll({
    target: heroViewportRef,
    offset: ['start start', 'end start'],
  });
  const bgVideoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const bgVideoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const editorialY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const showcaseY = useTransform(scrollYProgress, [0, 1], [0, -54]);

  // 3D interactive cursor parallax & tilt for `velmor-hero.jpg` and mascot
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 140, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 140, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const videoCursorX = useTransform(springX, [-0.5, 0.5], [10, -10]);
  const videoCursorY = useTransform(springY, [-0.5, 0.5], [6, -6]);

  // Subtle mountain parallax driven by smooth spring
  const mountainParallaxX = useTransform(springX, [-0.5, 0.5], [8, -8]);
  const mountainMidParallaxX = useTransform(springX, [-0.5, 0.5], [14, -14]);

  // Background Video & WebGL2 Procedural Aurora Lifecycle (Offscreen Pause & Reduced Motion)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = heroViewportRef.current;
    const videoEl = videoRef.current;
    if (!container) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    if (videoEl) {
      videoEl.muted = true;
      videoEl.playsInline = true;
      if (prefersReducedMotion) {
        videoEl.pause();
      } else {
        videoEl.play().catch(() => {});
      }
    }

    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });

    if (!gl) {
      setWebglReady(false);
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_300);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_300);
    if (!vs || !fs) {
      setWebglReady(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      setWebglReady(false);
      return;
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uQualityLoc = gl.getUniformLocation(program, 'u_quality');

    let isMobileDevice = window.innerWidth < 768;

    const resizeCanvas = () => {
      if (!canvas || !container) return;
      isMobileDevice = window.innerWidth < 768;
      const maxDpr = isMobileDevice ? 1.0 : 1.35;
      const scaleFactor = isMobileDevice ? 0.72 : 0.9;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * scaleFactor;
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    resizeCanvas();
    setWebglReady(true);

    let rafId: number | null = null;
    let isVisibleInViewport = true;
    const startTime = performance.now();

    const renderFrame = (timestamp: number) => {
      const elapsedSeconds = prefersReducedMotion ? 12.5 : (timestamp - startTime) * 0.001;

      pointerCurrentRef.current.x +=
        (pointerTargetRef.current.x - pointerCurrentRef.current.x) * 0.04;
      pointerCurrentRef.current.y +=
        (pointerTargetRef.current.y - pointerCurrentRef.current.y) * 0.04;

      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, elapsedSeconds);
      gl.uniform2f(uMouseLoc, pointerCurrentRef.current.x, pointerCurrentRef.current.y);
      gl.uniform1f(uQualityLoc, isMobileDevice ? 0.5 : 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const tick = (now: number) => {
      if (!isVisibleInViewport || document.hidden || prefersReducedMotion) {
        rafId = null;
        return;
      }
      renderFrame(now);
      rafId = requestAnimationFrame(tick);
    };

    const startLoopIfAllowed = () => {
      if (prefersReducedMotion) {
        stopLoop();
        renderFrame(performance.now());
        if (videoRef.current) videoRef.current.pause();
        return;
      }
      if (isVisibleInViewport && !document.hidden) {
        if (rafId === null) {
          rafId = requestAnimationFrame(tick);
        }
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    renderFrame(performance.now());
    startLoopIfAllowed();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleInViewport = Boolean(entry?.isIntersecting);
        if (isVisibleInViewport) {
          startLoopIfAllowed();
        } else {
          stopLoop();
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
        if (videoRef.current) videoRef.current.pause();
      } else {
        startLoopIfAllowed();
      }
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      startLoopIfAllowed();
    };

    const handleWindowResize = () => {
      resizeCanvas();
      renderFrame(performance.now());
    };

    window.addEventListener('resize', handleWindowResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      gl.deleteBuffer(positionBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  const handleHeroPointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const normY = 1.0 - (e.clientY - rect.top) / Math.max(rect.height, 1);
    pointerTargetRef.current = {
      x: Math.min(1, Math.max(0, normX)),
      y: Math.min(1, Math.max(0, normY)),
    };
    mouseX.set(normX - 0.5);
    mouseY.set((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5);
  };

  const handleHeroPointerLeave = () => {
    pointerTargetRef.current = { x: 0.5, y: 0.5 };
    mouseX.set(0);
    mouseY.set(0);
  };

  const greetingsRaw = t('hero.mascotGreetings', { returnObjects: true });
  const greetings = Array.isArray(greetingsRaw)
    ? greetingsRaw
    : [
        '¡Skål desde Dosquebradas y el Eje Cafetero! 🏔️ ¿Listo para probar el auténtico Skyr?',
        '¡15g de proteína pura por porción! Fuerza vikinga con leche fresca del Eje Cafetero 🛡️',
      ];

  const triggerFastPromoToast = (message: string) => {
    toast.dismiss();
    const toastId = toast.success(message, { duration: 1100 });
    window.setTimeout(() => {
      toast.dismiss(toastId);
    }, 1150);
  };

  const handleMascotClick = () => {
    setIsMascotJumping(true);
    setGreetingIndex((prev) => (prev + 1) % greetings.length);
    applyPromoCode('VELMOR10');
    navigator.clipboard?.writeText('VELMOR10').catch(() => {});
    triggerFastPromoToast(
      i18n.language?.startsWith('en')
        ? 'Viking Velmor activated code VELMOR10 (10% OFF) in your cart!'
        : '¡Vikingo Velmor activó el código VELMOR10 (10% Dto.) en tu carrito!'
    );
    setTimeout(() => setIsMascotJumping(false), 650);
  };

  const handleCopyPromo = () => {
    navigator.clipboard?.writeText('VELMOR10').catch(() => {});
    applyPromoCode('VELMOR10');
    setCopiedPromo(true);
    triggerFastPromoToast(
      i18n.language?.startsWith('en')
        ? 'Promo code VELMOR10 copied and applied!'
        : '¡Código VELMOR10 copiado y aplicado automáticamente!'
    );
    setTimeout(() => setCopiedPromo(false), 1800);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const howToBuySteps = [
    {
      num: '01',
      Icon: Cherry,
      title: t('hero.step1Title'),
      desc: t('hero.step1Desc'),
      detail: i18n.language?.startsWith('en')
        ? '5 artisanal flavors crafted daily'
        : '5 sabores artesanales frescos',
      accentColor: 'from-[#B47B2B] to-[#D99B3C]',
      ringColor: 'group-hover:border-[#B47B2B]/50',
      glowColor: 'from-[#B47B2B]/15 via-[#F5B95F]/10 to-transparent',
    },
    {
      num: '02',
      Icon: PackageCheck,
      title: t('hero.step2Title'),
      desc: t('hero.step2Desc'),
      detail: i18n.language?.startsWith('en')
        ? 'Personal 200g & Family 500g tubs'
        : 'Envases de 200g y 500g sellados',
      accentColor: 'from-[#004B87] to-[#33A6D8]',
      ringColor: 'group-hover:border-[#004B87]/45',
      glowColor: 'from-[#004B87]/15 via-[#33A6D8]/10 to-transparent',
    },
    {
      num: '03',
      Icon: MapPin,
      title: t('hero.step3Title'),
      desc: t('hero.step3Desc'),
      detail: i18n.language?.startsWith('en')
        ? '1-click structured WhatsApp order'
        : 'Pedido directo en 1 clic a WhatsApp',
      accentColor: 'from-[#2CA64E] to-emerald-500',
      ringColor: 'group-hover:border-[#2CA64E]/45',
      glowColor: 'from-[#2CA64E]/15 via-emerald-400/10 to-transparent',
    },
    {
      num: '04',
      Icon: Truck,
      title: t('hero.step4Title'),
      desc: t('hero.step4Desc'),
      detail: i18n.language?.startsWith('en')
        ? '100% cold-chain delivery guaranteed'
        : 'Cadena de frío 100% garantizada',
      accentColor: 'from-[#B47B2B] to-[#004B87]',
      ringColor: 'group-hover:border-[#B47B2B]/50',
      glowColor: 'from-[#B47B2B]/15 via-[#004B87]/10 to-transparent',
    },
  ];

  const benefitHighlights = [
    {
      Icon: Leaf,
      value: t('hero.stat1Value'),
      label: t('hero.stat1Label'),
      detail: i18n.language?.startsWith('en')
        ? 'Fresh highland milk & real fruit from the Coffee Region'
        : 'Leche fresca de ordeño diario y fruta real del Eje Cafetero',
      valueColor: 'text-[#004B87]',
      iconBg: 'bg-[#004B87]/10 text-[#004B87] group-hover:bg-[#004B87] group-hover:text-white',
      borderHover: 'hover:border-[#004B87]/40',
    },
    {
      Icon: ShieldCheck,
      value: t('hero.stat2Value'),
      label: t('hero.stat2Label'),
      detail: i18n.language?.startsWith('en')
        ? 'Free from artificial thickeners, dyes, or refined sugars'
        : 'Sin espesantes artificiales, colorantes ni azúcares añadidos',
      valueColor: 'text-[#2CA64E]',
      iconBg: 'bg-[#2CA64E]/12 text-[#2CA64E] group-hover:bg-[#2CA64E] group-hover:text-white',
      borderHover: 'hover:border-[#2CA64E]/45',
    },
    {
      Icon: Award,
      value: t('hero.stat3Value'),
      label: t('hero.stat3Label'),
      detail: i18n.language?.startsWith('en')
        ? '4x dairy concentration with authentic Icelandic Skyr cultures'
        : '4x concentración láctea con cultivos probióticos islandeses',
      valueColor: 'text-[#B47B2B]',
      iconBg: 'bg-[#B47B2B]/15 text-[#B47B2B] group-hover:bg-[#B47B2B] group-hover:text-white',
      borderHover: 'hover:border-[#B47B2B]/50',
    },
  ];

  const poses = [
    {
      id: 'velmorHero' as const,
      label: t('hero.mascotPose1'),
      src: '/images/velmor-hero.jpg',
      isCutout: false,
    },
    {
      id: 'cutout' as const,
      label: t('hero.mascotPose2'),
      src: '/images/mascota.png',
      isCutout: true,
    },
    {
      id: 'warrior' as const,
      label: t('hero.mascotPose3'),
      src: '/images/mascota-vikingo-epico.jpg',
      isCutout: false,
    },
    {
      id: 'sunset' as const,
      label: t('hero.mascotPose4'),
      src: '/images/mascota-vikingo-atardecer.jpg',
      isCutout: false,
    },
  ];

  const currentPose = poses.find((p) => p.id === activePose) || poses[0];

  return (
    <section id="home" className="relative overflow-hidden bg-[#FAF8F5]">
      {/* Scoped CSS Aurora & Starfield Fallback + Reduced Motion Rules */}
      <style>{`
        @keyframes velmorAuroraDrift {
          0% { transform: translate3d(-3%, 0%, 0) scale(1); opacity: 0.72; }
          50% { transform: translate3d(3%, -2%, 0) scale(1.06); opacity: 0.92; }
          100% { transform: translate3d(-3%, 0%, 0) scale(1); opacity: 0.72; }
        }
        @keyframes velmorAuroraWaveSecondary {
          0% { transform: translate3d(2%, 1%, 0) scale(1.03); opacity: 0.55; }
          50% { transform: translate3d(-4%, -1.5%, 0) scale(0.98); opacity: 0.8; }
          100% { transform: translate3d(2%, 1%, 0) scale(1.03); opacity: 0.55; }
        }
        .velmor-aurora-ribbon-1 {
          background: radial-gradient(ellipse 80% 38% at 62% 34%, rgba(45, 200, 142, 0.34) 0%, rgba(51, 166, 216, 0.24) 48%, rgba(142, 96, 214, 0.14) 74%, transparent 100%);
          animation: velmorAuroraDrift 18s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .velmor-aurora-ribbon-2 {
          background: radial-gradient(ellipse 75% 32% at 36% 28%, rgba(51, 166, 216, 0.28) 0%, rgba(142, 96, 214, 0.22) 45%, rgba(45, 200, 142, 0.16) 72%, transparent 100%);
          animation: velmorAuroraWaveSecondary 24s ease-in-out infinite;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .velmor-aurora-ribbon-1,
          .velmor-aurora-ribbon-2 {
            animation: none !important;
          }
        }
      `}</style>

      {/* Main Immersive Hero Viewport with Background Video + Aurora Shader + Smooth Dark-to-Transparent Overlay */}
      <div
        ref={heroViewportRef}
        onMouseMove={handleHeroPointerMove}
        onMouseLeave={handleHeroPointerLeave}
        className="relative min-h-[92vh] flex items-center pt-24 pb-20 lg:pt-28 lg:pb-24 overflow-hidden bg-[#060F1E]"
      >
        {/* Background Layer Stack */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Layer 1: Static Night Sky & Poster Fallback */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 72% 28%, rgba(44, 166, 78, 0.22), transparent 45%), radial-gradient(circle at 35% 24%, rgba(51, 166, 216, 0.22), transparent 50%), linear-gradient(180deg, #060F1E 0%, #0B1B32 52%, #132F4C 86%, #1B3B5C 100%)',
            }}
          />

          {/* Layer 2: Cinematic Looping Nordic Landscape & Yogurt Jar Video (`Yogurt_jar_in_Nordic_landscape_ab55d5e3_1080p.mp4`) */}
          <motion.div
            style={{
              y: bgVideoY,
              scale: bgVideoScale,
              x: videoCursorX,
            }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={videoRef}
              src="/images/Yogurt_jar_in_Nordic_landscape_ab55d5e3_1080p.mp4"
              poster="/images/velmor-hero.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
                videoLoaded ? 'opacity-90' : 'opacity-75'
              }`}
            />
          </motion.div>

          {/* Layer 3: WebGL2 Procedural Aurora Borealis & Starfield Ambient Layer (Blended Harmoniously) */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity duration-700 ${
              webglReady ? 'opacity-50' : 'opacity-0'
            }`}
          />

          {/* CSS Aurora Borealis Curtains (Fallback & Harmonic Glow) */}
          <div
            className={`absolute -inset-x-16 -top-12 h-[72%] blur-2xl velmor-aurora-ribbon-1 transition-opacity duration-700 ${
              webglReady ? 'opacity-25' : 'opacity-75'
            }`}
          />
          <div
            className={`absolute -inset-x-12 top-6 h-[64%] blur-3xl velmor-aurora-ribbon-2 transition-opacity duration-700 ${
              webglReady ? 'opacity-20' : 'opacity-65'
            }`}
          />

          {/* Layer 4: Smooth Dark-to-Transparent Gradient Overlays for Impeccable WCAG AA Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#040D1A]/90 via-[#07192F]/65 to-[#061224]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050E1C]/85 via-transparent to-[#040D1A]/45" />

          {/* Layer 5: Discrete Nordic & Coffee Region Mountain Silhouettes with Seamless Bottom Transition */}
          <motion.svg
            style={{ x: mountainParallaxX, y: videoCursorY }}
            className="absolute bottom-0 -left-4 -right-4 w-[calc(100%+2rem)] h-40 sm:h-52 lg:h-64 pointer-events-none"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#0D223B"
              fillOpacity="0.65"
              d="M0,196L90,162L185,188L310,118L430,174L555,108L690,168L820,124L955,178L1095,94L1230,156L1345,112L1440,148L1440,320L0,320Z"
            />
          </motion.svg>

          <motion.svg
            style={{ x: mountainMidParallaxX }}
            className="absolute bottom-0 -left-6 -right-6 w-[calc(100%+3rem)] h-36 sm:h-48 lg:h-56 pointer-events-none"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#081629"
              fillOpacity="0.82"
              d="M0,226L120,184L245,214L395,152L530,208L675,164L815,218L980,146L1135,204L1285,158L1440,198L1440,320L0,320Z"
            />
            {/* Seamless Organic Wave Transition into Velmor's Creamy White Surface (#FAF8F5) */}
            <path
              fill="#FAF8F5"
              fillOpacity="1"
              d="M0,286L80,279C160,272,320,258,480,262C640,267,800,288,960,288C1120,288,1280,268,1360,258L1440,248L1440,320L0,320Z"
            />
          </motion.svg>
        </div>

        {/* Foreground Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Editorial Typography & Value Proposition */}
            <motion.div
              style={{ y: editorialY }}
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Premium Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10253F]/90 backdrop-blur-md border border-[#F5B95F]/45 text-[#FDE68A] text-xs sm:text-sm font-bold mb-6 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#F5B95F]" />
                <span>{t('hero.badge')}</span>
              </motion.div>

              {/* Editorial Display Headline with High Contrast */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-bold tracking-tight leading-[1.06] mb-6 text-white font-serif-display text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]"
              >
                <span className="block text-[#F8FAFC]">{t('hero.titleLine1')}</span>
                <span className="block italic text-[#F5B95F] font-semibold my-1.5 drop-shadow-[0_2px_16px_rgba(180,123,43,0.45)]">
                  {t('hero.titleHighlight')}
                </span>
                <span className="block text-[#93C5FD]">{t('hero.titleLine2')}</span>
              </motion.h1>

              {/* Subtitle with WCAG AA/AAA Readability */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-base sm:text-lg lg:text-xl text-[#F1F5F9] max-w-2xl mx-auto lg:mx-0 mb-7 leading-relaxed font-normal text-pretty drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
              >
                {t('hero.subtitle')}
              </motion.p>

              {/* Trust Badges Row */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-5 mb-8"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0E223B]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#34D399]/40 shadow-sm">
                  <Leaf className="w-4 h-4 text-[#34D399]" />
                  <span>{t('hero.trust1')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0E223B]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#60A5FA]/40 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
                  <span>{t('hero.trust2')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0E223B]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#F5B95F]/40 shadow-sm">
                  <Truck className="w-4 h-4 text-[#F5B95F]" />
                  <span>{t('hero.trust3')}</span>
                </div>
              </motion.div>

              {/* Primary & Secondary CTAs (Artisanal Gold #B47B2B & Story CTA) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection('#products')}
                  className="bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold px-8 py-6 text-base rounded-xl shadow-[0_10px_25px_-5px_rgba(180,123,43,0.55)] hover:shadow-[0_14px_30px_-5px_rgba(180,123,43,0.7)] transition-[transform,box-shadow,background-color] duration-200 ease-out active:scale-[0.97] group"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {t('hero.ctaPrimary')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('#about')}
                  className="bg-white/95 hover:bg-white border-2 border-white/40 text-[#0F233C] font-semibold px-7 py-6 text-base rounded-xl shadow-md transition-[transform,background-color,box-shadow] duration-200 ease-out active:scale-[0.97] group"
                >
                  <Play className="mr-2 w-4 h-4 fill-[#004B87] text-[#004B87] translate-x-[0.5px]" />
                  {t('hero.ctaSecondary')}
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column: Floating `velmor-hero.jpg` Protagonist & Interactive Mascot Stage */}
            <motion.div
              style={{ y: showcaseY }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative flex flex-col items-center justify-center"
            >
              {/* Interactive Speech Bubble from the Viking Mascot */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${i18n.language}-${greetingIndex}`}
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.92 }}
                  transition={{ duration: 0.26 }}
                  onClick={handleMascotClick}
                  className="relative z-20 mb-3 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border-2 border-[#60A5FA]/45 rounded-2xl px-4 py-3 shadow-xl cursor-pointer hover:border-[#F5B95F] transition-colors"
                >
                  <p className="text-xs sm:text-sm font-semibold text-[#192434] text-center leading-snug">
                    {greetings[greetingIndex]}
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-[#60A5FA]/45 rotate-45" />
                </motion.div>
              </AnimatePresence>

              {/* 3D Interactive Floating Protagonist Stage (`velmor-hero.jpg` + Mascot Companion) */}
              <motion.div
                onClick={handleMascotClick}
                style={{
                  rotateX,
                  rotateY,
                  transformPerspective: 1100,
                }}
                animate={
                  isMascotJumping
                    ? { y: [0, -22, 0, -8, 0], rotate: [0, -4, 4, -2, 0], scale: [1, 1.06, 1] }
                    : { y: [0, -10, 0] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.65, ease: 'easeInOut' }
                    : { duration: 4.0, repeat: Infinity, ease: 'easeInOut' }
                }
                whileHover={{ scale: 1.03 }}
                className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[390px] lg:h-[390px] flex items-center justify-center cursor-pointer select-none group"
              >
                {/* Luminous Aurora Rim Backlight Behind `velmor-hero.jpg` */}
                <div className="absolute inset-2 rounded-3xl bg-gradient-to-tr from-[#33A6D8]/40 via-[#34D399]/35 to-[#F5B95F]/30 blur-2xl group-hover:scale-110 transition-transform duration-500" />

                {/* Pedestal Glow Shadow */}
                <motion.div
                  animate={{ scale: [1, 0.92, 1], opacity: [0.5, 0.3, 0.5] }}
                  transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-2 w-56 h-8 bg-[#030914]/75 rounded-full blur-md"
                />

                {/* Main Protagonist Render (`velmor-hero.jpg` or Selected Mascot Pose) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPose.id}
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.93 }}
                    transition={{ duration: 0.32 }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={currentPose.src}
                      alt="Yogur Artesanal Nórdico Velmor - Imagen Oficial Hero"
                      className={
                        currentPose.isCutout
                          ? 'w-full h-full object-contain drop-shadow-[0_22px_34px_rgba(0,0,0,0.6)]'
                          : 'w-68 h-68 sm:w-76 sm:h-76 lg:w-[350px] lg:h-[350px] object-cover rounded-[28px] border-2 border-white/85 shadow-[0_25px_50px_rgba(0,0,0,0.65)] ring-4 ring-[#33A6D8]/25'
                      }
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Interactive Mascot Companion Badge (Visible when `velmor-hero.jpg` is active) */}
                {activePose !== 'cutout' && (
                  <motion.div
                    animate={{ y: [0, -6, 0], rotate: [0, 3, -2, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMascotClick();
                    }}
                    title="¡Haz clic para activar VELMOR10 (-10%)!"
                    className="absolute -right-4 sm:-right-6 bottom-4 z-20 bg-white/95 backdrop-blur-md p-1.5 pr-3.5 rounded-2xl shadow-xl border-2 border-[#B47B2B]/50 flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <img
                      src="/images/mascota.png"
                      alt="Mascota Vikingo Velmor"
                      className="w-12 h-12 object-contain shrink-0"
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-extrabold text-[#004B87] leading-tight">
                        Vikingo Velmor
                      </p>
                      <p className="text-[10px] font-bold text-[#B47B2B] tabular-nums">
                        VELMOR10 · -10%
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Featured Product Mini-Card Badge (Visible when Mascot cutout is active) */}
                {activePose === 'cutout' && (
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToSection('#products');
                    }}
                    className="absolute -right-3 sm:-right-5 bottom-6 z-20 bg-white/95 backdrop-blur-md p-2 pr-3.5 rounded-2xl shadow-xl border border-[#B47B2B]/40 flex items-center gap-2.5 hover:scale-105 transition-transform"
                  >
                    <img
                      src="/images/velmor-hero.jpg"
                      alt="Envase Yogur Artesanal Velmor"
                      className="w-11 h-11 rounded-xl object-cover border border-[#004B87]/15 shrink-0"
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-extrabold text-[#004B87] leading-tight">
                        Skyr Velmor
                      </p>
                      <p className="text-[10px] font-bold text-[#B47B2B] tabular-nums">
                        200g · 500g
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Floating Dosquebradas / Eje Cafetero Origin Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-2 sm:-left-5 bottom-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#2CA64E]/35 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#2CA64E]/15 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#2CA64E]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-[#192434] leading-tight">
                      Dosquebradas
                    </p>
                    <p className="text-[10px] text-[#4E5E74] font-medium">Eje Cafetero</p>
                  </div>
                </motion.div>

                {/* Floating Protein Badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -right-2 sm:-right-4 top-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#004B87]/25 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#004B87]/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#004B87]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-[#004B87] leading-tight tabular-nums">
                      15g {i18n.language?.startsWith('en') ? 'Protein' : 'Proteína'}
                    </p>
                    <p className="text-[10px] text-[#4E5E74]">Skyr Vikingo</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Interactive Pose Switcher Pills */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-xs font-medium text-[#E2E8F0] drop-shadow flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B95F]" />
                  <span>{t('hero.mascotInteractHint')}</span>
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 bg-[#0E223B]/85 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-md">
                  {poses.map((pose) => (
                    <button
                      key={pose.id}
                      type="button"
                      onClick={() => setActivePose(pose.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        activePose === pose.id
                          ? 'bg-[#B47B2B] text-white shadow-sm'
                          : 'text-[#E2E8F0] hover:text-white'
                      }`}
                    >
                      {pose.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Vibrant First-Purchase Promo Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-[#E11D48] via-[#EF4444] to-[#F97316] rounded-2xl p-4 sm:px-8 sm:py-4 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base tracking-wide">
                {t('hero.promoBanner')}
              </p>
              <p className="text-xs text-white/90 tabular-nums">
                {i18n.language?.startsWith('en')
                  ? 'Valid on all 200g ($7.000) and 500g ($26.000) presentations · Direct WhatsApp checkout'
                  : 'Válido en todas las presentaciones de 200g ($7.000) y 500g ($26.000) · Pedido directo por WhatsApp'}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleCopyPromo}
            className="bg-white text-[#E11D48] hover:bg-white/90 font-bold px-5 py-2.5 rounded-xl shadow-sm shrink-0 gap-2"
          >
            {copiedPromo ? (
              <>
                <Check className="w-4 h-4 text-[#2CA64E]" />
                {t('hero.codeCopied')}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {t('hero.copyCode')}
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* 4-Step "¿Cómo comprar?" Section & Key Artisanal Benefits (Elevated Glassmorphism & Vector Icons) */}
      <div className="relative bg-gradient-to-b from-[#FAF8F5] via-[#EFECE6]/85 to-[#FAF8F5] border-t border-[#004B87]/10 py-16 sm:py-20 overflow-hidden">
        {/* Organic Ambient Background Orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#B47B2B]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-[#004B87]/8 blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12 sm:mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#B47B2B]/30 text-[#8C5A16] text-xs font-extrabold uppercase tracking-[0.18em] mb-3.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B47B2B]" />
              <span>
                {i18n.language?.startsWith('en')
                  ? 'Artisanal Experience in 4 Steps'
                  : 'Experiencia Artesanal en 4 Pasos'}
              </span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#192434] font-serif-display tracking-tight">
              {t('hero.howToBuyTitle')}
            </h2>
          </motion.div>

          {/* 4 Steps Grid with Connecting Line & Frosted Glass Cards */}
          <div className="relative">
            {/* Subtle Desktop Connecting Line Behind Cards */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-24 left-16 right-16 h-px bg-gradient-to-r from-[#B47B2B]/20 via-[#004B87]/25 to-[#2CA64E]/25 pointer-events-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {howToBuySteps.map((step, index) => {
                const StepIcon = step.Icon;
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.18 }}
                    transition={{
                      delay: index * 0.11,
                      duration: 0.62,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -8 }}
                    onClick={() => scrollToSection('#products')}
                    className={`group relative cursor-pointer rounded-3xl bg-white/85 hover:bg-white/95 backdrop-blur-md p-6 sm:p-7 text-center border border-[#004B87]/12 ${step.ringColor} shadow-[0_12px_32px_-12px_rgba(25,36,52,0.08)] hover:shadow-[0_24px_48px_-12px_rgba(180,123,43,0.22)] transition-[background-color,border-color,box-shadow] duration-300 flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Subtle Top Radial Glow Revealed on Hover */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute -top-12 inset-x-0 h-28 bg-gradient-to-b ${step.glowColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    <div>
                      {/* Top Step Pill & Dual-Ring Vector Medallion */}
                      <div className="relative mx-auto mb-5 w-16 h-16 flex items-center justify-center">
                        <div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.accentColor} opacity-15 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 shadow-sm`}
                        />
                        <div className="relative w-14 h-14 rounded-xl bg-white/95 group-hover:bg-transparent border border-[#B47B2B]/25 group-hover:border-white/30 flex items-center justify-center transition-colors duration-300">
                          <StepIcon className="w-6 h-6 text-[#B47B2B] group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                        </div>
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#B47B2B]/35 text-[10px] font-extrabold tabular-nums text-[#8C5A16] shadow-sm">
                          {step.num}
                        </span>
                      </div>

                      <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#B47B2B] mb-1.5">
                        {i18n.language?.startsWith('en')
                          ? `Step ${index + 1}`
                          : `Paso ${index + 1}`}
                      </span>
                      <h3 className="font-bold text-lg text-[#192434] group-hover:text-[#004B87] transition-colors font-serif-display mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4E5E74] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Interactive Micro-Detail Pill Revealed/Highlighted on Hover */}
                    <div className="mt-5 pt-3.5 border-t border-[#004B87]/10 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#004B87] group-hover:text-[#B47B2B] transition-colors">
                      <span>{step.detail}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 3 Sculpted Benefit Cards Row (Replacing Flat Numbers) */}
          <div className="mt-12 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {benefitHighlights.map((item, idx) => {
              const BenefitIcon = item.Icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    delay: 0.1 + idx * 0.12,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -5 }}
                  className={`group relative rounded-2xl bg-white/85 hover:bg-white/95 backdrop-blur-md p-5 sm:p-6 border border-[#004B87]/12 ${item.borderHover} shadow-[0_10px_28px_-12px_rgba(25,36,52,0.08)] hover:shadow-[0_18px_38px_-12px_rgba(0,75,135,0.16)] transition-all duration-300 flex items-start gap-4 text-left`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm ${item.iconBg}`}
                  >
                    <BenefitIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${item.valueColor}`}
                      >
                        {item.value}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[#192434] truncate">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-xs text-[#4E5E74] mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
