import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Leaf, Award, Recycle, Heart, Sparkles, CheckCircle2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STORY_VIDEOS = [
  {
    id: 'nordic-origin',
    src: '/images/Yogurt_jar_in_Nordic_landscape_ab55d5e3_1080p.mp4',
    poster: '/images/velmor-hero.jpg',
    titleEs: '1. Esencia Nórdica & Origen',
    titleEn: '1. Nordic Essence & Origin',
  },
  {
    id: 'viking-voyage',
    src: '/images/velmor-historia-barco-vikingo.mp4',
    poster: '/images/mascota-vikingo-atardecer.jpg',
    titleEs: '2. Travesía Vikinga Velmor',
    titleEn: '2. Velmor Viking Voyage',
  },
  {
    id: 'artisanal-commercial',
    src: '/images/velmor-comercial-artesanal.mp4',
    poster: '/images/scrolly-keyframe-start.jpg',
    titleEs: '3. Comercial Yogur Artesanal',
    titleEn: '3. Artisanal Yogurt Commercial',
  },
] as const;

export function About() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inlineVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const modalVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleExclusivePlay = (
    group: (HTMLVideoElement | null)[],
    activeIndex: number
  ) => {
    group.forEach((vid, idx) => {
      if (vid && idx !== activeIndex && !vid.paused) {
        vid.pause();
      }
    });
  };

  // Layered scroll parallax for smooth section transitions
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgOrbY = useTransform(scrollYProgress, [0, 1], ['-10%', '14%']);
  const imageCardY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const storyCardY = useTransform(scrollYProgress, [0, 1], [44, -18]);

  const values = [
    {
      icon: Leaf,
      title: t('about.value1Title'),
      description: t('about.value1Desc'),
      color: 'from-[#2CA64E] to-emerald-600',
      bgColor: 'bg-[#2CA64E]/10',
    },
    {
      icon: Award,
      title: t('about.value2Title'),
      description: t('about.value2Desc'),
      color: 'from-[#004B87] to-[#33A6D8]',
      bgColor: 'bg-[#004B87]/10',
    },
    {
      icon: Recycle,
      title: t('about.value3Title'),
      description: t('about.value3Desc'),
      color: 'from-[#33A6D8] to-cyan-600',
      bgColor: 'bg-[#33A6D8]/15',
    },
    {
      icon: Heart,
      title: t('about.value4Title'),
      description: t('about.value4Desc'),
      color: 'from-[#B47B2B] to-amber-600',
      bgColor: 'bg-[#B47B2B]/15',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-[#EFECE6]/75 to-[#FAF8F5] overflow-hidden"
    >
      {/* Subtle Parallax Background Accents */}
      <motion.div
        style={{ y: bgOrbY }}
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#33A6D8]/10 blur-3xl"
      />
      <motion.div
        style={{ y: bgOrbY }}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 -left-24 w-80 h-80 rounded-full bg-[#2CA64E]/10 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF4FA] text-[#004B87] text-xs sm:text-sm font-bold mb-4 border border-[#004B87]/15">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{t('about.badge')}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#192434] mb-3 sm:mb-4 font-serif-display leading-tight px-2">
            {t('about.title')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#4E5E74] max-w-2xl mx-auto px-2 leading-relaxed">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Main Content Grid - Layered Parallax across Mobile, Tablet (md), and Desktop (lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center mb-12 sm:mb-16">
          {/* Left: Visual Showcase Card */}
          <motion.div
            style={{ y: imageCardY }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 w-full min-w-0"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group border-4 border-white bg-[#EBF4FA] aspect-[16/11] sm:aspect-[16/10]">
              <img
                src="/images/velmor-hero.jpg"
                alt="Tradición Nórdica Velmor en Dosquebradas y el Eje Cafetero"
                onError={(e) => {
                  e.currentTarget.src = '/images/mascota-vikingo-epico.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#192434]/65 via-[#192434]/20 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <Button
                  size="lg"
                  onClick={() => setIsVideoOpen(true)}
                  className="bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold rounded-full px-6 py-5 sm:px-7 sm:py-6 shadow-xl gap-2.5 text-sm sm:text-base transition-transform group-hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-current shrink-0" />
                  <span>{t('about.watchVideo')}</span>
                </Button>
              </div>

              {/* Bottom Caption Strip */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:px-4 sm:py-3 flex items-center gap-3 shadow-md">
                <img
                  src="/images/mascota.png"
                  alt="Mascota Velmor"
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div className="min-w-0 text-left">
                  <p className="text-xs sm:text-sm font-bold text-[#004B87] truncate">
                    {t('about.title')}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#4E5E74] truncate">
                    {isEn
                      ? 'Dosquebradas, Coffee Region · Authentic Icelandic Recipe'
                      : 'Dosquebradas, Eje Cafetero · Receta Islandesa Auténtica'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Story Text & Responsive Metrics Grid */}
          <motion.div
            style={{ y: storyCardY }}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 w-full min-w-0 space-y-5 bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#004B87]/10 shadow-sm"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#004B87]">
              <CheckCircle2 className="w-4 h-4 text-[#2CA64E]" />
              <span>{t('about.badge')}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#192434] font-serif-display leading-snug">
              {t('about.title')}
            </h3>

            <p className="text-sm sm:text-base text-[#4E5E74] leading-relaxed">
              {t('about.story1')}
            </p>
            <p className="text-sm sm:text-base text-[#4E5E74] leading-relaxed">
              {t('about.story2')}
            </p>

            {/* Key Milestones - 2x2 Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#004B87]/10 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#B47B2B]">+5</div>
                <div className="text-xs text-[#4E5E74] font-semibold mt-0.5">
                  {t('about.yearsExp')}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#004B87]/10 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#004B87]">10k+</div>
                <div className="text-xs text-[#4E5E74] font-semibold mt-0.5">
                  {t('about.families')}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#004B87]/10 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#2CA64E]">500+</div>
                <div className="text-xs text-[#4E5E74] font-semibold mt-0.5">
                  {t('about.batches')}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#004B87]/10 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#B47B2B]">99%</div>
                <div className="text-xs text-[#4E5E74] font-semibold mt-0.5">
                  {t('about.satisfaction')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* "Ver nuestra historia" — 3-Column Responsive Video Grid (3 columns on desktop, 1 column on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#004B87]/10 text-[#004B87] flex items-center justify-center shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#192434] font-serif-display">
                  {t('about.watchVideo')}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E5E74]">
                  {isEn
                    ? 'Explore our 3 official brand stories and artisanal process videos'
                    : 'Explora nuestros 3 videos oficiales de historia, tradición vikinga y proceso artesanal'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {STORY_VIDEOS.map((video, index) => (
              <div
                key={video.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-3.5 border border-[#004B87]/15 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-full rounded-xl overflow-hidden bg-[#192434] aspect-video border border-[#004B87]/15">
                  <video
                    ref={(el) => {
                      inlineVideoRefs.current[index] = el;
                    }}
                    src={video.src}
                    poster={video.poster}
                    controls
                    playsInline
                    preload="metadata"
                    onPlay={() => handleExclusivePlay(inlineVideoRefs.current, index)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2.5 px-1 text-xs sm:text-sm font-bold text-[#004B87] truncate">
                  {isEn ? video.titleEn : video.titleEs}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values Grid - Responsive 1 col (mobile), 2 cols (tablet), 4 cols (desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white border border-[#004B87]/10 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${value.bgColor} flex items-center justify-center mb-4 shrink-0`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-[#192434] mb-2">{value.title}</h4>
                <p className="text-xs sm:text-sm text-[#4E5E74] leading-relaxed flex-1">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quality Certifications Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-[#004B87]/15 text-center shadow-sm"
        >
          <div className="text-2xl mb-2">🏅</div>
          <h4 className="font-bold text-base sm:text-lg text-[#192434] mb-1">
            {t('about.certTitle')}
          </h4>
          <p className="text-xs sm:text-sm text-[#4E5E74] max-w-2xl mx-auto leading-relaxed">
            {t('about.certDesc')}
          </p>
        </motion.div>
      </div>

      {/* Responsive "Ver nuestra historia" Modal — 3-Column Grid on Desktop & 1-Column on Mobile */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="w-[94vw] max-w-xl lg:max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-4 sm:p-6 border border-[#004B87]/15">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-[#004B87] pr-6">
              {t('about.watchVideo')} — {t('about.title')}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-5 w-full">
            {/* 3 Videos Grid (3 columns on desktop lg:grid-cols-3, 1 column on mobile grid-cols-1) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {STORY_VIDEOS.map((video, index) => (
                <div key={video.id} className="space-y-2">
                  <div className="w-full rounded-xl overflow-hidden bg-[#192434] aspect-video border border-[#004B87]/15 shadow-sm">
                    <video
                      ref={(el) => {
                        modalVideoRefs.current[index] = el;
                      }}
                      src={video.src}
                      poster={video.poster}
                      controls
                      autoPlay={index === 0}
                      playsInline
                      onPlay={() => handleExclusivePlay(modalVideoRefs.current, index)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#004B87] px-1 truncate">
                    {isEn ? video.titleEn : video.titleEs}
                  </p>
                </div>
              ))}
            </div>

            {/* Clean Story Box inside Modal */}
            <div className="bg-[#FAF8F5] rounded-xl p-4 sm:p-5 border border-[#004B87]/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src="/images/mascota.png"
                alt="Velmor Mascot"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
              <div className="min-w-0 space-y-1.5">
                <p className="text-sm sm:text-base font-bold text-[#004B87]">
                  {t('about.subtitle')}
                </p>
                <p className="text-xs sm:text-sm text-[#4E5E74] leading-relaxed">
                  {t('about.story1')}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
