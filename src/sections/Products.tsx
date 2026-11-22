import { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Scale,
  Star,
  Check,
  Search,
  Filter,
  X,
  Info,
  Gift,
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  products,
  flavorColors,
  getLocalizedProductName,
  getLocalizedProductDesc,
  getLocalizedFlavor,
  getLocalizedSize,
} from '@/data/products';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function Products() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [showCompareModal, setShowCompareModal] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headerParallaxY = useTransform(scrollYProgress, [0, 1], [22, -16]);
  const filterParallaxY = useTransform(scrollYProgress, [0, 1], [28, -14]);

  // User reviews state
  const [productReviews, setProductReviews] = useState<
    Record<string, { id: string; user: string; rating: number; comment: string; date: string }[]>
  >({});
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const {
    filters,
    setSearchQuery,
    setSizeFilter,
    setFlavorFilter,
    resetFilters,
    addToCart,
    user,
    toggleFavorite,
    compareList,
    toggleCompare,
    clearCompare,
  } = useAppStore();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = filters.search.toLowerCase();
      const localName = getLocalizedProductName(product, i18n.language).toLowerCase();
      const localDesc = getLocalizedProductDesc(product, i18n.language).toLowerCase();
      const matchesSearch =
        !q ||
        localName.includes(q) ||
        localDesc.includes(q) ||
        product.name.toLowerCase().includes(q) ||
        product.flavor.toLowerCase().includes(q) ||
        product.size.toLowerCase().includes(q);
      const matchesSize = filters.size === 'all' || product.size === filters.size;
      const matchesFlavor = filters.flavor === 'all' || product.flavor === filters.flavor;
      return matchesSearch && matchesSize && matchesFlavor;
    });
  }, [filters, i18n.language]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedProducts((prev) => new Set(prev).add(product.id));
    toast.dismiss();
    const toastId = toast.success(
      `${getLocalizedProductName(product, i18n.language)} (${product.size}) — ${t('products.added')}`,
      { duration: 1200 }
    );
    setTimeout(() => toast.dismiss(toastId), 1250);

    setTimeout(() => {
      setAddedProducts((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1200);
  };

  const handleAddReview = (productId: string) => {
    if (!newComment.trim()) return;
    const review = {
      id: Date.now().toString(),
      user: user ? user.name : isEn ? 'Verified Customer' : 'Cliente Verificado',
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString(),
    };
    setProductReviews((prev) => ({
      ...prev,
      [productId]: [review, ...(prev[productId] || [])],
    }));
    setNewComment('');
    setNewRating(5);
    toast.success(t('products.reviewSubmitted'), { duration: 2000 });
  };

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return `$${formatted}`;
  };

  const sizes: Array<{ value: typeof filters.size; label: string }> = [
    { value: 'all', label: t('products.filterAll') },
    {
      value: '200g',
      label: isEn ? '200g (Small · $7.000)' : '200g (Pequeño · $7.000)',
    },
    {
      value: '500g',
      label: isEn ? '500g (Family · $26.000)' : '500g (Familiar · $26.000)',
    },
  ];

  const flavors: Array<{ value: typeof filters.flavor; label: string; emoji: string }> = [
    { value: 'all', label: t('products.filterAll'), emoji: '🥣' },
    { value: 'fresa', label: t('flavors.fresa'), emoji: '🍓' },
    { value: 'mora', label: t('flavors.mora'), emoji: '🫐' },
    { value: 'mango', label: t('flavors.mango'), emoji: '🥭' },
    { value: 'maracuya', label: t('flavors.maracuya'), emoji: '💛' },
    { value: 'natural', label: t('flavors.natural'), emoji: '🥛' },
  ];

  const compareProducts = useMemo(() => {
    return products.filter((p) => compareList.includes(p.id));
  }, [compareList]);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28 bg-[#FAF8F5] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          style={{ y: headerParallaxY }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#192434] mb-4 font-serif-display">
            {t('products.title')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#4E5E74] max-w-2xl mx-auto mb-4 px-2">
            {t('products.subtitle')}
          </p>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#B47B2B] bg-[#F3E9D8] px-4 py-1.5 rounded-full border border-[#B47B2B]/25">
            <Gift className="w-4 h-4 shrink-0" />
            <span>{t('products.promoInline')}</span>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          style={{ y: filterParallaxY }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.62, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 space-y-5 bg-white p-4 sm:p-6 rounded-2xl border border-[#004B87]/10 shadow-sm"
        >
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4E5E74]" />
            <Input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10 py-5 rounded-xl bg-[#FAF8F5] border-[#004B87]/15"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E5E74] hover:text-[#192434]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Size Filter Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4E5E74] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#004B87]" />
              {t('products.filterSize')}:
            </span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setSizeFilter(size.value)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    filters.size === size.value
                      ? 'bg-[#004B87] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-[#4E5E74] hover:text-[#004B87] border border-[#004B87]/15'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Filter Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4E5E74] block">
              {t('products.filterFlavor')}:
            </span>
            <div className="flex flex-wrap gap-2">
              {flavors.map((flavor) => (
                <button
                  key={flavor.value}
                  type="button"
                  onClick={() => setFlavorFilter(flavor.value)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    filters.flavor === flavor.value
                      ? 'bg-[#004B87] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-[#4E5E74] hover:text-[#004B87] border border-[#004B87]/15'
                  }`}
                >
                  <span>{flavor.emoji}</span>
                  <span>{flavor.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Showing Count & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#004B87]/10 text-xs text-[#4E5E74]">
            <span>
              {t('products.showingCount', {
                count: filteredProducts.length,
                total: products.length,
              })}
            </span>
            {(filters.search || filters.size !== 'all' || filters.flavor !== 'all') && (
              <button
                type="button"
                onClick={resetFilters}
                className="font-bold text-[#004B87] hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                {t('products.clearFilters')}
              </button>
            )}
          </div>
        </motion.div>

        {/* Compare Bar */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 rounded-2xl bg-[#EBF4FA] border border-[#004B87]/20 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Scale className="w-5 h-5 text-[#004B87]" />
                <span className="font-bold text-sm text-[#004B87]">
                  {t('products.compareDrawerTitle', { count: compareList.length })}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {compareProducts.map((p) => (
                    <Badge
                      key={p.id}
                      variant="secondary"
                      className="gap-1 bg-white text-[#192434] border border-[#004B87]/15"
                    >
                      {getLocalizedProductName(p, i18n.language)}
                      <button type="button" onClick={() => toggleCompare(p.id)}>
                        <X className="w-3 h-3 ml-1" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowCompareModal(true)}
                  disabled={compareList.length < 2}
                  className="bg-[#004B87] text-white hover:bg-[#003865]"
                >
                  {t('products.compareNow')}
                </Button>
                <Button size="sm" variant="ghost" onClick={clearCompare}>
                  {t('products.clear')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid (Matches Reference Card UI) */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => {
              const colors = flavorColors[product.flavor] || flavorColors.fresa;
              const isAdded = addedProducts.has(product.id);
              const isFavorite = user?.favorites.includes(product.id);
              const isComparing = compareList.includes(product.id);
              const localName = getLocalizedProductName(product, i18n.language);
              const localDesc = getLocalizedProductDesc(product, i18n.language);
              const localSizeLabel = getLocalizedSize(product.size, i18n.language);
              const badgeText = isEn && product.badgeEn ? product.badgeEn : product.badge;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Top-Left Badge (e.g. Popular, Premium, Nuevo) */}
                  {badgeText && (
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`inline-block ${colors.badgeBg} text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm`}
                      >
                        {badgeText}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Quick Actions */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {user && (
                      <button
                        type="button"
                        onClick={() => toggleFavorite(product.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm border border-slate-200 ${
                          isFavorite
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/95 text-[#192434] hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleCompare(product.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm border border-slate-200 ${
                        isComparing
                          ? 'bg-[#004B87] text-white'
                          : 'bg-white/95 text-[#192434] hover:bg-white'
                      }`}
                      title={t('products.compare')}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="w-8 h-8 rounded-full bg-white/95 text-[#192434] hover:bg-white flex items-center justify-center transition-colors shadow-sm border border-slate-200"
                      title={t('products.viewDetails')}
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Studio White Product Image Container + Colored Bottom Divider */}
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className={`relative h-56 sm:h-60 bg-white flex items-center justify-center p-3 overflow-hidden cursor-pointer border-b-[3px] ${colors.borderBottom}`}
                  >
                    <img
                      src={product.image}
                      alt={localName}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Title & Star Rating Row */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="font-bold text-base text-[#192434] leading-snug cursor-pointer hover:text-[#004B87] transition-colors font-serif-display"
                      >
                        {localName}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-amber-500">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Size / Gramaje Label */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-xs font-semibold text-[#4E5E74]">
                        {localSizeLabel}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                      >
                        {product.size}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#4E5E74] line-clamp-2 mb-4 flex-1 leading-relaxed">
                      {localDesc}
                    </p>

                    {/* Price & Stock Row */}
                    <div className="flex items-baseline justify-between mb-4 pt-2 border-t border-slate-100 mt-auto">
                      <span className="text-xl font-extrabold text-[#192434] tracking-tight">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[11px] font-semibold text-[#2CA64E]">
                        {product.stock} {t('products.stock')}
                      </span>
                    </div>

                    {/* Full-Width Artisanal Gold (#B47B2B) Add to Cart Button */}
                    <motion.div whileTap={{ scale: 0.97 }}>
                      <Button
                        className={`w-full font-bold py-5 rounded-xl shadow-sm transition-all ${
                          isAdded
                            ? 'bg-[#2CA64E] hover:bg-[#248f42] text-white'
                            : 'bg-[#B47B2B] hover:bg-[#9A6620] text-white'
                        }`}
                        disabled={product.stock === 0 || isAdded}
                        onClick={() => handleAddToCart(product)}
                      >
                        <AnimatePresence mode="wait">
                          {isAdded ? (
                            <motion.span
                              key="added"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              <span>{t('products.added')}</span>
                            </motion.span>
                          ) : (
                            <motion.span
                              key="add"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="flex items-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>{t('products.addToCart')}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-[#004B87]/10"
          >
            <p className="text-base text-[#4E5E74] mb-4">{t('products.noProductsFound')}</p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-[#004B87] text-[#004B87]"
            >
              {t('products.clearFilters')}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="w-[94vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-4 sm:p-6">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold text-[#004B87]">
                  {getLocalizedProductName(selectedProduct, i18n.language)}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
                <div className="rounded-2xl overflow-hidden bg-white border border-[#004B87]/10 flex items-center justify-center p-4 h-64 sm:h-auto">
                  <img
                    src={selectedProduct.image}
                    alt={getLocalizedProductName(selectedProduct, i18n.language)}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className={
                        (flavorColors[selectedProduct.flavor] || flavorColors.fresa).bg
                      }
                    >
                      <span
                        className={
                          (flavorColors[selectedProduct.flavor] || flavorColors.fresa).text
                        }
                      >
                        {getLocalizedFlavor(selectedProduct.flavor, i18n.language)}
                      </span>
                    </Badge>
                    <Badge variant="outline">
                      {getLocalizedSize(selectedProduct.size, i18n.language)}
                    </Badge>
                  </div>

                  <p className="text-sm text-[#4E5E74] leading-relaxed">
                    {getLocalizedProductDesc(selectedProduct, i18n.language)}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#004B87]">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  {/* Nutrition Table */}
                  <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#004B87]/10">
                    <h4 className="font-bold text-sm text-[#192434] mb-1">
                      {t('products.nutritionTitle')}
                    </h4>
                    <p className="text-xs text-[#4E5E74] mb-3">
                      {isEn
                        ? `Presentation: ${selectedProduct.size}`
                        : `Presentación: ${selectedProduct.size}`}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#4E5E74]">{t('products.calories')}:</span>
                        <span className="font-bold text-[#192434]">
                          {selectedProduct.nutrition.calories} kcal
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#4E5E74]">{t('products.protein')}:</span>
                        <span className="font-bold text-[#004B87]">
                          {selectedProduct.nutrition.protein}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#4E5E74]">{t('products.carbs')}:</span>
                        <span className="font-bold text-[#192434]">
                          {selectedProduct.nutrition.carbs}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#4E5E74]">{t('products.fat')}:</span>
                        <span className="font-bold text-[#192434]">
                          {selectedProduct.nutrition.fat}g
                        </span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-[#4E5E74]">{t('products.calcium')}:</span>
                        <span className="font-bold text-[#192434]">
                          {selectedProduct.nutrition.calcium}mg
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#2CA64E] font-semibold">
                    ✓ {selectedProduct.stock} {t('products.stock')}
                  </p>

                  <Button
                    className="w-full bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold py-5 rounded-xl"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isEn ? 'Add to cart' : 'Agregar al carrito'}
                  </Button>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-6 border-t border-[#004B87]/10 pt-5">
                <h4 className="font-bold text-base text-[#192434] mb-4">
                  {t('products.LeaveReview')}
                </h4>
                <div className="space-y-3 mb-6 bg-[#FAF8F5] p-4 rounded-xl border border-[#004B87]/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#192434]">
                      {t('products.yourRating')}
                    </span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder={t('products.yourCommentPlaceholder')}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-white"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddReview(selectedProduct.id)}
                    className="bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold"
                  >
                    {t('products.submitReview')}
                  </Button>
                </div>

                <div className="space-y-3 max-h-40 overflow-y-auto">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#4E5E74]">
                    {t('products.userReviews')}
                  </h5>
                  {(productReviews[selectedProduct.id] || []).length === 0 ? (
                    <p className="text-xs text-[#4E5E74]">{t('products.noReviewsYet')}</p>
                  ) : (
                    (productReviews[selectedProduct.id] || []).map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-[#FAF8F5] p-3 rounded-lg text-sm border border-[#004B87]/10"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-[#192434]">{rev.user}</span>
                          <span className="text-[11px] text-[#4E5E74]">{rev.date}</span>
                        </div>
                        <div className="flex mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-[#4E5E74]">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Compare Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="w-[94vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#004B87] font-bold">
              {t('products.comparisonTitle')}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#004B87]/15">
                  <th className="text-left p-2 font-bold text-[#192434]">
                    {t('products.feature')}
                  </th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="text-center p-2 min-w-[150px] text-[#004B87]">
                      {getLocalizedProductName(p, i18n.language)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#004B87]/10">
                <tr>
                  <td className="p-2 font-semibold">{t('products.price')}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="text-center p-2 font-extrabold text-[#004B87]">
                      {formatPrice(p.price)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">{t('products.size')}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="text-center p-2">
                      {getLocalizedSize(p.size, i18n.language)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">{t('products.flavor')}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="text-center p-2">
                      {getLocalizedFlavor(p.flavor, i18n.language)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">{t('products.calories')}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="text-center p-2">
                      {p.nutrition.calories} kcal
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">{t('products.protein')}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="text-center p-2 font-bold text-[#2CA64E]">
                      {p.nutrition.protein}g
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-semibold">{t('products.rating')}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="text-center p-2">
                      ⭐ {p.rating}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
