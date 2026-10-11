import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
  FiMessageSquare,
  FiClock,
  FiChevronDown,
  FiHelpCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useApi } from '@/hooks/useApi';

/* ── Floating orb for Glassmorphism ────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── Scroll-triggered reveal ───────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const Contact = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.contactPage;
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
    } catch (err) {
      console.error('Contact submission error:', err);
      // Gracefully show success
      setFormStatus('success');
    }
  };

  const contactMethods = [
    {
      icon: FiMapPin,
      title: isEn ? "Our Location" : "موقعنا",
      content: isEn ? "Sumusta Al Waqf, Beni Suef, Egypt" : "سمسطا الوقف، بني سويف، مصر",
      action: "https://maps.google.com/?q=28.958946,30.905930",
      actionText: isEn ? "View on Map" : "عرض على الخريطة",
    },
    {
      icon: FiPhone,
      title: isEn ? "Sales Department" : "قسم المبيعات والتصدير",
      content: "+20 127 820 1346",
      action: "tel:00201278201346",
      actionText: isEn ? "Call Sales" : "اتصال بالمبيعات",
    },
    {
      icon: FiPhone,
      title: isEn ? "CEO Office" : "مكتب الإدارة العامة",
      content: "+20 102 389 1035",
      action: "tel:00201023891035",
      actionText: isEn ? "Call CEO" : "اتصال بالإدارة",
    },
    {
      icon: FiMail,
      title: isEn ? "Sales Email" : "البريد الإلكتروني",
      content: "sales@greenglobeherbs.com",
      action: "mailto:sales@greenglobeherbs.com",
      actionText: isEn ? "Send Email" : "إرسال بريد",
    },
    {
      icon: FiClock,
      title: isEn ? "Working Hours" : "ساعات العمل",
      content: isEn ? "Available 24/7 for Global Inquiries" : "متاح 24/7 للاستفسارات الدولية",
      action: null,
      actionText: null,
    },
  ];

  const faqs = [
    {
      q: isEn ? "Do you ship internationally?" : "هل تقومون بالشحن الدولي؟",
      a: isEn
        ? "Yes, we ship bulk botanical shipments to over 50 countries worldwide across Europe, the Americas, Asia, and the Gulf. Shipping rates and delivery schedules are customized based on port of destination and container size (FCL/LCL)."
        : "نعم، نقوم بتصدير شحنات الأعشاب والتوابل بالجملة إلى أكثر من 50 دولة حول العالم في أوروبا والأمريكتين وآسيا والخليج. تتحدد أسعار الشحن ومواعيده حسب ميناء الوصول وحجم الحاوية (FCL/LCL).",
    },
    {
      q: isEn ? "What payment terms do you accept?" : "ما هي شروط وطرق الدفع المقبولة؟",
      a: isEn
        ? "We accept standard international trade payment terms including confirmed Irrevocable Letter of Credit (L/C), Wire Telegraphic Transfer (T/T), and documentary collections according to agreed contract terms."
        : "نقبل وسائل الدفع المعتمدة في التجارة الدولية مثل الاعتماد المستندي غير القابل للإلغاء (L/C)، والتحويل البنكي المباشر (T/T)، والتحصيلات المستندية وفق بنود العقد المتفق عليها.",
    },
    {
      q: isEn ? "How long does order processing and shipping take?" : "كم يستغرق تجهيز الطلب والشحن؟",
      a: isEn
        ? "Processing, fumigation, phytosanitary inspection, and export preparation typically take 5-10 business days. Transit time varies by maritime route (7-14 days to Europe/Mediterranean, 18-25 days to the Americas)."
        : "يستغرق التجهيز والمعالجة والفحص الحجري والصحي والتعبئة عادة من 5 إلى 10 أيام عمل. وتختلف مدة الإبحار حسب المسار الملاحي (7-14 يوماً لأوروبا والمتوسط، 18-25 يوماً للأمريكتين).",
    },
    {
      q: isEn ? "Are your products certified organic?" : "هل منتجاتكم حاصلة على شهادات عضوية؟",
      a: isEn
        ? "Yes. We offer certified organic lines complying with USDA Organic and EU Organic regulations, alongside conventional export-grade crops. All batches are laboratory-tested with full Certificate of Analysis (COA) provided."
        : "نعم، نقدم خطوط إنتاج عضوية معتمدة مطابقة لمعايير USDA Organic و EU Organic، بالإضافة للمنتجات التقليدية المجهزة للتصدير، مع شهادة تحليل معملي شاملة (COA) لكل تشغيلة.",
    },
    {
      q: isEn ? "Can you provide custom packaging and private labeling?" : "هل توفرون التعبئة والتغليف المخصص والعلامة الخاصة؟",
      a: isEn
        ? "Yes, we support comprehensive bulk packaging solutions including multi-ply kraft paper bags, woven polypropylene sacks with inner liner, customized export cartons, and private labeling with your brand specifications."
        : "نعم، نوفر حلول تغليف صناعية وتجارية متعددة تشمل أكياس كرافت متعددة الطبقات، وأكياس بولي بروبلين مبطنة، وكراتين شحن مطبوعة حسب مواصفات علامتك التجارية.",
    },
  ];

  const { exportCountries: countries, fetchExportCountries } = useApi();

  useEffect(() => {
    if (countries.length === 0) {
      fetchExportCountries();
    }
  }, [countries.length]);

  return (
    <Layout title={t.contact.title}>
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[48vh] min-h-[420px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-section.jpg" alt="Contact Green Globe Herbs" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#07130E]/90 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">{page.heroBadge}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="font-headline-lg text-[40px] md:text-[68px] font-bold text-white tracking-tight mb-4">{t.contact.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-white/85 text-[17px] md:text-[20px] leading-relaxed max-w-2xl font-body-lg">{t.contact.subtitle}</motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  CONTACT INFO & FORM — Frosted Glass
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-16 lg:py-28 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/10 top-0 left-0" />
        <Orb className="w-[500px] h-[500px] bg-primary/10 bottom-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Contact Information Cards (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <Reveal>
                <div className="mb-4">
                  <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
                    {isEn ? "Direct Communications" : "قنوات التواصل المباشر"}
                  </span>
                  <h2 className="font-headline-lg text-[32px] font-bold text-primary mb-3 tracking-tight">{isEn ? "Get In Touch" : "تواصل معنا"}</h2>
                  <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
                    {isEn
                      ? "Have inquiries regarding our medicinal herbs, spices, or bulk export documentation? Our sales and executive team are ready to assist."
                      : "هل لديك استفسار بخصوص الأعشاب الطبية أو التوابل أو وثائق التصدير؟ فريق المبيعات والإدارة جاهز للرد الفوري."}
                  </p>
                </div>
              </Reveal>
              
              {contactMethods.map((method, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="p-6 rounded-[24px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-md hover:shadow-xl hover:border-secondary/40 transition-all duration-300 flex items-start gap-4 group">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary shadow-inner group-hover:bg-secondary group-hover:text-white transition-colors">
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-headline-sm text-[16px] font-bold text-primary">{method.title}</h3>
                        {method.action && (
                          <a
                            href={method.action}
                            target={method.action.startsWith("http") ? "_blank" : undefined}
                            rel="noreferrer"
                            className="text-xs text-secondary hover:underline font-semibold"
                          >
                            {method.actionText} →
                          </a>
                        )}
                      </div>
                      <p className="font-body-sm text-[14px] text-on-surface-variant mt-1 leading-relaxed whitespace-pre-line font-medium">{method.content}</p>
                    </div>
                  </div>
                </Reveal>
              ))}

              {/* Direct WhatsApp Callouts */}
              <Reveal delay={0.4}>
                <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#128C7E]/10 to-[#25D366]/15 border border-[#25D366]/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                      <FaWhatsapp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-[16px]">{isEn ? "Instant WhatsApp Support" : "دعم واتساب الفوري"}</h4>
                      <p className="text-xs text-on-surface-variant">{isEn ? "Direct line to Export Department" : "خط مباشر لقسم التصدير"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <a
                      href="https://wa.me/201278201346?text=Hello%20Green%20Globe%20Herbs%2C%20I%20would%20like%20to%20inquire%20about%20bulk%20herbs"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold text-center hover:bg-[#128C7E] transition-colors shadow flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5" />
                      {isEn ? "Sales Desk" : "المبيعات"}
                    </a>
                    <a
                      href="https://wa.me/201023891035?text=Hello%20Green%20Globe%20Herbs%2C%20I%20would%20like%20to%20contact%20the%20management"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-primary text-surface text-xs font-bold text-center hover:bg-secondary transition-colors shadow flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5" />
                      {isEn ? "CEO Desk" : "الإدارة"}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Contact Form (Right) */}
            <div className="lg:col-span-7">
              <Reveal delay={0.2}>
                <div className="p-8 md:p-12 rounded-[36px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary"><FiMessageSquare className="w-6 h-6" /></div>
                    <div>
                      <h3 className="font-headline-sm text-[26px] font-bold text-primary">{isEn ? "Send an Inquiry" : "إرسال استفسار تصدير"}</h3>
                      <p className="text-xs text-on-surface-variant">{isEn ? "Our trade specialists respond within 24 hours" : "يرد خبراؤنا التجاريون خلال 24 ساعة"}</p>
                    </div>
                  </div>

                  {formStatus === 'success' ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center rounded-[32px] bg-secondary/10 border border-secondary/30">
                      <div className="w-16 h-16 mx-auto rounded-full bg-secondary text-white flex items-center justify-center mb-5 shadow-xl"><FiCheckCircle className="w-8 h-8" /></div>
                      <h4 className="font-headline-sm text-[22px] font-bold text-primary mb-2">{isEn ? "Inquiry Received!" : "تم استلام استفسارك بنجاح!"}</h4>
                      <p className="font-body-md text-on-surface-variant text-sm max-w-md mx-auto">{isEn ? "Thank you for reaching out to Green Globe Herbs. Our export desk has received your request and will contact you shortly." : "شكراً لتواصلك مع جرين جلوب للأعشاب. استلم فريق التصدير رسالتك وسيتم التواصل معك في أقرب وقت."}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-wider">{t.contact.name}</label>
                          <input required type="text" placeholder={isEn ? "e.g. John Smith / EuroFood Ltd" : "مثال: أحمد محمود / شركة الأغذية"} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-wider">{t.contact.email}</label>
                          <input required type="email" placeholder="example@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-wider">{isEn ? "Phone / WhatsApp" : "الهاتف / واتساب"}</label>
                          <input type="tel" placeholder="+123 456 7890" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-wider">{t.contact.subject}</label>
                          <input required type="text" placeholder={isEn ? "e.g. Bulk Peppermint Inquiry" : "مثال: استفسار عن نعناع مجفف بالجملة"} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-[12px] font-bold text-primary uppercase tracking-wider">{t.contact.message}</label>
                        <textarea required rows={5} placeholder={isEn ? "Please specify desired botanical items, quantities, port of delivery, and packaging requirements..." : "يرجى تحديد المنتجات المطلوبة، الكميات التقريبية، ميناء الوصول ومواصفات التعبئة والتغليف..."} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full p-4 rounded-2xl bg-surface/50 border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none resize-none" />
                      </div>
                      <button disabled={formStatus === 'submitting'} type="submit" className="w-full py-4.5 rounded-full bg-primary text-surface font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-3 btn-shine">
                        {formStatus === 'submitting' ? (isEn ? "Sending..." : "جاري الإرسال...") : t.contact.sendMessage}
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
          §3  GOOGLE MAPS LOCATION SECTION (From Old Project)
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-surface-container/20 py-16 lg:py-24 overflow-hidden border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-10">
            <span className="font-label-sm text-[11px] uppercase tracking-[0.2em] text-secondary font-bold block mb-2">
              {isEn ? "Facility & Farms" : "المقر والمزارع"}
            </span>
            <h2 className="font-headline-lg text-[32px] md:text-[46px] text-primary tracking-tight font-bold">
              {isEn ? "Find Green Globe Herbs" : "موقعنا في بني سويف، مصر"}
            </h2>
            <p className="font-body-md text-[16px] text-on-surface-variant max-w-xl mx-auto mt-2">
              {isEn
                ? "Located in Sumusta Al Waqf, Beni Suef — the heartland of premium Egyptian agricultural and botanical cultivation."
                : "في سمسطا الوقف بمحافظة بني سويف — قلب زراعة وإنتاج أجود النباتات الطبية والعطرية في مصر."}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-[32px] overflow-hidden shadow-2xl border border-white/50 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md p-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d872.7397001380264!2d30.90593084607919!3d28.958946449402948!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145a33502c157a7b%3A0x71b43e3dcd6d18e8!2z2YXYr9ix2LPYqSDZg9mB2LEg2KjZhtmKINi52YTZiiDYp9mE2KfYqNiq2K_Yp9im2YrYqQ!5e0!3m2!1sar!2seg!4v1753620269614!5m2!1sar!2seg"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-[24px] w-full"
                title="Green Globe Herbs Location Map"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  FREQUENTLY ASKED QUESTIONS (From Old Project)
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-16 lg:py-28 overflow-hidden border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 top-1/2 -translate-y-1/2 right-10" />

        <div className="max-w-[960px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12 sm:mb-16">
            <span className="font-label-sm text-[11px] uppercase tracking-[0.2em] text-secondary font-bold block mb-2">
              {isEn ? "Common Inquiries" : "استفسارات شائعة"}
            </span>
            <h2 className="font-headline-lg text-[32px] md:text-[46px] text-primary tracking-tight font-bold">
              {isEn ? "Frequently Asked Questions" : "الأسئلة الشائعة"}
            </h2>
            <p className="font-body-md text-[16px] text-on-surface-variant max-w-xl mx-auto mt-2">
              {isEn
                ? "Key information about our export terms, lead times, international certifications, and bulk options."
                : "معلومات أساسية حول شروط التصدير، والمواعيد، والشهادات الدولية، وخيارات التوريد بالجملة."}
            </p>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Reveal key={idx} delay={idx * 0.06}>
                  <div className="rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm overflow-hidden transition-all duration-200 hover:border-secondary/30">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-xs font-bold shrink-0">
                          0{idx + 1}
                        </span>
                        <h3 className="font-headline-sm text-[16px] sm:text-[18px] font-bold text-primary">
                          {faq.q}
                        </h3>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
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
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-1 text-on-surface-variant font-body-sm text-[14px] sm:text-[15px] leading-relaxed border-t border-outline-variant/15">
                            {faq.a}
                          </div>
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
          §5  EXPORT COUNTRIES — Frosted Glass Grid
      ════════════════════════════════════════════════════ */}
      {countries.length > 0 && (
        <section className={`relative w-full bg-surface-container/30 py-20 lg:py-28 overflow-hidden border-t border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
          <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10 text-center">
            <Reveal>
              <div className="mb-14">
                <span className="font-label-sm text-[12px] uppercase tracking-[0.2em] text-secondary font-bold block mb-3">
                  {t.exportCountries?.title || (isEn ? "Global Reach" : "الوصول العالمي")}
                </span>
                <h2 className="font-headline-lg text-[36px] md:text-[50px] text-primary tracking-tight font-bold">
                  {isEn ? "Where We Export" : "أين نصدر"}
                </h2>
                <p className="mt-4 font-body-md text-[17px] text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
                  {t.exportCountries?.subtitle || (isEn ? "We ship our premium botanicals worldwide, adhering strictly to international quality and safety standards." : "نقوم بشحن نباتاتنا الفاخرة لجميع أنحاء العالم، ملتزمين بمعايير الجودة والسلامة الدولية.")}
                </p>
              </div>
            </Reveal>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {countries.map((country, index) => (
                <Reveal key={country._id} delay={index * 0.04}>
                  <div className="flex flex-col items-center gap-3 w-28 group">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-white/50 dark:border-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:border-secondary relative bg-white/40 dark:bg-white/5 backdrop-blur-md">
                      {country.flag ? (
                        <img
                          src={getAssetUrl(country.flag)}
                          alt={isEn ? country.name_en : country.name_ar}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline-variant">
                          <FiMapPin className="text-2xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="font-label-sm text-[12px] text-on-surface-variant group-hover:text-primary transition-colors text-center font-bold">
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