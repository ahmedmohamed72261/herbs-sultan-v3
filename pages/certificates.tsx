import { useEffect, useRef, useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import {
  FiAward, FiShield, FiCheckCircle, FiCheck, FiX,
  FiMaximize2, FiDownload, FiFileText, FiLayers,
  FiArrowRight, FiExternalLink
} from 'react-icons/fi';
import { FaLeaf, FaMicroscope } from 'react-icons/fa';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';

/* ── Floating ambient orb ──────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none select-none max-w-full ${className}`}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
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

import localCertificates from '@/data/certificates.json';

const Certificates = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';

  const { certificates, loading: apiLoading, fetchCertificates } = useApi();
  const [activeCertModal, setActiveCertModal] = useState<any | null>(null);

  useEffect(() => {
    if (certificates.length === 0) {
      fetchCertificates();
    }
  }, [certificates.length]);

  const displayedCertificates = useMemo(() => {
    return (localCertificates as any[]).map((cert) => {
      const apiMatch = certificates.find((c) => c.id === cert.id || c.title_en === cert.title_en) as any;
      return {
        ...cert,
        ...apiMatch,
        // Always guarantee the high-res .jpg image from /images/certificates/
        image: cert.image || apiMatch?.image || '/images/certificates/iso-9001.jpg',
        icon: cert.icon || apiMatch?.icon,
        title_en: cert.title_en || apiMatch?.title_en,
        title_ar: cert.title_ar || apiMatch?.title_ar,
        scope: isEn ? (cert.scope_en || apiMatch?.scope_en || apiMatch?.scope) : (cert.scope_ar || apiMatch?.scope_ar || apiMatch?.scope),
        issuer: isEn ? (cert.issuer_en || apiMatch?.issuer_en || apiMatch?.issuer) : (cert.issuer_ar || apiMatch?.issuer_ar || apiMatch?.issuer),
        validity: cert.validity || apiMatch?.validity || "Active & Verified",
      };
    });
  }, [certificates, isEn]);

  const labTestingProtocols = [
    {
      title: isEn ? "GC-MS Gas Chromatography" : "الفحص بالغاز الكروماتوغرافي (GC-MS)",
      target: isEn ? "Volatile Essential Oil Profiling" : "تحديد نسب وهوية الزيوت العطرية",
      desc: isEn
        ? "Quantifies active terpenes, linalool, menthol, and anethole to verify authentic botanical chemotype and peak potency."
        : "قياس دقيق لنسب التربينات واللينالول والمنثول والأنيثول للتأكد من القوة العلاجية والنكهة الأصيلة للمحصول.",
      standard: isEn ? "Min. Essential Oil Limits per Spec" : "حدود الزيوت الطيارة المعتمدة",
    },
    {
      title: isEn ? "Multi-Residue Pesticide Screen" : "فحص خلو متبقيات المبيدات (500+ مركب)",
      target: isEn ? "Zero Chemical Contaminants" : "خلو تام من المبيدات الكيميائية",
      desc: isEn
        ? "Tested through LC-MS/MS and GC-MS/MS against 500+ synthetic pesticide residues to ensure total compliance with EU MRL limits."
        : "فحص متطور لأكثر من 500 مركب كيميائي لضمان الامتثال التام للحدود القصوى للمتبقيات في أوروبا (MRL).",
      standard: isEn ? "< 0.01 mg/kg (Undetectable)" : "أقل من 0.01 مجم/كجم (غير قابل للاكتشاف)",
    },
    {
      title: isEn ? "Heavy Metals ICP-MS Analysis" : "تحليل المعادن الثقيلة بالبلازما (ICP-MS)",
      target: isEn ? "Lead, Cadmium, Mercury, Arsenic" : "الرصاص، الكادميوم، الزئبق، الزرنيخ",
      desc: isEn
        ? "High-resolution mass spectrometry screening ensuring soil minerals remain far below European Pharmacopoeia safety thresholds."
        : "فحص فائق الحساسية يضمن بقاء المعادن الثقيلة في التربة ضمن الحدود الآمنة لدستور الأدوية الأوروبي.",
      standard: isEn ? "Strict EU / USP Limits Compliant" : "مطابق لمعايير دستور الأدوية الأوروبي",
    },
    {
      title: isEn ? "Microbiological Quality Screen" : "الفحص الميكروبيولوجي الدقيق",
      target: isEn ? "Salmonella, E. coli, Mold & Yeast" : "السالمونيلا، الإشريكية القولونية، الفطريات",
      desc: isEn
        ? "Guarantees zero Salmonella in 25g, zero E. coli, and controlled total plate count (TPC) through gentle hygienic solar dehydration."
        : "ضمان الخلو التام من بكتيريا السالمونيلا في 25 جرام والإشريكية القولونية مع ضبط كامل للأعفان والخمائر.",
      standard: isEn ? "Salmonella: Negative in 25g" : "سالمونيلا: خالية تماماً في 25 جرام",
    },
  ];

  return (
    <Layout title={t.nav.certificates}>
      
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Quality & Accreditations
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 sm:pt-40 pb-20 sm:pb-24 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/20 top-[-100px] right-[-100px]" />
        <Orb className="w-[500px] h-[500px] bg-primary/25 bottom-[-100px] left-[-100px]" />
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
              {isEn ? "International Quality Accreditations • Audited Batches" : "شهادات الجودة والاعتمادات الدولية • تشغيلات مفحوصة"}
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
                Global Food Safety & <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  Certified Organic Standards
                </span>
              </>
            ) : (
              <>
                معايير سلامة الغذاء العالمية <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  وشهادات الزراعة العضوية المعتمدة
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
              ? "Every botanical batch exported by GREEN HERBS EG is governed by rigorous international standards: ISO 22000, HACCP, USDA Organic, EU Organic, and US FDA facility registration with exhaustive Certificate of Analysis (COA) logs."
              : "تخضع كل شحنة نصدرها لأعلى معايير الرقابة الصارمة عالمياً: الآيزو 22000، والهاسب، والعضوية الأمريكية والأوروبية، وتسجيل الـ FDA الأمريكي مع شهادات فحص وتحليل معملي كاملة."}
          </motion.p>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">ISO 22000</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Food Safety System" : "نظام سلامة الغذاء"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">USDA / EU</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Dual Organic Certified" : "اعتماد عضوي مزدوج"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">0.0%</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Pesticide Residue Free" : "خلو تام من المبيدات"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">FDA #Reg</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "U.S. Compliant Facility" : "منشأة معتمدة بأمريكا"}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  OFFICIAL CERTIFICATION BADGES GRID
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-24 sm:py-32 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[700px] h-[700px] bg-secondary/10 top-0 right-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <FiAward className="w-4 h-4" />
              {isEn ? "Export Quality Accreditations" : "شهادات اعتماد الجودة التصديرية"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight">
              {isEn ? "Certified Standards Verifying Our Export Crops" : "شهادات دولية توثق جودة محاصيلنا للتصدير"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mt-4">
              {isEn
                ? "These international standards verify that all our exported herbs, spices, seeds, and legumes comply with rigorous global food safety, organic, and phytosanitary rules."
                : "توثق هذه الشهادات العالمية مطابقة كافة محاصيلنا المصدرة من الأعشاب والبهارات والبذور والبقوليات لأدق معايير الجودة وسلامة الغذاء والزراعة العضوية."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCertificates.map((cert: any, idx: number) => {
              const certTitle = isEn ? (cert.title_en || cert.name_en || cert.title) : (cert.title_ar || cert.name_ar || cert.title);
              const certDesc = isEn ? (cert.description_en || cert.description) : (cert.description_ar || cert.description);

              return (
                <Reveal key={cert.id || idx} delay={idx * 0.08}>
                  <div
                    onClick={() => setActiveCertModal(cert)}
                    className="group cursor-pointer rounded-[32px] p-6 sm:p-7 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 hover:border-secondary/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between h-full relative"
                  >
                    <div>
                      {/* Certificate Document Photo Preview */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#04100A] border border-outline-variant/30 group-hover:border-secondary/50 shadow-md">
                        <img
                          src={cert.image || "/images/certificates/iso-9001.jpg"}
                          alt={certTitle}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/certificates/iso-9001.jpg";
                          }}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                        
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                          {cert.badge || "Verified Standard"}
                        </div>

                        {cert.icon && (
                          <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md p-1.5 shadow-md flex items-center justify-center">
                            <img src={cert.icon} alt="" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                        {certTitle}
                      </h3>

                      <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed line-clamp-2 mb-6">
                        {certDesc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs font-bold text-secondary group-hover:text-primary transition-colors">
                      <span className="uppercase tracking-wider">{isEn ? "View Details" : "عرض التفاصيل"}</span>
                      <FiMaximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  LABORATORY ANALYSIS PIPELINE (GC-MS & ICP-MS)
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-surface-container/50 py-24 sm:py-32 overflow-hidden border-y border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <FaMicroscope className="w-4 h-4" />
              {isEn ? "Laboratory Testing Protocol" : "بروتوكول الفحص والتحليل المعملي"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight">
              {isEn ? "Stringent Analytical Verification on Every Botanical Lot" : "فحص معملي دقيق لكل تشغيلة زراعية"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mt-4">
              {isEn
                ? "Every export container is accompanied by independent laboratory reports confirming essential oil purity, microbial cleanliness, and absolute absence of chemical adulteration."
                : "تصدر كل حاوية مصحوبة بتقارير معملية موثقة تثبت نسبة الزيوت العطرية والنقاء الميكروبيولوجي والخلو التام من أي بقايا كيميائية."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {labTestingProtocols.map((proto, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="rounded-[36px] p-8 sm:p-10 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary/15 text-secondary uppercase tracking-wider">
                        {proto.target}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        <span>{proto.standard}</span>
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-[24px] font-bold text-primary mb-3">
                      {proto.title}
                    </h3>

                    <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
                      {proto.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>{isEn ? "Protocol: ISO 17025 Tested" : "معتمد طبقاً لـ ISO 17025"}</span>
                    <strong className="text-primary font-bold">{isEn ? "Full COA Issued" : "شهادة COA معتمدة"}</strong>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  MODAL: CERTIFICATE FULL VIEW & SPECIFICATIONS
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeCertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl rounded-[36px] bg-white dark:bg-[#07130E] border border-white/40 dark:border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveCertModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Certificate Image Preview */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden mb-6 bg-[#04100A] border border-outline-variant/30 shadow-lg mt-4">
                <img
                  src={activeCertModal.image || "/images/certificates/iso-9001.jpg"}
                  alt={isEn ? (activeCertModal.title_en || activeCertModal.title) : (activeCertModal.title_ar || activeCertModal.title)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/certificates/iso-9001.jpg";
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 px-3.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase">
                  ✓ {activeCertModal.badge || "Certified Export Standard"}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {activeCertModal.icon ? (
                  <div className="w-14 h-14 rounded-2xl bg-white/95 p-2 border border-outline-variant/30 flex items-center justify-center shrink-0 shadow-md">
                    <img src={activeCertModal.icon} alt="" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center text-2xl font-bold shrink-0">
                    <FiAward />
                  </div>
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    {activeCertModal.badge || "Verified Quality Standard"}
                  </span>
                  <h3 className="font-headline-sm text-[24px] sm:text-[26px] font-bold text-primary">
                    {isEn ? (activeCertModal.title_en || activeCertModal.title) : (activeCertModal.title_ar || activeCertModal.title)}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 mb-8 text-sm">
                <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30">
                  <strong className="text-xs uppercase text-on-surface-variant block mb-1">
                    {isEn ? "Audit & Accreditation Scope:" : "نطاق التفتيش والاعتماد:"}
                  </strong>
                  <p className="text-primary font-medium">
                    {activeCertModal.scope || (isEn ? "Organic botanical processing, handling, sorting & container export" : "تجهيز ومعالجة وفرز وتصدير الأعشاب والنباتات الطبية")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30">
                  <strong className="text-xs uppercase text-on-surface-variant block mb-1">
                    {isEn ? "Issuing Body:" : "الجهة المانحة:"}
                  </strong>
                  <p className="text-primary font-medium">
                    {activeCertModal.issuer || (isEn ? "International Accredited Certification Body" : "هيئة توثيق دولية معتمدة")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30">
                  <strong className="text-xs uppercase text-on-surface-variant block mb-1">
                    {isEn ? "Summary & Compliance:" : "الوصف والمطابقة:"}
                  </strong>
                  <p className="text-on-surface-variant leading-relaxed">
                    {isEn ? (activeCertModal.description_en || activeCertModal.description) : (activeCertModal.description_ar || activeCertModal.description)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  onClick={() => setActiveCertModal(null)}
                  className="px-6 py-2.5 rounded-full border border-outline-variant text-on-surface-variant text-xs font-bold hover:text-primary transition-all"
                >
                  {isEn ? "Close" : "إغلاق"}
                </button>
                <Link
                  href="/products"
                  onClick={() => setActiveCertModal(null)}
                  className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-2 hover:bg-secondary transition-all shadow-md"
                >
                  <span>{isEn ? "View Certified Products" : "تصفح المنتجات المعتمدة"}</span>
                  <FiArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          §5  EXPORT CATALOG & CERTIFIED PRODUCT SOURCING
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-24 bg-surface-container/60 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <div className="rounded-[40px] bg-gradient-to-br from-white/90 to-surface-container/70 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-12 lg:p-16 shadow-2xl">
            <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase mb-4 block">
              {isEn ? "Certified Egyptian Botanical Crops" : "محاصيل زراعية مصرية معتمدة دولياً"}
            </span>
            <h2 className="font-headline-lg text-[32px] sm:text-[46px] font-bold text-primary tracking-tight mb-6">
              {isEn ? "Certified Organic Crops for Bulk Global Export" : "محاصيل عضوية معتمدة للتصدير البحري لكافة الأسواق العالمية"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              {isEn
                ? "All our export crops — herbs, spices, seeds, and legumes — are grown under Nile agricultural supervision and processed in facilities certified by ISO 22000, HACCP, USDA Organic, and EU Organic standards."
                : "تزرع كافة محاصيلنا التصديرية من الأعشاب والبهارات والبذور والبقوليات تحت إشراف زراعي مباشر في حوض النيل ومجهزة في محطات حاصلة على شهادات الآيزو والهاسب والعضوية الدولية."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="btn-shine inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-primary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-xl"
              >
                <span>{isEn ? "Browse Export Products" : "تصفح المنتجات التصديرية"}</span>
                <FiArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-primary/30 bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all"
              >
                <span>{isEn ? "Inquire for Bulk Export" : "طلب تسعير للتصدير"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Certificates;