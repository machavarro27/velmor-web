import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Award,
  Leaf,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const KEYFRAME_SOURCES = [
  '/images/scrolly-keyframe-start.jpg?v=official',
  '/images/scrolly-keyframe-mid1.jpg?v=official',
  '/images/scrolly-keyframe-mid2.jpg?v=official',
  '/images/scrolly-keyframe-end.jpg?v=official',
] as const;

interface EditorialSlide {
  id: string;
  num: string;
  image: string;
  stepTitle: string;
  kicker: string;
  title: string;
  highlight: string;
  description: string;
  metricValue: string;
  metricLabel: string;
}

export function Storyboard() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScrollRef = useRef(false);

  const slides: EditorialSlide[] = [
    {
      id: 'origin',
      num: '01',
      image: KEYFRAME_SOURCES[0],
      stepTitle: t('storyboard.step1Title'),
      kicker: isEn
        ? 'ARTISANAL ORIGIN · DOSQUEBRADAS, COFFEE REGION'
        : 'ORIGEN ARTESANAL · DOSQUEBRADAS, EJE CAFETERO',
      title: isEn ? 'Nordic silence, cultivated in' : 'El silencio nórdico, cultivado en',
      highlight: isEn ? 'our Coffee Region mountains.' : 'nuestras montañas.',
      description: t('storyboard.step1Desc'),
      metricValue: '100%',
      metricLabel: isEn ? 'Fresh Dosquebradas Milk' : 'Leche Fresca de Dosquebradas',
    },
    {
      id: 'unsealing',
      num: '02',
      image: KEYFRAME_SOURCES[1],
      stepTitle: t('storyboard.step2Title'),
      kicker: isEn
        ? 'SLOW COLD FERMENTATION · LIVE CULTURES'
        : 'FERMENTACIÓN LENTA EN FRÍO · CULTIVOS VIVOS',
      title: isEn ? 'Cold morning mist &' : 'Bruma matinal en frío y',
      highlight: isEn ? 'pure probiotic alchemy.' : 'alquimia probiótica pura.',
      description: t('storyboard.step2Desc'),
      metricValue: '24h',
      metricLabel: isEn ? 'Artisanal Cold Culturing' : 'Maduración Artesanal en Frío',
    },
    {
      id: 'texture',
      num: '03',
      image: KEYFRAME_SOURCES[2],
      stepTitle: t('storyboard.step3Title'),
      kicker: isEn
        ? '4X DAIRY CONCENTRATION · VELVETY SKYR'
        : '4X CONCENTRACIÓN LÁCTEA · TEXTURA SKYR',
      title: isEn ? 'Dense, silky texture with' : 'Textura densa y sedosa con',
      highlight: isEn ? '15g of pure protein.' : '15g de proteína natural.',
      description: t('storyboard.step3Desc'),
      metricValue: '15g',
      metricLabel: isEn ? 'Natural Protein per Serving' : 'Proteína Natural por Porción',
    },
    {
      id: 'harvest',
      num: '04',
      image: KEYFRAME_SOURCES[3],
      stepTitle: t('storyboard.step4Title'),
      kicker: isEn
        ? 'LIVING HARVEST · 0% PRESERVATIVES'
        : 'COSECHA VIVA DEL EJE CAFETERO · 0% CONSERVANTES',
      title: isEn ? 'Strawberries, wild blackberries &' : 'Fresas, moras silvestres y',
      highlight: isEn ? 'sun-ripened mango.' : 'mango madurado al sol.',
      description: t('storyboard.step4Desc'),
      metricValue: '0%',
      metricLabel: isEn ? 'Added Sugars or Preservatives' : 'Conservantes o Azúcar Añadida',
    },
  ];

  // Scroll the horizontal track to a specific card without moving or blocking vertical page scroll
  const scrollToSlide = useCallback(
    (index: number) => {
      const clamped = (index + slides.length) % slides.length;
      setActiveIndex(clamped);

      const container = galleryRef.current;
      const card = cardRefs.current[clamped];
      if (!container || !card) return;

      isProgrammaticScrollRef.current = true;
      const containerCenter = container.clientWidth / 2;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const targetLeft = Math.max(0, cardCenter - containerCenter);

      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });

      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 480);
    },
    [slides.length]
  );

  // Sync activeIndex when the user swipes horizontally on touch / trackpad
  useEffect(() => {
    const container = galleryRef.current;
    if (!container) return;

    const handleHorizontalScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      const center = container.scrollLeft + container.clientWidth / 2;
      let closestIdx = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);
    };

    container.addEventListener('scroll', handleHorizontalScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleHorizontalScroll);
  }, []);

  const scrollToProducts = () => {
    const el = document.querySelector('#products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="scrollytelling"
      aria-label={t('storyboard.title')}
      className="relative py-16 sm:py-20 lg:py-24 bg-[#FAF8F5] overflow-hidden"
    >
      {/* Subtle Ambient Background Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-10 w-96 h-96 rounded-full bg-[#33A6D8]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-10 w-96 h-96 rounded-full bg-[#B47B2B]/10 blur-3xl"
      />

      {/* Section Header + Chapter Tabs + Visible Left/Right Arrow Controls */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#004B87]/15 shadow-sm text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#004B87] mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B47B2B]" />
              <span>
                {isEn
                  ? 'Artisanal Process Gallery · Dosquebradas'
                  : 'Galería Artesanal · Dosquebradas, Eje Cafetero'}
              </span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#192434] font-serif-display leading-[1.08] tracking-tight">
              {t('storyboard.title')}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#4E5E74] mt-2.5 leading-relaxed">
              {t('storyboard.subtitle')}
            </p>
          </div>

          {/* Desktop & Mobile Prominent Left / Right Navigation Arrows + Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="text-xs font-bold text-[#4E5E74] bg-white/90 px-3.5 py-2 rounded-full border border-[#004B87]/15 shadow-sm tabular-nums">
              {isEn ? 'Slide' : 'Fotografía'} {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(slides.length).padStart(2, '0')}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToSlide(activeIndex - 1)}
                aria-label={isEn ? 'Previous photograph' : 'Fotografía anterior'}
                className="w-11 h-11 rounded-full bg-white hover:bg-[#004B87] text-[#192434] hover:text-white border border-[#004B87]/20 shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004B87]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSlide(activeIndex + 1)}
                aria-label={isEn ? 'Next photograph' : 'Siguiente fotografía'}
                className="w-11 h-11 rounded-full bg-[#004B87] hover:bg-[#003865] text-white border border-[#004B87] shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004B87]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Direct Chapter Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
          {slides.map((slide, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => scrollToSlide(idx)}
                className={`px-4 py-2.5 rounded-2xl text-left transition-all duration-200 active:scale-[0.98] border ${
                  isActive
                    ? 'bg-[#004B87] text-white border-[#004B87] shadow-md'
                    : 'bg-white/85 hover:bg-white text-[#4E5E74] hover:text-[#004B87] border-[#004B87]/12 shadow-sm'
                }`}
              >
                <span
                  className={`text-[10px] font-extrabold tabular-nums block ${
                    isActive ? 'text-[#F5B95F]' : 'text-[#B47B2B]'
                  }`}
                >
                  {isEn ? `STEP ${slide.num}` : `PASO ${slide.num}`}
                </span>
                <span className="text-xs sm:text-sm font-bold truncate block mt-0.5">
                  {slide.stepTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Interactive Gallery Track (Swipeable, Peek of Next Slide, Never Blocks Vertical Scroll) */}
      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Floating Side Arrow Buttons Over the Gallery (Desktop) */}
        <button
          type="button"
          onClick={() => scrollToSlide(activeIndex - 1)}
          aria-label={isEn ? 'Previous slide' : 'Anterior'}
          className="hidden md:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 hover:bg-[#004B87] text-[#192434] hover:text-white border border-[#004B87]/20 shadow-xl items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => scrollToSlide(activeIndex + 1)}
          aria-label={isEn ? 'Next slide' : 'Siguiente'}
          className="hidden md:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 hover:bg-[#004B87] text-[#192434] hover:text-white border border-[#004B87]/20 shadow-xl items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Horizontal Scroll Container with Snap & Peek */}
        <div
          ref={galleryRef}
          className="flex items-stretch gap-5 sm:gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-8 lg:px-16 pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, idx) => {
            const isActive = activeIndex === idx;
            return (
              <motion.div
                key={slide.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => {
                  if (!isActive) scrollToSlide(idx);
                }}
                animate={{
                  scale: isActive ? 1 : 0.96,
                  opacity: isActive ? 1 : 0.72,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`relative shrink-0 w-[88%] sm:w-[84%] lg:w-[80%] xl:w-[1040px] snap-center rounded-[28px] sm:rounded-[32px] overflow-hidden border-2 transition-shadow duration-300 bg-white ${
                  isActive
                    ? 'border-[#004B87]/25 shadow-[0_24px_55px_-15px_rgba(0,75,135,0.22)]'
                    : 'border-[#004B87]/10 shadow-md cursor-pointer hover:opacity-90'
                }`}
              >
                <div className="relative min-h-[430px] sm:min-h-[470px] lg:min-h-[510px] w-full flex flex-col justify-between p-6 sm:p-9 lg:p-12 overflow-hidden">
                  {/* Full-Bleed Official Velmor Keyframe Photograph */}
                  <img
                    src={slide.image}
                    alt={`${slide.stepTitle} — ${slide.title} ${slide.highlight}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="absolute inset-0 w-full h-full object-cover object-[68%_center] sm:object-[58%_center] select-none pointer-events-none transition-transform duration-700"
                  />

                  {/* Luminous Editorial Scrim on the Left for High-Contrast Typography */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAF8F5]/96 via-[#FAF8F5]/86 to-transparent sm:via-[#FAF8F5]/68 lg:via-[#FAF8F5]/42"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-[#FAF8F5]/85 via-[#FAF8F5]/30 to-transparent"
                  />

                  {/* Top Row Badges Inside Slide */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 bg-white/92 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#004B87]/15 shadow-sm">
                      <span className="font-serif-display italic text-base font-bold tabular-nums text-[#B47B2B]">
                        {slide.num}
                      </span>
                      <span className="h-3 w-px bg-[#004B87]/20" />
                      <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#004B87]">
                        {slide.kicker}
                      </span>
                    </div>

                    <div className="hidden sm:inline-flex items-center gap-2 bg-white/92 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#2CA64E]/25 text-xs font-bold text-[#192434] shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-[#2CA64E]" />
                      <span>Dosquebradas · Eje Cafetero</span>
                    </div>
                  </div>

                  {/* Editorial Narrative Block on Left Negative Space */}
                  <div className="relative z-10 max-w-[44ch] my-6 sm:my-auto space-y-3.5">
                    <h3 className="text-2xl sm:text-4xl lg:text-[44px] font-bold text-[#192434] font-serif-display leading-[1.08] tracking-[-0.02em] text-balance">
                      <span className="block">{slide.title}</span>
                      <span className="block italic text-[#8C5A16] font-semibold mt-1">
                        {slide.highlight}
                      </span>
                    </h3>

                    <p className="text-xs sm:text-base text-[#2C3A4E] leading-relaxed font-medium text-pretty">
                      {slide.description}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3.5">
                      <div className="inline-flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#004B87]/15 shadow-sm">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#004B87] tabular-nums">
                          {slide.metricValue}
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-[#4E5E74] leading-tight max-w-[135px]">
                          {slide.metricLabel}
                        </span>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToProducts();
                        }}
                        className="bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold px-5 sm:px-6 py-5 rounded-xl shadow-sm transition-[transform,box-shadow,background-color] duration-200 ease-out active:scale-[0.97] group"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        <span>
                          {isEn ? 'Order Artisanal Skyr' : 'Explorar Catálogo'}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>

                  {/* Bottom Bar Inside Slide: Step Title + Next Slide Hint */}
                  <div className="relative z-10 flex items-center justify-between gap-3 pt-3 border-t border-[#004B87]/10">
                    <div className="flex items-center gap-3 text-xs font-bold text-[#004B87]">
                      <span className="inline-flex items-center gap-1 bg-white/90 px-3 py-1 rounded-xl border border-[#004B87]/15">
                        <Award className="w-3.5 h-3.5 text-[#B47B2B]" />
                        15g {isEn ? 'Protein' : 'Proteína'}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white/90 px-3 py-1 rounded-xl border border-[#2CA64E]/25 text-[#2CA64E]">
                        <Leaf className="w-3.5 h-3.5" />
                        100% Natural
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSlide(idx + 1);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#004B87] hover:text-[#B47B2B] bg-white/95 px-3.5 py-1.5 rounded-full border border-[#004B87]/15 shadow-sm transition-colors"
                    >
                      <span>
                        {idx < slides.length - 1
                          ? isEn
                            ? `Next: ${slides[idx + 1].stepTitle}`
                            : `Siguiente: ${slides[idx + 1].stepTitle}`
                          : isEn
                          ? 'Back to Step 01'
                          : 'Volver al Paso 01'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots + Swipe Hint */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`${slide.num} ${slide.stepTitle}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? 'w-9 bg-[#004B87] shadow-sm'
                    : 'w-2.5 bg-[#004B87]/25 hover:bg-[#004B87]/50'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#4E5E74]">
            {isEn
              ? '← Swipe or use the arrows to explore all 4 stages →'
              : '← Desliza horizontalmente o usa las flechas para explorar las 4 etapas →'}
          </span>
        </div>
      </div>
    </section>
  );
}
