import { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import {
  FiDownload, FiFileText, FiEye, FiRefreshCw,
  FiCheckCircle, FiArrowRight, FiBookOpen, FiLayers, FiCheck
} from 'react-icons/fi';
import { FaWhatsapp, FaLeaf, FaFilePdf } from 'react-icons/fa';
import Link from 'next/link';
import { useApi, Catalog } from '@/hooks/useApi';

/* ── Floating ambient orb ──────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
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

const defaultCatalogs = [
  {
    id: "catalog-2026",
    title_en: "Green Globe Herbs • Master Botanical Export Catalog 2026/2027",
    title_ar: "جرين جلوب للأعشاب • الدليل الشامل لتصدير المحاصيل 2026/2027",
    version: "2026.1",
    pages: "48 Pages (EN/AR)",
    size: "8.4 MB • PDF",
    image: "/images/product/BASIL.jpg",
    description_en: "Comprehensive crop specifications for 50+ Egyptian medicinal herbs, culinary seeds, and flowers. Detailed mesh sizing, volatile oil contents, and harvest schedules.",
    description_ar: "المواصفات الفنية الشاملة لأكثر من 50 محصولاً نباتياً وبذوراً عطرية، مع أحجام الغربلة، ونسب الزيوت الطيارة، وجداول مواسم الحصاد الزراعية.",
    file: "/assets/docs/catalog-2026.pdf",
    highlights: ["Complete 50+ Botanical Crops", "Chemical & Physical Specs", "Harvest Diurnal Calendar"],
  },
  {
    id: "organic-dossier",
    title_en: "Certified Organic Medicinal Herbs & Teas Dossier",
    title_ar: "ملف الأعشاب والشاي العضوي المعتمد للتصدير الدولي",
    version: "EU/USDA",
    pages: "32 Pages (EN/AR)",
    size: "6.1 MB • PDF",
    image: "/images/agriculture-healthy-food.jpg",
    description_en: "Dedicated technical dossier on EU 2018/848 and USDA NOP certified crops. Gas chromatography benchmarks, zero pesticide guarantee, and laboratory analytical profiles.",
    description_ar: "ملف فني متخصص للمحاصيل العضوية المعتمدة وفق لوائح الاتحاد الأوروبي وأمريكا، مع تحاليل الكروماتوغرافيا وضمان خلو متبقيات المبيدات.",
    file: "/assets/docs/organic-dossier.pdf",
    highlights: ["GC-MS Chromatogram Samples", "Pesticide Screen (500+ MRL)", "Eurofins / SGS Verification"],
  },
  {
    id: "spices-seeds-guide",
    title_en: "Culinary Spices & Aromatic Seeds Wholesale Guide",
    title_ar: "دليل الجملة للتوابل والبذور العطرية (شمر، ينسون، كزبرة)",
    version: "Export A",
    pages: "24 Pages (EN/AR)",
    size: "4.8 MB • PDF",
    image: "/images/product/Fennel.jpg",
    description_en: "Detailed export guide for bulk fennel seeds, laser-cleaned anise, coriander, cumin, caraway, dill, and marjoram. Purity tables and bulk packaging capacities.",
    description_ar: "دليل التصدير لبذور الشمر والينسون المفروز ليزرياً والكزبرة والكمون والكراوية والشبت، مع جداول النقاء وسعات التعبئة بالجملة.",
    file: "/assets/docs/seeds-guide.pdf",
    highlights: ["Triple Optical Sorter Specs", "Bulk Bag & Sacks Options", "Moisture & Bulk Density"],
  },
  {
    id: "logistics-packaging-manual",
    title_en: "Ocean Container Loading & Export Packaging Manual",
    title_ar: "دليل التعبئة التصديرية وشحن الحاويات البحرية",
    version: "FCL/LCL",
    pages: "18 Pages (EN/AR)",
    size: "3.5 MB • PDF",
    image: "/images/product/Hibiscus.jpg",
    description_en: "Operational guide detailing 20ft / 40ft container loading tons, moisture barrier multi-ply kraft sacks, pallet stacking diagrams, and phytosanitary seal procedures.",
    description_ar: "دليل عمليات الشحن يوضح حمولة الحاويات 20 و 40 قدم، ومواصفات أكياس الكرافت العازلة، ومخططات رص المنصات، وإجراءات السيل الجمركي.",
    file: "/assets/docs/packaging-manual.pdf",
    highlights: ["Container Cubic Metric Tables", "Moisture Barrier Liners", "Phytosanitary Clearance Log"],
  },
];

const CatalogPage = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';
  
  const { catalogs, loading: apiLoading, fetchCatalogs } = useApi();

  useEffect(() => {
    if (catalogs.length === 0) {
      fetchCatalogs();
    }
  }, [catalogs.length]);

  const displayedCatalogs = catalogs.length > 0 ? catalogs : defaultCatalogs;

  return (
    <Layout title={t.nav.catalog}>
      
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Technical Catalogues & Product Sheets
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 sm:pt-40 pb-20 sm:pb-24 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/20 top-[-100px] left-[-100px]" />
        <Orb className="w-[500px] h-[500px] bg-primary/25 bottom-[-100px] right-[-100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(76,175,80,0.22),transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/15 shadow-xl mb-6 ring-1 ring-emerald-400/20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-emerald-300 uppercase font-bold">
              {isEn ? "Technical Specifications • 2026/2027 Export Harvest" : "المواصفات الفنية المعتمدة • محصول تصدير 2026/2027"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-headline-lg text-[40px] sm:text-[60px] lg:text-[72px] font-extrabold text-white leading-[1.08] tracking-tight mb-6 max-w-4xl"
          >
            {isEn ? (
              <>
                Botanical Export Catalogues & <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  Crop Specification Sheets
                </span>
              </>
            ) : (
              <>
                كتالوجات تصدير الأعشاب <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  وبطاقات المواصفات الفنية المعتمدة
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/85 text-[17px] sm:text-[20px] leading-relaxed max-w-3xl mb-12 font-body-lg"
          >
            {isEn
              ? "Download official product dossiers, Certificate of Analysis (COA) templates, and container shipping guides for procurement directors and botanical blenders worldwide."
              : "حمل الأدلة الفنية الشاملة، ونماذج شهادات التحليل المخبري، ومخططات شحن الحاويات المخصصة لمديري المشتريات ومصانع الأعشاب العالمية."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">48 Pages</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Full Master Catalog" : "الكتالوج الشامل"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">Bilingual</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "English & Arabic Dossier" : "نسخة عربي وإنجليزي"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">PDF Format</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Instant Download Ready" : "جاهز للتحميل الفوري"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">Free Sample</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "DHL Express Dispatch" : "شحن عينات مجانية"}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  OFFICIAL CATALOGUE LIST
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-24 sm:py-32 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[700px] h-[700px] bg-secondary/10 top-0 right-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <FiBookOpen className="w-4 h-4" />
              {isEn ? "Downloadable Publications" : "إصدارات ومطبوعات التصدير"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight">
              {isEn ? "Select an Export Guide or Technical Specification" : "اختر الدليل الفني أو الكتالوج المطلوب"}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedCatalogs.map((catalog: any, index: number) => {
              const catTitle = isEn ? (catalog.title_en || catalog.title) : (catalog.title_ar || catalog.title);
              const catDesc = isEn ? (catalog.description_en || catalog.description) : (catalog.description_ar || catalog.description);

              return (
                <Reveal key={catalog.id || index} delay={index * 0.1}>
                  <div className="rounded-[36px] p-8 sm:p-10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 hover:border-secondary/50 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group">
                    
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <span className="font-label-sm text-[10px] px-3 py-1 rounded-full bg-secondary/15 text-secondary uppercase font-bold tracking-wider">
                            {catalog.version ? `${isEn ? "Ed." : "طبعة"} ${catalog.version}` : "2026/2027"}
                          </span>
                          {catalog.pages && (
                            <span className="font-label-sm text-[10px] px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                              {catalog.pages}
                            </span>
                          )}
                        </div>
                        <span className="font-data-tabular text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <FaFilePdf />
                          <span>{catalog.size || "PDF"}</span>
                        </span>
                      </div>

                      <h3 className="font-headline-sm text-[24px] sm:text-[26px] font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                        {catTitle}
                      </h3>

                      <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed mb-6">
                        {catDesc}
                      </p>

                      {catalog.highlights && (
                        <div className="space-y-2 mb-8 pt-2">
                          {catalog.highlights.map((h: string, hIdx: number) => (
                            <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-primary">
                              <FiCheck className="text-secondary w-3.5 h-3.5 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-4 mt-auto">
                      <a
                        href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello Green Globe Herbs, please email or share the complete PDF copy of: ${catTitle}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-shine inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-primary text-white hover:bg-secondary font-label-sm text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span>{isEn ? "Request PDF Copy" : "طلب نسخة PDF كاملة"}</span>
                      </a>

                      <a
                        href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello Green Globe Herbs, I would like to request printed samples for: ${catTitle}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors"
                      >
                        <FaWhatsapp className="w-4 h-4" />
                        <span>{isEn ? "WhatsApp Inquiry" : "استفسار عبر واتساب"}</span>
                      </a>
                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  CUSTOM SPECIFICATION SHEET REQUEST CTA
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-24 bg-surface-container/60 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <div className="rounded-[40px] bg-gradient-to-br from-white/90 to-surface-container/70 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-12 lg:p-16 shadow-2xl">
            <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase mb-4 block">
              {isEn ? "Tailored Botanical Documentation" : "مواصفات مخصصة لشركتك"}
            </span>
            <h2 className="font-headline-lg text-[32px] sm:text-[46px] font-bold text-primary tracking-tight mb-6">
              {isEn ? "Require a Custom Specification Sheet for Your Blends?" : "تحتاج بطاقة مواصفات خاصة بخلطات ومنتجات شركتك؟"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              {isEn
                ? "Our agronomic quality team can generate tailor-made Certificate of Analysis (COA) templates matching your exact mesh size, essential oil threshold, and destination import regulations."
                : "يقوم فريق الجودة لدينا بإصدار بطاقات مواصفات فنية مخصصة مطابقة تماماً لمقاسات الغربلة ونسب الزيوت واشتراطات الاستيراد في بلدكم."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-shine inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-primary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-xl"
              >
                <span>{isEn ? "Contact Technical Desk" : "تواصل مع المكتب الفني"}</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/201278201346?text=Hello%20Green%20Globe%20Herbs,%20I%20need%20a%20custom%20specification%20sheet."
                target="_blank"
                rel="noreferrer"
                className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all shadow-md"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{isEn ? "WhatsApp Direct" : "واتساب المبيعات الفنية"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default CatalogPage;