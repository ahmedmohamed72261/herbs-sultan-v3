import { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import {
  FiDownload, FiArrowRight, FiCheckCircle, FiBookOpen, FiFileText, FiEye,
} from 'react-icons/fi';
import { FaWhatsapp, FaFilePdf, FaLeaf } from 'react-icons/fa';
import Link from 'next/link';

const PDF_URL = '/images/GREEN_HERBS_EG_Herbal_Product_Catalog.pdf';

/* ── Floating ambient orb ──────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none select-none max-w-full ${className}`}
      animate={{ opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── Scroll-triggered reveal ───────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const HIGHLIGHTS_EN = [
  "50+ Botanical Crops Fully Documented",
  "Herbs, Spices, Seeds & Legumes Sections",
  "International Quality Certifications",
  "Bilingual English & Arabic Content",
  "Export Packaging & Shipping Guide",
  "Contact & Trade Inquiry Details",
];

const HIGHLIGHTS_AR = [
  "توثيق شامل لأكثر من 50 محصولاً نباتياً",
  "أقسام الأعشاب والتوابل والبذور والبقوليات",
  "الشهادات الدولية للجودة والسلامة الغذائية",
  "محتوى ثنائي اللغة (عربي / إنجليزي)",
  "دليل التعبئة والشحن التصديري",
  "بيانات التواصل والاستفسارات التجارية",
];

const CatalogPage = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';
  const [showMobileIframe, setShowMobileIframe] = useState(false);

  return (
    <Layout title={t.nav.catalog}>

      {/* ══════════════════════════════════════════════════════
          §1  HERO
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 sm:pt-40 pb-20 sm:pb-24 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[700px] h-[700px] bg-secondary/20 top-[-150px] left-[-150px]" />
        <Orb className="w-[600px] h-[600px] bg-primary/25 bottom-[-100px] right-[-100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(76,175,80,0.25),transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xl mb-6 ring-1 ring-emerald-400/20"
          >
            <FaFilePdf className="text-emerald-400 w-3.5 h-3.5" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-emerald-300 uppercase font-bold">
              {isEn ? "Official Export Catalog 2026/2027" : "الكتالوج الرسمي للتصدير 2026/2027"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-headline-lg text-[40px] sm:text-[58px] lg:text-[68px] font-extrabold text-white leading-[1.08] tracking-tight mb-5 max-w-4xl"
          >
            {isEn ? (
              <>
                GREEN HERBS EG{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  Product Catalog
                </span>
              </>
            ) : (
              <>
                كتالوج المنتجات لشركة{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  جرين هيربس إيجيبت
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-[16px] sm:text-[19px] leading-relaxed max-w-2xl mb-10"
          >
            {isEn
              ? "Download our official 2026/2027 herbal product catalog featuring 50+ premium Egyptian botanicals — herbs, spices, seeds, and legumes — with full technical specifications."
              : "حمّل كتالوج المنتجات الرسمي للعام 2026/2027 ويشمل أكثر من 50 محصولاً نباتياً مصرياً فاخراً من أعشاب وتوابل وبذور وبقوليات مع المواصفات الفنية الكاملة."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href={PDF_URL}
              download="GREEN_HERBS_EG_Product_Catalog_2026.pdf"
              className="btn-shine inline-flex items-center gap-3 px-8 py-4 rounded-full bg-secondary text-white font-bold text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-emerald-900/40"
            >
              <FiDownload className="w-5 h-5" />
              {isEn ? "Download PDF (8.4 MB)" : "تحميل الكتالوج PDF (٨٫٤ ميجا)"}
            </a>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              <FiBookOpen className="w-4 h-4" />
              {isEn ? "View Online" : "عرض في المتصفح"}
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mt-14"
          >
            {[
              { val: "50+", label: isEn ? "Botanical Crops" : "محصول نباتي" },
              { val: "8.4 MB", label: isEn ? "PDF Catalog" : "حجم الكتالوج PDF" },
              { val: "EN/AR", label: isEn ? "Bilingual" : "ثنائي اللغة" },
              { val: "Free", label: isEn ? "Instant Download" : "تحميل مجاني فوري" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <div className="text-emerald-400 font-extrabold text-xl">{s.val}</div>
                <div className="text-white/60 text-[11px] uppercase tracking-wider font-semibold mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  PDF PREVIEW + HIGHLIGHTS
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-20 sm:py-28 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/8 top-0 right-0" />
        <Orb className="w-[500px] h-[500px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left: PDF Embed Preview */}
            <Reveal className="w-full">
              {/* ── MOBILE VIEW (< lg): Zero-vibration interactive mobile showcase ── */}
              <div className="block lg:hidden w-full">
                <div className="rounded-[28px] overflow-hidden border border-emerald-500/25 shadow-2xl bg-gradient-to-br from-[#06140D] via-[#091F14] to-[#04100A] p-6 text-white relative">
                  {/* Subtle background glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <FaFilePdf className="text-red-400 w-4 h-4 shrink-0" />
                      <span className="font-mono text-white/80 font-semibold truncate max-w-[190px]">
                        Catalog_2026.pdf
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 font-mono text-[10px] font-bold">
                      8.4 MB
                    </span>
                  </div>

                  {/* Visual Document Showcase Card */}
                  <div className="relative p-5 rounded-2xl bg-white/[0.04] border border-white/10 mb-5 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-400/10 border border-emerald-400/30 flex items-center justify-center mb-3 shadow-inner">
                      <FaLeaf className="text-emerald-400 w-8 h-8" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">
                      {isEn ? "Official Export Edition" : "الإصدار التصديري الرسمي"}
                    </div>
                    <h3 className="font-extrabold text-[17px] text-white leading-tight mb-2">
                      {isEn ? "GREEN HERBS EG Product Catalog" : "كتالوج منتجات جرين هيربس إيجيبت"}
                    </h3>
                    <p className="text-white/65 text-xs max-w-xs leading-relaxed mb-4">
                      {isEn
                        ? "50+ Egyptian medicinal crops, technical specs, quality testing, and bulk packaging."
                        : "٥٠+ محصولاً طبياً مصرياً، المواصفات الفنية، التحاليل المخبرية، وخيارات التعبئة."}
                    </p>

                    {/* Sector pills */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                      {[
                        isEn ? "Herbs" : "أعشاب",
                        isEn ? "Spices" : "توابل",
                        isEn ? "Seeds" : "بذور",
                        isEn ? "Legumes" : "بقوليات",
                      ].map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/80 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Primary Touch CTAs */}
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={PDF_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full btn-shine flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bc5b] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all"
                    >
                      <FiBookOpen className="w-4 h-4 shrink-0" />
                      <span>{isEn ? "Open & Read Fullscreen" : "فتح وتصفح الكتالوج بالكامل"}</span>
                    </a>

                    <a
                      href={PDF_URL}
                      download="GREEN_HERBS_EG_Product_Catalog_2026.pdf"
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all"
                    >
                      <FiDownload className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEn ? "Direct Download (8.4 MB)" : "تحميل مباشر (٨٫٤ ميجا)"}</span>
                    </a>

                    {/* Optional toggle for in-page iframe */}
                    <button
                      type="button"
                      onClick={() => setShowMobileIframe(!showMobileIframe)}
                      className="mt-1 text-[11px] text-white/50 hover:text-white/80 transition-colors flex items-center justify-center gap-1.5 py-1"
                    >
                      <FiEye className="w-3 h-3" />
                      <span>
                        {showMobileIframe
                          ? (isEn ? "Hide in-page preview" : "إخفاء المعاينة داخل الصفحة")
                          : (isEn ? "Need in-page preview on mobile?" : "معاينة الملف داخل الصفحة؟")}
                      </span>
                    </button>

                    {showMobileIframe && (
                      <div className="mt-2 rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-inner">
                        <iframe
                          src={`${PDF_URL}#toolbar=0&navpanes=0&scrollbar=0`}
                          title="GREEN HERBS EG Herbal Product Catalog Mobile Preview"
                          className="w-full"
                          style={{ height: '420px', border: 'none' }}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── DESKTOP VIEW (lg:block): Full embedded 620px PDF reader with zero jitter ── */}
              <div className="hidden lg:block rounded-[28px] overflow-hidden border border-outline-variant/30 shadow-2xl bg-white dark:bg-white/5">
                <div className="bg-surface-container-high px-5 py-3 flex items-center gap-3 border-b border-outline-variant/20">
                  <FaFilePdf className="text-red-500 w-4 h-4" />
                  <span className="text-xs font-semibold text-on-surface-variant truncate">
                    GREEN_HERBS_EG_Herbal_Product_Catalog.pdf
                  </span>
                  <a
                    href={PDF_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1 shrink-0"
                  >
                    <FiBookOpen className="w-3.5 h-3.5" />
                    {isEn ? "Open in New Tab" : "فتح في تبويب جديد"}
                  </a>
                </div>
                <iframe
                  src={`${PDF_URL}#toolbar=0&navpanes=0&scrollbar=0`}
                  title="GREEN HERBS EG Herbal Product Catalog"
                  className="w-full"
                  style={{ height: '620px', border: 'none' }}
                  loading="lazy"
                />
              </div>
            </Reveal>

            {/* Right: Info & Highlights */}
            <Reveal delay={0.1} className="flex flex-col gap-6 pt-2">
              <div>
                <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-4 font-bold">
                  <FiFileText className="w-4 h-4" />
                  {isEn ? "What's Inside" : "محتوى الكتالوج"}
                </span>
                <h2 className="font-headline-lg text-[32px] md:text-[42px] font-bold text-primary tracking-tight mb-4">
                  {isEn ? "Everything You Need to Start Sourcing" : "كل ما تحتاجه لبدء الاستيراد"}
                </h2>
                <p className="font-body-md text-[15px] sm:text-[16px] text-on-surface-variant leading-relaxed">
                  {isEn
                    ? "Our official export catalog covers every crop we produce and export — from aromatic herbs and therapeutic teas to culinary spices, botanical seeds, and protein-rich legumes. Specifications, quality standards, and packaging options are clearly documented."
                    : "يشمل كتالوجنا الرسمي كافة المحاصيل التي ننتجها ونصدرها — من الأعشاب العطرية والشاي الطبي إلى التوابل والبذور والبقوليات الغنية بالبروتين، مع توثيق واضح للمواصفات ومعايير الجودة وخيارات التعبئة."}
                </p>
              </div>

              {/* Highlights List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isEn ? HIGHLIGHTS_EN : HIGHLIGHTS_AR).map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-surface-container/60 dark:bg-white/5 border border-outline-variant/20"
                  >
                    <FiCheckCircle className="text-secondary w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-primary">{h}</span>
                  </div>
                ))}
              </div>

              {/* Download CTA Card */}
              <div className="rounded-[24px] p-6 bg-gradient-to-br from-emerald-950/90 to-emerald-900/80 dark:from-emerald-900/40 dark:to-emerald-800/20 border border-emerald-700/30 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <FaLeaf className="text-emerald-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {isEn ? "Official Product Catalog" : "الكتالوج الرسمي للمنتجات"}
                    </p>
                    <p className="text-emerald-300/70 text-xs">PDF • 8.4 MB • 2026/2027</p>
                  </div>
                </div>
                <a
                  href={PDF_URL}
                  download="GREEN_HERBS_EG_Product_Catalog_2026.pdf"
                  className="w-full btn-shine flex items-center justify-center gap-3 py-3.5 rounded-xl bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-primary transition-all shadow-lg shadow-emerald-900/40 mb-3"
                >
                  <FiDownload className="w-5 h-5" />
                  {isEn ? "Download Free Catalog" : "تحميل الكتالوج مجاناً"}
                </a>
                <a
                  href={`https://wa.me/201278201346?text=${encodeURIComponent(isEn ? "Hello GREEN HERBS EG, I downloaded your catalog and would like to start a trade inquiry." : "مرحباً جرين هيربس إيجيبت، لقد حملت الكتالوج وأود الاستفسار عن التجارة.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full whatsapp-glow flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:opacity-90 transition-all"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  {isEn ? "WhatsApp Trade Inquiry" : "استفسار عبر واتساب"}
                </a>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  CONTACT CTA
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-20 bg-surface-container/50 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <Reveal>
            <div className="rounded-[36px] bg-gradient-to-br from-white/90 to-surface-container/70 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-10 lg:p-14 shadow-2xl">
              <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase mb-4 block">
                {isEn ? "Ready to Import?" : "مستعد للاستيراد؟"}
              </span>
              <h2 className="font-headline-lg text-[28px] sm:text-[38px] font-bold text-primary tracking-tight mb-4">
                {isEn ? "Let's Start Your First Trade Order" : "لنبدأ أول طلب تجاري معاً"}
              </h2>
              <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant max-w-xl mx-auto mb-8 leading-relaxed">
                {isEn
                  ? "After reviewing the catalog, contact our export team for pricing, MOQ, and shipping terms tailored to your destination."
                  : "بعد مراجعة الكتالوج، تواصل مع فريق التصدير للحصول على الأسعار والحد الأدنى للطلب وشروط الشحن المناسبة لبلدك."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="btn-shine inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold text-[13px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl"
                >
                  {isEn ? "Contact Export Team" : "تواصل مع فريق التصدير"}
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-outline-variant/50 text-primary font-bold text-[13px] uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all"
                >
                  <FaLeaf className="w-3.5 h-3.5" />
                  {isEn ? "Browse All Products" : "استعراض كل المنتجات"}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </Layout>
  );
};

export default CatalogPage;