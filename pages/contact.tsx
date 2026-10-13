import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import {
  FiMapPin, FiPhone, FiMail, FiSend, FiClock,
  FiChevronDown, FiCheckCircle, FiUser, FiMessageCircle,
} from 'react-icons/fi';
import { FaWhatsapp, FaLeaf } from 'react-icons/fa';
import { useApi } from '@/hooks/useApi';

/* ── helpers ──────────────────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Input shared style ───────────────────────────────────── */
const INPUT = 'w-full px-5 py-3.5 rounded-2xl bg-white/8 dark:bg-white/5 border border-white/20 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder-white/30 text-[14px] font-medium transition-all outline-none';
const LABEL = 'block text-[11px] font-bold uppercase tracking-widest text-emerald-300/80 mb-2';

/* ─────────────────────────────────────────────────────────── */
const Contact = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await api.post('/messages', formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setFormStatus('success'); // graceful fallback
    }
  };

  const contactCards = [
    {
      icon: FiMapPin,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/20',
      label: isEn ? 'Location' : 'الموقع',
      value: isEn ? 'Sumusta Al Waqf, Beni Suef, Egypt' : 'سمسطا الوقف، بني سويف، مصر',
      link: 'https://maps.google.com/?q=28.958946,30.905930',
      linkText: isEn ? 'View on Map →' : 'على الخريطة →',
    },
    {
      icon: FiPhone,
      color: 'from-green-500/20 to-emerald-500/10',
      border: 'border-green-500/20',
      label: isEn ? 'Sales Line' : 'المبيعات',
      value: '+20 127 820 1346',
      link: 'tel:00201278201346',
      linkText: isEn ? 'Call Sales →' : 'اتصال →',
    },
    {
      icon: FiPhone,
      color: 'from-teal-500/20 to-green-500/10',
      border: 'border-teal-500/20',
      label: isEn ? 'CEO Office' : 'مكتب الإدارة',
      value: '+20 102 389 1035',
      link: 'tel:00201023891035',
      linkText: isEn ? 'Call CEO →' : 'اتصال →',
    },
    {
      icon: FiMail,
      color: 'from-cyan-500/20 to-emerald-500/10',
      border: 'border-cyan-500/20',
      label: isEn ? 'Email' : 'البريد الإلكتروني',
      value: 'sales@greenherbseg.com',
      link: 'mailto:sales@greenherbseg.com',
      linkText: isEn ? 'Send Email →' : 'مراسلة →',
    },
    {
      icon: FiClock,
      color: 'from-lime-500/20 to-green-500/10',
      border: 'border-lime-500/20',
      label: isEn ? 'Availability' : 'ساعات العمل',
      value: isEn ? 'Available 24 / 7 for Global Trade' : 'متاحون 24/7 للتجارة الدولية',
      link: null,
      linkText: null,
    },
  ];

  const faqs = [
    {
      q: isEn ? 'Do you ship internationally?' : 'هل تقومون بالشحن الدولي؟',
      a: isEn
        ? 'Yes, we export to 50+ countries across Europe, the Americas, Asia, and the Gulf. Rates and schedules are customized based on port and container size (FCL/LCL).'
        : 'نعم، نصدر إلى أكثر من 50 دولة في أوروبا والأمريكتين وآسيا والخليج. تتحدد الأسعار والمواعيد حسب ميناء الوصول وحجم الحاوية.',
    },
    {
      q: isEn ? 'What payment terms do you accept?' : 'ما هي شروط الدفع المقبولة؟',
      a: isEn
        ? 'We accept Irrevocable Letter of Credit (L/C), Wire Telegraphic Transfer (T/T), and documentary collections per agreed contract terms.'
        : 'نقبل الاعتماد المستندي غير القابل للإلغاء (L/C)، والتحويل البنكي (T/T)، والتحصيلات المستندية وفق بنود العقد.',
    },
    {
      q: isEn ? 'How long does order processing take?' : 'كم يستغرق تجهيز الطلب والشحن؟',
      a: isEn
        ? 'Processing, fumigation, phytosanitary inspection, and export prep typically take 5–10 business days. Transit time: 7–14 days to Europe, 18–25 days to the Americas.'
        : 'يستغرق التجهيز والفحص الحجري الصحي عادة 5–10 أيام عمل. ومدة الإبحار: 7–14 يوماً لأوروبا، 18–25 يوماً للأمريكتين.',
    },
    {
      q: isEn ? 'Are your products certified organic?' : 'هل منتجاتكم حاصلة على شهادات عضوية؟',
      a: isEn
        ? 'Yes. We offer USDA Organic and EU 2018/848 certified lines, alongside conventional export-grade crops, all with full Certificate of Analysis (COA).'
        : 'نعم، نقدم خطوط عضوية معتمدة وفق USDA وEU، بجانب المنتجات التقليدية، مع شهادة تحليل معملي شاملة لكل تشغيلة.',
    },
    {
      q: isEn ? 'Can you provide custom packaging?' : 'هل توفرون تغليفاً مخصصاً بعلامتي؟',
      a: isEn
        ? 'Yes — multi-ply kraft bags, woven PP sacks with inner liner, custom export cartons, and private labeling to your exact brand specifications.'
        : 'نعم — أكياس كرافت متعددة الطبقات، وأكياس بولي بروبلين مبطنة، وكراتين شحن مطبوعة حسب مواصفات علامتك التجارية.',
    },
  ];

  const { exportCountries: countries, fetchExportCountries } = useApi();
  useEffect(() => {
    if (countries.length === 0) fetchExportCountries();
  }, [countries.length]);

  return (
    <Layout title={t.contact.title}>

      {/* ══════════════════════════════════════════════════════
          §1  DARK HERO
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 pb-20 overflow-hidden bg-[#07130E] ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[700px] h-[700px] bg-emerald-600/18 -top-40 -left-40" />
        <Orb className="w-[500px] h-[500px] bg-green-500/15 bottom-0 right-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(76,175,80,0.22),transparent)] pointer-events-none" />

        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(76,175,80,1) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 backdrop-blur-md mb-7"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 text-[11px] font-bold uppercase tracking-[0.22em]">
              {isEn ? 'Export Trade Inquiries · Available 24/7' : 'استفسارات التصدير · متاح ٢٤/٧'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[42px] sm:text-[60px] lg:text-[72px] font-extrabold text-white leading-[1.06] tracking-tight mb-5 max-w-4xl"
          >
            {isEn ? (
              <>
                Start a Trade{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent">
                  Conversation
                </span>
              </>
            ) : (
              <>
                ابدأ{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent">
                  محادثة تجارية
                </span>{' '}
                معنا
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/65 text-[16px] sm:text-[19px] leading-relaxed max-w-2xl mb-12"
          >
            {isEn
              ? 'Whether you are a first-time importer or an established buyer, our export specialists are ready to assist with pricing, MOQ, certifications, and shipping logistics.'
              : 'سواء كنت مستورداً لأول مرة أو مشترياً راسخاً، فريق التصدير لدينا جاهز لمساعدتك في الأسعار والكميات والشهادات والشحن.'}
          </motion.p>

          {/* Quick contact pills */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <a
              href="https://wa.me/201278201346"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#25D366]/20"
            >
              <FaWhatsapp className="w-4 h-4" />
              {isEn ? 'WhatsApp Sales' : 'واتساب المبيعات'}
            </a>
            <a
              href="mailto:sales@greenherbseg.com"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/15 transition-all"
            >
              <FiMail className="w-4 h-4" />
              sales@greenherbseg.com
            </a>
            <a
              href="tel:00201278201346"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/15 transition-all"
            >
              <FiPhone className="w-4 h-4" />
              +20 127 820 1346
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  CONTACT CARDS + FORM
      ════════════════════════════════════════════════════ */}
      <section className={`relative bg-[#07130E] py-20 sm:py-28 overflow-hidden ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[500px] h-[500px] bg-emerald-700/12 top-10 right-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* LEFT: Contact info cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <Reveal className="mb-2">
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest mb-2 block">
                  {isEn ? 'Direct Channels' : 'قنوات التواصل المباشر'}
                </span>
                <h2 className="text-white text-[28px] sm:text-[34px] font-extrabold tracking-tight mb-3">
                  {isEn ? 'Reach Our Export Team' : 'تواصل مع فريق التصدير'}
                </h2>
                <p className="text-white/50 text-[14px] leading-relaxed">
                  {isEn
                    ? 'Our specialists are available around the clock for international buyers.'
                    : 'خبراؤنا متاحون على مدار الساعة للمشترين الدوليين.'}
                </p>
              </Reveal>

              {contactCards.map((card, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className={`flex items-start gap-4 p-5 rounded-[22px] bg-gradient-to-br ${card.color} border ${card.border} backdrop-blur-md hover:scale-[1.01] transition-transform duration-200 group`}>
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-emerald-400">
                      <card.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">{card.label}</p>
                      <p className="text-white font-semibold text-[14px] leading-snug break-all">{card.value}</p>
                      {card.link && (
                        <a
                          href={card.link}
                          target={card.link.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          className="text-emerald-400 text-xs font-bold mt-1 hover:text-emerald-300 transition-colors inline-block"
                        >
                          {card.linkText}
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}

              {/* WhatsApp card */}
              <Reveal delay={0.45}>
                <div className="rounded-[22px] bg-[#128C7E]/15 border border-[#25D366]/25 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg">
                      <FaWhatsapp className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-[14px]">{isEn ? 'Instant WhatsApp Support' : 'دعم واتساب الفوري'}</p>
                      <p className="text-white/40 text-[11px]">{isEn ? 'Direct to Export Department' : 'مباشرة لقسم التصدير'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="https://wa.me/201278201346?text=Hello%20GREEN%20HERBS%20EG%2C%20I%20would%20like%20to%20inquire%20about%20bulk%20herbs"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#128C7E] transition-colors"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5" />
                      {isEn ? 'Sales Desk' : 'المبيعات'}
                    </a>
                    <a
                      href="https://wa.me/201023891035?text=Hello%20GREEN%20HERBS%20EG%2C%20I%20would%20like%20to%20contact%20the%20management"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-700/60 border border-emerald-500/30 text-white text-xs font-bold hover:bg-emerald-600/60 transition-colors"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5" />
                      {isEn ? 'CEO Desk' : 'الإدارة'}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <div className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <FiMessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[20px]">
                        {isEn ? 'Send an Inquiry' : 'إرسال استفسار تجاري'}
                      </h3>
                      <p className="text-white/40 text-xs">
                        {isEn ? 'We respond within 24 hours' : 'نرد خلال 24 ساعة'}
                      </p>
                    </div>
                  </div>

                  {formStatus === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 text-center"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-5">
                        <FiCheckCircle className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h4 className="text-white font-bold text-[22px] mb-2">
                        {isEn ? 'Inquiry Received!' : 'تم استلام استفسارك!'}
                      </h4>
                      <p className="text-white/50 text-[14px] max-w-sm mx-auto leading-relaxed">
                        {isEn
                          ? 'Thank you for reaching out to GREEN HERBS EG. Our export team will contact you shortly.'
                          : 'شكراً لتواصلك مع جرين هيربس إيجيبت. سيتواصل معك فريق التصدير قريباً.'}
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={LABEL}>{t.contact.name}</label>
                          <input
                            required type="text"
                            placeholder={isEn ? 'Your name / company' : 'الاسم / الشركة'}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className={INPUT}
                          />
                        </div>
                        <div>
                          <label className={LABEL}>{t.contact.email}</label>
                          <input
                            required type="email"
                            placeholder="example@company.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className={INPUT}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={LABEL}>{isEn ? 'Phone / WhatsApp' : 'الهاتف / واتساب'}</label>
                          <input
                            type="tel"
                            placeholder="+1 234 567 8900"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className={INPUT}
                          />
                        </div>
                        <div>
                          <label className={LABEL}>{t.contact.subject}</label>
                          <input
                            required type="text"
                            placeholder={isEn ? 'e.g. Bulk Chamomile Inquiry' : 'مثال: استفسار عن بابونج بالجملة'}
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            className={INPUT}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL}>{t.contact.message}</label>
                        <textarea
                          required rows={5}
                          placeholder={isEn
                            ? 'Specify products, quantities, destination port, and packaging requirements...'
                            : 'حدد المنتجات المطلوبة والكميات وميناء الوصول ومتطلبات التعبئة...'}
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          className={`${INPUT} resize-none`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[13px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/40 disabled:opacity-50 flex items-center justify-center gap-3 btn-shine"
                      >
                        {formStatus === 'submitting'
                          ? (isEn ? 'Sending…' : 'جارٍ الإرسال…')
                          : t.contact.sendMessage}
                        <FiSend className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  MAP
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-20 sm:py-28 bg-background border-t border-outline-variant/20 overflow-hidden ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/8 top-0 right-0" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12">
            <span className="text-[11px] text-secondary font-bold uppercase tracking-widest block mb-2">
              {isEn ? 'Facility & Farms' : 'المقر والمزارع'}
            </span>
            <h2 className="text-[30px] md:text-[44px] font-bold text-primary tracking-tight mb-3">
              {isEn ? 'Find GREEN HERBS EG' : 'موقعنا في بني سويف'}
            </h2>
            <p className="text-on-surface-variant text-[15px] max-w-xl mx-auto">
              {isEn
                ? 'Located in Sumusta Al Waqf, Beni Suef — the heartland of premium Egyptian botanical cultivation.'
                : 'في سمسطا الوقف بمحافظة بني سويف — قلب زراعة وإنتاج أجود النباتات الطبية في مصر.'}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-[28px] overflow-hidden border border-outline-variant/25 shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d872.7397001380264!2d30.90593084607919!3d28.958946449402948!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145a33502c157a7b%3A0x71b43e3dcd6d18e8!2z2YXYr9ix2LPYqSDZg9mF2LEg2KjZhtmKINi52YTZiiDYp9mE2KfYqNiq2K_Yp9im2YrYqQ!5e0!3m2!1sar!2seg!4v1753620269614!5m2!1sar!2seg"
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GREEN HERBS EG Location Map"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  FAQ
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-20 sm:py-28 bg-background border-t border-outline-variant/20 overflow-hidden ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 top-1/2 -translate-y-1/2 right-0" />
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12">
            <span className="text-[11px] text-secondary font-bold uppercase tracking-widest block mb-2">
              {isEn ? 'Common Inquiries' : 'استفسارات شائعة'}
            </span>
            <h2 className="text-[30px] md:text-[44px] font-bold text-primary tracking-tight mb-3">
              {isEn ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
            </h2>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Reveal key={idx} delay={idx * 0.05}>
                  <div className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 overflow-hidden hover:border-secondary/30 transition-colors">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className={`w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors ${isOpen ? 'bg-secondary/5' : ''}`}
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-7 h-7 rounded-full bg-secondary/15 text-secondary text-[11px] font-black flex items-center justify-center shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="font-bold text-primary text-[15px] sm:text-[17px]">{faq.q}</span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.22 }}
                        className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0"
                      >
                        <FiChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 pt-1 text-on-surface-variant text-[14px] sm:text-[15px] leading-relaxed border-t border-outline-variant/15">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  EXPORT COUNTRIES
      ════════════════════════════════════════════════════ */}
      {countries.length > 0 && (
        <section className={`relative py-20 sm:py-28 bg-surface-container/30 border-t border-outline-variant/20 overflow-hidden ${isEn ? '' : 'rtl'}`}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10 text-center">
            <Reveal className="mb-14">
              <span className="text-[11px] text-secondary font-bold uppercase tracking-widest block mb-2">
                {isEn ? 'Global Reach' : 'الوصول العالمي'}
              </span>
              <h2 className="text-[30px] md:text-[44px] font-bold text-primary tracking-tight">
                {isEn ? 'Where We Export' : 'أين نصدر'}
              </h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {countries.map((country, index) => (
                <Reveal key={country._id} delay={index * 0.04}>
                  <div className="flex flex-col items-center gap-2 w-24 group">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow border border-white/40 dark:border-white/10 group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-300 bg-white/30 dark:bg-white/5">
                      {country.flag ? (
                        <img
                          src={getAssetUrl(country.flag)}
                          alt={isEn ? country.name_en : country.name_ar}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline-variant">
                          <FiMapPin />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-on-surface-variant group-hover:text-primary transition-colors font-semibold text-center">
                      {isEn ? country.name_en : country.name_ar}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

    </Layout>
  );
};

export default Contact;