import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  User,
  Menu,
  Globe,
  Volume2,
  VolumeX,
  Search,
  Plus,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { products, getLocalizedProductName, getLocalizedFlavor } from '@/data/products';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Header() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const {
    getCartCount,
    setCartOpen,
    language,
    setLanguage,
    soundEnabled,
    toggleSound,
    user,
    setLoginOpen,
    addToCart,
    setSearchQuery,
  } = useAppStore();

  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageSwitch = (lang: 'es' | 'en') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const navItems = [
    { href: '#home', label: t('nav.home') },
    { href: '#products', label: t('nav.products') },
    { href: '#about', label: t('nav.about') },
    { href: '#testimonials', label: t('nav.testimonials') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const filteredSearchProducts = products.filter((p) => {
    if (!quickSearch.trim()) return true;
    const q = quickSearch.toLowerCase();
    const localName = getLocalizedProductName(p, i18n.language).toLowerCase();
    const localFlavor = getLocalizedFlavor(p.flavor, i18n.language).toLowerCase();
    return (
      localName.includes(q) ||
      p.name.toLowerCase().includes(q) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
      localFlavor.includes(q) ||
      p.size.toLowerCase().includes(q)
    );
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#004B87]/10'
          : 'bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#004B87]/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Brand Logo */}
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className="flex items-center gap-3 group shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#EBF4FA] to-[#D6E9F8] border border-[#004B87]/20 shadow-sm flex items-center justify-center p-1">
              <img
                src="/images/mascota.png"
                alt="Velmor Logo"
                onError={(e) => {
                  e.currentTarget.src = '/images/logo-velmor.jpeg';
                }}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold tracking-tight text-[#004B87] font-serif-display leading-none">
                VELMOR
              </span>
              <span className="text-[11px] text-[#4E5E74] font-medium tracking-wide mt-0.5">
                {i18n.language?.startsWith('en')
                  ? 'Nordic Artisanal Yogurt'
                  : 'Yogur artesanal nórdico'}
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className="px-4 py-2 text-sm font-semibold text-[#192434]/80 hover:text-[#004B87] rounded-lg hover:bg-[#004B87]/5 transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                {item.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#004B87] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </motion.a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Bilingual Selector Pill (ES / EN) */}
            <div
              className="flex items-center bg-[#EBF4FA] p-1 rounded-full border border-[#004B87]/15"
              role="group"
              aria-label="Selector de idioma / Language selector"
            >
              <Globe className="w-3.5 h-3.5 text-[#004B87] ml-1.5 mr-1 hidden sm:inline" />
              <button
                type="button"
                onClick={() => handleLanguageSwitch('es')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'es'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-[#004B87]/75 hover:text-[#004B87]'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-[#004B87]/75 hover:text-[#004B87]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-[#192434]/80 hover:text-[#004B87] hover:bg-[#004B87]/5"
              aria-label={t('nav.search')}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className="hidden sm:flex text-[#192434]/80 hover:text-[#004B87] hover:bg-[#004B87]/5"
              aria-label="Toggle sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#004B87]" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative text-[#192434]/80 hover:text-[#004B87] hover:bg-[#004B87]/5"
              aria-label={t('nav.cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#004B87] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>

            {/* User Login Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLoginOpen(true)}
              className="hidden sm:flex text-[#192434]/80 hover:text-[#004B87] hover:bg-[#004B87]/5"
              aria-label={t('nav.login')}
            >
              {user ? (
                <div className="w-7 h-7 rounded-full bg-[#004B87] text-white text-xs font-bold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-[#192434]"
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-[#FAF8F5]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3 text-left">
                    <div className="w-11 h-11 rounded-xl bg-[#EBF4FA] border border-[#004B87]/20 p-1 flex items-center justify-center shrink-0">
                      <img
                        src="/images/mascota.png"
                        alt="Velmor"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-xl text-[#004B87] block leading-none">
                        VELMOR
                      </span>
                      <span className="text-xs text-[#4E5E74]">
                        {i18n.language?.startsWith('en')
                          ? 'Nordic Artisanal Yogurt'
                          : 'Yogur artesanal nórdico'}
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 flex flex-col gap-6">
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-1.5">
                    {navItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(item.href);
                        }}
                        className="px-4 py-3 text-base font-semibold text-[#192434] hover:bg-[#004B87]/10 hover:text-[#004B87] rounded-xl transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>

                  <hr className="border-[#004B87]/10" />

                  {/* Mobile Language Selector */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#4E5E74] px-2">
                      {i18n.language?.startsWith('en') ? 'Language' : 'Idioma'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={language === 'es' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleLanguageSwitch('es')}
                        className={
                          language === 'es'
                            ? 'bg-[#004B87] text-white'
                            : 'border-[#004B87]/20 text-[#192434]'
                        }
                      >
                        🇪🇸 Español
                      </Button>
                      <Button
                        variant={language === 'en' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleLanguageSwitch('en')}
                        className={
                          language === 'en'
                            ? 'bg-[#004B87] text-white'
                            : 'border-[#004B87]/20 text-[#192434]'
                        }
                      >
                        🇬🇧 English
                      </Button>
                    </div>
                  </div>

                  <hr className="border-[#004B87]/10" />

                  {/* Mobile User Button */}
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setLoginOpen(true);
                    }}
                    className="w-full gap-2 bg-[#004B87] hover:bg-[#003865] text-white"
                  >
                    <User className="w-4 h-4" />
                    {user ? user.name : t('nav.login')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Interactive Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="w-[92vw] sm:max-w-lg bg-white border-[#004B87]/15 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#004B87] text-xl font-bold">
              {t('nav.search')}
            </DialogTitle>
            <DialogDescription className="text-[#4E5E74]">
              {t('nav.searchDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5E74]" />
              <Input
                value={quickSearch}
                onChange={(e) => {
                  setQuickSearch(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder={t('products.searchPlaceholder')}
                className="pl-10 bg-[#FAF8F5] border-[#004B87]/20"
                autoFocus
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredSearchProducts.length === 0 ? (
                <p className="text-sm text-center py-6 text-[#4E5E74]">
                  {t('nav.noSearchResults')}
                </p>
              ) : (
                filteredSearchProducts.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EBF4FA]/70 border border-[#004B87]/10 transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        setIsSearchOpen(false);
                        scrollToSection('#products');
                      }}
                    >
                      <img
                        src={product.image}
                        alt={getLocalizedProductName(product, i18n.language)}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#192434] truncate">
                          {getLocalizedProductName(product, i18n.language)}
                        </p>
                        <p className="text-xs text-[#004B87] font-semibold">
                          {formatPrice(product.price)} · {product.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        addToCart(product, 1);
                        toast.success(
                          `${getLocalizedProductName(product, i18n.language)} - ${t('products.added')}`,
                          { duration: 2000 }
                        );
                      }}
                      className="bg-[#B47B2B] hover:bg-[#9A6620] text-white h-8 px-3 rounded-lg shrink-0"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {i18n.language?.startsWith('en') ? 'Add' : 'Añadir'}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}
