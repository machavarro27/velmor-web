import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Storyboard() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Layered parallax for fluid scrolling transitions
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const showcaseY = useTransform(scrollYProgress, [0, 1], [32, -24]);
  const bgGlowY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  const slides = [
    {
      id: 1,
      image: '/images/velmor-hero.jpg',
      title: t('storyboard.step1Title'),
      caption: t('storyboard.step1Desc'),
    },
    {
      id: 2,
      image: '/images/natural.jpg',
      title: t('storyboard.step2Title'),
      caption: t('storyboard.step2Desc'),
    },
    {
      id: 3,
      image: '/images/fresa.jpg',
      title: t('storyboard.step3Title'),
      caption: t('storyboard.step3Desc'),
    },
    {
      id: 4,
      image: '/images/mora.jpg',
      title: t('storyboard.step4Title'),
      caption: t('storyboard.step4Desc'),
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 lg:py-24 bg-gradient-to-b from-[#FAF8F5] via-white to-white border-y border-[#004B87]/10 overflow-hidden"
    >
      <motion.div
        style={{ y: bgGlowY }}
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[560px] h-72 rounded-full bg-[#33A6D8]/10 blur-3xl"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#192434] mb-3 font-serif-display">
            {t('storyboard.title')}
          </h2>
          <p className="text-[#4E5E74] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2">
            {t('storyboard.subtitle')}
          </p>
        </motion.div>

        {/* Main Carousel Display with Layered Scroll Parallax */}
        <motion.div
          style={{ y: showcaseY }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#004B87]/15 shadow-lg"
        >
          <div className="relative h-64 sm:h-80 lg:h-[400px] w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={slides[currentSlide].id}
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#004B87] flex items-center justify-center shadow-md transition-transform hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* Caption Box */}
          <div className="p-4 sm:p-6 bg-white border-t border-[#004B87]/10 text-center">
            <h3 className="text-base sm:text-xl font-bold text-[#004B87] mb-1">
              {slides[currentSlide].title}
            </h3>
            <p className="text-xs sm:text-base text-[#4E5E74] max-w-2xl mx-auto leading-relaxed">
              {slides[currentSlide].caption}
            </p>
          </div>
        </motion.div>

        {/* Thumbnails Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`group relative rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all text-left bg-[#FAF8F5] ${
                currentSlide === index
                  ? 'border-[#004B87] ring-2 ring-[#004B87]/25 shadow-md'
                  : 'border-[#004B87]/10 opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-20 sm:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-2 bg-[#FAF8F5]">
                <p className="text-[11px] sm:text-xs font-bold text-[#192434] truncate">
                  {slide.title}
                </p>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
            }
            className="border-[#004B87]/20 text-[#192434]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>
          <span className="text-xs font-bold text-[#4E5E74] px-3">
            {currentSlide + 1} / {slides.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="border-[#004B87]/20 text-[#192434]"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
