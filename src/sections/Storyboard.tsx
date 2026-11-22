import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Film,
  MapPin,
  Award,
  Leaf,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TOTAL_FRAMES = 75;

const KEYFRAME_SOURCES = [
  '/images/scrolly-keyframe-start.jpg?v=official',
  '/images/scrolly-keyframe-mid1.jpg?v=official',
  '/images/scrolly-keyframe-mid2.jpg?v=official',
  '/images/scrolly-keyframe-end.jpg?v=official',
] as const;

interface EditorialChapter {
  id: string;
  num: string;
  range: [number, number];
  targetProgress: number;
  kicker: string;
  title: string;
  highlight: string;
  description: string;
  metricValue: string;
  metricLabel: string;
  keyframeIndex: number;
}

export function Storyboard() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const [viewMode, setViewMode] = useState<'scrolly' | 'editorial'>('scrolly');
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualProgress, setManualProgress] = useState<number | null>(null);

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const renderedProgressRef = useRef<number>(-1);
  const isInViewportRef = useRef<boolean>(true);
  const rafIdRef = useRef<number | null>(null);

  const chapters: EditorialChapter[] = [
    {
      id: 'origin',
      num: '01',
      range: [0, 0.27],
      targetProgress: 0.04,
      kicker: isEn
        ? 'ARTISANAL ORIGIN · DOSQUEBRADAS, COFFEE REGION'
        : 'ORIGEN ARTESANAL · DOSQUEBRADAS, EJE CAFETERO',
      title: isEn ? 'Nordic silence, cultivated in' : 'El silencio nórdico, cultivado en',
      highlight: isEn ? 'our Coffee Region mountains.' : 'nuestras montañas.',
      description: t('storyboard.step1Desc'),
      metricValue: '100%',
      metricLabel: isEn ? 'Fresh Dosquebradas Milk' : 'Leche Fresca de Dosquebradas',
      keyframeIndex: 0,
    },
    {
      id: 'unsealing',
      num: '02',
      range: [0.27, 0.54],
      targetProgress: 0.36,
      kicker: isEn
        ? 'SLOW COLD FERMENTATION · LIVE CULTURES'
        : 'FERMENTACIÓN LENTA EN FRÍO · CULTIVOS VIVOS',
      title: isEn ? 'Cold morning mist &' : 'Bruma matinal en frío y',
      highlight: isEn ? 'pure probiotic alchemy.' : 'alquimia probiótica pura.',
      description: t('storyboard.step2Desc'),
      metricValue: '24h',
      metricLabel: isEn ? 'Artisanal Cold Culturing' : 'Maduración Artesanal en Frío',
      keyframeIndex: 1,
    },
    {
      id: 'texture',
      num: '03',
      range: [0.54, 0.78],
      targetProgress: 0.67,
      kicker: isEn
        ? '4X DAIRY CONCENTRATION · VELVETY SKYR'
        : '4X CONCENTRACIÓN LÁCTEA · TEXTURA SKYR',
      title: isEn ? 'Dense, silky texture with' : 'Textura densa y sedosa con',
      highlight: isEn ? '15g of pure protein.' : '15g de proteína natural.',
      description: t('storyboard.step3Desc'),
      metricValue: '15g',
      metricLabel: isEn ? 'Natural Protein per Serving' : 'Proteína Natural por Porción',
      keyframeIndex: 2,
    },
    {
      id: 'harvest',
      num: '04',
      range: [0.78, 1.01],
      targetProgress: 0.98,
      kicker: isEn
        ? 'LIVING HARVEST · 0% PRESERVATIVES'
        : 'COSECHA VIVA DEL EJE CAFETERO · 0% CONSERVANTES',
      title: isEn ? 'Strawberries, wild blackberries &' : 'Fresas, moras silvestres y',
      highlight: isEn ? 'sun-ripened mango.' : 'mango madurado al sol.',
      description: t('storyboard.step4Desc'),
      metricValue: '0%',
      metricLabel: isEn ? 'Added Sugars or Preservatives' : 'Conservantes o Azúcar Añadida',
      keyframeIndex: 3,
    },
  ];

  // Detect prefers-reduced-motion reactively (QA Invariant #1)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Preload 4 pixel-locked editorial keyframes into memory (QA Invariant #2)
  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(KEYFRAME_SOURCES.length);
    let loadedCount = 0;

    KEYFRAME_SOURCES.forEach((src, index) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        imgs[index] = img;
        loadedCount += 1;
        loadedImagesRef.current = imgs;
        if (index === 0 || loadedCount === KEYFRAME_SOURCES.length) {
          setImagesLoaded(true);
          renderedProgressRef.current = -1;
        }
      };
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll progress tracking with motion/react
  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.0005,
  });

  const progressBarScaleY = useTransform(smoothProgress, [0, 1], [0.06, 1]);

  // Core 60fps <canvas> Frame Synthesizer (Interpolates 75 Virtual Frames from the 4 Locked Keyframes)
  const renderCanvasFrame = useCallback((rawProgress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const progress = Math.min(1, Math.max(0, rawProgress));
    const imgs = loadedImagesRef.current;
    const validImgs = imgs.filter(Boolean);
    if (validImgs.length === 0) return;

    // Cap DPR at 1.5 desktop / 1.0 mobile for optimal VRAM & 60fps performance (QA Invariant #3)
    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? 1.0 : 1.5;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const rect = canvas.getBoundingClientRect();
    const targetW = Math.max(1, Math.floor(rect.width * dpr));
    const targetH = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const totalSegments = KEYFRAME_SOURCES.length - 1; // 3 segments across 4 keyframes
    const scaled = progress * totalSegments;
    const segIdx = Math.min(totalSegments - 1, Math.floor(scaled));
    const localT = scaled - segIdx;
    // Cubic ease-in-out between consecutive pixel-locked keyframes
    const smoothT =
      localT < 0.5
        ? 4 * localT * localT * localT
        : 1 - Math.pow(-2 * localT + 2, 3) / 2;

    const imgA = imgs[segIdx] || validImgs[0];
    const imgB = imgs[Math.min(KEYFRAME_SOURCES.length - 1, segIdx + 1)] || imgA;

    ctx.clearRect(0, 0, targetW, targetH);

    // Subtle continuous optical dolly-in zoom (1.00 -> 1.045) across the 75 frames
    const dollyScale = 1.0 + progress * 0.045;

    const drawCoverAnchored = (image: HTMLImageElement, alpha: number, extraScale = 1) => {
      if (!image || !image.complete || image.naturalWidth === 0) return;
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      const scale = Math.max(targetW / iw, targetH / ih) * dollyScale * extraScale;
      const dw = iw * scale;
      const dh = ih * scale;
      // Anchor right-center so the Velmor jar stays framed on the right and negative space stays on the left
      const anchorX = isMobile ? 0.68 : 0.56;
      const dx = (targetW - dw) * anchorX;
      const dy = (targetH - dh) * 0.5;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(image, dx, dy, dw, dh);
      ctx.restore();
    };

    // Base frame A
    drawCoverAnchored(imgA, 1.0, 1.0);

    // Interpolated frame B with subtle upward kinetic drift during lid unsealing / fruit levitation
    if (imgB && imgB !== imgA && smoothT > 0.002) {
      drawCoverAnchored(imgB, smoothT, 1.0 + (1 - smoothT) * 0.008);
    }

    // Subtle procedural cold Nordic mist & Artisanal Gold / Borealis micro-particles synchronized to scroll
    ctx.save();
    const particleCount = isMobile ? 10 : 18;
    for (let i = 0; i < particleCount; i++) {
      const seed = (i + 1) * 17.37;
      const px = ((Math.sin(seed) * 0.5 + 0.5) * 0.55 + 0.4) * targetW;
      const basePy = (Math.cos(seed * 1.3) * 0.5 + 0.5) * targetH;
      const py = (basePy - progress * targetH * (0.18 + (i % 4) * 0.05) + targetH) % targetH;
      const radius = (1.2 + (i % 3) * 1.1) * dpr;
      const alpha = Math.sin(progress * Math.PI) * (0.14 + (i % 3) * 0.06);

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle =
        i % 3 === 0
          ? `rgba(180, 123, 43, ${alpha})` // Artisanal Gold #B47B2B
          : i % 3 === 1
          ? `rgba(51, 166, 216, ${alpha})` // Nordic Sky Blue #33A6D8
          : `rgba(255, 255, 255, ${alpha * 1.2})`; // Cold Nordic Frost
      ctx.fill();
    }
    ctx.restore();
  }, []);

  // Paint initial frame and handle window resize / reduced motion / manual scrubber
  useEffect(() => {
    const activeProg =
      manualProgress !== null ? manualProgress : smoothProgress.get() || 0;
    renderCanvasFrame(activeProg);

    const handleResize = () => {
      renderedProgressRef.current = -1;
      renderCanvasFrame(
        manualProgress !== null ? manualProgress : smoothProgress.get() || 0
      );
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded, manualProgress, renderCanvasFrame, smoothProgress]);

  // IntersectionObserver to pause canvas updates when off-screen (QA Invariant #3)
  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        isInViewportRef.current = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Bidirectional Scroll Listener -> 60fps <canvas> Frame Update
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (!isInViewportRef.current || viewMode !== 'scrolly') return;

    // Release manual override once the user scrolls naturally
    if (manualProgress !== null && Math.abs(latest - manualProgress) > 0.035) {
      setManualProgress(null);
    }

    const effectiveProgress = manualProgress !== null ? manualProgress : latest;
    const frameIdx = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(effectiveProgress * (TOTAL_FRAMES - 1)) + 1)
    );
    setCurrentFrameNum(frameIdx);

    // Determine active editorial chapter (01 - 04)
    const chapterIdx =
      effectiveProgress < 0.27
        ? 0
        : effectiveProgress < 0.54
        ? 1
        : effectiveProgress < 0.78
        ? 2
        : 3;
    setActiveChapterIdx(chapterIdx);

    if (Math.abs(effectiveProgress - renderedProgressRef.current) > 0.001) {
      renderedProgressRef.current = effectiveProgress;
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        renderCanvasFrame(effectiveProgress);
      });
    }
  });

  const handleJumpToChapter = (index: number) => {
    const target = chapters[index];
    if (!target) return;
    setActiveChapterIdx(index);
    const frameIdx = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(target.targetProgress * (TOTAL_FRAMES - 1)) + 1)
    );
    setCurrentFrameNum(frameIdx);
    setManualProgress(target.targetProgress);
    renderCanvasFrame(target.targetProgress);

    // Also smoothly position scroll if in scrolly mode
    if (viewMode === 'scrolly' && scrollTrackRef.current) {
      const rect = scrollTrackRef.current.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const scrollableDistance = Math.max(0, rect.height - window.innerHeight);
      window.scrollTo({
        top: absoluteTop + scrollableDistance * target.targetProgress,
        behavior: 'smooth',
      });
    }
  };

  const handleScrubSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = Number(e.target.value);
    const norm = (frame - 1) / (TOTAL_FRAMES - 1);
    setCurrentFrameNum(frame);
    setManualProgress(norm);
    const chapterIdx = norm < 0.27 ? 0 : norm < 0.54 ? 1 : norm < 0.78 ? 2 : 3;
    setActiveChapterIdx(chapterIdx);
    renderCanvasFrame(norm);
  };

  const scrollToProducts = () => {
    const el = document.querySelector('#products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentChapter = chapters[activeChapterIdx] || chapters[0];
  const effectiveEditorialMode = viewMode === 'editorial' || prefersReducedMotion;

  return (
    <section
      id="scrollytelling"
      aria-label={t('storyboard.title')}
      className="relative bg-[#FAF8F5] border-y border-[#004B87]/12"
    >
      {/* MODO 1: SCROLLYTELLING <CANVAS> 60FPS SINCRONIZADO CON EL SCROLL */}
      {!effectiveEditorialMode ? (
        <div ref={scrollTrackRef} className="relative h-[290vh] sm:h-[320vh]">
          <div className="sticky top-16 h-[calc(100dvh-4rem)] w-full overflow-hidden flex flex-col justify-between bg-[#FAF8F5]">
            {/* Layer 1: Static Fallback Poster (Immediate First Paint) */}
            <img
              src={KEYFRAME_SOURCES[currentChapter.keyframeIndex]}
              alt={currentChapter.title}
              className="absolute inset-0 w-full h-full object-cover object-[68%_center] sm:object-[56%_center] pointer-events-none select-none"
            />

            {/* Layer 2: High-DPI 60fps Scrollytelling <canvas> */}
            <canvas
              ref={canvasRef}
              aria-label="Secuencia interactiva de Scrollytelling del Yogur Artesanal Nórdico Velmor"
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Layer 3: Luminous Editorial Scrim on the Left Negative Space for WCAG AAA Readability */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAF8F5]/96 via-[#FAF8F5]/82 to-transparent sm:via-[#FAF8F5]/55 lg:via-[#FAF8F5]/35"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-t from-[#FAF8F5]/90 via-[#FAF8F5]/40 to-transparent"
            />

            {/* Top Editorial Control Bar: Kicker + Mode Switcher ("Scrollytelling <canvas>" vs "Composición Estática") */}
            <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#004B87]/15 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B47B2B]" />
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#004B87]">
                  {isEn
                    ? 'Interactive Scrollytelling · Dosquebradas'
                    : 'Scrollytelling Artesanal · Dosquebradas'}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-white/92 backdrop-blur-md p-1 rounded-full border border-[#004B87]/15 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode('scrolly')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#004B87] text-white shadow-sm transition-colors"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Canvas Sequence' : 'Secuencia <canvas>'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('editorial')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#4E5E74] hover:text-[#004B87] transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Editorial Keyframes' : 'Vista Editorial Estática'}</span>
                </button>
              </div>
            </div>

            {/* Middle Stage: Left Negative-Space Editorial Typography + Vertical Fermentation Thread */}
            <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 xl:col-span-5 flex gap-5 sm:gap-6 items-stretch">
                  {/* Vertical Progress Thread ("Hilo de Fermentación Lenta") */}
                  <div className="hidden sm:flex flex-col items-center py-2">
                    <span className="text-xs font-extrabold tabular-nums text-[#B47B2B] mb-2">
                      {currentChapter.num}
                    </span>
                    <div className="relative w-0.5 flex-1 bg-[#004B87]/15 rounded-full overflow-hidden">
                      <motion.div
                        style={{ scaleY: progressBarScaleY }}
                        className="absolute inset-0 bg-gradient-to-b from-[#004B87] via-[#33A6D8] to-[#B47B2B] origin-top"
                      />
                    </div>
                    <span className="text-[11px] font-bold tabular-nums text-[#4E5E74] mt-2">
                      04
                    </span>
                  </div>

                  {/* Animated Editorial Copy Block (High Contrast WCAG AAA on Clean Negative Space) */}
                  <div className="flex-1 max-w-[46ch]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentChapter.id}
                        initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -14, filter: 'blur(3px)' }}
                        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif-display italic text-2xl sm:text-3xl font-bold tabular-nums text-[#B47B2B]">
                            {currentChapter.num}
                          </span>
                          <span className="h-px w-6 bg-[#B47B2B]/50" />
                          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#004B87]">
                            {currentChapter.kicker}
                          </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#192434] font-serif-display leading-[1.06] tracking-[-0.02em] text-balance">
                          <span className="block">{currentChapter.title}</span>
                          <span className="block italic text-[#8C5A16] font-semibold mt-1">
                            {currentChapter.highlight}
                          </span>
                        </h2>

                        <p className="text-sm sm:text-base lg:text-lg text-[#2C3A4E] leading-[1.68] font-medium text-pretty">
                          {currentChapter.description}
                        </p>

                        {/* Clean Editorial Metric + Artisanal Gold CTA */}
                        <div className="pt-2 flex flex-wrap items-center gap-4">
                          <div className="inline-flex items-center gap-3 bg-white/92 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#004B87]/15 shadow-sm">
                            <span className="text-xl sm:text-2xl font-extrabold text-[#004B87] tabular-nums">
                              {currentChapter.metricValue}
                            </span>
                            <span className="text-xs font-bold text-[#4E5E74] leading-tight max-w-[140px]">
                              {currentChapter.metricLabel}
                            </span>
                          </div>

                          <Button
                            onClick={scrollToProducts}
                            className="bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold px-6 py-5 rounded-xl shadow-sm transition-[transform,box-shadow,background-color] duration-200 ease-out active:scale-[0.97] group"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            <span>
                              {isEn ? 'Order Artisanal Skyr' : 'Explorar Catálogo'}
                            </span>
                            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Interactive Scrubber Bar: Chapter Pills (01-04) + Frame Scrubber (Frame XX / 75) */}
            <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-5 sm:pb-7">
              <div className="bg-white/92 backdrop-blur-md rounded-2xl p-3 sm:px-5 sm:py-3.5 border border-[#004B87]/15 shadow-md flex flex-col md:flex-row items-center justify-between gap-3.5">
                {/* 4 Chapter Direct Jump Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full md:w-auto">
                  {chapters.map((chap, idx) => {
                    const isActive = activeChapterIdx === idx;
                    return (
                      <button
                        key={chap.id}
                        type="button"
                        onClick={() => handleJumpToChapter(idx)}
                        className={`px-3 py-1.5 rounded-xl text-left transition-[background-color,color,transform] duration-200 active:scale-[0.98] ${
                          isActive
                            ? 'bg-[#004B87] text-white shadow-sm'
                            : 'bg-[#FAF8F5] text-[#4E5E74] hover:text-[#004B87] border border-[#004B87]/10'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-extrabold tabular-nums block ${
                            isActive ? 'text-[#F5B95F]' : 'text-[#B47B2B]'
                          }`}
                        >
                          {chap.num}
                        </span>
                        <span className="text-xs font-bold truncate block">
                          {t(`storyboard.step${idx + 1}Title`)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Frame Scrubber Slider + Live Frame Counter */}
                <div className="flex items-center gap-3 w-full md:w-72 lg:w-80">
                  <span className="text-[11px] font-bold text-[#004B87] uppercase tracking-wider shrink-0">
                    {isEn ? 'Scroll / Scrub' : 'Scroll / Frame'}
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={TOTAL_FRAMES}
                    value={currentFrameNum}
                    onChange={handleScrubSlider}
                    aria-label="Control de fotogramas de la secuencia artesanal Velmor"
                    className="w-full accent-[#B47B2B] cursor-pointer h-1.5 bg-[#EBF4FA] rounded-lg"
                  />
                  <span className="text-xs font-extrabold tabular-nums text-[#192434] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#004B87]/15 shrink-0">
                    {String(currentFrameNum).padStart(2, '0')} / {TOTAL_FRAMES}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODO 2: COMPOSICIÓN ESTÁTICA EDITORIAL LIMPIA (ETAPA 1 DE VALIDACIÓN & ACCESIBILIDAD) */
        <div className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FA] text-[#004B87] text-xs font-extrabold uppercase tracking-[0.2em] mb-4 border border-[#004B87]/15">
                <Sparkles className="w-3.5 h-3.5 text-[#B47B2B]" />
                <span>
                  {isEn
                    ? 'Editorial Storyboard · Dosquebradas, Coffee Region'
                    : 'Composición Editorial · Dosquebradas, Eje Cafetero'}
                </span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold text-[#192434] font-serif-display leading-[1.06] tracking-[-0.02em] text-balance">
                {t('storyboard.title')}
              </h2>
              <p className="text-base sm:text-lg text-[#3D4C60] mt-3 leading-relaxed">
                {t('storyboard.subtitle')}
              </p>
            </div>

            {!prefersReducedMotion && (
              <div className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-[#004B87]/15 shadow-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('scrolly')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4E5E74] hover:text-[#004B87] transition-colors"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Canvas Sequence' : 'Secuencia <canvas>'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('editorial')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#004B87] text-white shadow-sm transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Editorial Keyframes' : 'Vista Editorial Estática'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Asymmetric 5/7 Editorial Split Composition */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left 5 Cols: Clean Editorial Chapters without Cluttered Boxes */}
            <div className="lg:col-span-5 space-y-8 border-l-2 border-[#004B87]/15 pl-6 sm:pl-8">
              {chapters.map((chap, idx) => {
                const isSelected = activeChapterIdx === idx;
                return (
                  <div
                    key={chap.id}
                    onClick={() => setActiveChapterIdx(idx)}
                    className={`cursor-pointer transition-opacity duration-300 ${
                      isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="font-serif-display italic text-2xl font-bold tabular-nums text-[#B47B2B]">
                        {chap.num}
                      </span>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#004B87]">
                        {t(`storyboard.step${idx + 1}Title`)}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#192434] font-serif-display leading-snug mb-2">
                      {chap.title} <span className="italic text-[#8C5A16]">{chap.highlight}</span>
                    </h3>
                    <p className="text-sm text-[#3D4C60] leading-relaxed">
                      {chap.description}
                    </p>
                  </div>
                );
              })}

              <div className="pt-4">
                <Button
                  onClick={scrollToProducts}
                  className="bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold px-7 py-5 rounded-xl shadow-sm transition-[transform,box-shadow,background-color] duration-200 ease-out active:scale-[0.97] group"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span>{isEn ? 'Explore Artisanal Skyr' : 'Explorar Catálogo Velmor'}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Right 7 Cols: High-Contrast Editorial Keyframe Showcase */}
            <div className="lg:col-span-7 space-y-5">
              <div className="relative rounded-[28px] overflow-hidden border-2 border-white shadow-xl bg-white aspect-video">
                <img
                  src={KEYFRAME_SOURCES[activeChapterIdx]}
                  alt={currentChapter.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#FAF8F5]/95 backdrop-blur-md rounded-2xl p-4 border border-[#004B87]/15 flex flex-wrap items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2CA64E]/15 text-[#2CA64E] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#004B87] uppercase tracking-wider">
                        Keyframe {currentChapter.num} · Dosquebradas, Eje Cafetero
                      </p>
                      <p className="text-sm font-bold text-[#192434]">
                        {t(`storyboard.step${activeChapterIdx + 1}Title`)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#004B87]">
                    <span className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#004B87]/15">
                      <Award className="w-3.5 h-3.5 text-[#B47B2B]" />
                      15g Proteína
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#2CA64E]/25 text-[#2CA64E]">
                      <Leaf className="w-3.5 h-3.5" />
                      100% Natural
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Generated Keyframes Filmstrip Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {chapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => setActiveChapterIdx(idx)}
                    className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all ${
                      activeChapterIdx === idx
                        ? 'border-[#004B87] ring-2 ring-[#004B87]/25 shadow-md'
                        : 'border-[#004B87]/12 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={KEYFRAME_SOURCES[idx]}
                      alt={chap.title}
                      className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-2 bg-white">
                      <span className="text-[10px] font-extrabold text-[#B47B2B] tabular-nums block">
                        KEYFRAME {chap.num}
                      </span>
                      <span className="text-xs font-bold text-[#192434] truncate block">
                        {t(`storyboard.step${idx + 1}Title`)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
