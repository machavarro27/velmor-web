import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Award,
  Truck,
  Leaf,
  MapPin,
  ShieldCheck,
  Cherry,
  PackageCheck,
} from 'lucide-react';

export function HowToBuy() {
  const { t, i18n } = useTranslation();

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

  return (
    <section
      id="how-to-buy"
      className="relative bg-gradient-to-b from-[#FAF8F5] via-[#EFECE6]/85 to-[#FAF8F5] border-y border-[#004B87]/10 py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
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

        {/* 3 Sculpted Benefit Cards Row */}
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
    </section>
  );
}
