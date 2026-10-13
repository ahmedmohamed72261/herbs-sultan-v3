import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useAppStore } from "@/store";
import { translations } from "@/lib/translations";
import {
  FiPackage, FiRefreshCw, FiArrowRight, FiSearch,
  FiX, FiGrid, FiList, FiAward,
} from "react-icons/fi";
import { FaWhatsapp, FaLeaf } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useApi, Product, Category } from "@/hooks/useApi";
import api, { getAssetUrl } from "@/lib/api";
import localProducts from "@/data/products.json";

function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
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

const fallbackBotanicals: Product[] = localProducts as Product[];

const Products = () => {
  const { language } = useAppStore();
  const router = useRouter();
  const t = translations[language];
  const isEn = language === "en";

  const { categories, loading: apiLoading, errors, fetchCategories } = useApi();

  const [products, setProducts] = useState<Product[]>(fallbackBotanicals);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "dense">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync category from URL
  useEffect(() => {
    if (!router.isReady) return;
    const cat = router.query.category as string;
    if (cat && categories.length > 0) {
      const match = categories.find((c) => c.slug === cat || c.id.toString() === cat);
      setSelectedCategory(match ? match.slug : cat);
    } else if (!cat) {
      setSelectedCategory(null);
    }
  }, [router.isReady, router.query.category, categories]);

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories.length]);

  const fetchProducts = useCallback(() => {
    const filtered = selectedCategory
      ? fallbackBotanicals.filter(
          (p) => p.category?.slug === selectedCategory || p.category?.id?.toString() === selectedCategory
        )
      : fallbackBotanicals;
    setProducts(filtered);
    setLoadingProducts(false);
  }, [selectedCategory]);

  useEffect(() => {
    if (router.isReady) fetchProducts();
  }, [fetchProducts, router.isReady]);

  const handleCategoryClick = useCallback(
    (slugOrId: string | null) => {
      if (slugOrId) {
        const category = categories.find((c) => c.slug === slugOrId || c.id.toString() === slugOrId);
        const slug = category?.slug || slugOrId;
        router.push(`/products?category=${slug}`, undefined, { shallow: true });
      } else {
        router.push("/products", undefined, { shallow: true });
      }
    },
    [router, categories]
  );

  const displayedProducts = useMemo(() => {
    const list = products.length > 0 ? products : fallbackBotanicals;
    return list.filter((p) => {
      const matchesCategory =
        !selectedCategory ||
        p.category?.slug === selectedCategory ||
        p.category?.id?.toString() === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.name_en?.toLowerCase().includes(query) ||
        p.name_ar?.toLowerCase().includes(query) ||
        p.short_description_en?.toLowerCase().includes(query) ||
        p.short_description_ar?.toLowerCase().includes(query) ||
        p.category?.name_en?.toLowerCase().includes(query) ||
        p.category?.name_ar?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  const heroMetrics = [
    { value: "50+",      label_en: "Certified Crops",      label_ar: "محصول معتمد"          },
    { value: "99.8%",    label_en: "Optical Purity",        label_ar: "نقاء فيزيائي بالليزر"  },
    { value: "< 8.0%",  label_en: "Maritime Moisture",     label_ar: "رطوبة الشحن البحري"   },
    { value: "FOB/CIF", label_en: "Alexandria & Damietta",  label_ar: "الإسكندرية ودمياط"    },
  ];

  const resetFilters = () => {
    setSearchQuery("");
    handleCategoryClick(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <Layout title={t.products.title}>

      {/* ══════════════════════════════════════════════════════
          §1  HERO
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 sm:pt-40 pb-16 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/18 top-[-100px] right-[-100px]" />
        <Orb className="w-[500px] h-[500px] bg-primary/20 bottom-[-80px] left-[-100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(76,175,80,0.16),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center">

          {/* Status pill */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xl mb-6 ring-1 ring-emerald-400/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-emerald-300 uppercase font-bold">
              {isEn ? "Direct Farm Harvest • Full Spec & COA Available" : "محاصيل مزارع وادي النيل • شهادات التحليل COA متاحة"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="font-headline-lg text-[38px] sm:text-[58px] lg:text-[68px] font-extrabold text-white leading-[1.08] tracking-tight mb-5 max-w-4xl">
            {isEn ? (
              <>Egyptian Botanical <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  Crop Directory & Specifications
                </span>
              </>
            ) : (
              <>دليل المحاصيل والأعشاب الطبية <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  المعتمدة للتصدير الدولي
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/75 text-[16px] sm:text-[18px] leading-relaxed max-w-2xl mb-10">
            {isEn
              ? "Certified organic medicinal herbs, culinary seeds, and botanical flowers grown in Egyptian Nile basin soil — screened through multi-stage optical laser facilities."
              : "أعشاب طبية وتوابل وبذور عضوية معتمدة مزروعة في طمي النيل ببني سويف، مجهزة بأحدث أجهزة الفرز الضوئي للأسواق الدولية."}
          </motion.p>

          {/* Hero metric chips — 4 compact inline items */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-2">
            {heroMetrics.map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/8 border border-white/12 backdrop-blur-md">
                <span className="text-emerald-400 font-extrabold text-[15px] font-headline-sm">{m.value}</span>
                <span className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">
                  {isEn ? m.label_en : m.label_ar}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  FILTER CONSOLE + PRODUCT GRID
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background pt-10 pb-24 min-h-screen overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/8 top-0 right-0" />
        <Orb className="w-[500px] h-[500px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">

          {/* ── Filter Bar ── */}
          <div className="mb-8 space-y-4">

            {/* Row 1: Search + view toggle */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search botanical name, Latin name, or origin…" : "ابحث باسم المحصول أو الاسم العلمي أو المنشأ…"}
                  className="w-full pl-11 pr-10 py-3 rounded-full bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none text-primary text-sm shadow-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    aria-label="Clear">
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden sm:inline">
                  {isEn ? "View:" : "العرض:"}
                </span>
                {(["grid", "dense"] as const).map((mode) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      viewMode === mode
                        ? "bg-secondary text-white border-secondary shadow-md"
                        : "bg-white/60 dark:bg-white/5 border-white/50 dark:border-white/10 text-on-surface-variant hover:text-primary"}`}
                    title={mode === "grid" ? "Grid View" : "List View"}>
                    {mode === "grid" ? <FiGrid className="w-4 h-4" /> : <FiList className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm">
              <span className="font-label-sm text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <FaLeaf className="w-3 h-3" />
                {isEn ? "Filter by Category" : "تصفية حسب التصنيف"}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`px-4 py-2 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-wide transition-all ${
                    !selectedCategory
                      ? "bg-primary text-white shadow-md scale-[1.02]"
                      : "bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {isEn ? "All Categories" : "جميع التصنيفات"}
                </button>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id.toString();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug || cat.id.toString())}
                      className={`px-4 py-2 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-wide transition-all ${
                        isSelected
                          ? "bg-primary text-white shadow-md scale-[1.02]"
                          : "bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:border-secondary hover:text-secondary"
                      }`}
                    >
                      {isEn ? cat.name_en : cat.name_ar}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Result count + reset */}
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-on-surface-variant">
                {isEn ? (
                  <>Showing <strong className="text-primary font-bold">{displayedProducts.length}</strong> botanical crops</>
                ) : (
                  <>عرض <strong className="text-primary font-bold">{displayedProducts.length}</strong> محصول نباتي</>
                )}
              </p>
              {hasActiveFilters && (
                <button onClick={resetFilters}
                  className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1.5 transition-colors">
                  <FiRefreshCw className="w-3.5 h-3.5" />
                  {isEn ? "Reset Filters" : "إعادة الفلاتر"}
                </button>
              )}
            </div>
          </div>

          {/* ── Product Display ── */}
          {loadingProducts ? (
            /* Premium Botanical Skeleton Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-[28px] overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-sm flex flex-col h-[460px] animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100/40 via-emerald-50/20 to-white/30 dark:from-white/5 dark:to-white/10 relative flex items-center justify-center shrink-0">
                    <FaLeaf className="w-10 h-10 text-secondary/25 animate-pulse" />
                    <div className="absolute top-3 left-3 w-20 h-6 rounded-full bg-white/60 dark:bg-white/10" />
                  </div>
                  {/* Content Skeleton */}
                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <div className="h-6 w-3/4 rounded-full bg-primary/15 dark:bg-white/15" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3.5 w-full rounded-full bg-outline-variant/30 dark:bg-white/10" />
                      <div className="h-3.5 w-5/6 rounded-full bg-outline-variant/20 dark:bg-white/5" />
                    </div>
                    {/* Metrics Skeleton */}
                    <div className="flex items-center gap-4 pt-3 border-t border-outline-variant/20">
                      <div className="h-7 w-20 rounded-md bg-outline-variant/20" />
                      <div className="h-7 w-20 rounded-md bg-outline-variant/20" />
                    </div>
                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-4 w-24 rounded-full bg-secondary/30" />
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            /* Empty state */
            <div className="rounded-[32px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/40 max-w-lg mx-auto text-center p-14 shadow-xl">
              <div className="w-16 h-16 mx-auto mb-5 bg-secondary/12 rounded-2xl flex items-center justify-center text-3xl">🌿</div>
              <h3 className="font-headline-sm text-xl font-bold text-primary mb-3">
                {isEn ? "No Matching Crops" : "لا توجد نتائج مطابقة"}
              </h3>
              <p className="text-sm text-on-surface-variant mb-7">
                {isEn ? "Try clearing your search or switching category." : "يرجى مسح البحث أو اختيار فئة أخرى."}
              </p>
              <button onClick={resetFilters}
                className="px-8 py-3 rounded-full bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-primary transition-all shadow-md">
                {isEn ? "Show All Crops" : "عرض الكل"}
              </button>
            </div>
          ) : viewMode === "grid" ? (

            /* ─── GRID VIEW ─── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product, idx) => {
                const prodName = isEn ? product.name_en : product.name_ar;
                const prodCategory = isEn ? (product.category?.name_en || "Botanical") : (product.category?.name_ar || "محصول");
                const prodDesc = (isEn
                  ? product.short_description_en || product.description_en
                  : product.short_description_ar || product.description_ar) || "";

                return (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, delay: (idx % 3) * 0.06 }}
                    className="group rounded-[28px] overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 hover:border-secondary/40 shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 flex flex-col h-full">

                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high shrink-0">
                      {product.image ? (
                        <img src={getAssetUrl(product.image)} alt={prodName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-outline">
                          <FaLeaf className="w-10 h-10 text-secondary/30 mb-2" />
                          <span className="text-xs font-bold uppercase text-secondary/40">{prodName}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Category badge */}
                      <span className="absolute top-3 left-3 font-label-sm text-[10px] px-3 py-1.5 rounded-full bg-primary/85 backdrop-blur-md text-white uppercase font-bold tracking-widest shadow-md">
                        {prodCategory}
                      </span>
                      {product.form && (
                        <span className="absolute top-3 right-3 font-label-sm text-[10px] px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md text-emerald-300 font-bold">
                          {product.form}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-1">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-headline-sm text-[20px] font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-1">
                          {prodName}
                        </h3>
                      </Link>
                      <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed line-clamp-2 mb-5 flex-1">
                        {prodDesc}
                      </p>

                      {/* Inline metrics row */}
                      <div className="flex items-center gap-4 text-xs mb-5 pb-4 border-b border-outline-variant/20">
                        <div>
                          <span className="text-on-surface-variant text-[10px] uppercase font-semibold block">{isEn ? "Purity" : "النقاء"}</span>
                          <strong className="text-primary font-bold">{(product as any).purity || "99.8%"}</strong>
                        </div>
                        <div className="w-px h-6 bg-outline-variant/30" />
                        <div>
                          <span className="text-on-surface-variant text-[10px] uppercase font-semibold block">{isEn ? "Moisture" : "الرطوبة"}</span>
                          <strong className="text-primary font-bold">{(product as any).moisture || "< 8.0%"}</strong>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <Link href={`/products/${product.id}`}
                          className="inline-flex items-center gap-1.5 font-label-sm text-[11px] font-bold text-secondary group-hover:text-primary transition-colors uppercase tracking-wider">
                          {isEn ? "View Specs" : "تفاصيل ومواصفات"}
                          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello! Quote request for ${product.name_en} (${(product as any).form || "Export Grade"}).`)}`}
                          target="_blank" rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-sm">
                          <FaWhatsapp className="w-3.5 h-3.5" />
                          {isEn ? "RFQ" : "تسعير"}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          ) : (

            /* ─── DENSE LIST VIEW ─── */
            <div className="flex flex-col gap-3">
              {displayedProducts.map((product, idx) => {
                const prodName = isEn ? product.name_en : product.name_ar;
                const prodCategory = isEn ? (product.category?.name_en || "Botanical") : (product.category?.name_ar || "محصول");
                const prodDesc = (isEn
                  ? product.short_description_en || product.description_en
                  : product.short_description_ar || product.description_ar) || "";

                return (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.35 }}
                    className="rounded-2xl px-5 py-4 bg-white/75 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 hover:border-secondary/35 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4">

                    {/* Thumb */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0">
                      {product.image ? (
                        <img src={getAssetUrl(product.image)} alt={prodName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary"><FaLeaf /></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">{prodCategory}</span>
                        {(product as any).form && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{(product as any).form}</span>
                        )}
                      </div>
                      <h4 className="font-headline-sm text-[17px] font-bold text-primary leading-tight">{prodName}</h4>
                      <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">{prodDesc}</p>
                    </div>

                    {/* Metrics + Actions */}
                    <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-primary">{(product as any).purity || "99.8%"} {isEn ? "Pure" : "نقاء"}</div>
                        <div className="text-[11px] text-on-surface-variant">{(product as any).moisture || "< 8%"} {isEn ? "Moisture" : "رطوبة"}</div>
                      </div>
                      <Link href={`/products/${product.id}`}
                        className="px-4 py-2 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white font-bold text-[11px] transition-all">
                        {isEn ? "Details" : "التفاصيل"}
                      </Link>
                      <a href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello! Quote for ${product.name_en}.`)}`}
                        target="_blank" rel="noreferrer"
                        className="p-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-all shadow-sm">
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
      <section className={`relative py-20 bg-[#07130E] overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[860px] mx-auto px-6 text-center relative z-10">
          <SectionLabel text={isEn ? "Custom Specifications Available" : "مواصفات وتوليفات خاصة حسب الطلب"} />
          <h2 className="font-headline-lg text-[28px] sm:text-[44px] font-bold text-white tracking-tight mb-5">
            {isEn ? "Looking for Custom Cut, Mesh Size, or Private Label?" : "تبحث عن حجم غربلة مخصص أو تعبئة بعلامتك التجارية؟"}
          </h2>
          <p className="text-white/70 text-[15px] sm:text-[17px] max-w-xl mx-auto mb-9 leading-relaxed">
            {isEn
              ? "Our processing facility can calibrate specific mesh cuts (tea bag cuts, fine powders, rubbed leaves) and package with your private label specifications."
              : "يمكن لمصنعنا معايرة أحجام الغربلة المطلوبة وتجهيز التعبئة والتغليف بعلامتك التجارية الخاصة بالكامل."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact"
              className="btn-shine inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl w-full sm:w-auto">
              {isEn ? "Inquire Custom Spec" : "طلب مواصفات خاصة"}
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/201278201346?text=Hello%20Green%20Globe%20Herbs,%20I%20need%20custom%20mesh%20and%20private%20label%20specifications."
              target="_blank" rel="noreferrer"
              className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all shadow-md w-full sm:w-auto">
              <FaWhatsapp className="w-5 h-5" />
              {isEn ? "WhatsApp Direct" : "محادثة مبيعات مباشرة"}
            </a>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Products;
