import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  Truck,
  Check,
  MessageCircle,
  MapPin,
  User,
  Phone,
  FileText,
  ArrowLeft,
  Save,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  getLocalizedProductName,
  getLocalizedFlavor,
  getLocalizedSize,
} from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

const WHATSAPP_NUMBER = '573175687206';

export function CartDrawer() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    promoCode,
    discountPercent,
    applyPromoCode,
    shippingInfo,
    setShippingInfo,
    getCartTotal,
    getDiscountAmount,
    getFinalTotal,
  } = useAppStore();

  const [promoInput, setPromoInput] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'confirm'>('cart');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Local controlled form state synced with store + sessionStorage for guaranteed reactivity
  const [formState, setFormState] = useState({
    fullName: shippingInfo?.fullName || '',
    phone: shippingInfo?.phone || '',
    address: shippingInfo?.address || '',
    neighborhood: shippingInfo?.neighborhood || '',
    city:
      shippingInfo?.city && !shippingInfo.city.toLowerCase().includes('bogot')
        ? shippingInfo.city
        : 'Dosquebradas, Risaralda',
    notes: shippingInfo?.notes || '',
  });

  useEffect(() => {
    if (shippingInfo) {
      setFormState((prev) => ({
        fullName: shippingInfo.fullName ?? prev.fullName,
        phone: shippingInfo.phone ?? prev.phone,
        address: shippingInfo.address ?? prev.address,
        neighborhood: shippingInfo.neighborhood ?? prev.neighborhood,
        city:
          shippingInfo.city && !shippingInfo.city.toLowerCase().includes('bogot')
            ? shippingInfo.city
            : 'Dosquebradas, Risaralda',
        notes: shippingInfo.notes ?? prev.notes,
      }));
    }
  }, [shippingInfo]);

  const updateField = (field: keyof typeof formState, value: string) => {
    const updated = { ...formState, [field]: value };
    setFormState(updated);
    setShippingInfo(updated);
    try {
      sessionStorage.setItem('velmor-delivery-draft', JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const subtotal = getCartTotal();
  const discount = getDiscountAmount();
  const shipping = subtotal >= 50000 ? 0 : 5000;
  const total = getFinalTotal();
  const freeShippingRemaining = Math.max(0, 50000 - subtotal);

  // Format number with thousands dots (e.g. 30.000) so template -$[Precio] renders cleanly as $30.000
  const formatNumber = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const formatCurrency = (price: number) => `$${formatNumber(price)}`;

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      toast.success(
        t('cart.promoSuccess', {
          code: promoInput.toUpperCase(),
          percent: useAppStore.getState().discountPercent,
        }),
        { duration: 2000 }
      );
      setPromoInput('');
    } else {
      toast.error(t('cart.promoInvalid'), { duration: 2000 });
    }
  };

  const validateShipping = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!formState.fullName.trim()) newErrors.fullName = true;
    if (!formState.address.trim()) newErrors.address = true;
    if (!formState.city.trim()) newErrors.city = true;
    if (!formState.phone.trim()) newErrors.phone = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(t('cart.validationError'), { duration: 2500 });
      return false;
    }
    setShippingInfo(formState);
    return true;
  };

  const handleSaveShippingOnly = () => {
    if (validateShipping()) {
      toast.success(t('cart.shippingSaved'), { duration: 2000 });
    }
  };

  const handleContinueToConfirm = () => {
    if (validateShipping()) {
      toast.success(t('cart.shippingSaved'), { duration: 2000 });
      setCheckoutStep('confirm');
    }
  };

  // Build exact WhatsApp message structure requested
  const buildWhatsAppMessageLines = (): string[] => {
    const fullAddressParts = [
      formState.address.trim(),
      formState.neighborhood.trim(),
      formState.city.trim(),
    ].filter(Boolean);
    const fullAddress = fullAddressParts.join(' / ');

    const productLines = cart.map((item) => {
      const name = getLocalizedProductName(item.product, i18n.language);
      const sizeStr = item.product.size;
      const nameWithSize = name.toLowerCase().includes(sizeStr.toLowerCase())
        ? name
        : `${name} (${sizeStr})`;
      const linePrice = item.product.price * item.quantity;
      return `- ${item.quantity}x ${nameWithSize} - $${formatNumber(linePrice)}`;
    });

    const extraSummaryLines: string[] = [];
    if (discount > 0) {
      extraSummaryLines.push(
        isEn
          ? `🏷️ *Discount (${promoCode}):* -$${formatNumber(discount)}`
          : `🏷️ *Descuento (${promoCode}):* -$${formatNumber(discount)}`
      );
    }
    extraSummaryLines.push(
      isEn
        ? `🚚 *Shipping:* ${shipping === 0 ? 'FREE' : `$${formatNumber(shipping)}`}`
        : `🚚 *Envío:* ${shipping === 0 ? 'GRATIS' : `$${formatNumber(shipping)}`}`
    );

    if (isEn) {
      return [
        `🛒 *NEW ORDER - VELMOR* 🥛`,
        `----------------------------------`,
        `👤 *Customer:* ${formState.fullName.trim()}`,
        `📍 *Delivery Address:* ${fullAddress}`,
        `📞 *Phone:* ${formState.phone.trim()}`,
        ...(formState.notes.trim() ? [`📝 *Notes:* ${formState.notes.trim()}`] : []),
        `----------------------------------`,
        `🛍️ *Products:*`,
        ...productLines,
        `----------------------------------`,
        ...extraSummaryLines,
        `💰 *Total to Pay:* $${formatNumber(total)}`,
        `----------------------------------`,
        `Thank you for choosing artisanal! ✨`,
      ];
    }

    return [
      `🛒 *NUEVO PEDIDO - VELMOR* 🥛`,
      `----------------------------------`,
      `👤 *Cliente:* ${formState.fullName.trim()}`,
      `📍 *Dirección de Entrega:* ${fullAddress}`,
      `📞 *Teléfono:* ${formState.phone.trim()}`,
      ...(formState.notes.trim() ? [`📝 *Notas:* ${formState.notes.trim()}`] : []),
      `----------------------------------`,
      `🛍️ *Productos:*`,
      ...productLines,
      `----------------------------------`,
      ...extraSummaryLines,
      `💰 *Total a Pagar:* $${formatNumber(total)}`,
      `----------------------------------`,
      `¡Gracias por elegir lo artesanal! ✨`,
    ];
  };

  const buildWhatsAppMessagePreview = (): string => {
    return buildWhatsAppMessageLines().join('\n');
  };

  const handleSendWhatsAppOrder = () => {
    if (!validateShipping()) {
      setCheckoutStep('shipping');
      return;
    }

    const encodedText = buildWhatsAppMessageLines()
      .map((line) => encodeURIComponent(line))
      .join('%0A');
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    toast.success(
      isEn
        ? 'Opening WhatsApp with your Velmor order!'
        : '¡Abriendo WhatsApp con tu pedido Velmor!',
      { duration: 2000 }
    );
  };

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(open) => {
        setCartOpen(open);
        if (!open) setCheckoutStep('cart');
      }}
    >
      <SheetContent className="w-full sm:max-w-lg flex flex-col bg-[#FAF8F5] p-0 border-l border-[#004B87]/15">
        {/* Drawer Header + Interactive Stepper */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#004B87]/10 shrink-0">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between text-[#004B87]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#004B87] text-white flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="font-bold text-base sm:text-lg">
                  {t('cart.title')} ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Interactive 3-Step Checkout Stepper */}
          {cart.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 mt-4 bg-[#FAF8F5] p-1 rounded-xl border border-[#004B87]/10">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  checkoutStep === 'cart'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-[#4E5E74] hover:text-[#004B87]'
                }`}
              >
                {t('cart.stepCart')}
              </button>
              <button
                type="button"
                onClick={() => setCheckoutStep('shipping')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  checkoutStep === 'shipping'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-[#4E5E74] hover:text-[#004B87]'
                }`}
              >
                {t('cart.stepShipping')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateShipping()) setCheckoutStep('confirm');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  checkoutStep === 'confirm'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-[#4E5E74] hover:text-[#004B87]'
                }`}
              >
                {t('cart.stepPayment')}
              </button>
            </div>
          )}
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-28 h-28 rounded-full bg-[#EBF4FA] flex items-center justify-center mb-5 border border-[#004B87]/15"
            >
              <img
                src="/images/mascota.png"
                alt="Mascota Velmor"
                className="w-24 h-24 object-contain"
              />
            </motion.div>
            <h3 className="text-xl font-bold text-[#192434] mb-2">{t('cart.empty')}</h3>
            <p className="text-sm text-[#4E5E74] mb-6 max-w-xs">{t('cart.emptySub')}</p>
            <Button
              onClick={() => setCartOpen(false)}
              className="bg-[#004B87] hover:bg-[#003865] text-white font-bold px-6 py-5 rounded-xl"
            >
              {t('cart.Explore')}
            </Button>
          </div>
        ) : (
          <>
            {/* STEP 1: CART ITEMS & PROMO */}
            {checkoutStep === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Free Shipping Progress Bar */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#2CA64E]/25 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#192434] mb-2">
                      <Truck className="w-4 h-4 text-[#2CA64E] shrink-0" />
                      {freeShippingRemaining > 0 ? (
                        <span>
                          {t('cart.freeShippingProgress', {
                            amount: formatCurrency(freeShippingRemaining),
                          })}
                        </span>
                      ) : (
                        <span className="text-[#2CA64E]">{t('cart.freeShippingUnlocked')}</span>
                      )}
                    </div>
                    <div className="h-2 bg-[#EBF4FA] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (subtotal / 50000) * 100)}%` }}
                        className="h-full bg-[#2CA64E] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Itemized Products */}
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-[#004B87]/10 shadow-sm"
                      >
                        <img
                          src={item.product.image}
                          alt={getLocalizedProductName(item.product, i18n.language)}
                          onError={(e) => {
                            e.currentTarget.src = '/images/small-fresa.jpg';
                          }}
                          className="w-20 h-20 rounded-xl object-contain p-1 shrink-0 border border-[#004B87]/10 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-[#192434] line-clamp-1">
                            {getLocalizedProductName(item.product, i18n.language)}
                          </h4>
                          <p className="text-xs text-[#4E5E74] mt-0.5">
                            {getLocalizedSize(item.product.size, i18n.language)} ·{' '}
                            {getLocalizedFlavor(item.product.flavor, i18n.language)}
                          </p>
                          <p className="font-extrabold text-[#004B87] text-sm mt-1">
                            {formatCurrency(item.product.price * item.quantity)}
                            <span className="text-[11px] font-normal text-[#4E5E74] ml-1.5">
                              ({formatCurrency(item.product.price)} c/u)
                            </span>
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border border-[#004B87]/20 rounded-lg bg-[#FAF8F5]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="p-1.5 hover:bg-[#004B87]/10 text-[#192434] transition-colors rounded-l-lg"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-bold text-[#192434]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                className="p-1.5 hover:bg-[#004B87]/10 text-[#192434] transition-colors rounded-r-lg"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-auto"
                              title={t('cart.remove')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Promo Code Input + Quick VELMOR10 Chip */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#004B87]/10 space-y-2.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E5E74]" />
                        <Input
                          placeholder={t('cart.promoCode')}
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="pl-9 bg-[#FAF8F5] text-sm h-10"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyPromo}
                        className="border-[#004B87] text-[#004B87] hover:bg-[#004B87] hover:text-white font-bold h-10"
                      >
                        {t('cart.apply')}
                      </Button>
                    </div>

                    {promoCode ? (
                      <div className="flex items-center justify-between text-xs text-[#2CA64E] font-bold bg-[#2CA64E]/10 px-3 py-1.5 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          {t('cart.promoSuccess', {
                            code: promoCode,
                            percent: discountPercent,
                          })}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          applyPromoCode('VELMOR10');
                          toast.dismiss();
                          const id = toast.success(
                            t('cart.promoSuccess', { code: 'VELMOR10', percent: 10 }),
                            { duration: 1100 }
                          );
                          setTimeout(() => toast.dismiss(id), 1150);
                        }}
                        className="text-xs font-semibold text-[#B47B2B] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isEn
                          ? 'Click here to apply VELMOR10 (-10% OFF)'
                          : 'Haz clic aquí para activar VELMOR10 (-10% Dto.)'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Step 1 Footer */}
                <div className="p-4 sm:p-5 bg-white border-t border-[#004B87]/10 space-y-3 shrink-0">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-[#4E5E74]">
                      <span>{t('cart.subtotal')}</span>
                      <span className="font-semibold text-[#192434]">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[#2CA64E] font-semibold">
                        <span>
                          {t('cart.discount')} ({promoCode})
                        </span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#4E5E74]">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        {t('cart.shipping')}
                      </span>
                      <span className="font-semibold text-[#192434]">
                        {shipping === 0 ? (
                          <span className="text-[#2CA64E] font-bold">
                            {t('cart.shippingFree')}
                          </span>
                        ) : (
                          formatCurrency(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-[#004B87] pt-2 border-t border-[#004B87]/10">
                      <span>{t('cart.total')}</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Primary Action: Ingresar Datos de Entrega */}
                  <Button
                    type="button"
                    className="w-full bg-[#004B87] hover:bg-[#003865] text-white font-bold py-6 rounded-xl shadow-md text-base cursor-pointer"
                    onClick={() => setCheckoutStep('shipping')}
                  >
                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                    <span>{t('cart.checkout')}</span>
                    <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 text-xs h-9"
                      onClick={() => setCartOpen(false)}
                    >
                      {t('cart.continueShopping')}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs h-9"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      {t('cart.clear')}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: DELIVERY DETAILS FORM ("Ingresar Datos de Entrega") */}
            {checkoutStep === 'shipping' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#004B87]/15 shadow-sm">
                    <h3 className="font-bold text-base text-[#004B87] flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{t('cart.shippingTitle')}</span>
                    </h3>
                    <p className="text-xs text-[#4E5E74] mt-1">
                      {t('cart.shippingSubtitle')}
                    </p>

                    <div className="mt-4 space-y-3.5">
                      <div>
                        <Label className="text-xs font-bold text-[#192434] flex items-center gap-1.5 mb-1">
                          <User className="w-3.5 h-3.5 text-[#004B87]" />
                          {t('cart.fullName')}
                        </Label>
                        <Input
                          value={formState.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          placeholder={t('cart.fullNamePlaceholder')}
                          className={`bg-[#FAF8F5] ${
                            errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : ''
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-bold text-[#192434] flex items-center gap-1.5 mb-1">
                            <Phone className="w-3.5 h-3.5 text-[#004B87]" />
                            {t('cart.phone')}
                          </Label>
                          <Input
                            type="tel"
                            value={formState.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            placeholder={t('cart.phonePlaceholder')}
                            className={`bg-[#FAF8F5] ${
                              errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : ''
                            }`}
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-bold text-[#192434] mb-1 block">
                            {t('cart.city')}
                          </Label>
                          <Input
                            value={formState.city}
                            onChange={(e) => updateField('city', e.target.value)}
                            placeholder={t('cart.cityPlaceholder')}
                            className={`bg-[#FAF8F5] ${
                              errors.city ? 'border-rose-500 ring-1 ring-rose-500' : ''
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-[#192434] flex items-center gap-1.5 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#004B87]" />
                          {t('cart.address')}
                        </Label>
                        <Input
                          value={formState.address}
                          onChange={(e) => updateField('address', e.target.value)}
                          placeholder={t('cart.addressPlaceholder')}
                          className={`bg-[#FAF8F5] ${
                            errors.address ? 'border-rose-500 ring-1 ring-rose-500' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-[#192434] mb-1 block">
                          {t('cart.neighborhood')}
                        </Label>
                        <Input
                          value={formState.neighborhood}
                          onChange={(e) => updateField('neighborhood', e.target.value)}
                          placeholder={t('cart.neighborhoodPlaceholder')}
                          className="bg-[#FAF8F5]"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-[#192434] flex items-center gap-1.5 mb-1">
                          <FileText className="w-3.5 h-3.5 text-[#004B87]" />
                          {t('cart.notes')}
                        </Label>
                        <Input
                          value={formState.notes}
                          onChange={(e) => updateField('notes', e.target.value)}
                          placeholder={t('cart.notesPlaceholder')}
                          className="bg-[#FAF8F5]"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSaveShippingOnly}
                        className="w-full border-[#004B87]/30 text-[#004B87] hover:bg-[#EBF4FA] font-semibold gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {t('cart.saveShipping')}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 2 Footer */}
                <div className="p-4 sm:p-5 bg-white border-t border-[#004B87]/10 space-y-2.5 shrink-0">
                  <Button
                    type="button"
                    className="w-full bg-[#2CA64E] hover:bg-[#238b3f] text-white font-bold py-6 rounded-xl shadow-md text-sm sm:text-base gap-2"
                    onClick={handleSendWhatsAppOrder}
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>{t('cart.sendDirectWhatsapp')}</span>
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 text-xs h-10"
                      onClick={() => setCheckoutStep('cart')}
                    >
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                      {t('cart.backToCart')}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1 text-xs h-10 bg-[#004B87] text-white hover:bg-[#003865]"
                      onClick={handleContinueToConfirm}
                    >
                      {t('cart.continueToConfirm')}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 3: ORDER CONFIRMATION & STRUCTURED WHATSAPP PREVIEW */}
            {checkoutStep === 'confirm' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Confirmed Delivery Address Card */}
                  <div className="p-4 rounded-2xl bg-white border border-[#2CA64E]/30 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2CA64E] flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        {t('cart.deliverySummaryTitle')}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('shipping')}
                        className="text-xs font-bold text-[#004B87] hover:underline"
                      >
                        {t('cart.backToShipping')}
                      </button>
                    </div>
                    <p className="text-sm font-bold text-[#192434]">
                      👤 {formState.fullName} · 📞 {formState.phone}
                    </p>
                    <p className="text-xs text-[#4E5E74]">
                      📍 {formState.address}
                      {formState.neighborhood ? ` (${formState.neighborhood})` : ''} —{' '}
                      {formState.city}
                    </p>
                    {formState.notes && (
                      <p className="text-xs text-[#4E5E74] italic">📝 {formState.notes}</p>
                    )}
                  </div>

                  {/* Live WhatsApp Message Preview */}
                  <div className="p-4 rounded-2xl bg-[#EDF8F0] border border-[#2CA64E]/30 space-y-2">
                    <p className="text-xs font-bold text-[#192434] flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-[#2CA64E]" />
                      {t('cart.whatsappPreviewTitle')}
                    </p>
                    <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap text-[#192434] bg-white/95 p-3.5 rounded-xl border border-[#2CA64E]/20 max-h-64 overflow-y-auto">
                      {buildWhatsAppMessagePreview()}
                    </pre>
                  </div>
                </div>

                {/* Step 3 Footer */}
                <div className="p-4 sm:p-5 bg-white border-t border-[#004B87]/10 space-y-2.5 shrink-0">
                  <div className="flex justify-between text-base font-extrabold text-[#004B87] pb-1">
                    <span>{t('cart.total')}</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-[#2CA64E] hover:bg-[#238b3f] text-white font-bold py-6 rounded-xl shadow-lg text-base gap-2"
                    onClick={handleSendWhatsAppOrder}
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>{t('cart.confirmAndSendWhatsapp')}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-xs h-9"
                    onClick={() => setCheckoutStep('shipping')}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    {t('cart.backToShipping')}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
