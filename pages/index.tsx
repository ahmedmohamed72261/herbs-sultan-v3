import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useAppStore } from "@/store";
import { translations } from "@/lib/translations";
import api, { getAssetUrl } from "@/lib/api";
import {
  FiArrowRight, FiStar, FiPackage, FiGlobe,
  FiShield, FiTruck, FiAward, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiCheck, FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiPlay, FiPause,
  FiCheckCircle, FiLayers, FiSliders, FiFileText
} from "react-icons/fi";
import { FaWhatsapp, FaLeaf, FaSeedling } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Product {
  id: number | string;
  name_en: string;
  name_ar: string;
  short_description_en?: string;
  short_description_ar?: string;
  description_en?: string;
  description_ar?: string;
  image: string | null;
  category?: { name_en: string; name_ar: string; slug?: string; id?: string };
}

/* ── Animated counter ──────────────────────────────────────── */
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

/* ── Floating ambient orb ──────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Scroll-triggered reveal ───────────────────────────────── */
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

export default function Home() {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.homePage;
  const isEn = language === "en";

  // Featured specimens for modern interactive Hero card
  // Featured specimens for modern interactive Hero card
  const heroSpecimens = [
    {
      id: "basil",
      name_en: "Sweet Nile Basil",
      name_ar: "ريحان النيل الحلو",
      latin: "Ocimum basilicum",
      image: "/images/product/BASIL.jpg",
      oil: "1.9% Essential Oil",
      moisture: "< 8.0% Moisture",
      purity: "99.9% Cleaned",
      region: isEn ? "Beni Suef Nile Basin" : "حوض النيل، بني سويف",
      badge: isEn ? "Certified Organic" : "عضوي معتمد",
      description_en: "Intensely fragrant sun-dried leaves with rich linalool profile, sorted through multi-stage optical cleaners.",
      description_ar: "أوراق مجففة شمسياً غنية بنكهة اللينالول العطرية، مفروزة عبر أجهزة الفرز الضوئي المتطورة.",
    },
    {
      id: "peppermint",
      name_en: "Egyptian Peppermint",
      name_ar: "نعناع فلفلي مصري",
      latin: "Mentha piperita",
      image: "/assets/images/spice1.jpg",
      oil: "2.2% Volatile Oil",
      moisture: "< 7.5% Moisture",
      purity: "99.8% Pure Leaf",
      region: isEn ? "Beni Suef Farms" : "مزارع بني سويف",
      badge: isEn ? "Export Star Crop" : "أعلى طلب تصديري",
      description_en: "High-menthol crushed and whole leaves, steam-sterilized for European herbal tea and pharmaceutical blending.",
      description_ar: "أوراق كاملة ومجروشة غنية بالمنثول، معقمة بالبخار لصناعات الشاي العشبي والأدوية الأوروبية.",
    },
    {
      id: "chamomile",
      name_en: "Golden Chamomile",
      name_ar: "بابونج ذهبي فاخر",
      latin: "Matricaria chamomilla",
      image: "/images/agriculture-healthy-food.jpg",
      oil: "0.8% Pure Essence",
      moisture: "< 9.0% Moisture",
      purity: "98.5% Whole Flowers",
      region: isEn ? "Middle Egypt Farms" : "مزارع مصر الوسطى",
      badge: isEn ? "Peak Harvest" : "قمة موسم الحصاد",
      description_en: "Hand-harvested intact yellow blossoms with dense bisabolol content for premium wellness infusions.",
      description_ar: "زهرات كاملة مجمعة يدوياً غنية بمركب البيسابولول لخلطات الاسترخاء والشاي الطبيعي الفاخر.",
    },
    {
      id: "hibiscus",
      name_en: "Aswan Ruby Hibiscus",
      name_ar: "كركديه أسواني ياقوتي",
      latin: "Hibiscus sabdariffa",
      image: "/images/product/Hibiscus.jpg",
      oil: "Anthocyanin Rich",
      moisture: "< 8.5% Moisture",
      purity: "99.2% Whole Calyces",
      region: isEn ? "Upper Egypt & Nile Valley" : "صعيد مصر ووادي النيل",
      badge: isEn ? "Gourmet Grade" : "درجة أولى ممتازة",
      description_en: "Deep crimson whole calyces with intense tart floral flavor, naturally dehydrated without sulfur.",
      description_ar: "بتلات كاملة بلون ياقوتي داكن ونكهة منعشة غنية بمضادات الأكسدة ومجففة طبيعياً بدون كبريت.",
    },
    {
      id: "fennel",
      name_en: "Egyptian Sweet Fennel",
      name_ar: "شمر حلو مصري",
      latin: "Foeniculum vulgare",
      image: "/images/product/Fennel.jpg",
      oil: "> 2.0% Anethole Oil",
      moisture: "< 8.0% Moisture",
      purity: "99.5% Triple Sifted",
      region: isEn ? "Beni Suef Alluvial Basin" : "طمي بني سويف الخصب",
      badge: isEn ? "EU Pharmacopoeia" : "مطابق لدستور الأدوية الأوروبي",
      description_en: "Naturally sun-cured oval seeds with sweet licorice aroma and high essential oil content.",
      description_ar: "بذور شمر نقية برائحة ينسونية زكية ونسبة عالية من زيت الأنيثول للاستخدامات الغذائية والصيدلانية.",
    },
    {
      id: "marjoram",
      name_en: "Nile Sweet Marjoram",
      name_ar: "بردقوش النيل الفاخر",
      latin: "Origanum majorana",
      image: "/images/product/Marjoram.jpg",
      oil: "1.8% Pure Essence",
      moisture: "< 7.5% Moisture",
      purity: "99.7% Clean Rubbed",
      region: isEn ? "Beni Suef Valley" : "وادي بني سويف",
      badge: isEn ? "Triple Optical Cleaned" : "مفروز ليزرياً 3 مراحل",
      description_en: "Delicate velvety leaves with sweet piney aroma, ideal for gourmet Mediterranean seasonings and herbal blends.",
      description_ar: "أوراق مخملية عطرة بنكهة دافئة مميزة لتوابل المطبخ المتوسطي وتوليفات الأعشاب الصحية.",
    },
  ];

  const [activeSpecimenIndex, setActiveSpecimenIndex] = useState(0);
  const activeSpecimen = heroSpecimens[activeSpecimenIndex];

  // Auto-rotate hero specimen
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpecimenIndex((prev) => (prev + 1) % heroSpecimens.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSpecimens.length]);

  // Video State
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (!introVideoRef.current) return;
    if (isVideoPlaying) {
      introVideoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      introVideoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  // Process timeline active step
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  // Interactive B2B RFQ Calculator State
  const [rfqProduct, setRfqProduct] = useState("Organic Dried Basil");
  const [rfqGrade, setRfqGrade] = useState("Certified Organic (USDA / EU)");
  const [rfqQuantity, setRfqQuantity] = useState("1 - 5 Metric Tons");
  const [rfqPackaging, setRfqPackaging] = useState("20kg Multi-Ply Kraft Paper Sacks");
  const [rfqPort, setRfqPort] = useState("CIF Europe (Rotterdam/Hamburg)");

  const rfqWhatsAppMessage = useMemo(() => {
    const text = `Hello Green Globe Herbs, I would like to request a formal B2B quotation:\n\n• Product: ${rfqProduct}\n• Quality Grade: ${rfqGrade}\n• Volume: ${rfqQuantity}\n• Packaging: ${rfqPackaging}\n• Destination: ${rfqPort}\n\nPlease share your current FOB/CIF pricing, Certificate of Analysis (COA), and lead times.`;
    return encodeURIComponent(text);
  }, [rfqProduct, rfqGrade, rfqQuantity, rfqPackaging, rfqPort]);

  // Products from API
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials]         = useState<any[]>([]);
  const [navCategories, setNavCategories]       = useState<any[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>("all");
  const [formStatus, setFormStatus]             = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData]                 = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const defaultMockProducts: Product[] = [
    {
      id: 101,
      name_en: "Organic Dried Basil Leaves",
      name_ar: "أوراق ريحان عضوي مجفف",
      short_description_en: "Egyptian sweet basil (Ocimum basilicum), optical-sorted and steam-sterilized with >1.8% essential oil.",
      short_description_ar: "ريحان مصري حلو مفروز ضوئياً ومعقم بالبخار بنسبة زيوت عطرية تتجاوز 1.8%.",
      image: "/images/product/BASIL.jpg",
      category: { name_en: "Herbs", name_ar: "أعشاب", slug: "herbs" }
    },
    {
      id: 102,
      name_en: "Peppermint Leaves (Crushed / T.B.C.)",
      name_ar: "أوراق نعناع فلفلي (مجروش وتفل شاي)",
      short_description_en: "Pure Mentha piperita from Nile alluvial soil with rich menthol aroma for gourmet infusions and blends.",
      short_description_ar: "نعناع فلفلي نقي من دلتا النيل برائحة منثول نفاذة لتوليفات الشاي الفاخر ومستحضرات الأعشاب.",
      image: "/assets/images/spice1.jpg",
      category: { name_en: "Herbs", name_ar: "أعشاب", slug: "herbs" }
    },
    {
      id: 103,
      name_en: "Egyptian Chamomile Flowers (Whole Heads)",
      name_ar: "أزهار البابونج المصري (رؤوس كاملة)",
      short_description_en: "Hand-picked golden blossoms with 95% intact heads, high apigenin and calming aromatic attributes.",
      short_description_ar: "أزهار ذهبية مجمعة يدوياً برؤوس سليمة تفوق 95% وغنية بالأبيجينين للتهدئة والخلطات الصحية.",
      image: "/images/agriculture-healthy-food.jpg",
      category: { name_en: "Dried Flowers", name_ar: "زهور مجففة", slug: "dried-flowers" }
    },
    {
      id: 104,
      name_en: "Aswan Ruby Hibiscus (Whole Calyces)",
      name_ar: "كركديه أسواني ياقوتي (بتلات كاملة)",
      short_description_en: "Vibrant scarlet whole flowers packed with natural anthocyanins, sun-cured for specialty herbal teas.",
      short_description_ar: "زهور كركديه ياقوتية مجففة شمسياً وغنية بمضادات الأكسدة لأفخر توليفات الشاي والعصائر الطبيعية.",
      image: "/images/product/Hibiscus.jpg",
      category: { name_en: "Herbal Teas", name_ar: "شاي عشبي", slug: "herbal-teas" }
    },
    {
      id: 105,
      name_en: "Fennel Seeds (Export Grade A)",
      name_ar: "بذور الشمر (درجة تصدير أ)",
      short_description_en: "Naturally dried Foeniculum vulgare seeds with sweet aniseed nuance and high anethole purity.",
      short_description_ar: "بذور شمر مجففة طبيعياً بنكهة ينسونية حلوة ونقاء عالي لمركب الأنيثول.",
      image: "/images/product/Fennel.jpg",
      category: { name_en: "Seeds", name_ar: "بذور", slug: "seeds" }
    },
    {
      id: 106,
      name_en: "Sweet Marjoram Rubbed Leaves",
      name_ar: "أوراق البردقوش المنقى والمجروش",
      short_description_en: "Fragrant Origanum majorana harvested at peak diurnal hours, screened for superior aroma and color retention.",
      short_description_ar: "بردقوش بلدي عطري محصود بعناية ومفرز هوائياً للحفاظ على الزيوت الطيارة ولونه الأخضر الطبيعي.",
      image: "/images/product/Marjoram.jpg",
      category: { name_en: "Herbs", name_ar: "أعشاب", slug: "herbs" }
    },
    {
      id: 107,
      name_en: "Anise Seeds (Triple Optical Cleaned)",
      name_ar: "بذور الينسون (مفروزة ضوئياً 3 مراحل)",
      short_description_en: "Premium Egyptian Pimpinella anisum, world-famous for intense licorice flavor and medicinal purity.",
      short_description_ar: "ينسون مصري فاخر مشهور عالمياً بنكهته النفاذة ونقاوته العالية للاستخدامات الغذائية والدوائية.",
      image: "/images/product/Anise.jpg",
      category: { name_en: "Seeds", name_ar: "بذور", slug: "seeds" }
    },
    {
      id: 108,
      name_en: "Mediterranean Thyme Leaves",
      name_ar: "أوراق الزعتر المتوسطي الفاخر",
      short_description_en: "High-thymol dried wild thyme leaves, optical-sorted to strict European microbial limits.",
      short_description_ar: "أوراق زعتر بري غنية بالثيمول ومطابقة لأدق الاشتراطات الميكروبيولوجية للاتحاد الأوروبي.",
      image: "/images/product/Thyme.jpg",
      category: { name_en: "Herbs", name_ar: "أعشاب", slug: "herbs" }
    },
    {
      id: 109,
      name_en: "Aromatic Rosemary Needles",
      name_ar: "أوراق الروزماري (إكليل الجبل)",
      short_description_en: "Select cut and dried rosemary needles with pine-woody essence for seasoning and botanical extracts.",
      short_description_ar: "أوراق إكليل الجبل النقية برائحتها الخشبية العطرية لتتبيل الأغذية واستخلاص الزيوت.",
      image: "/images/product/Rosemary.jpg",
      category: { name_en: "Herbs", name_ar: "أعشاب", slug: "herbs" }
    }
  ];

  const fallbackTestimonials = useMemo(() => [
    {
      name: "Dr. Markus Schneider",
      role: isEn ? "Procurement Director • Kräuter & Tee GmbH (Germany)" : "مدير المشتريات • كرويتر أند تي ذ.م.م (ألمانيا)",
      text_en: "Green Globe Herbs has been our trusted Egyptian botanical supplier for over 5 years. Their peppermint and chamomile consistently meet the strictest EU pesticide limits, and ocean freight logistics are always on point.",
      text_ar: "جرين جلوب للأعشاب شريكنا الاستراتيجي في مصر منذ أكثر من 5 سنوات. جودة النعناع والبابونج مطابقة دائماً لأدق معايير الاتحاد الأوروبي مع التزام تام بمواعيد الشحن البحري.",
    },
    {
      name: "Elena Rostova",
      role: isEn ? "Head of Sourcing • Nordic Infusions (Poland)" : "رئيسة التوريدات • نورديك إنفيوجنز (بولندا)",
      text_en: "The essential oil content in their sweet basil and fennel seeds is extraordinary. Every shipment comes accompanied with exhaustive COA and microbiology reports. A truly world-class export operation.",
      text_ar: "نسبة الزيوت الطيارة في الريحان والشمر لديهم استثنائية جداً. كل شحنة تصل مصحوبة بشهادات التحليل المخبري والميكروبي المعتمدة. تعامل احترافي عالمي بكل المقاييس.",
    },
    {
      name: "Tariq Al-Mansoor",
      role: isEn ? "VP of Supply Chain • Royal Botanical Blends (UAE)" : "نائب رئيس سلاسل الإمداد • رويال بليندز للأعشاب (الإمارات)",
      text_en: "Fast customs clearance support, pristine packaging in multi-ply kraft sacks, and outstanding hibiscus flower calyces. Green Globe Herbs represents the gold standard of Egyptian agricultural exports.",
      text_ar: "دعم سريع في التخليص الجمركي وتعبئة فائقة الجودة في أكياس كرافت متعددة الطبقات وزهور كركديه ياقوتية فاخرة. جرين جلوب تمثل المعيار الذهبي للصادرات الزراعية المصرية.",
    },
  ], [isEn]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchTestimonials();
    fetchCategories();
  }, [language]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        setNavCategories(
          data
            .filter((c: any) => c.is_active !== false)
            .map((c: any) => ({
              id: c.id ?? c._id,
              order: c.order ?? 0,
              slug: c.slug,
              label: isEn ? c.name_en : c.name_ar,
            }))
            .sort((a: any, b: any) => a.order - b.order)
        );
      }
    } catch {}
  };

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials");
      const data = res.data?.data || res.data || [];
      setTestimonials(Array.isArray(data) && data.length > 0 ? data : fallbackTestimonials);
    } catch {
      setTestimonials(fallbackTestimonials);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const res = await api.get("/products");
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setFeaturedProducts(data.slice(0, 9));
      } else {
        setFeaturedProducts(defaultMockProducts);
      }
    } catch {
      setFeaturedProducts(defaultMockProducts);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await api.post('/messages', formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const filteredProducts = activeCategorySlug === "all"
    ? featuredProducts
    : featuredProducts.filter((p) => {
        const catSlug = p.category?.slug?.toLowerCase();
        const catName = p.category?.name_en?.toLowerCase();
        return catSlug === activeCategorySlug.toLowerCase() || catName === activeCategorySlug.toLowerCase();
      });

  const stats = [
    { value: 25,  suffix: "+", label: isEn ? "Years Agricultural Heritage"  : "عاماً من التراث الزراعي"  },
    { value: 50,  suffix: "+", label: isEn ? "Global Export Markets"       : "سوقاً دولياً نصدر إليه" },
    { value: 500, suffix: "+", label: isEn ? "Certified Botanical Crops"    : "صنف نباتي معتمد للتصدير"    },
    { value: 100, suffix: "%", label: isEn ? "International QC Compliance" : "مطابقة لمعايير الجودة الدولية" },
  ];

  // 6 Core Organic Pillars with Modern Technical Specs
  const modernOrganicBenefits = [
    {
      icon: FaSeedling,
      chip: isEn ? "Soil Purity" : "نقاء التربة",
      title: isEn ? "Naturally Regenerative Cultivation" : "زراعة طبيعية متجددة",
      desc: isEn
        ? "Grown in nutrient-dense Egyptian Nile basin soil without synthetic pesticides, fungicides, or synthetic fertilizers."
        : "تزرع في تربة طمي النيل الغنية بالمعادن بدون أي مبيدات أو مخصبات صناعية أو تعديل وراثي.",
      metric: isEn ? "0.0% Chemical Residues" : "0.0% متبقيات كيميائية",
    },
    {
      icon: FiShield,
      chip: isEn ? "Certification" : "شهادات الجودة",
      title: isEn ? "Dual USDA & EU Organic Certified" : "اعتماد عضوي أمريكي وأوروبي",
      desc: isEn
        ? "Each cultivation batch is fully audited and certified in accordance with USDA NOP and European Union organic regulations."
        : "كل محصول خاضع للرقابة ومطابق للوائح الزراعة العضوية لوزارة الزراعة الأمريكية والاتحاد الأوروبي.",
      metric: isEn ? "Full Lot Traceability" : "تتبع كامل للتشغيلات",
    },
    {
      icon: FaLeaf,
      chip: isEn ? "Potency" : "التركيز والفاعلية",
      title: isEn ? "Peak Essential Oil Yields" : "أعلى تركيز للزيوت العطرية",
      desc: isEn
        ? "Timed harvesting during peak diurnal sun hours ensures maximum essential oil concentration, aroma, and therapeutic value."
        : "حصاد دقيق في أوقات سطوع الشمس المثالية لضمان أعلى نسبة للمركبات النشطة والزيوت الطيارة.",
      metric: isEn ? ">1.8% - 2.5% Volatile Oils" : ">1.8% - 2.5% زيوت طيارة",
    },
    {
      icon: FiGlobe,
      chip: isEn ? "Eco-Friendly" : "صديق للبيئة",
      title: isEn ? "Sustainable Nile Basin Irrigation" : "ري مستدام بمياه النيل",
      desc: isEn
        ? "Carefully monitored drip irrigation and solar-assisted dehydration protect regional water reservoirs and reduce emissions."
        : "شبكات ري بالتنقيط وتجفيف نظيف يحافظ على الموارد المائية ويقلل الانبعاثات الكربونية.",
      metric: isEn ? "Solar Dehydration Cleaned" : "تجفيف نظيف بالطاقة الشمسية",
    },
    {
      icon: FiLayers,
      chip: isEn ? "Processing" : "معالجة متقدمة",
      title: isEn ? "Multi-Stage Optical Sorting" : "فرز ليزري ضوئي متعدد المراحل",
      desc: isEn
        ? "Modern hygienic facility equipped with laser color-sorters, vibrating gravity tables, and magnetic metal separators."
        : "خطوط معالجة آلية متطورة مزودة بفرز ليزري وفواصل مغناطيسية وغرابيل هوائية دقيقة.",
      metric: isEn ? "99.8% Physical Purity" : "99.8% نقاء فيزيائي",
    },
    {
      icon: FiTruck,
      chip: isEn ? "Global Freight" : "شحن دولي",
      title: isEn ? "Hermetic Container Packing" : "تغليف محكم لحاويات التصدير",
      desc: isEn
        ? "Multi-wall moisture-barrier kraft paper sacks and PP bags with food-grade inner liners for extended oceanic transit."
        : "أكياس كرافت متعددة الطبقات عازلة للرطوبة وبطانات غذائية محكمة تتحمل الرحلات البحرية الطويلة.",
      metric: isEn ? "<8.0% Standard Moisture" : "<8.0% نسبة الرطوبة",
    },
  ];

  // 5-Step Pipeline with Detailed Technical Data
  const interactivePipeline = [
    {
      step: "01",
      title: isEn ? "Direct Farm Partnership" : "شراكة المزارع المباشرة",
      subtitle: isEn ? "Beni Suef Cultivation" : "زراعة بمحافظة بني سويف",
      details: isEn
        ? "Long-term contract farming with certified Egyptian growers. We provide verified organic non-GMO seed stock, supervise soil biology, and maintain batch origin logs."
        : "عقود زراعية مباشرة مع مزارعين معتمدين. نوفر بذوراً عضوية غير معدلة وراثياً، ونشرف على خصوبة التربة وسجلات التتبع الحقلي.",
      kpis: [isEn ? "100% Non-GMO Seeds" : "بذور غير معدلة وراثياً", isEn ? "Direct Agronomic Supervision" : "إشراف زراعي مباشر"],
    },
    {
      step: "02",
      title: isEn ? "GC-MS & Microbial Lab Testing" : "الفحص المعملي والكروماتوغرافي",
      subtitle: isEn ? "Pre-Processing Clearance" : "فحص دقيق قبل التشغيل",
      details: isEn
        ? "Every incoming lot undergoes rigorous laboratory analysis: gas chromatography (GC-MS) for volatile oil profiling, zero pesticide testing, and microbial safety."
        : "تخضع كل شحنة لتحاليل معملية متطورة للغاز الكروماتوغرافي (GC-MS) لتحديد نسب الزيوت العطرية، مع فحص خلو المبيدات والسلامة الميكروبية.",
      kpis: [isEn ? "Gas Chromatography Verified" : "تحليل كروماتوغرافي معتمد", isEn ? "Zero Pesticide Guarantee" : "ضمان خلو تام من المبيدات"],
    },
    {
      step: "03",
      title: isEn ? "Precision Optical & Air Cleaning" : "الفرز الضوئي والتنقية الهوائية",
      subtitle: isEn ? "Automated Sizing & Sorting" : "فرز وغربلة آلية متقدمة",
      details: isEn
        ? "Processed in our automated hygienic facility using gentle vibratory sieves, high-speed optical color sorters, and de-stoners to isolate pristine leaves and seeds."
        : "تتم المعالجة داخل خطوط إنتاج حديثة ومغلقة باستخدام فرز ضوئي عالي السرعة وفواصل كهرومغناطيسية لعزل الشوائب بدقة متناهية.",
      kpis: [isEn ? "99.8% Target Purity" : "99.8% نسبة النقاء المستهدفة", isEn ? "Custom Mesh Calibration" : "معايرة دقيقة لحجم الحبيبات"],
    },
    {
      step: "04",
      title: isEn ? "Multi-Barrier Export Packing" : "التعبئة التصديرية المعزولة",
      subtitle: isEn ? "Moisture & Aroma Lock" : "حماية كاملة للرطوبة والنكهة",
      details: isEn
        ? "Packed in food-grade multi-wall kraft paper sacks, poly-lined woven bags, or corrugated master cartons with oxygen/moisture desiccants and tamper-evident labeling."
        : "تعبئة في أكياس كرافت غذائية متعددة الطبقات أو أكياس بولي بروبلين مبطنة بكراتين شحن قوية مع أختام تتبع مقاومة للتلاعب.",
      kpis: [isEn ? "Moisture Barrier Liners" : "بطانات عازلة للرطوبة", isEn ? "Private Label Ready" : "جاهز للعلامات الخاصة"],
    },
    {
      step: "05",
      title: isEn ? "Phytosanitary & Port Logistics" : "الفحص الصحي واللوجستيات",
      subtitle: isEn ? "Alexandria & Damietta Sea Ports" : "شحن عبر موانئ الإسكندرية ودمياط",
      details: isEn
        ? "Official Egyptian Phytosanitary inspection, fumigation certification, Bill of Lading, Certificate of Origin, and express ocean container dispatch worldwide."
        : "استخراج الشهادات الصحية النباتية المعتمدة، وشهادات التبخير، وشهادة المنشأ الرسمية، مع تنسيق كامل لشحن الحاويات المبردة والجافة.",
      kpis: [isEn ? "Full Shipping Dossier" : "ملف تصديري متكامل", isEn ? "FOB / CIF Global Terms" : "شروط توريد FOB و CIF"],
    },
  ];

  return (
    <Layout title={t.home.heroTitle}>

      {/* ══════════════════════════════════════════════════════
          §1  HERO — Ultra-Modern B2B Botanical Luxury
      ════════════════════════════════════════════════════ */}
      <section className={`relative min-h-[94vh] flex items-center justify-center overflow-hidden bg-[#07130E] text-white pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 ${isEn ? "" : "rtl"}`}>
        
        {/* Ambient Botanical Mesh Glows & Architectural Grid Texture */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Orb className="w-[600px] h-[600px] bg-secondary/20 top-[-100px] left-[-100px]" />
          <Orb className="w-[700px] h-[700px] bg-primary/25 bottom-[-150px] right-[-100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(76,175,80,0.22),rgba(255,255,255,0))]" />
          {/* Modern Subtle High-Tech Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07130E]/60 to-[#07130E]" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Bold Typography & Dual CTA Dock */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Live Export Status Pill */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/15 shadow-xl mb-6 ring-1 ring-emerald-400/20"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                <span className="font-label-sm text-[11px] tracking-[0.2em] uppercase font-bold text-emerald-300">
                  {isEn ? "Direct Egypt Nile Harvest 2026/2027 • Bulk Export Active" : "محصول وادي النيل 2026/2027 • تصدير الحاويات بالجملة متاح الآن"}
                </span>
              </motion.div>

              {/* Main Headline with Modern Gradient Tone */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-headline-lg text-[40px] sm:text-[56px] lg:text-[68px] font-extrabold tracking-tight leading-[1.08] mb-6 text-white"
              >
                {isEn ? (
                  <>
                    Pure Organic Botanicals, <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                      Cultivated for Global Quality.
                    </span>
                  </>
                ) : (
                  <>
                    أعشاب ونباتات طبية فاخرة، <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                      مُنتقاة ومجهزة لأسواق العالم.
                    </span>
                  </>
                )}
              </motion.h1>

              {/* High-Impact Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/85 text-[17px] sm:text-[19px] leading-relaxed max-w-2xl mb-8 font-body-lg"
              >
                {isEn
                  ? "Green Globe Herbs exports certified organic medicinal herbs, spices, and seeds worldwide directly from our sustainable Nile basin farms in Beni Suef, Egypt."
                  : "شركة جرين جلوب للأعشاب تصدر أجود الأعشاب الطبية والبهارات والبذور العضوية المعتمدة دولياً مباشرة من مزارع حوض النيل في بني سويف، مصر إلى موانئ العالم."}
              </motion.p>

              {/* Trust Metric Chips Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 mb-10 text-xs font-semibold"
              >
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-2">
                  <FiCheck className="text-[#25D366] w-4 h-4" />
                  <span>ISO 22000 & HACCP</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-2">
                  <FiCheck className="text-[#25D366] w-4 h-4" />
                  <span>USDA & EU Organic</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-2">
                  <FiCheck className="text-[#25D366] w-4 h-4" />
                  <span>99.8% GC-MS Tested Purity</span>
                </div>
              </motion.div>

              {/* Dual Action Dock */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
              >
                <a
                  href="#rfq-calculator"
                  className="btn-shine inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-label-sm text-[13px] font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-2xl border border-white/20 w-full sm:w-auto"
                >
                  <FiSliders className="w-4 h-4" />
                  <span>{isEn ? "Interactive RFQ Tool" : "أداة التسعير الفوري"}</span>
                  <FiArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/201278201346?text=${encodeURIComponent("Hello Green Globe Herbs, I would like to inquire about your bulk export botanical catalog.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-glow inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-label-sm text-[13px] font-bold uppercase tracking-wider transition-all shadow-xl w-full sm:w-auto"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span>{isEn ? "WhatsApp Export Desk" : "واتساب المبيعات المباشر"}</span>
                </a>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-label-sm text-[12px] font-bold uppercase tracking-wider transition-all border border-white/20 backdrop-blur-md w-full sm:w-auto"
                >
                  <span>{isEn ? "Catalog" : "الكتالوج"}</span>
                </Link>
              </motion.div>

            </div>

            {/* Right Column: Live Botanical Harvest Specimen Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative rounded-[36px] p-6 sm:p-7 bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/10"
              >
                {/* Header Switcher Buttons */}
                <div className="pb-4 border-b border-white/15 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                      <span className="font-label-sm text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                        {isEn ? "Live Harvest Specimen Card" : "بطاقة المواصفات الحقلية الفورية"}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/60 font-mono">
                      0{activeSpecimenIndex + 1} / 0{heroSpecimens.length}
                    </span>
                  </div>

                  {/* Horizontal Scrollable Crop Selector Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {heroSpecimens.map((spec, i) => (
                      <button
                        key={spec.id}
                        onClick={() => setActiveSpecimenIndex(i)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider whitespace-nowrap transition-all ${
                          activeSpecimenIndex === i
                            ? "bg-secondary text-white shadow-md border border-white/30 scale-105"
                            : "bg-white/10 text-white/70 hover:bg-white/20 border border-transparent"
                        }`}
                      >
                        {isEn ? spec.name_en.split(" ")[spec.name_en.split(" ").length - 1] : spec.name_ar.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specimen Visual & Badges */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpecimen.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-inner border border-white/20 bg-black/40">
                      <img
                        src={activeSpecimen.image}
                        alt={activeSpecimen.name_en}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2E7D32]/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        {activeSpecimen.badge}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="font-headline-sm text-[20px] font-bold leading-tight">
                          {isEn ? activeSpecimen.name_en : activeSpecimen.name_ar}
                        </div>
                        <div className="text-xs text-emerald-300 italic font-serif">
                          {activeSpecimen.latin}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed min-h-[36px]">
                      {isEn ? activeSpecimen.description_en : activeSpecimen.description_ar}
                    </p>

                    {/* Specimen Live Metric Chips */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                        <div className="text-[10px] uppercase font-bold text-white/60">{isEn ? "Oil Yield" : "الزيت الطيار"}</div>
                        <div className="font-bold text-xs text-emerald-300 mt-0.5">{activeSpecimen.oil}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                        <div className="text-[10px] uppercase font-bold text-white/60">{isEn ? "Purity" : "النقاء"}</div>
                        <div className="font-bold text-xs text-emerald-300 mt-0.5">{activeSpecimen.purity}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                        <div className="text-[10px] uppercase font-bold text-white/60">{isEn ? "Moisture" : "الرطوبة"}</div>
                        <div className="font-bold text-xs text-emerald-300 mt-0.5">{activeSpecimen.moisture}</div>
                      </div>
                    </div>

                    {/* Quick Inquiry on Active Crop */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-white/70 flex items-center gap-1.5">
                        <FiMapPin className="text-secondary w-3.5 h-3.5" />
                        <span>{activeSpecimen.region}</span>
                      </span>

                      <a
                        href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello! I'd like to request a specification sheet and quotation for ${activeSpecimen.name_en} (${activeSpecimen.latin}).`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-4 rounded-full bg-secondary hover:bg-primary text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                        <span>{isEn ? "Inquire Batch" : "طلب تسعير الدفعة"}</span>
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  INFINITE RUNNING MARQUEE TICKER (Ultra-Modern Touch)
      ════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-primary py-4 overflow-hidden text-white border-y border-white/10 shadow-lg">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-12 font-label-sm text-[12px] font-bold uppercase tracking-[0.25em]">
          <span className="flex items-center gap-3">🌱 100% Certified Organic Harvest</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">🔬 ISO 22000 & HACCP Certified Lab</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">🚢 Bulk Ocean Container Logistics (FCL/LCL)</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">📦 Private Label & Multi-Wall Kraft Packing</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">🇪🇬 Directly Rooted in Beni Suef, Egypt</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">✨ 0.0% Synthetic Chemicals or Pesticides</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">🌍 Exporting Worldwide to 50+ Nations</span>
          <span className="text-white/40">•</span>
          {/* Duplicate for seamless infinite loop */}
          <span className="flex items-center gap-3">🌱 100% Certified Organic Harvest</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">🔬 ISO 22000 & HACCP Certified Lab</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">🚢 Bulk Ocean Container Logistics (FCL/LCL)</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">📦 Private Label & Multi-Wall Kraft Packing</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-3">🇪🇬 Directly Rooted in Beni Suef, Egypt</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  STATS BAR — Trust & Global Reach Counters
      ════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-surface-container/40 border-b border-outline-variant/30 py-14 overflow-hidden">
        <Orb className="w-[600px] h-[600px] bg-secondary/10 -top-60 left-1/2 -translate-x-1/2" />
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="px-6 py-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-md text-center hover:-translate-y-2 transition-all duration-300">
                  <div className="font-headline-lg text-[40px] md:text-[50px] font-extrabold text-primary mb-2">
                    <CountUp target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest font-bold">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  INTERACTIVE BENTO GRID: GREEN GLOBE ECOSYSTEM
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-24 lg:py-36 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 top-20 -left-40" />
        <Orb className="w-[500px] h-[500px] bg-primary/10 bottom-20 -right-40" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "The Botanical Infrastructure" : "البنية التحتية الزراعية الفاخرة"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[52px] font-bold text-primary tracking-tight mb-4">
              {isEn ? "Rooted in Egypt, Built for the World" : "جذور في أرض مصر، ومعايير تلبي متطلبات العالم"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              {isEn
                ? "From the mineral-rich soils of Beni Suef to state-of-the-art optical laser sorting, discover how Green Globe Herbs guarantees purity across every metric."
                : "من تربة بني سويف الطميية الخصبة إلى أحدث خطوط الفرز الضوئي والتعقيم، اكتشف كيف نضمن أعلى درجات النقاء في كل شحنة."}
            </p>
          </Reveal>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Bento Card 1: Live Cinematic Farm Film (8 Columns) */}
            <div className="lg:col-span-8">
              <Reveal>
                <div className="relative rounded-[36px] overflow-hidden shadow-2xl border border-white/50 dark:border-white/10 group aspect-[16/10] bg-black">
                  <video
                    ref={introVideoRef}
                    src="/assets/videos/intro.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={toggleVideo}
                    className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-secondary text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg"
                    aria-label={isVideoPlaying ? "Pause Video" : "Play Video"}
                  >
                    {isVideoPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="absolute bottom-6 left-6 right-6 z-20 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
                        📍 {isEn ? "Sumusta Al Waqf, Beni Suef" : "سمسطا الوقف، بني سويف"}
                      </div>
                      <h3 className="font-headline-sm text-[22px] sm:text-[26px] font-bold">
                        {isEn ? "Sustainable Nile Basin Cultivation" : "الزراعة المستدامة في حوض النيل"}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 max-w-lg mt-1">
                        {isEn ? "Microclimate excellence producing naturally elevated essential oil profiles." : "مناخ مثالي يمنح النباتات أعلى تركيز طبيعي للزيوت العطرية والنقاء."}
                      </p>
                    </div>

                    <Link
                      href="/about"
                      className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30 transition-all shrink-0 self-start sm:self-auto"
                    >
                      {isEn ? "Our Story →" : "قصتنا ←"}
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Bento Card 2: Lab Analytical Metrics (4 Columns) */}
            <div className="lg:col-span-4">
              <Reveal delay={0.1}>
                <div className="h-full rounded-[36px] p-8 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-6 shadow-inner">
                      <FiShield className="w-6 h-6" />
                    </div>
                    <span className="font-label-sm text-[11px] font-bold uppercase tracking-widest text-secondary block mb-1">
                      {isEn ? "Lab Analysis Guarantee" : "ضمان الفحص المعملي"}
                    </span>
                    <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-6">
                      {isEn ? "Stringent Purity Tolerances" : "أعلى معايير النقاء الكيميائي"}
                    </h3>

                    <div className="space-y-4">
                      {/* Metric 1 */}
                      <div className="p-4 rounded-2xl bg-surface/70 border border-outline-variant/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-on-surface-variant font-medium">{isEn ? "Physical Botanical Purity" : "النقاء النباتي الفيزيائي"}</span>
                          <span className="text-base font-bold text-primary">99.8%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 w-[99.8%]" />
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="p-4 rounded-2xl bg-surface/70 border border-outline-variant/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-on-surface-variant font-medium">{isEn ? "Synthetic Chemical Residues" : "المتبقيات الكيميائية"}</span>
                          <span className="text-xs font-bold text-secondary bg-secondary/15 px-2.5 py-1 rounded-full">0.0% Non-Detected</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-secondary to-emerald-400 w-full" />
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="p-4 rounded-2xl bg-surface/70 border border-outline-variant/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-on-surface-variant font-medium">{isEn ? "Moisture Threshold" : "الحد الأقصى للرطوبة"}</span>
                          <span className="text-base font-bold text-primary">&lt; 7.5% Max</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 w-[75%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/20 text-xs text-on-surface-variant mt-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0" />
                    <span>{isEn ? "Every export batch accompanied by certified COA & Phytosanitary dossier." : "كل شحنة تصديرية مصحوبة بشهادة تحليل معملية COA وشهادة صحية رسمية."}</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Bento Card 3: International Certifications Strip (6 Columns) */}
            <div className="lg:col-span-6">
              <Reveal delay={0.2}>
                <div className="p-8 rounded-[36px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl h-full flex flex-col justify-between">
                  <div>
                    <span className="font-label-sm text-[11px] font-bold uppercase tracking-widest text-secondary block mb-1">
                      {isEn ? "Global Compliance" : "الاعتماد الدولي"}
                    </span>
                    <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-4">
                      {isEn ? "Certified to Strict Global Standards" : "معتمدون وفق أرفع المعايير العالمية"}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                      {isEn
                        ? "Our processing and agricultural networks operate strictly under internationally benchmarked food safety frameworks."
                        : "تدار منشآتنا ومزارعنا وفق أحدث أنظمة سلامة الغذاء وإمكانية التتبع المعترف بها دولياً."}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-secondary/50 transition-colors">
                        <div className="font-bold text-sm text-primary">ISO 22000</div>
                        <div className="text-[10px] text-on-surface-variant mt-0.5">Food Safety</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-secondary/50 transition-colors">
                        <div className="font-bold text-sm text-primary">HACCP</div>
                        <div className="text-[10px] text-on-surface-variant mt-0.5">Hazard Control</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-secondary/50 transition-colors">
                        <div className="font-bold text-sm text-primary">USDA Org</div>
                        <div className="text-[10px] text-on-surface-variant mt-0.5">NOP Verified</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-secondary/50 transition-colors">
                        <div className="font-bold text-sm text-primary">EU Organic</div>
                        <div className="text-[10px] text-on-surface-variant mt-0.5">Reg. 2018/848</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant font-medium">
                      {isEn ? "View all accreditation documents" : "عرض جميع وثائق الاعتماد"}
                    </span>
                    <Link href="/certificates" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                      <span>{isEn ? "Certificates Page" : "صفحة الشهادات"}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Bento Card 4: Global Ocean & Air Dispatch (6 Columns) */}
            <div className="lg:col-span-6">
              <Reveal delay={0.25}>
                <div className="p-8 rounded-[36px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl h-full flex flex-col justify-between">
                  <div>
                    <span className="font-label-sm text-[11px] font-bold uppercase tracking-widest text-secondary block mb-1">
                      {isEn ? "Logistics Advantage" : "الميزة اللوجستية"}
                    </span>
                    <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-4">
                      {isEn ? "Direct Ocean Port Despatch (Alexandria / Damietta)" : "شحن مباشر عبر موانئ الإسكندرية ودمياط"}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                      {isEn
                        ? "Proximity to key Egyptian maritime ports enables swift sailing times to Europe (7-12 days), the Gulf (5-9 days), and the Americas (18-24 days)."
                        : "قربنا الجغرافي من الموانئ البحرية الكبرى يضمن سرعة الإبحار إلى أوروبا والخليج والأمريكتين بأقل تكاليف شحن."}
                    </p>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-secondary/50 transition-colors">
                        <div className="text-[11px] text-on-surface-variant font-bold uppercase">{isEn ? "Europe" : "أوروبا"}</div>
                        <div className="text-xs font-bold text-secondary mt-1">7 - 12 Days</div>
                        <div className="text-[9px] text-on-surface-variant/80 mt-0.5">Rotterdam / Hamburg</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-secondary/50 transition-colors">
                        <div className="text-[11px] text-on-surface-variant font-bold uppercase">{isEn ? "Gulf & ME" : "الخليج"}</div>
                        <div className="text-xs font-bold text-secondary mt-1">5 - 9 Days</div>
                        <div className="text-[9px] text-on-surface-variant/80 mt-0.5">Jebel Ali / Jeddah</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 hover:border-secondary/50 transition-colors">
                        <div className="text-[11px] text-on-surface-variant font-bold uppercase">{isEn ? "Americas" : "الأمريكتان"}</div>
                        <div className="text-xs font-bold text-secondary mt-1">18 - 24 Days</div>
                        <div className="text-[9px] text-on-surface-variant/80 mt-0.5">New York / Montreal</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant font-medium">
                      {isEn ? "Explore destination ports" : "استكشف وجهات التصدير"}
                    </span>
                    <Link href="/export" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
                      <span>{isEn ? "Export Destinations" : "وجهات الشحن"}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  THE 6 CORE ORGANIC BENEFITS CARDS (Modernized)
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-24 lg:py-36 overflow-hidden bg-surface-container-low/50 border-y border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/15 top-1/2 -right-40 -translate-y-1/2" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "Purity, Health & Sustainability" : "النقاء والصحة والاستدامة"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight mb-4">
              {isEn ? "Our 6 Pillars of Organic Excellence" : "ركائزنا الست للتميز العضوي"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              {isEn
                ? "Every shipment reflects our rigorous commitment to soil regeneration, pharmaceutical purity, and ecological balance."
                : "كل شحنة تعكس التزامنا الصارم بخصوبة التربة، والنقاء الدوائي، والتوازن البيئي المستدام."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modernOrganicBenefits.map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <div className="p-8 rounded-[36px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 hover:border-secondary/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-surface-container text-primary border border-outline-variant/30">
                      {item.chip}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-[20px] font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="font-body-sm text-[14px] text-on-surface-variant leading-relaxed mb-6 flex-1">
                    {item.desc}
                  </p>

                  <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs font-bold text-secondary">
                    <span>✨ {item.metric}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §6  INTERACTIVE B2B RFQ CALCULATOR (State-of-the-Art UX)
      ════════════════════════════════════════════════════ */}
      <section id="rfq-calculator" className={`relative w-full py-24 lg:py-36 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-primary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "Interactive B2B Quotation Builder" : "أداة بناء عروض الأسعار التفاعلية B2B"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight mb-4">
              {isEn ? "Configure Your Bulk Shipment RFQ" : "خصص مواصفات شحنتك التصديرية"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              {isEn
                ? "Select your target crop, quality grade, quantity, and destination to instantly generate a formal quotation inquiry."
                : "حدد المحصول المستهدف، ودرجة الجودة، والكمية، وميناء الوصول لتوليد طلب تسعير فوري ومباشر."}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[40px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl p-8 sm:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                
                {/* Selectors Column (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Product Selector */}
                  <div>
                    <label className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">
                      1. {isEn ? "Select Botanical Item" : "اختر المحصول المطلوب"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        "Organic Dried Basil",
                        "Peppermint Leaves",
                        "Egyptian Chamomile",
                        "Aswan Ruby Hibiscus",
                        "Fennel Seeds",
                        "Sweet Marjoram",
                        "Anise Seeds",
                        "Thyme / Rosemary",
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setRfqProduct(item)}
                          className={`p-3 rounded-2xl text-xs font-bold text-center transition-all ${
                            rfqProduct === item
                              ? "bg-primary text-white shadow-md border-primary scale-[1.02]"
                              : "bg-surface-container/50 hover:bg-surface-container text-on-surface-variant border border-outline-variant/30"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grade Selector */}
                  <div>
                    <label className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">
                      2. {isEn ? "Quality & Organic Certification Grade" : "رتبة الجودة والشهادة العضوية"}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Certified Organic (USDA / EU)",
                        "Conventional Export Grade A",
                        "Steam-Sterilized Micro-Cleaned",
                        "Custom Specification / Private Label",
                      ].map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setRfqGrade(grade)}
                          className={`p-3 rounded-2xl text-xs font-bold text-center transition-all ${
                            rfqGrade === grade
                              ? "bg-secondary text-white shadow-md border-secondary"
                              : "bg-surface-container/50 hover:bg-surface-container text-on-surface-variant border border-outline-variant/30"
                          }`}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Volume */}
                  <div>
                    <label className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">
                      3. {isEn ? "Estimated Volume Required" : "الكمية التقديرية المطلوبة"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        "500 KG Trial",
                        "1 - 5 Metric Tons",
                        "20ft FCL Container",
                        "40ft FCL Container",
                      ].map((qty) => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setRfqQuantity(qty)}
                          className={`p-3 rounded-2xl text-xs font-bold text-center transition-all ${
                            rfqQuantity === qty
                              ? "bg-primary text-white shadow-md border-primary"
                              : "bg-surface-container/50 hover:bg-surface-container text-on-surface-variant border border-outline-variant/30"
                          }`}
                        >
                          {qty}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Packaging & Incoterms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">
                        4. {isEn ? "Export Packaging" : "نوع التعبئة والتغليف"}
                      </label>
                      <select
                        value={rfqPackaging}
                        onChange={(e) => setRfqPackaging(e.target.value)}
                        className="w-full p-3.5 rounded-2xl bg-surface-container/50 border border-outline-variant/50 text-xs font-semibold text-primary outline-none focus:border-secondary"
                      >
                        <option value="20kg Multi-Ply Kraft Paper Sacks">20kg Multi-Ply Kraft Sacks</option>
                        <option value="25kg Woven Poly Bags (PP) with Liner">25kg Woven Poly Bags with Liner</option>
                        <option value="Custom Corrugated Master Cartons">Custom Corrugated Cartons</option>
                        <option value="Compacted Export Bales">Compacted Export Bales</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">
                        5. {isEn ? "Incoterm / Destination" : "شروط التسليم والوجهة"}
                      </label>
                      <select
                        value={rfqPort}
                        onChange={(e) => setRfqPort(e.target.value)}
                        className="w-full p-3.5 rounded-2xl bg-surface-container/50 border border-outline-variant/50 text-xs font-semibold text-primary outline-none focus:border-secondary"
                      >
                        <option value="CIF Europe (Rotterdam/Hamburg)">CIF Europe (Rotterdam / Hamburg)</option>
                        <option value="CIF North America (New York/Montreal)">CIF North America (NY / Montreal)</option>
                        <option value="CIF Middle East & Gulf (Jebel Ali/Jeddah)">CIF Gulf (Jebel Ali / Jeddah)</option>
                        <option value="CIF Asia (Singapore/Qingdao)">CIF Asia (Singapore / Qingdao)</option>
                        <option value="FOB Alexandria / Damietta Port">FOB Alexandria / Damietta Port</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Summary & Live Action Card (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border border-secondary/30 shadow-lg">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-6">
                      <span className="font-label-sm text-[11px] font-bold uppercase tracking-widest text-secondary">
                        {isEn ? "Live Specification Summary" : "ملخص الطلب المخصص"}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                    </div>

                    <div className="space-y-3.5 text-xs text-on-surface">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-medium">{isEn ? "Botanical:" : "المحصول:"}</span>
                        <span className="font-bold text-primary">{rfqProduct}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-medium">{isEn ? "Quality Grade:" : "الرتبة:"}</span>
                        <span className="font-bold text-secondary">{rfqGrade}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-medium">{isEn ? "Volume:" : "الكمية:"}</span>
                        <span className="font-bold text-primary">{rfqQuantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-medium">{isEn ? "Packaging:" : "التغليف:"}</span>
                        <span className="font-bold text-primary">{rfqPackaging}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-medium">{isEn ? "Destination:" : "الوجهة:"}</span>
                        <span className="font-bold text-primary">{rfqPort}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                        <span className="text-on-surface-variant font-medium">{isEn ? "Estimated Lead Time:" : "فترة التجهيز:"}</span>
                        <span className="font-bold text-secondary">5 - 8 Business Days</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <a
                      href={`https://wa.me/201278201346?text=${rfqWhatsAppMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-shine whatsapp-glow w-full py-4 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-label-sm text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      <span>{isEn ? "Generate WhatsApp RFQ" : "إرسال الطلب عبر واتساب فوراً"}</span>
                    </a>

                    <Link
                      href="/contact"
                      className="w-full py-3.5 rounded-full bg-white/80 dark:bg-white/10 hover:bg-primary hover:text-white text-primary font-label-sm text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-outline-variant/40 transition-all text-center"
                    >
                      <FiMail className="w-4 h-4" />
                      <span>{isEn ? "Send as Formal Email Inquiry" : "إرسال كطلب رسمي عبر البريد"}</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §7  FEATURED PRODUCTS CATALOG SHOWCASE
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-24 lg:py-36 overflow-hidden bg-surface-container-low/40 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 bottom-0 left-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
                <span className="w-5 h-px bg-secondary inline-block" />
                {isEn ? "Botanical Export Showcase" : "معرض المحاصيل التصديرية"}
              </span>
              <h2 className="font-headline-lg text-[36px] md:text-[48px] font-bold text-primary tracking-tight">
                {isEn ? "Featured Organic & Conventional Crops" : "منتجات ومحاصيل مختارة"}
              </h2>
            </div>
            
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-label-sm text-[12px] font-bold text-secondary hover:text-primary uppercase tracking-widest transition-colors shrink-0"
            >
              <span>{isEn ? "View Complete Catalog" : "عرض الكتالوج الكامل"}</span>
              <FiArrowRight />
            </Link>
          </Reveal>

          {/* Category Tabs */}
          <Reveal delay={0.06}>
            <div className="flex gap-2.5 mb-12 overflow-x-auto pb-3 flex-wrap scrollbar-hide">
              <button
                onClick={() => setActiveCategorySlug("all")}
                className={`px-6 py-3 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
                  activeCategorySlug === "all"
                    ? "bg-secondary text-white shadow-md"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary"
                }`}
              >
                {isEn ? "All Products" : "جميع المنتجات"}
              </button>
              
              {navCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategorySlug(cat.slug)}
                  className={`px-6 py-3 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
                    activeCategorySlug === cat.slug
                      ? "bg-secondary text-white shadow-md"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
            {filteredProducts.map((prod: any, idx: number) => {
              const prodName = isEn ? (prod.name_en || prod.name) : (prod.name_ar || prod.name || prod.name_en);
              const prodDesc = isEn ? (prod.short_description_en || prod.description_en || prod.description) : (prod.short_description_ar || prod.description_ar || prod.description);
              const catName = isEn ? (prod.category?.name_en || "Botanical") : (prod.category?.name_ar || "أعشاب");
              
              return (
                <Reveal key={prod._id || prod.id || idx} delay={idx * 0.06}>
                  <div className="group rounded-[32px] overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-secondary/50 transition-all duration-300 flex flex-col h-full">
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-dim">
                      {prod.image ? (
                        <img
                          src={getAssetUrl(prod.image)}
                          alt={prodName}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <FiPackage className="w-12 h-12" />
                        </div>
                      )}
                      <span className="absolute top-4 right-4 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/85 backdrop-blur-md text-white shadow-md">
                        {catName}
                      </span>
                    </div>

                    {/* Content Area */}
                    <div className="p-7 flex flex-col flex-1">
                      <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                        {prodName}
                      </h3>
                      <p className="font-body-sm text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed mb-6 flex-1">
                        {prodDesc}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 gap-3">
                        <Link
                          href={`/products/${prod._id || prod.id}`}
                          className="font-label-sm text-[12px] font-bold text-secondary group-hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-wider"
                        >
                          <span>{isEn ? "Specs & COA" : "المواصفات"}</span>
                          <FiArrowRight />
                        </Link>

                        <a
                          href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello! I'd like to request a quote for ${prodName}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-full bg-secondary/15 hover:bg-secondary text-secondary hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <FaWhatsapp className="w-3.5 h-3.5" />
                          <span>{isEn ? "Quick RFQ" : "تسعير"}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="btn-shine inline-flex items-center gap-3 px-10 py-4.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              <span>{isEn ? "Explore Complete Product Catalog" : "تصفح الكتالوج الكامل للأعشاب والبهارات"}</span>
              <FiArrowRight />
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §8  INTERACTIVE 5-STEP QUALITY PIPELINE (Animated)
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-24 lg:py-36 overflow-hidden bg-background border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 top-0 left-1/2 -translate-x-1/2" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "Farm to Port Assurance" : "رقابة محكمة من الحقل حتى الميناء"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight mb-4">
              {isEn ? "The 5-Step Export Quality Pipeline" : "مراحل ضبط الجودة الخمس للتصدير"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              {isEn
                ? "Click any stage to inspect the technical protocols and quality checkpoints applied to every export container."
                : "انقر على أي مرحلة لاستعراض البروتوكولات الفنية وفحوصات السلامة المطبقة على كل شحنة."}
            </p>
          </Reveal>

          {/* Interactive Step Switcher Header */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
              {interactivePipeline.map((p, idx) => (
                <button
                  key={p.step}
                  onClick={() => setActiveProcessStep(idx)}
                  className={`p-4 rounded-2xl text-left transition-all border ${
                    activeProcessStep === idx
                      ? "bg-primary text-white border-primary shadow-xl scale-[1.02]"
                      : "bg-surface-container/50 hover:bg-surface-container text-on-surface-variant border-outline-variant/30"
                  }`}
                >
                  <div className={`font-bold text-xs uppercase mb-1 ${activeProcessStep === idx ? "text-emerald-300" : "text-secondary"}`}>
                    Stage {p.step}
                  </div>
                  <div className="font-headline-sm text-sm font-bold line-clamp-1">
                    {p.title}
                  </div>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Active Step Detailed Showcase Box */}
          <Reveal delay={0.2}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProcessStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="rounded-[36px] p-8 sm:p-12 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary uppercase tracking-widest inline-block mb-3">
                      Stage {interactivePipeline[activeProcessStep].step}: {interactivePipeline[activeProcessStep].subtitle}
                    </span>
                    <h3 className="font-headline-lg text-[26px] sm:text-[34px] font-bold text-primary mb-4">
                      {interactivePipeline[activeProcessStep].title}
                    </h3>
                    <p className="text-on-surface-variant font-body-lg text-[16px] leading-relaxed mb-6">
                      {interactivePipeline[activeProcessStep].details}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {interactivePipeline[activeProcessStep].kpis.map((kpi, k) => (
                        <span key={k} className="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-primary flex items-center gap-2">
                          <FiCheckCircle className="text-secondary w-4 h-4" />
                          <span>{kpi}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-3xl bg-primary/10 border border-primary/20 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-2xl mb-4 shadow-lg">
                      {interactivePipeline[activeProcessStep].step}
                    </div>
                    <div className="font-bold text-primary text-base mb-1">
                      {isEn ? "Quality Milestone" : "مرحلة فحص معتمدة"}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {isEn ? "Validated prior to container sealing" : "يتم إقرارها قبل إغلاق الحاوية بالسيل الجمركي"}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §9  TESTIMONIALS CAROUSEL
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-24 lg:py-32 overflow-hidden bg-surface-container-low/50 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 bottom-0 right-0" />
        <div className="max-w-[960px] mx-auto px-6 text-center relative z-10">
          
          <Reveal>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <FiStar className="w-4 h-4 text-secondary" />
              <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase">
                {isEn ? "Verified Importer Reviews" : "شهادات مستوردينا الدوليين"}
              </span>
            </div>
            <h2 className="font-headline-lg text-[36px] md:text-[48px] font-bold text-primary tracking-tight mb-14">
              {isEn ? "Trusted by Global Tea & Botanical Blenders" : "شريك معتمد لكبرى شركات الأعشاب والشاي العالمية"}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              loop
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet !w-2.5 !h-2.5 !bg-outline !opacity-30 !rounded-full transition-all",
                bulletActiveClass: "!bg-secondary !opacity-100 !w-8",
              }}
              className="pb-16"
            >
              {(testimonials.length > 0 ? testimonials : fallbackTestimonials).map((item: any, idx: number) => (
                <SwiperSlide key={idx}>
                  <div className="rounded-[36px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-10 lg:p-14 text-left shadow-xl">
                    <div className="text-[50px] text-secondary/30 font-serif leading-none mb-4">"</div>
                    <p className="font-headline-sm text-[20px] md:text-[24px] leading-relaxed text-primary font-medium mb-8">
                      {item?.text_en ? (isEn ? item.text_en : item.text_ar) : item?.text}
                    </p>
                    <div className="flex items-center gap-4 border-t border-outline-variant/30 pt-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-lg shadow-md">
                        {item?.name?.charAt(0) || "G"}
                      </div>
                      <div>
                        <div className="font-label-sm text-[15px] font-bold text-primary">{item?.name}</div>
                        <div className="font-body-sm text-[13px] text-on-surface-variant uppercase tracking-wider">{item?.role}</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §10 DIRECT TRADE INQUIRY & HEADQUARTERS
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-24 lg:py-32 overflow-hidden bg-background border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/15 top-1/2 left-0 -translate-y-1/2" />
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "Trade Operations" : "عمليات التصدير والتواصل"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[48px] font-bold text-primary tracking-tight">
              {isEn ? "Connect With Green Globe Herbs Export Desk" : "تواصل مع مكتب تصدير جرين جلوب للأعشاب"}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Contact Details (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <Reveal>
                <div className="p-8 rounded-[32px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg space-y-6">
                  <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-2">
                    {isEn ? "Direct Export Assistance" : "خدمة التصدير المباشرة"}
                  </h3>
                  <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
                    {isEn
                      ? "Have questions regarding product moisture limits, phytosanitary certificates, or port delivery schedules? Reach our trade desk directly."
                      : "هل لديك استفسار بخصوص حدود الرطوبة، أو الشهادات الصحية، أو جداول الإبحار؟ تواصل مع مكتب التصدير مباشرة."}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-outline-variant/30 text-[13px]">
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <strong>{isEn ? "Our Location" : "موقعنا"}:</strong>
                        <p className="text-on-surface-variant mt-0.5">{isEn ? "Sumusta Al Waqf, Beni Suef Governorate, Egypt" : "سمسطا الوقف، محافظة بني سويف، مصر"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiPhone className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <strong>{isEn ? "Phone & WhatsApp" : "الهاتف والواتساب"}:</strong>
                        <p className="text-on-surface-variant mt-0.5">Sales: +20 127 820 1346 | CEO: +20 102 389 1035</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiMail className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <strong>{isEn ? "Email Address" : "البريد الإلكتروني"}:</strong>
                        <p className="text-on-surface-variant mt-0.5">sales@greenglobeherbs.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiClock className="text-secondary w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <strong>{isEn ? "Working Hours" : "ساعات العمل"}:</strong>
                        <p className="text-on-surface-variant mt-0.5">{isEn ? "Available 24/7 for Global Trade Inquiries" : "متاح 24/7 لاستقبال استفسارات التصدير الدولية"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Quick Inquiry Form (Right) */}
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <div className="p-8 md:p-12 rounded-[36px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl">
                  <h3 className="font-headline-sm text-[24px] font-bold text-primary mb-6">
                    {isEn ? "Send Us A Message" : "أرسل لنا رسالة استفسار"}
                  </h3>

                  {formStatus === 'success' ? (
                    <div className="p-8 text-center rounded-3xl bg-secondary/15 border border-secondary/30">
                      <div className="w-16 h-16 mx-auto rounded-full bg-secondary text-white flex items-center justify-center mb-4 shadow-lg">
                        <FiCheck className="w-8 h-8" />
                      </div>
                      <h4 className="font-headline-sm text-[22px] font-bold text-primary mb-2">
                        {isEn ? "Inquiry Received!" : "تم استلام رسالتك بنجاح!"}
                      </h4>
                      <p className="font-body-md text-on-surface-variant text-sm">
                        {isEn ? "Your inquiry has been routed to our export sales desk. We will respond within 24 hours." : "تم تحويل استفسارك إلى مكتب التصدير. سنرد عليك خلال 24 ساعة."}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-primary uppercase tracking-wider">{t.contact.name}</label>
                          <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3.5 rounded-2xl bg-surface/70 border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-primary uppercase tracking-wider">{t.contact.email}</label>
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-3.5 rounded-2xl bg-surface/70 border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-primary uppercase tracking-wider">{isEn ? "Phone / WhatsApp" : "الهاتف أو الواتساب"}</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-3.5 rounded-2xl bg-surface/70 border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-label-sm text-[11px] font-bold text-primary uppercase tracking-wider">{t.contact.subject}</label>
                          <input
                            required
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full p-3.5 rounded-2xl bg-surface/70 border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-label-sm text-[11px] font-bold text-primary uppercase tracking-wider">{t.contact.message}</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full p-3.5 rounded-2xl bg-surface/70 border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="btn-shine w-full py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-label-sm text-[12px] font-bold uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <FiSend />
                        <span>{formStatus === 'submitting' ? (isEn ? "Sending..." : "جاري الإرسال...") : (isEn ? "Send Export Inquiry" : "إرسال استفسار التصدير")}</span>
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
          §11 FINAL CTA — Ready to Source
      ════════════════════════════════════════════════════ */}
      <section className={`relative overflow-hidden py-24 bg-surface-container-low/60 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
          <Reveal>
            <div className="rounded-[40px] bg-gradient-to-br from-white/90 to-surface-container/70 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-12 lg:p-16 shadow-2xl">
              <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase mb-4 block">
                {isEn ? "Global Export Partnership" : "شراكة التصدير الدولية"}
              </span>

              <h2 className="font-headline-lg text-[36px] md:text-[52px] font-bold text-primary tracking-tight mb-6">
                {isEn ? "Ready to Source Premium Egyptian Botanicals?" : "جاهز لاستيراد أجود النباتات والأعشاب المصرية؟"}
              </h2>

              <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-xl mx-auto mb-10 leading-relaxed">
                {isEn
                  ? "Connect with our export sales desk for certified product specifications, COA samples, and competitive FOB/CIF quotations."
                  : "تواصل مع مكتب مبيعات التصدير للحصول على مواصفات المنتجات المعتمدة، وعينات التحليل COA، وعروض أسعار تنافسية FOB و CIF."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#rfq-calculator"
                  className="btn-shine inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-primary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-xl w-full sm:w-auto"
                >
                  <FiSliders className="w-4 h-4" />
                  <span>{isEn ? "Build Custom RFQ" : "خصص طلب عرض الأسعار"}</span>
                </a>

                <a
                  href="https://wa.me/201278201346"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all w-full sm:w-auto"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span>{isEn ? "WhatsApp Sales Desk" : "واتساب المبيعات المباشر"}</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </Layout>
  );
}
