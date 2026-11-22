import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck, HelpCircle } from 'lucide-react';
import { testimonials } from '@/data/products';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_BACKGROUNDS = [
  {
    src: '/images/faq-dosquebradas-1.jpg',
    labelEs: 'Viaducto Helicoidal · Dosquebradas, Risaralda',
    labelEn: 'Helicoidal Viaduct · Dosquebradas, Risaralda',
  },
  {
    src: '/images/faq-dosquebradas-2.jpg',
    labelEs: 'Montañas Verdes y Valle de Dosquebradas',
    labelEn: 'Green Mountains & Valley of Dosquebradas',
  },
  {
    src: '/images/faq-dosquebradas-3.jpg',
    labelEs: 'Cordillera y Cielo del Eje Cafetero',
    labelEn: 'Mountain Range & Sky of the Coffee Region',
  },
  {
    src: '/images/faq-dosquebradas-4.jpg',
    labelEs: 'Bruma Matinal en las Colinas de Dosquebradas',
    labelEn: 'Morning Mist in the Dosquebradas Hills',
  },
] as const;

export function Testimonials() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [faqBgIndex, setFaqBgIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const cardParallaxY = useTransform(scrollYProgress, [0, 1], [24, -22]);
  const faqParallaxY = useTransform(scrollYProgress, [0, 1], [24, -14]);
  const faqBgY = useTransform(scrollYProgress, [0, 1], ['-6%', '8%']);
  const faqBgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.1]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Automatic background slideshow for the FAQ section (cycles every 4.5s)
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setFaqBgIndex((prev) => (prev + 1) % FAQ_BACKGROUNDS.length);
    }, 4500);
    return () => clearInterval(bgTimer);
  }, []);

  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % testimonials.length;
      }
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const currentTestimonial = testimonials[currentIndex];
  const faqsRaw = t('testimonials.faqs', { returnObjects: true });
  const faqs = Array.isArray(faqsRaw) ? (faqsRaw as Array<{ q: string; a: string }>) : [];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-[#FAF8F5] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#192434] mb-3 font-serif-display">
            {t('testimonials.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#4E5E74] max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          style={{ y: cardParallaxY }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-3xl mx-auto mb-16"
        >
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentIndex}-${i18n.language}`}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction < 0 ? 50 : -50 }}
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-md border border-[#004B87]/12 relative">
                  <Quote className="w-10 h-10 text-[#B47B2B]/30 mb-4" />

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < currentTestimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-base sm:text-lg text-[#192434] mb-6 leading-relaxed italic">
                    "
                    {isEn && currentTestimonial.commentEn
                      ? currentTestimonial.commentEn
                      : currentTestimonial.comment}
                    "
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#004B87]/20"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm sm:text-base text-[#192434]">
                            {currentTestimonial.name}
                          </h4>
                          {currentTestimonial.verified && (
                            <span
                              className="inline-flex items-center gap-1 text-xs text-[#2CA64E] font-semibold"
                              title={t('testimonials.verified')}
                            >
                              <BadgeCheck className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#4E5E74]">{currentTestimonial.product}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full w-9 h-9 border-[#004B87]/20"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(1)}
                        className="rounded-full w-9 h-9 border-[#004B87]/20"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-7 bg-[#004B87]' : 'w-2 bg-[#004B87]/25'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Social Proof Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20 text-center"
        >
          <div className="p-6 rounded-2xl bg-white border border-[#004B87]/10 shadow-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#004B87]">
              {t('testimonials.stat1Value')}
            </p>
            <p className="text-xs sm:text-sm text-[#4E5E74] mt-1">
              {t('testimonials.stat1Label')}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#004B87]/10 shadow-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2CA64E]">
              {t('testimonials.stat2Value')}
            </p>
            <p className="text-xs sm:text-sm text-[#4E5E74] mt-1">
              {t('testimonials.stat2Label')}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#004B87]/10 shadow-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#B47B2B]">
              {t('testimonials.stat3Value')}
            </p>
            <p className="text-xs sm:text-sm text-[#4E5E74] mt-1">
              {t('testimonials.stat3Label')}
            </p>
          </div>
        </motion.div>

        {/* FAQ Section with Automatic Panoramic Slideshow of Dosquebradas / Eje Cafetero */}
        <motion.div
          style={{ y: faqParallaxY }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[32px] overflow-hidden border-2 border-white/80 shadow-[0_24px_60px_-15px_rgba(15,35,60,0.28)] px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20"
        >
          {/* Automatic Panoramic Slideshow Background with Smooth Crossfade & Subtle Ken Burns Zoom */}
          <motion.div
            style={{ y: faqBgY, scale: faqBgScale }}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none bg-[#0F233C]"
          >
            {FAQ_BACKGROUNDS.map((bg, idx) => {
              const isActive = idx === faqBgIndex;
              return (
                <motion.img
                  key={bg.src}
                  src={bg.src}
                  alt={isEn ? bg.labelEn : bg.labelEs}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1.04 : 1.0,
                  }}
                  transition={{
                    opacity: { duration: 1.25, ease: 'easeInOut' },
                    scale: { duration: 4.8, ease: 'easeOut' },
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              );
            })}
          </motion.div>

          {/* Calibrated Atmospheric Gradient Overlay (Keeps Mountains, Viaduct & Birds Visible + High Contrast) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0F233C]/58 via-[#152C24]/42 to-[#0F233C]/76"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.14),transparent_65%)]"
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#FDE68A] bg-[#0F233C]/80 backdrop-blur-md border border-[#F5B95F]/40 px-4 py-1.5 rounded-full mb-4 shadow-sm">
                <HelpCircle className="w-4 h-4 text-[#F5B95F]" />
                <span>
                  {isEn ? 'FAQ · Dosquebradas & Coffee Region' : 'FAQ · Dosquebradas & Eje Cafetero'}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white font-serif-display leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]">
                {t('testimonials.faqTitle')}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-[#F1F5F9] mt-2.5 max-w-xl mx-auto font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {t('testimonials.faqSubtitle')}
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3.5">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-white/95 hover:bg-white backdrop-blur-md rounded-2xl border border-white/80 px-5 sm:px-6 shadow-[0_12px_32px_rgba(8,22,41,0.22)] transition-colors duration-200"
                >
                  <AccordionTrigger className="text-left font-bold text-sm sm:text-base text-[#192434] hover:text-[#004B87] hover:no-underline py-4 sm:py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-[#3D4C60] leading-relaxed pb-5 font-medium">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Subtle Landscape Caption & Interactive Slide Indicators */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/20">
              <span className="text-xs font-semibold text-white/90 drop-shadow">
                📍 {isEn ? FAQ_BACKGROUNDS[faqBgIndex].labelEn : FAQ_BACKGROUNDS[faqBgIndex].labelEs}
              </span>
              <div className="flex items-center gap-2">
                {FAQ_BACKGROUNDS.map((bg, idx) => (
                  <button
                    key={bg.src}
                    type="button"
                    onClick={() => setFaqBgIndex(idx)}
                    aria-label={isEn ? bg.labelEn : bg.labelEs}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === faqBgIndex
                        ? 'w-7 bg-[#F5B95F] shadow-sm'
                        : 'w-2 bg-white/45 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
