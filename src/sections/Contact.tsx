import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const WHATSAPP_NUMBER = '573175687206';

export function Contact() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const leftColumnY = useTransform(scrollYProgress, [0, 1], [24, -18]);
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [38, -24]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(
        isEn ? 'Please complete all required fields' : 'Por favor completa los campos requeridos',
        { duration: 1500 }
      );
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success(t('contact.success'), { duration: 1500 });
    setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      isEn
        ? 'Hello Velmor! 🏔️ I would like more information about your artisanal Skyr products in Dosquebradas and the Coffee Region.'
        : '¡Hola Velmor! 🏔️ Me gustaría recibir más información sobre sus productos de Skyr artesanal en Dosquebradas y el Eje Cafetero.'
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-gradient-to-b from-[#FAF8F5] to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#192434] mb-3 font-serif-display">
            {t('contact.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#4E5E74] max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left: WhatsApp Direct Care & Info Cards */}
          <motion.div
            style={{ y: leftColumnY }}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            {/* Instant WhatsApp Care Card */}
            <div className="p-6 rounded-2xl bg-[#F3E9D8]/75 border border-[#B47B2B]/25 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#2CA64E] flex items-center justify-center text-white shadow-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#192434]">
                    {t('contact.whatsappCta')}
                  </h4>
                  <p className="text-xs text-[#4E5E74]">+57 317 568 7206</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#4E5E74] mb-4">
                {t('contact.whatsappDesc')}
              </p>
              <Button
                onClick={openWhatsApp}
                className="w-full bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold py-5 rounded-xl gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {t('contact.whatsappButton')}
              </Button>
            </div>

            {/* Info Cards */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#004B87]/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF4FA] text-[#004B87] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#192434]">
                  {isEn ? 'Dosquebradas & Coffee Region' : 'Dosquebradas & Eje Cafetero'}
                </h4>
                <p className="text-xs sm:text-sm text-[#4E5E74]">{t('contact.address')}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#004B87]/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF4FA] text-[#004B87] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#192434]">{t('contact.scheduleLabel')}</h4>
                <p className="text-xs sm:text-sm text-[#4E5E74]">{t('contact.hours')}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#004B87]/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF4FA] text-[#004B87] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#192434]">{t('contact.emailLabel')}</h4>
                <p className="text-xs sm:text-sm text-[#4E5E74]">pedidos@velmor.co</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            style={{ y: rightColumnY }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#004B87]/12 shadow-sm space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-[#192434]">
                    {t('contact.name')} *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('contact.namePlaceholder')}
                    className="bg-white border-[#004B87]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-[#192434]">
                    {t('contact.email')} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('contact.emailPlaceholder')}
                    className="bg-white border-[#004B87]/15"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-[#192434]">
                    <Phone className="w-3.5 h-3.5 inline mr-1 text-[#004B87]" />
                    {t('contact.phone')}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('contact.phonePlaceholder')}
                    className="bg-white border-[#004B87]/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-bold text-[#192434]">
                    {t('contact.subject')}
                  </Label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white border border-[#004B87]/15 text-sm text-[#192434]"
                  >
                    <option value="general">{t('contact.subjectGeneral')}</option>
                    <option value="order">{t('contact.subjectOrder')}</option>
                    <option value="wholesale">{t('contact.subjectWholesale')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-bold text-[#192434]">
                  {t('contact.message')} *
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.messagePlaceholder')}
                  className="bg-white border-[#004B87]/15 resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isSubmitted}
                className="w-full bg-[#B47B2B] hover:bg-[#9A6620] text-white font-bold py-6 rounded-xl shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('contact.sending')}
                  </span>
                ) : isSubmitted ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {t('contact.success')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    {t('contact.send')}
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
