import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { FadeIn } from "@/components/Motion";
import ProductCard from "@/components/ProductCard";
import { useAppStore } from "@/store";
import { translations } from "@/lib/translations";
import {
  FiPackage, FiRefreshCw, FiArrowRight, FiSearch, FiSliders,
  FiX, FiCheck, FiInfo, FiLayers, FiFileText, FiGrid, FiList,
  FiDroplet, FiAward, FiShield, FiTruck
} from "react-icons/fi";
import { FaWhatsapp, FaLeaf, FaSeedling } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useApi, Product, Category } from "@/hooks/useApi";
import api, { getAssetUrl } from "@/lib/api";

/* ── Floating ambient orb ──────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Rich Default Botanical Database for Egyptian Export ──── */
const fallbackBotanicals: Product[] = [
  {
    id: 101,
    name_en: "Organic Sweet Basil Leaves",
    name_ar: "أوراق ريحان حلو عضوي",
    short_description_en: "Sun-cured Ocimum basilicum with high linalool content. Optical sorted to 99.9% purity.",
    short_description_ar: "ريحان مصري حلو غني باللينالول، مفروز ليزرياً بنقاوة 99.9% وخالٍ من المبيدات.",
    description_en: "Prime Egyptian sweet basil cultivated in the fertile Nile alluvial basin in Beni Suef. Screened through multi-stage vibratory sieves and color optical sorters.",
    description_ar: "ريحان مصري بلدي فاخر من مزارع حوض النيل في بني سويف، مجهز ومفروز بأحدث التقنيات الضوئية الأوروبية.",
    image: "/images/product/BASIL.jpg",
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    form: "Whole & Crushed",
    purity: "99.9%",
    moisture: "< 8.0%",
    origin: "Beni Suef, Egypt",
  },
  {
    id: 102,
    name_en: "Peppermint Leaves (Crushed / T.B.C.)",
    name_ar: "أوراق نعناع فلفلي (مجروش وتفل شاي)",
    short_description_en: "Mentha piperita with crisp menthol aroma, steam-sterilized for European herbal tea blending.",
    short_description_ar: "نعناع فلفلي نقي غني بالمنثول، معقم بالبخار ومناسب لتوليفات الشاي والصناعات الطبية.",
    description_en: "Rich green crushed peppermint and tea bag cut (T.B.C.) with high volatile oil yield (>2.2%).",
    description_ar: "أوراق نعناع فلفلي بلون أخضر زاهي ونسبة زيوت طيارة تفوق 2.2% مطابقة للمواصفات الألمانية والأوروبية.",
    image: "/assets/images/spice1.jpg",
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    form: "Crushed / T.B.C.",
    purity: "99.8%",
    moisture: "< 7.5%",
    origin: "Beni Suef, Egypt",
  },
  {
    id: 103,
    name_en: "Egyptian Chamomile Flowers (Whole)",
    name_ar: "أزهار البابونج المصري (رؤوس كاملة)",
    short_description_en: "Golden intact flower heads with rich bisabolol and apigenin content for premium infusions.",
    short_description_ar: "أزهار بابونج ذهبية كاملة الرؤوس غنية بالأبيجينين والبيسابولول لخلطات الاسترخاء.",
    description_en: "Hand-picked whole Matricaria chamomilla flowers with 95%+ intact heads, gently sun-dried to preserve essential oils.",
    description_ar: "أزهار بابونج منتقاة يدوياً بنسبة تماسك رؤوس تفوق 95% ومجففة طبيعياً للحفاظ على الزيوت العطرية.",
    image: "/images/agriculture-healthy-food.jpg",
    category: { id: 2, name_en: "Dried Flowers", name_ar: "زهور مجففة" },
    form: "Whole Flower Heads",
    purity: "98.5%",
    moisture: "< 9.0%",
    origin: "Fayoum & Middle Egypt",
  },
  {
    id: 104,
    name_en: "Aswan Ruby Hibiscus (Whole Calyces)",
    name_ar: "كركديه أسواني ياقوتي (بتلات كاملة)",
    short_description_en: "Deep scarlet Hibiscus sabdariffa loaded with natural anthocyanins and tart refreshing flavor.",
    short_description_ar: "بتلات كركديه ياقوتية داكنة غنية بمضادات الأكسدة والأنثوسيانين لنكهة منعشة فاخرة.",
    description_en: "Sun-cured whole calyces naturally dehydrated without chemical additives or sulfur treatment.",
    description_ar: "كركديه أسواني نقي مجفف شمسياً بدون أي مواد كيميائية أو معالجة بالكبريت.",
    image: "/images/product/Hibiscus.jpg",
    category: { id: 3, name_en: "Herbal Teas", name_ar: "شاي عشبي" },
    form: "Whole Calyces / Siftings",
    purity: "99.2%",
    moisture: "< 8.5%",
    origin: "Upper Egypt (Aswan)",
  },
  {
    id: 105,
    name_en: "Sweet Fennel Seeds (Export Grade A)",
    name_ar: "بذور الشمر الحلو (درجة تصدير أ)",
    short_description_en: "Triple-sifted Foeniculum vulgare seeds with sweet anise nuance and >2.0% anethole volatile oil.",
    short_description_ar: "بذور شمر نقية برائحة ينسونية زكية ونسبة زيت طيار تتجاوز 2% لتطبيقات الأغذية والأدوية.",
    description_en: "Natural sun-cured oval seeds compliant with European Pharmacopoeia standards.",
    description_ar: "بذور شمر مفرزة هوائياً ومطابقة لدستور الأدوية الأوروبي وخالية من أي حشرات أو شوائب.",
    image: "/images/product/Fennel.jpg",
    category: { id: 4, name_en: "Seeds", name_ar: "بذور" },
    form: "Whole Seeds",
    purity: "99.5%",
    moisture: "< 8.0%",
    origin: "Beni Suef, Egypt",
  },
  {
    id: 106,
    name_en: "Sweet Marjoram Rubbed Leaves",
    name_ar: "أوراق البردقوش المنقى والمجروش",
    short_description_en: "Fragrant Origanum majorana with velvety olive-green color and piney, sweet culinary aroma.",
    short_description_ar: "بردقوش بلدي فاخر بلون زيتوني مخملي ورائحة عطرية دافئة لتوابل الأغذية والخلطات.",
    description_en: "Processed in our automated facility through multi-stage rub screens and metal separators.",
    description_ar: "مجهز عبر مناخل فرك آلية وغرابيل دقيقة مع عزل مغناطيسي تام للمعادن.",
    image: "/images/product/Marjoram.jpg",
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    form: "Rubbed Leaves",
    purity: "99.7%",
    moisture: "< 7.5%",
    origin: "Nile Valley, Egypt",
  },
  {
    id: 107,
    name_en: "Egyptian Anise Seeds (Laser Cleaned)",
    name_ar: "بذور الينسون المصري (مفروزة ليزرياً)",
    short_description_en: "Renowned Pimpinella anisum famous worldwide for high trans-anethole content and sweet licorice note.",
    short_description_ar: "ينسون مصري شهير عالمياً بنقاوته العالية ونسبة مركب الترانس-أنيثول للاستخدام الصيدلاني والغذائي.",
    description_en: "Triple-destoned and optical sorted for pharmaceutical infusions, confectionery, and extracts.",
    description_ar: "مفرز 3 مراحل مع فحص كثافة هوائية لإزالة البذور الفارغة وضمان أعلى نقاء.",
    image: "/images/product/Anise.jpg",
    category: { id: 4, name_en: "Seeds", name_ar: "بذور" },
    form: "Whole Clean Seeds",
    purity: "99.8%",
    moisture: "< 8.0%",
    origin: "Middle Egypt",
  },
  {
    id: 108,
    name_en: "Wild Mediterranean Thyme Leaves",
    name_ar: "أوراق الزعتر البري الفاخر",
    short_description_en: "High-thymol rubbed wild thyme, optical sorted to strict European microbial specifications.",
    short_description_ar: "أوراق زعتر بري غنية بالثيمول، مفروزة ضوئياً ومطابقة للمواصفات الميكروبيولوجية الأوروبية.",
    description_en: "Rich thymol profile for pharmaceutical extracts, essential oil distillation, and seasoning blends.",
    description_ar: "أوراق نقية خالية من السيقان مجهزة خصيصاً لاستخلاص الزيوت وتصنيع التوابل الفاخرة.",
    image: "/images/product/Thyme.jpg",
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    form: "Rubbed Leaves",
    purity: "99.6%",
    moisture: "< 8.0%",
    origin: "Nile Basin, Egypt",
  },
  {
    id: 109,
    name_en: "Aromatic Rosemary Needles (Whole & Cut)",
    name_ar: "أوراق الروزماري (إكليل الجبل كامل ومجروش)",
    short_description_en: "Pure Rosmarinus officinalis with pine-woody essence, ideal for gourmet culinary and oleoresin extraction.",
    short_description_ar: "إكليل جبل نقي برائحة خشبية صنوبرية مميزة لتتبيل اللحوم واستخلاص مضادات الأكسدة الطبيعية.",
    description_en: "Naturally sun-cured intact green needles with high carnosic acid and rosmarinic acid antioxidant levels.",
    description_ar: "أوراق مجففة شمسياً بلون أخضر طبيعي غنية بحمض الروزمارينيك ومضادات الأكسدة الطبيعية.",
    image: "/images/product/Rosemary.jpg",
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    form: "Whole Needles & Cut",
    purity: "99.5%",
    moisture: "< 8.5%",
    origin: "Beni Suef, Egypt",
  },
  {
    id: 110,
    name_en: "Golden Calendula Flowers (Petals)",
    name_ar: "بتلات زهور الأذريون (الكاليندولا)",
    short_description_en: "Vibrant orange Calendula officinalis petals, gentle dehydrated for cosmetic and wellness tea blends.",
    short_description_ar: "بتلات كاليندولا برتقالية زاهية، مجففة بعناية لمنتجات التجميل ومستحضرات العناية الطبيعية.",
    description_en: "Hand-separated orange blossoms with dense flavonoid and carotenoid attributes.",
    description_ar: "بتلات مفصولة يدوياً غنية بالفلافونويدات ومطابقة لمعايير مستحضرات التجميل العالمية.",
    image: "/images/agriculture-healthy-food.jpg",
    category: { id: 2, name_en: "Dried Flowers", name_ar: "زهور مجففة" },
    form: "Whole Petals",
    purity: "98.0%",
    moisture: "< 9.0%",
    origin: "Fayoum Farms, Egypt",
  },
  {
    id: 111,
    name_en: "Egyptian Coriander Seeds",
    name_ar: "بذور الكزبرة المصرية النقية",
    short_description_en: "Spherical aromatic Coriandrum sativum seeds with citrus-floral linalool essence and uniform golden color.",
    short_description_ar: "بذور كزبرة كروية بلون ذهبي متجانس ونكهة حمضية عطرية غنية بزيت اللينالول.",
    description_en: "Triple air-cleaned and gravity-separated for uniform sizing and zero hollow seeds.",
    description_ar: "مفرزة هوائياً على طاولات الجاذبية لعزل الحبوب الفارغة وضمان أعلى وزن حجمي.",
    image: "/images/product/BASIL.jpg",
    category: { id: 4, name_en: "Seeds", name_ar: "بذور" },
    form: "Whole Seeds & Split",
    purity: "99.5%",
    moisture: "< 8.0%",
    origin: "Beni Suef, Egypt",
  },
  {
    id: 112,
    name_en: "Nile Green Dill Weed (Rubbed)",
    name_ar: "أوراق الشبت الأخضر المنقى",
    short_description_en: "Intensely green Anethum graveolens rubbed tips with characteristic savory-aniseed flavor.",
    short_description_ar: "أوراق شبت بلدي بلون أخضر نضر ونكهة عشبية زكية لتوابل الأسماك والمأكولات الأوروبية.",
    description_en: "Cleaned from tough stems and foreign organic matter, compliant with EU microbiological thresholds.",
    description_ar: "منقى تماماً من السيقان والشوائب العضوية ومطابق للاشتراطات الميكروبيولوجية الأوروبية.",
    image: "/assets/images/spice1.jpg",
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    form: "Rubbed Tips",
    purity: "99.4%",
    moisture: "< 7.5%",
    origin: "Nile Basin, Egypt",
  },
];

const Products = () => {
  const { language } = useAppStore();
  const router = useRouter();
  const t = translations[language];
  const isEn = language === "en";

  const { categories, loading: apiLoading, errors, fetchCategories } = useApi();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "dense">("grid");
  const [activeSpecModal, setActiveSpecModal] = useState<Product | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync category query from URL
  useEffect(() => {
    if (!router.isReady) return;
    const cat = router.query.category as string;
    if (cat && categories.length > 0) {
      const matchedCategory = categories.find(
        (c) => c.slug === cat || c.id.toString() === cat,
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id.toString());
      } else {
        setSelectedCategory(cat);
      }
    } else if (!cat) {
      setSelectedCategory(null);
    }
  }, [router.isReady, router.query.category, categories]);

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories.length]);

  const normalizeItem = (item: any) => (item ? { ...item, id: item.id ?? item._id } : null);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const response = await api.get('/products', { params });
      const data = response.data?.data || response.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data.map(normalizeItem).filter(Boolean));
      } else {
        setProducts(fallbackBotanicals);
      }
    } catch {
      setProducts(fallbackBotanicals);
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (router.isReady) {
      fetchProducts();
    }
  }, [fetchProducts, router.isReady]);

  const handleCategoryClick = useCallback(
    (id: string | null) => {
      if (id) {
        const category = categories.find((c) => c.id.toString() === id);
        if (category && category.slug) {
          router.push(`/products?category=${category.slug}`, undefined, { shallow: true });
        } else {
          router.push(`/products?category=${id}`, undefined, { shallow: true });
        }
      } else {
        router.push("/products", undefined, { shallow: true });
      }
    },
    [router, categories],
  );

  // Display products: filter by search and form
  const displayedProducts = useMemo(() => {
    const list = products.length > 0 ? products : fallbackBotanicals;
    return list.filter((p) => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        p.name_en?.toLowerCase().includes(query) ||
        p.name_ar?.toLowerCase().includes(query) ||
        p.short_description_en?.toLowerCase().includes(query) ||
        p.short_description_ar?.toLowerCase().includes(query) ||
        (p.category && (p.category.name_en?.toLowerCase().includes(query) || p.category.name_ar?.toLowerCase().includes(query)));

      // Form match
      const matchesForm = selectedForm === "all" ||
        (p.form && p.form.toLowerCase().includes(selectedForm.toLowerCase()));

      return matchesSearch && matchesForm;
    });
  }, [products, searchQuery, selectedForm]);

  const formsList = [
    { id: "all", label_en: "All Cuts & Forms", label_ar: "جميع الأشكال والفرز" },
    { id: "whole", label_en: "Whole Leaves & Flowers", label_ar: "أوراق وزهور كاملة" },
    { id: "crushed", label_en: "Crushed / Rubbed", label_ar: "مجروش ومفرز" },
    { id: "t.b.c", label_en: "T.B.C (Tea Bag Cut)", label_ar: "تفل شاي (T.B.C)" },
    { id: "seed", label_en: "Whole Seeds", label_ar: "بذور كاملة" },
  ];

  return (
    <Layout title={t.products.title}>
      
      {/* ══════════════════════════════════════════════════════
          §1  HERO — High-Impact Botanical Export Hub
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 sm:pt-40 pb-20 sm:pb-24 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}>
        
        {/* Ambient Glows */}
        <Orb className="w-[600px] h-[600px] bg-secondary/20 top-[-100px] right-[-100px]" />
        <Orb className="w-[500px] h-[500px] bg-primary/25 bottom-[-100px] left-[-100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(76,175,80,0.18),transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/15 shadow-xl mb-6 ring-1 ring-emerald-400/20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-emerald-300 uppercase font-bold">
              {isEn ? "Direct Farm Harvest • Full Spec & COA Available" : "محاصيل مزارع وادي النيل • متوفر شهادات التحليل COA"}
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
                Egyptian Botanical <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  Crop Directory & Specifications
                </span>
              </>
            ) : (
              <>
                دليل المحاصيل والأعشاب الطبية <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  المعتمدة للتصدير الدولي
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
              ? "Browse certified organic medicinal herbs, culinary seeds, and botanical flowers grown in Egyptian Nile basin soil. Screened through multi-stage optical laser facilities for international blenders and pharmaceutical processors."
              : "استكشف أرقى الأعشاب الطبية والتوابل والبذور العضوية المزروعة في طمي النيل ببني سويف، والمجهزة بأحدث أجهزة الفرز الضوئي لشركات الشاي ومستحضرات الأعشاب العالمية."}
          </motion.p>

          {/* Export Performance Metric Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">50+</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Certified Botanical Crops" : "محصول معتمد"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">99.8%</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Physical Optical Purity" : "نقاء فيزيائي بالليزر"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">&lt; 8.0%</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Maritime Moisture Limit" : "رطوبة للشحن البحري"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">FOB / CIF</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Alexandria & Damietta" : "شحن الإسكندرية ودمياط"}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  INTERACTIVE FILTER CONSOLE & SEARCH ENGINE
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background pt-10 pb-28 min-h-screen overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[700px] h-[700px] bg-secondary/10 top-0 right-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Main Filter & Search Island */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl mb-12">
            
            {/* Top Row: Search Input + View Mode */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search by botanical name, Latin name, or origin..." : "ابحث باسم المحصول، الاسم العلمي، أو بلد المنشأ..."}
                  className="w-full pl-12 pr-10 py-3.5 rounded-full bg-surface-container-low/60 dark:bg-white/5 border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-sm outline-none text-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    aria-label="Clear search"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <span className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-2 hidden sm:inline">
                  {isEn ? "View:" : "العرض:"}
                </span>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl border transition-all ${
                    viewMode === "grid"
                      ? "bg-secondary text-white border-secondary shadow-md"
                      : "bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:text-primary"
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("dense")}
                  className={`p-3 rounded-xl border transition-all ${
                    viewMode === "dense"
                      ? "bg-secondary text-white border-secondary shadow-md"
                      : "bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:text-primary"
                  }`}
                  title="Dense View"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Middle Row: Category Pills */}
            <div className="flex flex-col gap-2 mb-4 pt-4 border-t border-outline-variant/30">
              <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                <FaLeaf className="w-3.5 h-3.5" />
                {t.products.filterByCategory}
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`px-5 py-2.5 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${
                    !selectedCategory
                      ? "bg-primary text-white shadow-lg ring-2 ring-primary/30"
                      : "bg-surface-container-low border border-outline-variant/50 text-on-surface-variant hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {isEn ? "All Botanical Crops" : "جميع المحاصيل"}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id.toString())}
                    className={`px-5 py-2.5 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${
                      selectedCategory === category.id.toString()
                        ? "bg-primary text-white shadow-lg ring-2 ring-primary/30"
                        : "bg-surface-container-low border border-outline-variant/50 text-on-surface-variant hover:border-secondary hover:text-secondary"
                    }`}
                  >
                    {isEn ? category.name_en : category.name_ar}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Cut & Form Pills */}
            <div className="flex flex-col gap-2 pt-3">
              <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                <FiLayers className="w-3.5 h-3.5" />
                {isEn ? "Filter by Form & Cut:" : "تصفية حسب شكل وهيئة المحصول:"}
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {formsList.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedForm(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedForm === f.id
                        ? "bg-secondary/15 text-secondary border border-secondary/40 font-bold"
                        : "bg-transparent text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {isEn ? f.label_en : f.label_ar}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Result Counter & Active Filters Bar */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="font-body-sm text-sm text-on-surface-variant">
              {isEn ? (
                <>Showing <strong className="text-primary font-bold">{displayedProducts.length}</strong> export botanical crops</>
              ) : (
                <>عرض <strong className="text-primary font-bold">{displayedProducts.length}</strong> محصول نباتي تصديري</>
              )}
            </div>

            {(searchQuery || selectedForm !== "all" || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedForm("all");
                  handleCategoryClick(null);
                }}
                className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1.5 transition-colors"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                <span>{isEn ? "Reset Filters" : "إعادة ضبط الفلاتر"}</span>
              </button>
            )}
          </div>

          {/* Loading State */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[420px] rounded-[32px] bg-white/40 dark:bg-white/5 border border-white/20 p-6 animate-pulse flex flex-col">
                  <div className="h-48 bg-black/5 dark:bg-white/10 rounded-2xl mb-6 w-full" />
                  <div className="h-6 bg-black/5 dark:bg-white/10 rounded-md w-3/4 mb-4" />
                  <div className="h-4 bg-black/5 dark:bg-white/10 rounded-md w-full mb-2" />
                  <div className="h-4 bg-black/5 dark:bg-white/10 rounded-md w-5/6" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            /* Empty Search Results */
            <div className="rounded-[36px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/40 max-w-xl mx-auto text-center p-14 shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-secondary/15 rounded-3xl flex items-center justify-center text-secondary text-3xl">
                🌿
              </div>
              <h3 className="font-headline-sm text-2xl font-bold text-primary mb-3">
                {isEn ? "No Matching Botanical Crops" : "لا توجد نتائج مطابقة"}
              </h3>
              <p className="font-body-md text-on-surface-variant mb-8 text-sm">
                {isEn
                  ? "Try clearing your search query or switching category filters."
                  : "يرجى مسح كلمات البحث أو اختيار فئة أخرى من القائمة."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedForm("all");
                  handleCategoryClick(null);
                }}
                className="px-8 py-3.5 rounded-full bg-secondary text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-primary transition-all"
              >
                {isEn ? "Show All Crops" : "عرض جميع المحاصيل"}
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* 3-Column Modern Grid with Enhanced Botanical Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProducts.map((product) => {
                const prodName = isEn ? product.name_en : product.name_ar;
                const prodCategory = isEn ? (product.category?.name_en || "Botanical") : (product.category?.name_ar || "محصول");
                const prodDesc = (isEn
                  ? product.short_description_en || product.description_en
                  : product.short_description_ar || product.description_ar) || "";

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="group rounded-[32px] overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 hover:border-secondary/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative"
                  >
                    {/* Top Image Box */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high">
                      {product.image ? (
                        <img
                          src={getAssetUrl(product.image)}
                          alt={prodName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-outline">
                          <FaLeaf className="w-12 h-12 text-secondary/40 mb-2" />
                          <span className="text-xs font-bold uppercase">{prodName}</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                        <span className="font-label-sm text-[10px] px-3.5 py-1.5 rounded-full bg-primary/90 backdrop-blur-md text-white uppercase font-bold tracking-widest shadow-md">
                          {prodCategory}
                        </span>
                        {product.form && (
                          <span className="font-label-sm text-[10px] px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 font-bold shadow-md">
                            {product.form}
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Card Body */}
                    <div className="p-7 flex flex-col flex-1">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-headline-sm text-[22px] font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-1">
                          {prodName}
                        </h3>
                      </Link>

                      <p className="font-body-sm text-[14px] text-on-surface-variant leading-relaxed line-clamp-2 mb-6 flex-1">
                        {prodDesc}
                      </p>

                      {/* Botanical Quality Metrics Bar */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-surface-container-low/80 dark:bg-white/5 border border-outline-variant/30 text-xs mb-6">
                        <div>
                          <span className="text-on-surface-variant text-[10px] uppercase block font-semibold">{isEn ? "Purity" : "النقاء"}</span>
                          <strong className="text-primary font-bold">{product.purity || "99.8%"}</strong>
                        </div>
                        <div>
                          <span className="text-on-surface-variant text-[10px] uppercase block font-semibold">{isEn ? "Moisture" : "الرطوبة"}</span>
                          <strong className="text-primary font-bold">{product.moisture || "< 8.0%"}</strong>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 gap-2 mt-auto">
                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex items-center gap-1.5 font-label-sm text-[12px] font-bold text-secondary group-hover:text-primary transition-colors uppercase tracking-wider"
                        >
                          <span>{isEn ? "View Specs" : "تفاصيل ومواصفات"}</span>
                          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <a
                          href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello Green Globe Herbs, I would like to request an export quotation and COA for: ${product.name_en} (${product.form || 'Export Grade'}).`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                          title="Instant WhatsApp Quote"
                        >
                          <FaWhatsapp className="w-3.5 h-3.5" />
                          <span>{isEn ? "RFQ" : "تسعير"}</span>
                        </a>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Dense Row View */
            <div className="flex flex-col gap-4">
              {displayedProducts.map((product) => {
                const prodName = isEn ? product.name_en : product.name_ar;
                const prodCategory = isEn ? (product.category?.name_en || "Botanical") : (product.category?.name_ar || "محصول");
                const prodDesc = (isEn
                  ? product.short_description_en || product.description_en
                  : product.short_description_ar || product.description_ar) || "";

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-3xl p-5 md:p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 hover:border-secondary/40 shadow-md hover:shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-container shrink-0">
                        {product.image ? (
                          <img src={getAssetUrl(product.image)} alt={prodName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary"><FaLeaf /></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">{prodCategory}</span>
                          {product.form && <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{product.form}</span>}
                        </div>
                        <h4 className="font-headline-sm text-lg font-bold text-primary">{prodName}</h4>
                        <p className="text-xs text-on-surface-variant line-clamp-1 max-w-xl mt-1">{prodDesc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-primary">{product.purity || "99.8%"} {isEn ? "Purity" : "نقاء"}</div>
                        <div className="text-[11px] text-on-surface-variant">{product.moisture || "< 8%"} {isEn ? "Moisture" : "رطوبة"}</div>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="px-4 py-2 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-bold text-xs transition-all"
                      >
                        {isEn ? "Details" : "التفاصيل"}
                      </Link>
                      <a
                        href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello Green Globe Herbs, I would like to request quote for: ${product.name_en}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-all shadow-md"
                        title="WhatsApp Quote"
                      >
                        <FaWhatsapp className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  CUSTOM B2B BLENDS & PRIVATE LABEL CTA
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-24 bg-surface-container/60 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <div className="rounded-[40px] bg-gradient-to-br from-white/90 to-surface-container/70 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-12 lg:p-16 shadow-2xl">
            <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase mb-4 block">
              {isEn ? "Custom Specifications Available" : "مواصفات وتوليفات خاصة حسب الطلب"}
            </span>
            <h2 className="font-headline-lg text-[32px] sm:text-[46px] font-bold text-primary tracking-tight mb-6">
              {isEn ? "Looking for Custom Cut, Mesh Size, or Private Label?" : "تبحث عن حجم غربلة مخصص أو تعبئة بعلامتك التجارية؟"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              {isEn
                ? "Our processing facility can calibrate specific mesh cuts (tea bag cuts, fine powders, rubbed leaves) and package according to your private label specifications."
                : "يمكن لمصنعنا معايرة أحجام الغربلة المطلوبة (تفل شاي، بودرة ناعمة، أوراق مفرزة) وتجهيز التعبئة والتغليف بعلامتك التجارية الخاصة بالكامل."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-shine inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-primary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-xl"
              >
                <span>{isEn ? "Inquire Custom Spec" : "طلب مواصفات خاصة"}</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/201278201346?text=Hello%20Green%20Globe%20Herbs,%20I%20need%20custom%20mesh%20and%20private%20label%20specifications."
                target="_blank"
                rel="noreferrer"
                className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all shadow-md"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{isEn ? "WhatsApp Direct Desk" : "محادثة مبيعات مباشرة"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Products;
