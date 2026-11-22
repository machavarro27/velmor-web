import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Send, Check, Sparkles, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [peopleCount, setPeopleCount] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const calcCardY = useTransform(scrollYProgress, [0, 1], [24, -18]);
  const bannerCardY = useTransform(scrollYProgress, [0, 1], [34, -22]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Email', { duration: 1300 });
      return;
    }
    setIsSubmitted(true);
    toast.success(t('newsletter.success'), { duration: 1400 });
    setEmail('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Math.max(1, parseInt(peopleCount || '1', 10));
    const grams = num * 1000;
    const tubs = Math.ceil(grams / 1000);
    setCalcResult(
      t('newsletter.calcResult', {
        people: num,
        grams,
        tubs,
      })
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 lg:py-24 bg-[#FAF8F5] border-t border-[#004B87]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Portion Calculator Box (Warm Cream Card) */}
        <motion.div
          style={{ y: calcCardY }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.18 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#B47B2B]/25 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-[#B47B2B] font-bold text-sm mb-2">
            <Calculator className="w-5 h-5" />
            <span>{t('newsletter.CalcTitle')}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#4E5E74] mb-5">
            {t('newsletter.calcSubtitle')}
          </p>

          <form onSubmit={handleCalculate} className="flex flex-col sm:flex-row gap-3 mb-5">
            <Input
              type="number"
              min={1}
              max={20}
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              placeholder={t('newsletter.calcPlaceholder')}
              className="bg-[#FAF8F5] border-[#004B87]/15 flex-1"
            />
            <Button
              type="submit"
              className="bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold px-6"
            >
              {t('newsletter.calcButton')}
            </Button>
          </form>

          {calcResult && (
            <div className="p-4 rounded-xl bg-[#EBF4FA] border border-[#004B87]/20 text-sm font-bold text-[#004B87] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B47B2B] shrink-0" />
              <span>{calcResult}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#F3E9D8]/60 border border-[#B47B2B]/20 text-xs sm:text-sm text-[#192434] space-y-2">
            <p className="font-bold text-[#8C5A16]">{t('newsletter.calcTipsTitle')}</p>
            <p className="text-[#4E5E74] flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2CA64E] shrink-0" />
              <span>{t('newsletter.calcTip1')}</span>
            </p>
            <p className="text-[#4E5E74] flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2CA64E] shrink-0" />
              <span>{t('newsletter.calcTip2')}</span>
            </p>
          </div>
        </motion.div>

        {/* Luminous Nordic Sky Newsletter Banner */}
        <motion.div
          style={{ y: bannerCardY }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.18 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#EBF4FA] via-[#D6E9F8] to-[#E2F2EA] border border-[#004B87]/15 p-8 sm:p-12 lg:p-16 shadow-md"
        >
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-[#004B87] shadow-sm mb-5 border border-[#004B87]/15">
              <Mail className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#192434] mb-3 font-serif-display">
              {t('newsletter.title')}
            </h2>

            <p className="text-sm sm:text-base text-[#4E5E74] mb-8 max-w-lg mx-auto">
              {t('newsletter.subtitle')}
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4E5E74]" />
                <Input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 pr-4 py-6 rounded-xl bg-white border-[#004B87]/20 text-[#192434]"
                  disabled={isSubmitted}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitted}
                className="bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold px-8 py-6 rounded-xl shadow-md"
              >
                {isSubmitted ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    OK
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {t('newsletter.button')}
                  </span>
                )}
              </Button>
            </form>

            <p className="text-xs text-[#4E5E74] flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#004B87]" />
              {t('newsletter.privacy')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
