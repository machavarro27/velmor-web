import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { toast } from 'sonner';

export function Hero() {
  const { t, i18n } = useTranslation();
  const { applyPromoCode } = useAppStore();
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isMascotJumping, setIsMascotJumping] = useState(false);
  const [activePose, setActivePose] = useState<'cutout' | 'warrior' | 'sunset'>('cutout');

  // 3D interactive tilt for the mascot
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 140, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 140, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const greetingsRaw = t('hero.mascotGreetings', { returnObjects: true });
  const greetings = Array.isArray(greetingsRaw)
    ? greetingsRaw
    : [
        '¡Skål desde las montañas de Bogotá! 🏔️ ¿Listo para probar el auténtico Skyr?',
        '¡15g de proteína pura por porción! Fuerza vikinga con leche de la Sabana 🛡️',
      ];

  const handleMascotClick = () => {
    setIsMascotJumping(true);
    setGreetingIndex((prev) => (prev + 1) % greetings.length);
    applyPromoCode('VELMOR10');
    navigator.clipboard?.writeText('VELMOR10').catch(() => {});
    toast.success(
      i18n.language?.startsWith('en')
        ? 'Viking Velmor activated code VELMOR10 (10% OFF) in your cart!'
        : '¡Vikingo Velmor activó el código VELMOR10 (10% Dto.) en tu carrito!',
      { duration: 2000 }
    );
    setTimeout(() => setIsMascotJumping(false), 750);
  };

  const handleCopyPromo = () => {
    navigator.clipboard?.writeText('VELMOR10').catch(() => {});
    applyPromoCode('VELMOR10');
    setCopiedPromo(true);
    toast.success(
      i18n.language?.startsWith('en')
        ? 'Promo code VELMOR10 copied and applied!'
        : '¡Código VELMOR10 copiado y aplicado automáticamente!',
      { duration: 2000 }
    );
    setTimeout(() => setCopiedPromo(false), 2500);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const howToBuySteps = [
    {
      num: '1',
      icon: '🍓',
      title: t('hero.step1Title'),
      desc: t('hero.step1Desc'),
    },
    {
      num: '2',
      icon: '🥛',
      title: t('hero.step2Title'),
      desc: t('hero.step2Desc'),
    },
    {
      num: '3',
      icon: '📍',
      title: t('hero.step3Title'),
      desc: t('hero.step3Desc'),
    },
    {
      num: '4',
      icon: '🚚',
      title: t('hero.step4Title'),
      desc: t('hero.step4Desc'),
    },
  ];

  const poses = [
    {
      id: 'cutout' as const,
      label: t('hero.mascotPose1'),
      src: '/images/mascota.png',
      isCutout: true,
    },
    {
      id: 'warrior' as const,
      label: t('hero.mascotPose2'),
      src: '/images/mascota-vikingo-epico.jpg',
      isCutout: false,
    },
    {
      id: 'sunset' as const,
      label: t('hero.mascotPose3'),
      src: '/images/mascota-vikingo-atardecer.jpg',
      isCutout: false,
    },
  ];

  const currentPose = poses.find((p) => p.id === activePose) || poses[0];

  return (
    <section id="home" className="relative overflow-hidden bg-[#FAF8F5]">
      {/* Main Hero Area with Bogotá Highlands & Nordic Nature Atmosphere */}
      <div className="relative min-h-[88vh] flex items-center pt-24 pb-14 lg:pt-28 lg:pb-20 overflow-hidden">
        {/* Luminous Nature & Bogotá Highlands Layered Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Soft High-Resolution Landscape Texture in Light Mode */}
          <img
            src="/images/hero-landscape.jpg"
            alt="Paisaje Natural Tierras Altas de Bogotá y Fiordos Nórdicos"
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter brightness-110 contrast-95"
          />

          {/* Creamy Nordic Sky & Morning Mist Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/70 to-[#EBF4FA]/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent" />

          {/* Sunlit Glow over the Eastern Hills of Bogotá (Cerros Orientales) */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.45, 0.65, 0.45],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 right-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#FDE68A]/40 via-[#33A6D8]/15 to-transparent blur-3xl"
          />

          {/* SVG Silhouette of the Bogotá Highlands & Andean Savanna Valleys */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-48 sm:h-64 lg:h-80 pointer-events-none"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            {/* Distant Nordic & Andean Peaks in Soft Sky Blue */}
            <path
              fill="#D6E9F8"
              fillOpacity="0.65"
              d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,197.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
            {/* Midground Cerros de Bogotá in Soft Nordic Blue + Fresh Green tint */}
            <path
              fill="#CFE8DC"
              fillOpacity="0.55"
              d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,192C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
            {/* Foreground Creamy Meadow Blend */}
            <path
              fill="#FAF8F5"
              fillOpacity="0.95"
              d="M0,268L80,261.3C160,255,320,240,480,245.3C640,251,800,277,960,277.3C1120,277,1280,251,1360,238L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Editorial Typography & Value Proposition */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Premium Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3E9D8] border border-[#B47B2B]/25 text-[#8C5A16] text-xs sm:text-sm font-bold mb-6 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#B47B2B]" />
                <span>{t('hero.badge')}</span>
              </motion.div>

              {/* Editorial Display Headline (Inspired by Manus Reference) */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-bold tracking-tight leading-[1.06] mb-6 text-[#192434] font-serif-display"
              >
                <span className="block">{t('hero.titleLine1')}</span>
                <span className="block italic text-[#B47B2B] font-semibold my-1">
                  {t('hero.titleHighlight')}
                </span>
                <span className="block text-[#004B87]">{t('hero.titleLine2')}</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-base sm:text-lg lg:text-xl text-[#4E5E74] max-w-2xl mx-auto lg:mx-0 mb-7 leading-relaxed font-normal"
              >
                {t('hero.subtitle')}
              </motion.p>

              {/* Trust Badges Row */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-8"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-[#192434] bg-white/85 px-3.5 py-2 rounded-xl border border-[#2CA64E]/25 shadow-sm">
                  <Leaf className="w-4 h-4 text-[#2CA64E]" />
                  <span>{t('hero.trust1')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#192434] bg-white/85 px-3.5 py-2 rounded-xl border border-[#004B87]/20 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#004B87]" />
                  <span>{t('hero.trust2')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#192434] bg-white/85 px-3.5 py-2 rounded-xl border border-[#B47B2B]/25 shadow-sm">
                  <Truck className="w-4 h-4 text-[#B47B2B]" />
                  <span>{t('hero.trust3')}</span>
                </div>
              </motion.div>

              {/* Primary & Secondary CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection('#products')}
                  className="bg-[#A66A18] hover:bg-[#8C5712] text-white font-bold px-8 py-6 text-base rounded-xl shadow-md hover:shadow-lg transition-all group"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {t('hero.ctaPrimary')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('#about')}
                  className="bg-white/90 hover:bg-white border-2 border-[#192434]/20 text-[#192434] font-semibold px-7 py-6 text-base rounded-xl shadow-sm group"
                >
                  <Play className="mr-2 w-4 h-4 fill-[#004B87] text-[#004B87]" />
                  {t('hero.ctaSecondary')}
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column: Interactive & Dynamic 3D Velmor Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.25 }}
              className="lg:col-span-5 relative flex flex-col items-center justify-center"
            >
              {/* Interactive Speech Bubble from the Viking Mascot */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${i18n.language}-${greetingIndex}`}
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.92 }}
                  transition={{ duration: 0.28 }}
                  onClick={handleMascotClick}
                  className="relative z-20 mb-3 max-w-xs sm:max-w-sm bg-white border-2 border-[#004B87]/20 rounded-2xl px-4 py-3 shadow-lg cursor-pointer hover:border-[#004B87] transition-colors"
                >
                  <p className="text-xs sm:text-sm font-semibold text-[#192434] text-center leading-snug">
                    {greetings[greetingIndex]}
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-[#004B87]/20 rotate-45" />
                </motion.div>
              </AnimatePresence>

              {/* 3D Interactive Mascot Stage */}
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleMascotClick}
                style={{
                  rotateX,
                  rotateY,
                  transformPerspective: 1000,
                }}
                animate={
                  isMascotJumping
                    ? { y: [0, -24, 0, -10, 0], rotate: [0, -5, 5, -2, 0], scale: [1, 1.08, 1] }
                    : { y: [0, -10, 0] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.7, ease: 'easeInOut' }
                    : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
                }
                whileHover={{ scale: 1.04 }}
                className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[370px] lg:h-[370px] flex items-center justify-center cursor-pointer select-none group"
              >
                {/* Luminous Aura Halo Behind Mascot */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#33A6D8]/25 via-[#2CA64E]/15 to-[#FDE68A]/35 blur-2xl group-hover:scale-110 transition-transform duration-500" />

                {/* Pedestal Meadow Shadow */}
                <motion.div
                  animate={{ scale: [1, 0.92, 1], opacity: [0.35, 0.22, 0.35] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-2 w-48 h-7 bg-[#004B87]/20 rounded-full blur-md"
                />

                {/* Mascot Render */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPose.id}
                    src={currentPose.src}
                    alt="Mascota Oficial Vikingo Velmor - Yogur Artesanal"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={
                      currentPose.isCutout
                        ? 'relative z-10 w-full h-full object-contain drop-shadow-[0_20px_28px_rgba(0,75,135,0.25)]'
                        : 'relative z-10 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-cover rounded-3xl border-4 border-white shadow-2xl'
                    }
                  />
                </AnimatePresence>

                {/* Floating Highland Origin Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-2 sm:-left-4 bottom-8 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#2CA64E]/30 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#2CA64E]/15 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#2CA64E]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-[#192434] leading-tight">
                      Sabana de Bogotá
                    </p>
                    <p className="text-[10px] text-[#4E5E74]">2.600 m.s.n.m.</p>
                  </div>
                </motion.div>

                {/* Floating Protein Badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -right-2 sm:-right-4 top-10 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#004B87]/25 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#004B87]/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#004B87]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-[#004B87] leading-tight">
                      15g {i18n.language?.startsWith('en') ? 'Protein' : 'Proteína'}
                    </p>
                    <p className="text-[10px] text-[#4E5E74]">Skyr Vikingo</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Interactive Pose Switcher Pills */}
              <div className="mt-3 flex flex-col items-center gap-2">
                <p className="text-xs font-medium text-[#4E5E74]">
                  ✨ {t('hero.mascotInteractHint')}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white/90 p-1.5 rounded-full border border-[#004B87]/15 shadow-sm">
                  {poses.map((pose) => (
                    <button
                      key={pose.id}
                      type="button"
                      onClick={() => setActivePose(pose.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        activePose === pose.id
                          ? 'bg-[#004B87] text-white shadow-sm'
                          : 'text-[#4E5E74] hover:text-[#004B87]'
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

      {/* Vibrant First-Purchase Promo Banner (Matches Reference Screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
              <p className="text-xs text-white/90">
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

      {/* 4-Step "¿Cómo comprar?" Section & Key Indicators (Matches Reference Screenshot) */}
      <div className="bg-[#EFECE6]/75 border-y border-[#004B87]/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#192434] font-serif-display">
              {t('hero.howToBuyTitle')}
            </h2>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {howToBuySteps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 rounded-2xl p-6 text-center border border-[#004B87]/10 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#B47B2B] text-white flex items-center justify-center text-2xl shadow-md">
                  <span>{step.icon}</span>
                </div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#B47B2B] mb-1">
                  {i18n.language?.startsWith('en') ? `Step ${step.num}` : `Paso ${step.num}`}
                </span>
                <h3 className="font-bold text-base text-[#192434] mb-1">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#4E5E74]">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* 3 Highlight Metrics Row */}
          <div className="mt-12 pt-8 border-t border-[#004B87]/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#004B87]">
                {t('hero.stat1Value')}
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#4E5E74] mt-1">
                {t('hero.stat1Label')}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#2CA64E]">
                {t('hero.stat2Value')}
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#4E5E74] mt-1">
                {t('hero.stat2Label')}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#B47B2B]">
                {t('hero.stat3Value')}
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#4E5E74] mt-1">
                {t('hero.stat3Label')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
