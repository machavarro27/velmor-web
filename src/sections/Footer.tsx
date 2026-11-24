import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, ArrowUp, MapPin, Phone, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * URLs oficiales de las redes sociales de Yogur Velmor.
 */
const SOCIAL_URLS = {
  tiktok: 'https://vm.tiktok.com/ZS9PPMTD6Njsb-XVC8U/',
  youtube: 'https://www.youtube.com/@YogurtVelmor',
  instagram: 'https://www.instagram.com/yogurt_velmor/',
} as const;

function TikTokIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z" />
    </svg>
  );
}

function YouTubeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

export function Footer() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialPlatforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      href: SOCIAL_URLS.tiktok,
      subtitle: isEn ? 'Recipes, texture & Nordic lifestyle' : 'Recetas, textura y estilo nórdico',
      cta: isEn ? 'Follow on TikTok' : 'Seguir en TikTok',
      ariaLabel: isEn
        ? 'Visit Yogur Velmor official TikTok profile (opens in a new tab)'
        : 'Visitar perfil oficial de Yogur Velmor en TikTok (se abre en una nueva pestaña)',
      Icon: TikTokIcon,
      iconBg: 'bg-[#192434] text-white group-hover:bg-[#004B87]',
      badgeBorder: 'hover:border-[#004B87]/40 hover:shadow-[0_14px_30px_-8px_rgba(0,75,135,0.22)]',
      accentText: 'text-[#004B87]',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      href: SOCIAL_URLS.youtube,
      subtitle: isEn ? 'Artisanal process & Coffee Region farms' : 'Proceso artesanal y fincas del Eje Cafetero',
      cta: isEn ? 'Watch on YouTube' : 'Ver en YouTube',
      ariaLabel: isEn
        ? 'Visit Yogur Velmor official YouTube channel (opens in a new tab)'
        : 'Visitar canal oficial de Yogur Velmor en YouTube (se abre en una nueva pestaña)',
      Icon: YouTubeIcon,
      iconBg: 'bg-[#C81E1E] text-white group-hover:bg-[#B91C1C]',
      badgeBorder: 'hover:border-[#C81E1E]/35 hover:shadow-[0_14px_30px_-8px_rgba(200,30,30,0.2)]',
      accentText: 'text-[#C81E1E]',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      href: SOCIAL_URLS.instagram,
      subtitle: isEn ? 'Daily news, promos & community' : 'Novedades diarias, promos y comunidad',
      cta: isEn ? 'Follow on Instagram' : 'Seguir en Instagram',
      ariaLabel: isEn
        ? 'Visit Yogur Velmor official Instagram profile (opens in a new tab)'
        : 'Visitar perfil oficial de Yogur Velmor en Instagram (se abre en una nueva pestaña)',
      Icon: InstagramIcon,
      iconBg: 'bg-gradient-to-tr from-[#B47B2B] via-[#D946EF] to-[#004B87] text-white',
      badgeBorder: 'hover:border-[#B47B2B]/45 hover:shadow-[0_14px_30px_-8px_rgba(180,123,43,0.25)]',
      accentText: 'text-[#B47B2B]',
    },
  ];

  const quickLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#products', label: t('nav.products') },
    { href: '#about', label: t('nav.about') },
    { href: '#testimonials', label: t('nav.testimonials') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const productLinks = [
    { href: '#products', label: `Skyr ${t('flavors.fresa')}` },
    { href: '#products', label: `Skyr ${t('flavors.mango')}` },
    { href: '#products', label: `Skyr ${t('flavors.maracuya')}` },
    { href: '#products', label: `Skyr ${t('flavors.mora')}` },
    { href: '#products', label: `Skyr ${t('flavors.natural')}` },
  ];

  return (
    <footer className="bg-[#EBF4FA] border-t border-[#004B87]/15 text-[#192434] relative">
      {/* Scroll to Top Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute -top-5 left-1/2 -translate-x-1/2 z-20"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="rounded-full w-10 h-10 bg-white border-[#004B87]/20 text-[#004B87] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Highlighted Social Media Section ("Síguenos en nuestras redes") right below Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-labelledby="velmor-social-heading"
          className="mb-12 rounded-3xl bg-gradient-to-br from-white via-[#FAF8F5] to-[#F3E9D8]/55 border border-[#004B87]/15 p-6 sm:p-8 lg:p-10 shadow-sm"
        >
          <div className="text-center max-w-2xl mx-auto mb-7">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF4FA] text-[#004B87] text-xs font-bold mb-2.5 border border-[#004B87]/15">
              <Sparkles className="w-3.5 h-3.5 text-[#B47B2B]" />
              <span>{isEn ? 'Velmor Community' : 'Comunidad Velmor'}</span>
            </span>
            <h3
              id="velmor-social-heading"
              className="text-2xl sm:text-3xl font-bold text-[#192434] font-serif-display"
            >
              {isEn ? 'Follow us on social media' : 'Síguenos en nuestras redes'}
            </h3>
            <p className="text-xs sm:text-sm text-[#4E5E74] mt-1.5">
              {isEn
                ? 'Discover Nordic Skyr recipes, our artisanal process in Dosquebradas, and exclusive promotions.'
                : 'Descubre recetas con Skyr nórdico, nuestro proceso artesanal en Dosquebradas y promociones exclusivas.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.Icon;
              return (
                <a
                  key={platform.id}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.ariaLabel}
                  className={`group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-[#004B87]/12 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004B87] focus-visible:ring-offset-2 ${platform.badgeBorder}`}
                >
                  <div
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${platform.iconBg}`}
                    style={{ width: '3.25rem', height: '3.25rem' }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-base sm:text-lg text-[#192434] group-hover:text-[#004B87] transition-colors font-serif-display">
                        {platform.name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-[#4E5E74]/60 group-hover:text-[#004B87] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </div>
                    <p className="text-xs text-[#4E5E74] line-clamp-1 mt-0.5">
                      {platform.subtitle}
                    </p>
                    <span
                      className={`inline-block text-xs font-bold mt-1.5 ${platform.accentText} group-hover:underline`}
                    >
                      {platform.cta} →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <a href="#home" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#004B87]/20 shadow-sm p-1 flex items-center justify-center shrink-0">
                <img
                  src="/images/mascota.png"
                  alt="Velmor Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-bold text-[#004B87] font-serif-display block leading-none">
                  VELMOR
                </span>
                <span className="text-xs text-[#4E5E74]">
                  {isEn ? 'Nordic Artisanal Yogurt' : 'Yogur artesanal nórdico'}
                </span>
              </div>
            </a>
            <p className="text-sm text-[#4E5E74] mb-5 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-2.5">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.Icon;
                return (
                  <a
                    key={platform.id}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform.ariaLabel}
                    title={platform.name}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#004B87] text-[#004B87] hover:text-white border border-[#004B87]/15 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004B87] focus-visible:ring-offset-2"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#004B87] mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#4E5E74] hover:text-[#004B87] font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#004B87] mb-4">
              {t('footer.products')}
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-[#4E5E74] hover:text-[#004B87] font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#004B87] mb-4">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-sm text-[#4E5E74]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#004B87] shrink-0 mt-0.5" />
                <span>{t('contact.address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2CA64E] shrink-0" />
                <a
                  href="https://wa.me/573175687206"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#004B87] font-semibold"
                >
                  +57 317 568 7206
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#004B87] shrink-0" />
                <span>pedidos@velmor.co</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#004B87]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4E5E74]">
          <p className="flex items-center gap-1 font-medium text-center sm:text-left">
            © {new Date().getFullYear()} Velmor. {t('footer.rights')} · {t('footer.madeWith')}{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline shrink-0" />
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <a href="#privacy" className="hover:text-[#004B87] transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#terms" className="hover:text-[#004B87] transition-colors">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
