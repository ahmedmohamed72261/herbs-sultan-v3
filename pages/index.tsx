import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useAppStore } from "@/store";
import { translations } from "@/lib/translations";
import api, { getAssetUrl } from "@/lib/api";
import {
  FiArrowRight, FiPackage, FiMapPin, FiMail, FiCheckCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import localProducts from "@/data/products.json";
import localCategories from "@/data/categories.json";

interface Product {
  id: number | string;
  slug?: string;
  name_en: string;
  name_ar: string;
  short_description_en?: string;
  short_description_ar?: string;
  description_en?: string;
  description_ar?: string;
  image: string | null;
  images?: string[] | null;
  purity?: string;
  origin?: string;
  category?: { name_en: string; name_ar: string; slug?: string; id?: string | number };
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (1800 / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] pointer-events-none select-none max-w-full ${className}`}
      animate={{ opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
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

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
      <span className="w-5 h-px bg-secondary inline-block" />
      {text}
    </span>
  );
}

export default function Home() {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === "en";

  const heroSpecimens = useMemo(() => [
    {
      id: "basil", name_en: "Sweet Nile Basil", name_ar: "ريحان النيل الحلو",
      latin: "Ocimum basilicum", image: "/images/products/basil.jpg",
      oil: "1.9% Ess. Oil", moisture: "< 8.0%", purity: "99.9% Clean",
      region: isEn ? "Beni Suef, Nile Basin" : "حوض النيل، بني سويف",
      badge: isEn ? "Certified Organic" : "عضوي معتمد",
      desc_en: "Sun-dried basil leaves with rich linalool profile, multi-stage optical sorted.",
      desc_ar: "أوراق ريحان مجففة شمسياً غنية بالزيوت العطرية، مفروزة ضوئياً.",
    },
    {
      id: "peppermint", name_en: "Egyptian Peppermint", name_ar: "نعناع فلفلي مصري",
      latin: "Mentha piperita", image: "/images/products/peppermint.jpg",
      oil: "2.2% Volatile Oil", moisture: "< 7.5%", purity: "99.8% Leaf",
      region: isEn ? "Beni Suef Farms" : "مزارع بني سويف",
      badge: isEn ? "Export Star Crop" : "أعلى طلب تصديري",
      desc_en: "High-menthol leaves, steam-sterilized for herbal tea and pharmaceutical blending.",
      desc_ar: "أوراق غنية بالمنثول معقمة بالبخار لصناعات الشاي والأدوية.",
    },
    {
      id: "chamomile", name_en: "Golden Chamomile", name_ar: "بابونج ذهبي فاخر",
      latin: "Matricaria chamomilla", image: "/images/products/chamomile.jpg",
      oil: "0.8% Pure Essence", moisture: "< 9.0%", purity: "98.5% Flowers",
      region: isEn ? "Middle Egypt Farms" : "مزارع مصر الوسطى",
      badge: isEn ? "Peak Harvest" : "قمة موسم الحصاد",
      desc_en: "Hand-harvested golden blossoms with dense bisabolol content for premium infusions.",
      desc_ar: "زهرات ذهبية مجمعة يدوياً غنية بالبيسابولول للشاي الطبيعي الفاخر.",
    },
    {
      id: "hibiscus", name_en: "Aswan Ruby Hibiscus", name_ar: "كركديه أسواني ياقوتي",
      latin: "Hibiscus sabdariffa", image: "/images/products/hibiscus.jpg",
      oil: "Anthocyanin Rich", moisture: "< 8.5%", purity: "99.2% Calyces",
      region: isEn ? "Upper Egypt, Nile Valley" : "صعيد مصر ووادي النيل",
      badge: isEn ? "Gourmet Grade" : "درجة أولى ممتازة",
      desc_en: "Deep crimson whole calyces naturally dehydrated, packed with antioxidants.",
      desc_ar: "بتلات ياقوتية مجففة طبيعياً وغنية بمضادات الأكسدة.",
    },
    {
      id: "marjoram", name_en: "Nile Sweet Marjoram", name_ar: "بردقوش النيل الفاخر",
      latin: "Origanum majorana", image: "/images/products/marjoram.jpg",
      oil: "1.8% Pure Essence", moisture: "< 7.5%", purity: "99.7% Rubbed",
      region: isEn ? "Beni Suef Valley" : "وادي بني سويف",
      badge: isEn ? "Triple Optical Cleaned" : "مفروز ليزرياً 3 مراحل",
      desc_en: "Velvety leaves with sweet piney aroma for gourmet Mediterranean seasonings.",
      desc_ar: "أوراق مخملية بنكهة دافئة مميزة لتوابل المطبخ المتوسطي.",
    },
    {
      id: "fennel", name_en: "Egyptian Sweet Fennel", name_ar: "شمر حلو مصري",
      latin: "Foeniculum vulgare", image: "/images/products/fennel.jpg",
      oil: "> 2.0% Anethole", moisture: "< 8.0%", purity: "99.5% Sifted",
      region: isEn ? "Beni Suef Alluvial Basin" : "طمي بني سويف الخصب",
      badge: isEn ? "EU Pharmacopoeia" : "مطابق لدستور الأدوية الأوروبي",
      desc_en: "Sun-cured oval seeds with sweet licorice aroma and high essential oil content.",
      desc_ar: "بذور شمر بنكهة ينسونية زكية ونسبة عالية من زيت الأنيثول.",
    },
  ], [isEn]);

  const [activeSpecimenIndex, setActiveSpecimenIndex] = useState(0);
  const activeSpecimen = heroSpecimens[activeSpecimenIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpecimenIndex((prev) => (prev + 1) % heroSpecimens.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSpecimens.length]);

  // Source of truth: All products from data/products.json with new /images/products/ images
  const allBotanicals: Product[] = useMemo(() => {
    return (localProducts as unknown as Product[]);
  }, []);

  // Lookup map to ensure any product record gets the new image in /images/products/
  const localProductMap = useMemo(() => {
    const map = new Map<string, Product>();
    (localProducts as unknown as Product[]).forEach((p) => {
      if (p.slug) map.set(p.slug.toLowerCase(), p);
      if (p.id) map.set(p.id.toString(), p);
      if (p.name_en) map.set(p.name_en.toLowerCase(), p);
    });
    return map;
  }, []);

  const [productsList, setProductsList] = useState<Product[]>(allBotanicals);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>("all");
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  const categories = useMemo(() =>
    localCategories.map((c) => ({
      id: c.id, slug: c.slug,
      label: isEn ? c.name_en : c.name_ar,
      image: c.image,
    })), [isEn]
  );

  const fallbackTestimonials = useMemo(() => [
    {
      name: "Dr. Markus Schneider",
      role: isEn ? "Procurement Director • Kräuter & Tee GmbH, Germany" : "مدير المشتريات • كرويتر أند تي، ألمانيا",
      text_en: "GREEN HERBS EG has been our trusted Egyptian botanical supplier for 5+ years. Their peppermint and chamomile consistently meet the strictest EU pesticide limits.",
      text_ar: "جرين هيربس إيجيبت شريكنا الاستراتيجي في مصر منذ أكثر من 5 سنوات. جودة النعناع والبابونج دائماً مطابقة لأدق معايير الاتحاد الأوروبي.",
    },
    {
      name: "Elena Rostova",
      role: isEn ? "Head of Sourcing • Nordic Infusions, Poland" : "رئيسة التوريدات • نورديك إنفيوجنز، بولندا",
      text_en: "The essential oil content in their sweet basil and fennel seeds is extraordinary. Every shipment comes with exhaustive COA and microbiology reports.",
      text_ar: "نسبة الزيوت الطيارة في الريحان والشمر استثنائية جداً. كل شحنة مصحوبة بشهادات التحليل المخبري المعتمدة.",
    },
    {
      name: "Tariq Al-Mansoor",
      role: isEn ? "VP Supply Chain • Royal Botanical Blends, UAE" : "نائب رئيس سلاسل الإمداد • رويال بليندز، الإمارات",
      text_en: "Outstanding hibiscus calyces and pristine multi-ply kraft sack packaging. GREEN HERBS EG represents the gold standard of Egyptian agricultural exports.",
      text_ar: "زهور كركديه فاخرة وتعبئة محكمة في أكياس كرافت متعددة الطبقات. جرين هيربس إيجيبت تمثل المعيار الذهبي للصادرات الزراعية المصرية.",
    },
  ], [isEn]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/products");
        const apiData = res.data?.data || res.data || [];
        if (Array.isArray(apiData) && apiData.length > 0) {
          // Merge API data with local high-quality images from data/products.json
          const merged = apiData.map((apiItem: any) => {
            const localMatch =
              localProductMap.get(apiItem.slug?.toLowerCase()) ||
              localProductMap.get(apiItem.id?.toString()) ||
              localProductMap.get(apiItem.name_en?.toLowerCase()) ||
              localProductMap.get(apiItem.name?.toLowerCase());

            return {
              ...apiItem,
              image: localMatch?.image || apiItem.image || "/images/products/chamomile.jpg",
              images: localMatch?.images || (apiItem.images?.length ? apiItem.images : [localMatch?.image || apiItem.image || "/images/products/chamomile.jpg"]),
              category: localMatch?.category || apiItem.category,
              purity: localMatch?.purity || apiItem.purity,
              origin: localMatch?.origin || apiItem.origin,
            };
          });
          setProductsList(merged.length > 0 ? merged : allBotanicals);
        } else {
          setProductsList(allBotanicals);
        }
      } catch {
        setProductsList(allBotanicals);
      }
    })();
    (async () => {
      try {
        const res = await api.get("/testimonials");
        const data = res.data?.data || res.data || [];
        setTestimonials(Array.isArray(data) && data.length > 0 ? data : fallbackTestimonials);
      } catch {
        setTestimonials(fallbackTestimonials);
      }
    })();
  }, [language, allBotanicals, localProductMap]);

  // Filter products by selected category across all items in dataset
  const filteredProducts = useMemo(() => {
    const list = productsList.length > 0 ? productsList : allBotanicals;
    if (activeCategorySlug === "all") {
      return list.slice(0, 9);
    }
    const matched = list.filter((p) => {
      const catSlug = p.category?.slug?.toLowerCase();
      const catName = p.category?.name_en?.toLowerCase();
      return catSlug === activeCategorySlug.toLowerCase() || catName === activeCategorySlug.toLowerCase();
    });
    return matched.length > 0 ? matched.slice(0, 9) : list.slice(0, 9);
  }, [productsList, allBotanicals, activeCategorySlug]);

  const stats = [
    { value: 25,  suffix: "+", label: isEn ? "Years of Heritage"      : "عاماً من الخبرة"      },
    { value: 50,  suffix: "+", label: isEn ? "Export Markets"          : "سوقاً دولياً"          },
    { value: 51,  suffix: "+", label: isEn ? "Botanical Varieties"     : "صنف نباتي معتمد"      },
    { value: 100, suffix: "%", label: isEn ? "Quality Compliance"      : "مطابقة دولية كاملة"   },
  ];

  const pipeline = useMemo(() => [
    {
      step: "01", title: isEn ? "Farm Partnership" : "شراكة المزارع",
      subtitle: isEn ? "Beni Suef Cultivation" : "زراعة بني سويف",
      details: isEn
        ? "Long-term contract farming with certified growers. We provide organic non-GMO seeds and supervise batch origin logs."
        : "عقود زراعية مع مزارعين معتمدين. نوفر بذوراً عضوية غير معدلة مع إشراف مباشر على التتبع الحقلي.",
      kpis: [isEn ? "100% Non-GMO Seeds" : "بذور غير معدلة وراثياً", isEn ? "Direct Agronomic Supervision" : "إشراف زراعي مباشر"],
    },
    {
      step: "02", title: isEn ? "Lab Testing" : "الفحص المعملي",
      subtitle: isEn ? "GC-MS Analysis" : "تحليل كروماتوغرافي",
      details: isEn
        ? "Every lot undergoes GC-MS volatile oil profiling, zero pesticide testing, and full microbial safety verification."
        : "تخضع كل شحنة لتحاليل GC-MS الكروماتوغرافية مع فحص خلو المبيدات والسلامة الميكروبية.",
      kpis: [isEn ? "GC-MS Verified" : "تحليل كروماتوغرافي معتمد", isEn ? "Zero Pesticide Guarantee" : "ضمان خلو تام من المبيدات"],
    },
    {
      step: "03", title: isEn ? "Optical Sorting" : "الفرز الضوئي",
      subtitle: isEn ? "Automated Cleaning" : "تنقية آلية متقدمة",
      details: isEn
        ? "Processed with high-speed optical color sorters, vibratory sieves, and magnetic separators for pristine purity."
        : "معالجة بالفرز الضوئي عالي السرعة والمغانط الكهربائية لعزل الشوائب بدقة متناهية.",
      kpis: [isEn ? "99.8% Target Purity" : "99.8% نسبة النقاء", isEn ? "Custom Mesh Calibration" : "معايرة دقيقة للحبيبات"],
    },
    {
      step: "04", title: isEn ? "Export Packing" : "التعبئة التصديرية",
      subtitle: isEn ? "Moisture & Aroma Lock" : "حماية كاملة للرطوبة",
      details: isEn
        ? "Packed in multi-wall kraft paper sacks with food-grade liners, desiccants, and tamper-evident sealing."
        : "تعبئة في أكياس كرافت متعددة الطبقات مع بطانات غذائية وأختام مقاومة للتلاعب.",
      kpis: [isEn ? "Moisture Barrier Liners" : "بطانات عازلة للرطوبة", isEn ? "Private Label Ready" : "جاهز للعلامات الخاصة"],
    },
    {
      step: "05", title: isEn ? "Port Logistics" : "الشحن البحري",
      subtitle: isEn ? "Alexandria & Damietta" : "الإسكندرية ودمياط",
      details: isEn
        ? "Official phytosanitary inspection, fumigation certificate, Bill of Lading, Certificate of Origin, and ocean dispatch."
        : "الشهادات الصحية النباتية وشهادات التبخير وشهادة المنشأ مع تنسيق كامل للحاويات البحرية.",
      kpis: [isEn ? "Full Shipping Dossier" : "ملف تصديري متكامل", isEn ? "FOB / CIF Global Terms" : "شروط FOB و CIF"],
    },
  ], [isEn]);

  return (
    <Layout title={t.home.heroTitle}>

      {/* §1 HERO */}
      <section
        dir={isEn ? "ltr" : "rtl"}
        className={`relative min-h-[100svh] flex items-center overflow-hidden bg-[#04100A] text-white ${isEn ? "" : "rtl"}`}
      >

        {/* ── Ambient background layers ── */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Mesh gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_50%,rgba(37,211,102,0.13),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_85%_40%,rgba(46,125,50,0.18),transparent_65%)]" />
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#04100A] to-transparent" />
        </div>

        {/* ── Main container ── */}
        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 lg:pt-24 pb-16 lg:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-10 items-center min-h-[calc(100svh-80px)]">

            {/* ══ COLUMN 1: Text content (Always order-1 so data is first on mobile) ══ */}
            <div className={`flex flex-col items-start ${isEn ? "text-left" : "text-right"} order-1 w-full`}>

              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md mb-6 ring-1 ring-emerald-400/10"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
                </span>
                <span className="font-bold text-[11px] uppercase text-emerald-300">
                  {isEn ? (
                    "Nile Harvest 2026/2027 · Bulk Export Active"
                  ) : (
                    <>
                      <span>محصول وادي النيل</span>{" "}
                      <bdi className="font-mono text-emerald-200">2026/2027</bdi>{" "}
                      <span>· تصدير الجملة متاح</span>
                    </>
                  )}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-extrabold tracking-tight leading-[1.12] mb-6 text-white w-full"
                style={{ fontSize: "clamp(34px, 5.2vw, 70px)" }}
              >
                {isEn ? (
                  <>
                    Egypt's Finest<br />
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-[#a5d6a7] bg-clip-text text-transparent">
                        Organic Herbs
                      </span>
                      <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6 Q75 2 150 5 Q225 8 298 4" stroke="url(#heroUnderline)" strokeWidth="3" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="heroUnderline" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#4caf50" />
                            <stop offset="1" stopColor="#25D366" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <br />
                    <span className="text-white/90">for Global Markets</span>
                  </>
                ) : (
                  <>
                    أجود الأعشاب<br />
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-l from-emerald-300 via-green-200 to-[#a5d6a7] bg-clip-text text-transparent">
                        العضوية المصرية
                      </span>
                      <svg className="absolute -bottom-1 right-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M298 6 Q225 2 150 5 Q75 8 2 4" stroke="url(#heroUnderlineAr)" strokeWidth="3" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="heroUnderlineAr" x1="300" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#4caf50" />
                            <stop offset="1" stopColor="#25D366" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <br />
                    <span className="text-white/90">للأسواق العالمية</span>
                  </>
                )}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="text-white/70 text-[16px] sm:text-[17px] leading-relaxed max-w-[540px] mb-7"
              >
                {isEn
                  ? "Premium export-grade herbs, spices & seeds grown in the fertile Nile basin. ISO 22000 certified, GC-MS tested, shipped worldwide from Egypt."
                  : "أعشاب وتوابل وبذور عضوية نقية تُزرع في حوض النيل الخصب. حاصلة على اعتمادات ISO 22000 و HACCP، ومفحوصة مخبرياً بـ GC-MS، نشحنها بحراً وجواً لكافة موانئ العالم."}
              </motion.p>

              {/* Cert chips */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="flex flex-wrap items-center gap-2 mb-8"
              >
                {(isEn
                  ? ["ISO 22000 & HACCP", "USDA & EU Organic", "GC-MS Verified"]
                  : ["معتمد ISO 22000 & HACCP", "عضوي USDA & EU", "فحص مخبري GC-MS"]
                ).map((chip) => (
                  <div
                    key={chip}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.12] backdrop-blur-md text-[12px] font-semibold text-white/85"
                  >
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{chip}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto"
              >
                <a
                  href={`https://wa.me/201278201346?text=${encodeURIComponent(isEn ? "Hello GREEN HERBS EG, I would like to inquire about your bulk export botanical catalog." : "مرحباً جرين هيربس إيجيبت، أود الاستفسار عن كتالوج التصدير وعروض الأسعار.")}`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bc5b] text-white font-bold text-[13px] uppercase tracking-wider transition-all shadow-[0_8px_30px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] hover:-translate-y-0.5"
                >
                  <FaWhatsapp className="w-5 h-5 shrink-0" />
                  <span>{isEn ? "WhatsApp Us" : "تواصل عبر واتساب"}</span>
                </a>
                <Link href="/products"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border border-white/20 bg-white/[0.07] backdrop-blur-md hover:bg-white/[0.14] text-white font-bold text-[13px] uppercase tracking-wider transition-all hover:-translate-y-0.5"
                >
                  <span>{isEn ? "Browse Catalog" : "تصفح الكتالوج"}</span>
                  <FiArrowRight className="w-4 h-4 shrink-0 rtl:rotate-180" />
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="flex items-center gap-6 sm:gap-9 pt-6 border-t border-white/[0.1] w-full"
              >
                {[
                  { value: "25+", label: isEn ? "Years Experience" : "عاماً من الخبرة" },
                  { value: "50+", label: isEn ? "Export Markets" : "سوقاً دولياً" },
                  { value: "51+", label: isEn ? "Botanical Varieties" : "صنفاً معتمداً" },
                ].map((s) => (
                  <div key={s.label} className={isEn ? "text-left" : "text-right"}>
                    <div className="text-[26px] sm:text-[32px] font-extrabold text-white tracking-tight leading-none font-mono">
                      {s.value}
                    </div>
                    <div className="text-[11px] font-bold uppercase text-emerald-400/85 mt-1.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ══ COLUMN 2: Core Export Categories Bento (Always order-2 so it stays below data on mobile) ══ */}
            <div className="relative order-2 w-full max-w-[620px] mx-auto">
              {/* Outer Glassmorphic Frame */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-3.5 sm:p-5 rounded-[30px] sm:rounded-[36px] bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
              >
                {/* Header status bar */}
                <div className="flex items-center justify-between px-3 py-2 mb-3.5 border-b border-white/[0.08] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/60">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
                    </span>
                    <span className="text-emerald-300 font-extrabold">
                      {isEn ? "Core Export Categories" : "قطاعات التصدير الرئيسية"}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/[0.07] border border-white/10 text-white/80 font-mono text-[10px]">
                    {isEn ? "4 Sectors · 51+ Varieties" : "٤ قطاعات · ٥١+ صنفاً"}
                  </span>
                </div>

                {/* 2x2 Categories Bento Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    {
                      slug: "herbs",
                      name_en: "Organic Herbs",
                      name_ar: "أعشاب عضوية",
                      tag_en: "Whole & Crushed Leaf",
                      tag_ar: "أوراق كاملة ومجروشة",
                      image: "/images/category/herbs.jpg",
                      badge: isEn ? "100% Organic" : "عضوي 100%",
                    },
                    {
                      slug: "spices",
                      name_en: "Egyptian Spices",
                      name_ar: "توابل وبهارات",
                      tag_en: "Aromatic & Pure",
                      tag_ar: "زيوت عطرية مركزة",
                      image: "/images/category/spices.jpg",
                      badge: isEn ? "Steam Cleaned" : "معقم بالبخار",
                    },
                    {
                      slug: "seeds",
                      name_en: "Aromatic Seeds",
                      name_ar: "بذور عطرية وزيتية",
                      tag_en: "Color-Sorted Purity",
                      tag_ar: "فرز ليزري فائق النقاء",
                      image: "/images/category/seeds.jpg",
                      badge: isEn ? "99.8% Purity" : "نقاء 99.8%",
                    },
                    {
                      slug: "legumes",
                      name_en: "Grains & Legumes",
                      name_ar: "حبوب وبقوليات",
                      tag_en: "Destoned & Graded",
                      tag_ar: "مفروزة وخالية من الحصى",
                      image: "/images/category/Legumes.jpg",
                      badge: isEn ? "Bulk Export" : "شحنات بحرية",
                    },
                  ].map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="group relative h-[180px] sm:h-[210px] rounded-2xl sm:rounded-[24px] overflow-hidden border border-white/[0.12] hover:border-emerald-400/50 transition-all duration-500 shadow-md flex flex-col justify-between p-3 sm:p-4 block"
                    >
                      {/* Image background with zoom */}
                      <img
                        src={cat.image}
                        alt={isEn ? cat.name_en : cat.name_ar}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      {/* Deep dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 group-hover:via-black/30 transition-colors" />

                      {/* Top Pill / Badge */}
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#04100A]/80 backdrop-blur-md border border-white/15 text-[10px] font-bold text-emerald-300">
                          {cat.badge}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-[#25D366] transition-all group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                          <FiArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </div>
                      </div>

                      {/* Bottom Info */}
                      <div className="relative z-10 text-white">
                        <div className="text-[15px] sm:text-[17px] font-extrabold leading-tight tracking-tight group-hover:text-emerald-300 transition-colors">
                          {isEn ? cat.name_en : cat.name_ar}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-white/75 mt-0.5 font-medium">
                          {isEn ? cat.tag_en : cat.tag_ar}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Floating Lab-Quality Stamp Badge at Bottom */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-3.5 sm:mt-4 p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#06140D]/90 to-emerald-950/80 border border-emerald-500/30 backdrop-blur-xl flex items-center justify-between gap-3 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                      <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-emerald-400">
                        {isEn ? "GC-MS Lab Tested & Purity Guaranteed" : "فحص مخبري كروماتوغرافي GC-MS"}
                      </div>
                      <div className="text-[13px] sm:text-[14px] font-extrabold text-white">
                        <bdi className="font-mono">99.8%</bdi>{" "}
                        {isEn ? "Certified Physical & Optical Purity" : "نقاء فيزيائي وخلو من الشوائب"}
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] font-bold uppercase">
                      ISO 22000
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                      HACCP
                    </span>
                  </div>
                </motion.div>

                {/* Ambient glow behind showcase */}
                <div className="absolute -inset-4 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(37,211,102,0.12),transparent_70%)] pointer-events-none -z-10" />
              </motion.div>
            </div>


          </div>
        </div>
      </section>


      {/* §2 TICKER */}
      <section className="relative w-full bg-primary py-3.5 overflow-hidden text-white border-y border-white/10">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-10 font-label-sm text-[11px] font-bold uppercase tracking-[0.25em]">
          {["🌱 100% Certified Organic","🔬 ISO 22000 & HACCP","🌍 50+ Export Markets",
            "📦 MOQ: 500 KG Trial","✅ USDA & EU Organic","🚢 FOB Alexandria / CIF Worldwide",
            "🌿 51 Botanical Varieties","⚗️ GC-MS Tested Every Batch",
            "🌱 100% Certified Organic","🔬 ISO 22000 & HACCP","🌍 50+ Export Markets",
            "📦 MOQ: 500 KG Trial","✅ USDA & EU Organic","🚢 FOB Alexandria / CIF Worldwide",
          ].map((item, i) => (
            <span key={i} className={item === "•" ? "text-white/40" : ""}>{item}<span className="mx-5 text-white/30">•</span></span>
          ))}
        </div>
      </section>

      {/* §3 STATS */}
      <section className={`relative w-full py-20 bg-background border-b border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="px-6 py-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm text-center hover:-translate-y-1 transition-all duration-300">
                  <div className="font-headline-lg text-[42px] md:text-[52px] font-extrabold text-primary mb-1">
                    <CountUp target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest font-bold">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* §4 CATEGORIES */}
      <section className={`relative w-full py-24 lg:py-32 overflow-hidden bg-surface-container-low/40 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 top-20 -left-40" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-14">
            <SectionLabel text={isEn ? "Product Range" : "نطاق المنتجات"} />
            <h2 className="font-headline-lg text-[34px] md:text-[48px] font-bold text-primary tracking-tight mb-3">
              {isEn ? "Four Botanical Categories" : "أربعة أصناف نباتية فاخرة"}
            </h2>
            <p className="font-body-lg text-[16px] text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              {isEn
                ? "From aromatic herbs to nutrient-rich legumes — our complete export range grown in the fertile Nile basin."
                : "من الأعشاب العطرية إلى البقوليات الغنية — مجموعتنا الكاملة المزروعة في طمي النيل الخصب."}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Reveal key={cat.id} delay={idx * 0.08}>
                <Link href={`/products?category=${cat.slug}`}
                  className="group block rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative aspect-[4/5] bg-black">
                  <img src={cat.image} alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="font-headline-sm text-[22px] font-bold mb-1">{cat.label}</div>
                    <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                      <span>{isEn ? "Explore Range" : "استكشف الأصناف"}</span>
                      <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* §5 FEATURED PRODUCTS */}
      <section className={`relative w-full py-24 lg:py-32 overflow-hidden bg-background border-t border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 bottom-0 left-0" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">

          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <SectionLabel text={isEn ? "Botanical Export Showcase" : "معرض المحاصيل التصديرية"} />
              <h2 className="font-headline-lg text-[34px] md:text-[46px] font-bold text-primary tracking-tight">
                {isEn ? "Featured Crops" : "منتجات مختارة"}
              </h2>
            </div>
            <Link href="/products"
              className="inline-flex items-center gap-2 font-label-sm text-[12px] font-bold text-secondary hover:text-primary uppercase tracking-widest transition-colors shrink-0">
              {isEn ? "View Complete Catalog" : "عرض الكتالوج الكامل"}<FiArrowRight />
            </Link>
          </Reveal>

          {/* Category tabs */}
          <Reveal delay={0.05}>
            <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              {[{ id: "all", slug: "all", label: isEn ? "All" : "الكل" }, ...categories].map((cat) => (
                <button key={cat.slug} onClick={() => setActiveCategorySlug(cat.slug)}
                  className={`px-5 py-2.5 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    activeCategorySlug === cat.slug ? "bg-secondary text-white shadow-md" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"}`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProducts.map((prod: any, idx: number) => {
              const prodName = isEn ? (prod.name_en || prod.name) : (prod.name_ar || prod.name_en);
              const prodDesc = isEn ? (prod.short_description_en || prod.description_en) : (prod.short_description_ar || prod.description_ar || prod.short_description_en);
              const catName = isEn ? (prod.category?.name_en || "Botanical") : (prod.category?.name_ar || "أعشاب");
              const prodSlug = prod.slug || prod._id || prod.id;
              return (
                <Reveal key={prod._id || prod.id || idx} delay={idx * 0.05}>
                  <div className="group rounded-[28px] overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-md hover:shadow-xl hover:border-secondary/40 transition-all duration-300 flex flex-col h-full">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-dim">
                      <img
                        src={prod.image?.startsWith("/") ? prod.image : (getAssetUrl(prod.image) || "/images/products/chamomile.jpg")}
                        alt={prodName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/products/chamomile.jpg";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/85 backdrop-blur-md text-white shadow-sm">{catName}</span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-headline-sm text-[19px] font-bold text-primary mb-2 group-hover:text-secondary transition-colors">{prodName}</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 leading-relaxed mb-5 flex-1">{prodDesc}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 gap-3">
                        <Link href={`/products/${prodSlug}`}
                          className="font-label-sm text-[11px] font-bold text-secondary group-hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                          {isEn ? "Specs & COA" : "المواصفات"}<FiArrowRight />
                        </Link>
                        <a href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello! Quote request for ${prod.name_en}.`)}`}
                          target="_blank" rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-full bg-secondary/15 hover:bg-secondary text-secondary hover:text-white font-bold text-[11px] flex items-center gap-1.5 transition-all">
                          <FaWhatsapp className="w-3 h-3" />{isEn ? "RFQ" : "تسعير"}
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/products"
              className="btn-shine inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
              {isEn ? "Explore Complete Product Catalog" : "تصفح الكتالوج الكامل"}<FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* §6 PIPELINE */}
      <section className={`relative w-full py-24 lg:py-32 overflow-hidden bg-surface-container-low/50 border-t border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 top-0 left-1/2 -translate-x-1/2" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">

          <Reveal className="text-center mb-14">
            <SectionLabel text={isEn ? "Farm to Port Assurance" : "رقابة من الحقل للميناء"} />
            <h2 className="font-headline-lg text-[34px] md:text-[48px] font-bold text-primary tracking-tight mb-3">
              {isEn ? "5-Step Quality Pipeline" : "خمس مراحل لضبط الجودة"}
            </h2>
            <p className="font-body-lg text-[16px] text-on-surface-variant max-w-xl mx-auto">
              {isEn ? "Click any stage to inspect our technical protocols applied to every export container."
                : "انقر على أي مرحلة لاستعراض البروتوكولات الفنية المطبقة على كل شحنة تصديرية."}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              {pipeline.map((p, idx) => (
                <button key={p.step} onClick={() => setActiveProcessStep(idx)}
                  className={`p-4 rounded-2xl text-left transition-all border ${
                    activeProcessStep === idx ? "bg-primary text-white border-primary shadow-xl scale-[1.02]"
                      : "bg-white/80 dark:bg-white/5 hover:bg-surface-container text-on-surface-variant border-outline-variant/30"}`}>
                  <div className={`font-bold text-[10px] uppercase mb-1 ${activeProcessStep === idx ? "text-emerald-300" : "text-secondary"}`}>Stage {p.step}</div>
                  <div className="font-headline-sm text-sm font-bold line-clamp-2">{p.title}</div>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <AnimatePresence mode="wait">
              <motion.div key={activeProcessStep} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="rounded-[32px] p-8 sm:p-12 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary uppercase tracking-widest inline-block mb-3">
                      Stage {pipeline[activeProcessStep].step}: {pipeline[activeProcessStep].subtitle}
                    </span>
                    <h3 className="font-headline-lg text-[26px] sm:text-[32px] font-bold text-primary mb-4">{pipeline[activeProcessStep].title}</h3>
                    <p className="text-on-surface-variant font-body-lg text-[16px] leading-relaxed mb-6">{pipeline[activeProcessStep].details}</p>
                    <div className="flex flex-wrap gap-3">
                      {pipeline[activeProcessStep].kpis.map((kpi, k) => (
                        <span key={k} className="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-primary flex items-center gap-2">
                          <FiCheckCircle className="text-secondary w-4 h-4" />{kpi}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-3xl bg-primary/10 border border-primary/20 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-2xl mb-4 shadow-lg">
                      {pipeline[activeProcessStep].step}
                    </div>
                    <div className="font-bold text-primary text-base mb-1">{isEn ? "Quality Milestone" : "مرحلة فحص معتمدة"}</div>
                    <div className="text-xs text-on-surface-variant">{isEn ? "Validated before container sealing" : "يتم إقرارها قبل إغلاق الحاوية"}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </section>

      {/* §7 TESTIMONIALS */}
      <section className={`relative w-full py-24 lg:py-28 overflow-hidden bg-background border-t border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 bottom-0 right-0" />
        <div className="max-w-[900px] mx-auto px-6 text-center relative z-10">
          <Reveal>
            <SectionLabel text={isEn ? "Verified Importer Reviews" : "شهادات مستوردينا"} />
            <h2 className="font-headline-lg text-[34px] md:text-[46px] font-bold text-primary tracking-tight mb-12">
              {isEn ? "Trusted by Global Importers" : "موثوق به من كبار المستوردين العالميين"}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Swiper modules={[Autoplay, Pagination]} spaceBetween={24} slidesPerView={1} loop
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              pagination={{ clickable: true,
                bulletClass: "swiper-pagination-bullet !w-2.5 !h-2.5 !bg-outline !opacity-30 !rounded-full transition-all",
                bulletActiveClass: "!bg-secondary !opacity-100 !w-8" }}
              className="pb-14">
              {(testimonials.length > 0 ? testimonials : fallbackTestimonials).map((item: any, idx: number) => (
                <SwiperSlide key={idx}>
                  <div className="rounded-[32px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-8 lg:p-12 text-left shadow-lg">
                    <div className="text-[44px] text-secondary/25 font-serif leading-none mb-3">"</div>
                    <p className="font-headline-sm text-[18px] md:text-[22px] leading-relaxed text-primary font-medium mb-7">
                      {item?.text_en ? (isEn ? item.text_en : item.text_ar) : item?.text}
                    </p>
                    <div className="flex items-center gap-4 border-t border-outline-variant/20 pt-5">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow">
                        {item?.name?.charAt(0) || "G"}
                      </div>
                      <div>
                        <div className="font-label-sm text-[14px] font-bold text-primary">{item?.name}</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">{item?.role}</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
        </div>
      </section>

      {/* §8 FINAL CTA */}
      <section className={`relative overflow-hidden py-20 bg-[#07130E] ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
          <Reveal>
            <SectionLabel text={isEn ? "Global Export Partnership" : "شراكة التصدير الدولية"} />
            <h2 className="font-headline-lg text-[32px] md:text-[48px] font-bold text-white tracking-tight mb-5">
              {isEn ? "Ready to Source Premium Egyptian Botanicals?" : "جاهز لاستيراد أجود النباتات المصرية؟"}
            </h2>
            <p className="text-white/70 text-[16px] max-w-lg mx-auto mb-9 leading-relaxed">
              {isEn
                ? "Connect with our export desk for certified product specs, COA samples, and competitive FOB/CIF quotations."
                : "تواصل مع مكتب التصدير للحصول على المواصفات المعتمدة وعينات COA وعروض أسعار تنافسية."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={`https://wa.me/201278201346?text=${encodeURIComponent("Hello GREEN HERBS EG, I would like to start a trade inquiry.")}`}
                target="_blank" rel="noopener noreferrer"
                className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all shadow-xl w-full sm:w-auto">
                <FaWhatsapp className="w-5 h-5" />
                {isEn ? "WhatsApp Sales Desk" : "واتساب المبيعات"}
              </a>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all border border-white/25 w-full sm:w-auto">
                <FiMail className="w-4 h-4" />
                {isEn ? "Send Email Inquiry" : "إرسال استفسار بريدي"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </Layout>
  );
}
