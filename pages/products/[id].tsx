import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import {
  FiArrowLeft, FiCheck, FiMapPin, FiLayers, FiDroplet, FiAward,
  FiCloud, FiArchive, FiClock, FiSend, FiTruck, FiShield,
  FiChevronRight, FiMaximize2, FiX, FiShare2
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { GetServerSideProps } from 'next';

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  images: string[] | null;
  category: {
    id: number;
    name_en: string;
    name_ar: string;
  };
  price?: number | string;
  sku?: string;
  stock?: number;
  is_featured?: boolean;
  origin?: string;
  form?: string;
  color?: string;
  purity?: string;
  moisture?: string;
  packaging?: string;
  shelf_life?: string;
  certifications?: string[];
  export_availability?: string;
}

interface ProductDetailsProps {
  product: Product | null;
  suggestedProducts: Product[];
}

const specIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  origin: FiMapPin,
  form: FiLayers,
  color: FiDroplet,
  purity: FiAward,
  moisture: FiCloud,
  packaging: FiArchive,
  shelf_life: FiClock,
  export_availability: FiSend,
};

const ProductDetails = ({ product, suggestedProducts }: ProductDetailsProps) => {
  const router = useRouter();
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';

  const [selectedImage, setSelectedImage] = useState<string | null>(product?.image || null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);

  const allImages = [
    ...(product?.image ? [product.image] : []),
    ...(Array.isArray(product?.images) ? product.images : [])
  ];

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      navigator.share({
        title: isEn ? product?.name_en : product?.name_ar,
        text: isEn ? product?.short_description_en : product?.short_description_ar,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2500);
    }
  };

  interface ProductSpec {
    label: string;
    key: string;
  }

  const specFields: ProductSpec[] = [
    { label: language === 'en' ? 'Origin' : 'بلد المنشأ', key: 'origin' },
    { label: language === 'en' ? 'Form' : 'الشكل', key: 'form' },
    { label: language === 'en' ? 'Color' : 'اللون', key: 'color' },
    { label: language === 'en' ? 'Purity' : 'النقاء', key: 'purity' },
    { label: language === 'en' ? 'Moisture' : 'الرطوبة', key: 'moisture' },
    { label: language === 'en' ? 'Packaging' : 'التغليف', key: 'packaging' },
    { label: language === 'en' ? 'Shelf Life' : 'مدة الصلاحية', key: 'shelf_life' },
    { label: language === 'en' ? 'Export Availability' : 'التوفر للتصدير', key: 'export_availability' },
  ];

  if (!product) {
    return (
      <Layout title={t.products.title}>
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-surface">
          <span className="text-6xl mb-6 opacity-50 text-outline">🌿</span>
          <p className="font-headline-sm text-2xl font-bold text-primary mb-8">{t.common.noData}</p>
          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 px-6 py-3 border border-outline-variant hover:border-primary text-primary font-label-sm font-bold uppercase tracking-widest transition-colors bg-surface-container"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
        </div>
      </Layout>
    );
  }

  const productName = language === 'en' ? product.name_en : product.name_ar;
  const productDesc = language === 'en' ? product.description_en : product.description_ar;
  const categoryName = language === 'en' ? product.category?.name_en : product.category?.name_ar;
  const price = Number(product.price);
  const hasPrice = price > 0;

  const keyFeatures = isEn ? [
    "100% Certified Organic Egyptian Harvest",
    "High Concentration of Natural Essential Oils",
    "Microbiologically Tested & Free of Pesticides",
    "Processed Under Strict ISO 22000 & HACCP Standards",
    "Custom Export Packaging (Bulk Bags, Cartons, Bales)"
  ] : [
    "محصول مصري عضوي معتمد 100%",
    "نسبة تركيز عالية للزيوت العطرية الطبيعية",
    "مفحوص معملياً ومطابق للمواصفات وخالٍ من المبيدات",
    "معالج ومجهز وفق معايير ISO 22000 و HACCP الدولية",
    "خيارات تعبئة متعددة للتصدير (أكياس جملة، كراتين، بالات)"
  ];

  return (
    <Layout title={productName}>
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-outline-variant/40 pt-24 pb-4">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 py-3 font-label-sm text-[11px] font-bold tracking-widest uppercase">
            <button onClick={() => router.push('/')} className="text-on-surface-variant hover:text-primary transition-colors">
              {language === 'en' ? 'Home' : 'الرئيسية'}
            </button>
            <span className="text-outline-variant">/</span>
            <button onClick={() => router.push('/products')} className="text-on-surface-variant hover:text-primary transition-colors">
              {language === 'en' ? 'Products' : 'المنتجات'}
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary truncate max-w-[200px]">{productName}</span>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="py-12 lg:py-20 bg-surface min-h-screen border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
            
            {/* Image Section */}
            <FadeIn className="lg:sticky lg:top-28 lg:self-start">
              {/* Main Image with Zoom Trigger */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative rounded-[32px] border border-outline-variant/60 bg-surface-container-high aspect-square flex items-center justify-center overflow-hidden group cursor-pointer shadow-lg"
              >
                {selectedImage ? (
                  <img
                    src={getAssetUrl(selectedImage)}
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-outline">
                    <span className="text-6xl mb-4 block opacity-50">🌿</span>
                    <span className="font-label-sm text-[11px] uppercase font-bold tracking-widest">{productName}</span>
                  </div>
                )}
                
                {/* Zoom indicator overlay (like old project) */}
                <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <FiMaximize2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Click to zoom' : 'انقر للتكبير'}</span>
                </div>

                {product.is_featured && (
                  <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 bg-secondary text-white px-3.5 py-1.5 rounded-full font-label-sm text-[10px] font-bold uppercase tracking-widest shadow-md">
                    <span>{language === 'en' ? 'Featured' : 'مميز'}</span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 rounded-2xl flex-shrink-0 border-2 transition-all overflow-hidden ${
                        selectedImage === img
                          ? 'border-secondary scale-105 shadow-md'
                          : 'border-outline-variant/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getAssetUrl(img)}
                        alt={`Gallery ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </FadeIn>

            {/* Details Section */}
            <FadeIn className="flex flex-col">
              
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-[0.2em]">
                  {categoryName || (isEn ? "Organic Botanicals" : "نباتات عضوية")}
                </span>
              </div>

              <h1 className="font-headline-lg text-[36px] lg:text-[48px] font-bold text-primary mb-4 leading-tight tracking-tight">
                {productName}
              </h1>

              {hasPrice && (
                <div className="mb-6 pb-6 border-b border-outline-variant/30 flex items-baseline gap-2">
                  <span className="font-headline-md text-3xl font-extrabold text-primary">
                    ${price.toFixed(2)}
                  </span>
                  <span className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    / {language === 'en' ? 'kg' : 'كجم'}
                  </span>
                </div>
              )}

              <p className="font-body-lg text-[16px] text-on-surface-variant leading-relaxed mb-8 pl-5 border-l-2 border-secondary italic">
                {language === 'en' ? product.short_description_en : product.short_description_ar}
              </p>

              {/* Action Buttons: WhatsApp Quote & Share */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-8 border-b border-outline-variant/30">
                <a
                  href={(() => {
                    const phone = '201278201346';
                    const msg = language === 'en'
                      ? `Hello! I'm interested in ${productName}.%0A%0AProduct Details:%0A- Category: ${categoryName}%0A${hasPrice ? `- Price: $${price.toFixed(2)}/kg%0A` : ''}${product.origin ? `- Origin: ${product.origin}%0A` : ''}${product.form ? `- Form: ${product.form}%0A` : ''}${product.certifications?.length ? `- Certifications: ${product.certifications.join(', ')}` : ''}%0A%0ACould you please provide an export quote and availability?`
                      : `مرحباً، أنا مهتم بـ ${productName}.%0A%0Aتفاصيل المنتج:%0A- التصنيف: ${categoryName}%0A${hasPrice ? `- السعر: $${price.toFixed(2)}/كجم%0A` : ''}${product.origin ? `- بلد المنشأ: ${product.origin}%0A` : ''}${product.form ? `- الشكل: ${product.form}%0A` : ''}${product.certifications?.length ? `- الشهادات: ${product.certifications.join(', ')}` : ''}%0A%0Aهل يمكنكم تزويدي بعرض سعر والتوافر للتصدير؟`;
                    return `https://wa.me/${phone}?text=${msg}`;
                  })()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-shine whatsapp-glow flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-label-sm text-[12px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  <span>{language === 'en' ? 'Inquire on WhatsApp' : 'طلب تسعير عبر واتساب'}</span>
                </a>

                <button
                  onClick={handleShare}
                  className="py-4 px-6 rounded-full border border-outline-variant/60 hover:border-primary text-primary font-label-sm text-[12px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 hover:bg-surface-container-low"
                >
                  <FiShare2 className="w-4 h-4" />
                  <span>{copyNotification ? (isEn ? 'Copied!' : 'تم النسخ!') : (isEn ? 'Share' : 'مشاركة')}</span>
                </button>
              </div>

              {/* Key Features (from Old Project) */}
              <div className="mb-10 p-6 rounded-3xl bg-surface-container-low/60 border border-outline-variant/30">
                <h3 className="font-headline-sm text-[18px] font-bold text-primary mb-4 flex items-center gap-2">
                  <FiAward className="text-secondary" />
                  <span>{isEn ? 'Key Features & Purity' : 'المزايا الفنية والنقاء'}</span>
                </h3>
                <ul className="space-y-2.5">
                  {keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-on-surface-variant font-body-sm text-[14px]">
                      <FiCheck className="text-secondary shrink-0 w-4 h-4" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Description */}
              <div className="mb-10">
                <h3 className="font-label-sm text-[11px] font-bold text-secondary tracking-[0.2em] uppercase mb-3">
                  {language === 'en' ? 'About this botanical' : 'عن هذا المحصول'}
                </h3>
                <div className="font-body-md text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                  {productDesc}
                </div>
              </div>

              {/* Product Specifications Table */}
              <div className="mb-8">
                <h3 className="font-label-sm text-[11px] font-bold text-secondary tracking-[0.2em] uppercase mb-4">
                  {language === 'en' ? 'Technical Specifications' : 'المواصفات الفنية'}
                </h3>
                <div className="rounded-2xl overflow-hidden border border-outline-variant/40 divide-y divide-outline-variant/30 bg-surface-container-lowest">
                  {specFields.map((field) => {
                    const value = (product as any)[field.key];
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    const Icon = specIcons[field.key];
                    return (
                      <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-surface-container-low/40 transition-colors">
                        <span className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-3 mb-1 sm:mb-0">
                          {Icon && <Icon className="w-3.5 h-3.5 text-secondary" />}
                          {field.label}
                        </span>
                        <span className="font-body-md text-[13px] font-bold text-primary sm:text-right">
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </FadeIn>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Zooming In Product Photo */}
      {isLightboxOpen && selectedImage && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl p-2 hover:opacity-80 transition-opacity"
            aria-label="Close Lightbox"
          >
            <FiX />
          </button>
          <div className="max-w-4xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={getAssetUrl(selectedImage)}
              alt={productName}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <section className="w-full bg-surface-container-low py-20 lg:py-32">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-12">
            <FadeIn>
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 pb-6 border-b border-outline-variant">
                <div>
                  <span className="font-label-sm text-[10px] tracking-widest text-secondary uppercase block mb-3 font-bold">
                    {language === 'en' ? 'You might also like' : 'قد يعجبك أيضاً'}
                  </span>
                  <h2 className="font-headline-md text-[32px] font-bold text-primary tracking-tight">
                    {language === 'en' ? 'Related Products' : 'منتجات ذات صلة'}
                  </h2>
                </div>
                <a href="/products" className="inline-flex items-center gap-2 font-label-sm text-[11px] font-bold text-primary hover:text-secondary uppercase tracking-widest transition-colors">
                  {language === 'en' ? 'View All' : 'عرض الكل'}
                  <FiChevronRight className="w-4 h-4" />
                </a>
              </div>

              <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suggestedProducts.map((prod) => (
                  <StaggerItem key={prod.id}>
                    <ProductCard
                      id={prod.id}
                      name={language === 'en' ? prod.name_en : prod.name_ar}
                      category={(language === 'en' ? prod.category?.name_en : prod.category?.name_ar) || ''}

                      description={language === 'en' ? prod.short_description_en : prod.short_description_ar}
                      image={prod.image}
                      isFeatured={prod.is_featured}
                    />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </FadeIn>
          </div>
        </section>
      )}
    </Layout>
  );
};

const fallbackProductCatalog: Product[] = [
  {
    id: 101,
    name_en: "Organic Sweet Basil Leaves",
    name_ar: "أوراق ريحان حلو عضوي",
    short_description_en: "Sun-cured Ocimum basilicum with high linalool content. Optical sorted to 99.9% purity.",
    short_description_ar: "ريحان مصري حلو غني باللينالول، مفروز ليزرياً بنقاوة 99.9% وخالٍ من المبيدات.",
    description_en: "Prime Egyptian sweet basil cultivated in the fertile Nile alluvial basin in Beni Suef. Screened through multi-stage vibratory sieves and color optical sorters to eliminate stalks and dust. Rich in aromatic linalool and methyl chavicol, perfectly suited for European gourmet seasonings, extraction, and culinary tea infusions.",
    description_ar: "ريحان مصري بلدي فاخر من مزارع حوض النيل في بني سويف، مجهز ومفروز بأحدث التقنيات الضوئية الأوروبية لعزل الشوائب والسيقان. غني بمركبات اللينالول العطرية لتتبيل الأغذية واستخلاص الزيوت وتوليفات الشاي الطبيعي.",
    image: "/images/product/BASIL.jpg",
    images: ["/images/product/BASIL.jpg", "/images/agriculture-healthy-food.jpg"],
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    origin: "Beni Suef, Nile Valley, Egypt",
    form: "Whole & Crushed Rubbed Leaves",
    color: "Bright Velvety Green",
    purity: "99.9% Optical Machine Cleaned",
    moisture: "< 7.5% Standard Oceanic Moisture",
    packaging: "20kg Multi-Ply Kraft Paper Sacks with Poly Liner",
    shelf_life: "24 Months from Harvest Date",
    export_availability: "FOB Alexandria / CIF Global Ports (Available Year-Round)",
    certifications: ["ISO 22000:2018", "HACCP", "USDA Organic", "EU Organic", "FDA Registered"],
    is_featured: true,
  },
  {
    id: 102,
    name_en: "Peppermint Leaves (Crushed / T.B.C.)",
    name_ar: "أوراق نعناع فلفلي (مجروش وتفل شاي)",
    short_description_en: "Mentha piperita with crisp menthol aroma, steam-sterilized for European herbal tea blending.",
    short_description_ar: "نعناع فلفلي نقي غني بالمنثول، معقم بالبخار ومناسب لتوليفات الشاي والصناعات الطبية.",
    description_en: "Pure Egyptian peppermint cultivated in Beni Suef and the Fayoum oasis. Harvested at peak diurnal hours to preserve >2.2% volatile menthol oil. Steam-sterilized and cut to exact tea-bag cut (T.B.C.) or whole leaf specifications.",
    description_ar: "نعناع فلفلي مصري نقي محصود في أوقات السطوع الشمسي المثالية للحفاظ على أعلى تركيز لزيت المنثول (>2.2%). معقم بالبخار ومفرز بدقة متناهية لأكياس الشاي العشبي والمنتجات الطبية.",
    image: "/assets/images/spice1.jpg",
    images: ["/assets/images/spice1.jpg", "/images/lab.jpg"],
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    origin: "Beni Suef Farms, Egypt",
    form: "T.B.C. (Tea Bag Cut 1-3mm) & Crushed",
    color: "Deep Forest Green",
    purity: "99.8% Pure Botanical Leaf",
    moisture: "< 7.5% Maximum",
    packaging: "20kg Multi-Ply Kraft Sacks / 25kg PP Bags",
    shelf_life: "24 Months",
    export_availability: "Active Bulk Export Available",
    certifications: ["ISO 22000", "HACCP", "USDA Organic", "EU Organic"],
    is_featured: true,
  },
  {
    id: 103,
    name_en: "Egyptian Chamomile Flowers (Whole Heads)",
    name_ar: "أزهار البابونج المصري (رؤوس كاملة)",
    short_description_en: "Golden intact flower heads with rich bisabolol and apigenin content for premium infusions.",
    short_description_ar: "أزهار بابونج ذهبية كاملة الرؤوس غنية بالأبيجينين والبيسابولول لخلطات الاسترخاء.",
    description_en: "World-renowned Egyptian golden chamomile (Matricaria chamomilla). Hand-picked intact flower heads exceeding 95% whole flowers with minimal stem. Naturally dehydrated to preserve radiant yellow disc florets and soothing apigenin flavones.",
    description_ar: "بابونج مصري ذهبي شهير عالمياً بزهوره الكاملة المنتقاة يدوياً بنسبة تماسك تفوق 95%. مجفف طبيعياً للحفاظ على زيوته الطيارة ومركبات الأبيجينين المهدئة.",
    image: "/images/agriculture-healthy-food.jpg",
    images: ["/images/agriculture-healthy-food.jpg", "/images/1.jpg"],
    category: { id: 2, name_en: "Dried Flowers", name_ar: "زهور مجففة" },
    origin: "Fayoum & Middle Egypt",
    form: "Whole Intact Flower Heads (Grade A)",
    color: "Golden Yellow Discs with White Florets",
    purity: "98.5% Whole Flowers",
    moisture: "< 9.0% Standard",
    packaging: "10kg - 15kg Corrugated Master Export Cartons",
    shelf_life: "24 Months",
    export_availability: "Peak Harvest Export Active",
    certifications: ["ISO 22000", "HACCP", "USDA Organic", "Halal"],
    is_featured: true,
  },
  {
    id: 104,
    name_en: "Aswan Ruby Hibiscus (Whole Calyces)",
    name_ar: "كركديه أسواني ياقوتي (بتلات كاملة)",
    short_description_en: "Deep scarlet Hibiscus sabdariffa loaded with natural anthocyanins and tart refreshing flavor.",
    short_description_ar: "بتلات كركديه ياقوتية داكنة غنية بمضادات الأكسدة والأنثوسيانين لنكهة منعشة فاخرة.",
    description_en: "Sun-cured intact calyces cultivated along the sun-drenched Upper Egypt riverbanks in Aswan. Rich in ruby anthocyanins, fruit acids, and vitamin C. Naturally dehydrated without any sulfur or color preservatives.",
    description_ar: "بتلات كركديه أسواني مجففة شمسياً على ضفاف النيل بصعيد مصر، غنية بمضادات الأكسدة والأنثوسيانين وفيتامين سي وبدون أي إضافات كيميائية أو معالجة بالكبريت.",
    image: "/images/product/Hibiscus.jpg",
    images: ["/images/product/Hibiscus.jpg"],
    category: { id: 3, name_en: "Herbal Teas", name_ar: "شاي عشبي" },
    origin: "Aswan & Upper Egypt",
    form: "Whole Calyces / Siftings",
    color: "Deep Ruby Crimson",
    purity: "99.2% Pure Calyces",
    moisture: "< 8.5%",
    packaging: "25kg Woven Bags with Moisture Liner",
    shelf_life: "36 Months",
    export_availability: "Year-Round Ocean FCL",
    certifications: ["ISO 22000", "HACCP", "USDA Organic", "Halal"],
    is_featured: true,
  },
  {
    id: 105,
    name_en: "Sweet Fennel Seeds (Export Grade A)",
    name_ar: "بذور الشمر الحلو (درجة تصدير أ)",
    short_description_en: "Triple-sifted Foeniculum vulgare seeds with sweet anise nuance and >2.0% anethole volatile oil.",
    short_description_ar: "بذور شمر نقية برائحة ينسونية زكية ونسبة زيت طيار تتجاوز 2% لتطبيقات الأغذية والأدوية.",
    description_en: "Natural sun-cured oval seeds screened on vibrating gravity tables and de-stoners. Sweet aniseed aroma and high essential oil content meeting European Pharmacopoeia monographs.",
    description_ar: "بذور شمر مفرزة على طاولات الجاذبية وخالية من الحبوب الفارغة، بنسبة زيوت طيارة عالية تطابق دستور الأدوية الأوروبي.",
    image: "/images/product/Fennel.jpg",
    images: ["/images/product/Fennel.jpg"],
    category: { id: 4, name_en: "Seeds", name_ar: "بذور" },
    origin: "Beni Suef Alluvial Basin, Egypt",
    form: "Whole Clean Seeds (Mesh 99%)",
    color: "Greenish-Yellow Oval Seeds",
    purity: "99.5% Triple Machine Sifted",
    moisture: "< 8.0%",
    packaging: "25kg / 50kg Multi-Ply Poly-Lined Bags",
    shelf_life: "24 Months",
    export_availability: "Available Year-Round",
    certifications: ["ISO 22000", "HACCP", "EU Pharmacopoeia Compliant"],
    is_featured: true,
  },
  {
    id: 106,
    name_en: "Sweet Marjoram Rubbed Leaves",
    name_ar: "أوراق البردقوش المنقى والمجروش",
    short_description_en: "Fragrant Origanum majorana with velvety olive-green color and piney, sweet culinary aroma.",
    short_description_ar: "بردقوش بلدي فاخر بلون زيتوني مخملي ورائحة عطرية دافئة لتوابل الأغذية والخلطات.",
    description_en: "Gently rubbed and aspirated marjoram leaves. High essential oil concentration (>1.8%) rich in terpinen-4-ol. Optical laser-sorted to ensure no stems or inert plant matter.",
    description_ar: "أوراق بردقوش مفرزة هوائياً وغنية بمركب التربينين، مطابقة لأدق المعايير الأوروبية للتوابل وصناعات الأغذية الفاخرة.",
    image: "/images/product/Marjoram.jpg",
    images: ["/images/product/Marjoram.jpg"],
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    origin: "Nile Valley, Beni Suef",
    form: "Clean Rubbed Leaves",
    color: "Velvety Grey-Green",
    purity: "99.7% Pure Leaf",
    moisture: "< 7.5%",
    packaging: "20kg Multi-Ply Kraft Bags",
    shelf_life: "24 Months",
    export_availability: "Active Bulk Supply",
    certifications: ["ISO 22000", "HACCP", "USDA Organic", "EU Organic"],
    is_featured: true,
  },
  {
    id: 107,
    name_en: "Egyptian Anise Seeds (Laser Cleaned)",
    name_ar: "بذور الينسون المصري (مفروزة ليزرياً)",
    short_description_en: "Renowned Pimpinella anisum famous worldwide for high trans-anethole content and sweet licorice note.",
    short_description_ar: "ينسون مصري شهير عالمياً بنقاوته العالية ونسبة مركب الترانس-أنيثول للاستخدام الصيدلاني والغذائي.",
    description_en: "Egyptian anise is regarded worldwide as the benchmark for sweet licorice aroma and pharmaceutical-grade purity. Screened through three-stage laser color sorters to ensure 99.8% physical purity.",
    description_ar: "الينسون المصري يعد المعيار الذهبي عالمياً للنقاء ورائحة الأنيثول الزكية، مجهز عبر 3 مراحل فرز ليزري متطورة.",
    image: "/images/product/Anise.jpg",
    images: ["/images/product/Anise.jpg"],
    category: { id: 4, name_en: "Seeds", name_ar: "بذور" },
    origin: "Middle Egypt",
    form: "Whole Triple-Sifted Seeds",
    color: "Greyish-Green Pyriform Seeds",
    purity: "99.8% Optical Purity",
    moisture: "< 8.0%",
    packaging: "25kg Polypropylene Bags with Poly Liner",
    shelf_life: "24 Months",
    export_availability: "Annual Export Allocation Available",
    certifications: ["ISO 22000", "HACCP", "Halal"],
    is_featured: true,
  },
  {
    id: 108,
    name_en: "Wild Mediterranean Thyme Leaves",
    name_ar: "أوراق الزعتر البري الفاخر",
    short_description_en: "High-thymol rubbed wild thyme, optical sorted to strict European microbial specifications.",
    short_description_ar: "أوراق زعتر بري غنية بالثيمول، مفروزة ضوئياً ومطابقة للمواصفات الميكروبيولوجية الأوروبية.",
    description_en: "Wild-grown aromatic thyme with intense pungent herbal aroma and high thymol percentage. Dehydrated in shade tunnels and machine-sifted for Mediterranean seasoning blends.",
    description_ar: "زعتر عطري غني بالثيمول مطهر ومجفف بعناية في أنفاق تجفيف نظيفة، ومفرز لإزالة السيقان والشوائب.",
    image: "/images/product/Thyme.jpg",
    images: ["/images/product/Thyme.jpg"],
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    origin: "Nile Basin, Egypt",
    form: "Clean Rubbed Leaves",
    color: "Dusty Olive Green",
    purity: "99.6% Pure Leaf",
    moisture: "< 8.0%",
    packaging: "20kg Kraft Paper Sacks",
    shelf_life: "24 Months",
    export_availability: "Available for FCL/LCL",
    certifications: ["ISO 22000", "HACCP"],
    is_featured: true,
  },
  {
    id: 109,
    name_en: "Aromatic Rosemary Needles (Whole & Cut)",
    name_ar: "أوراق الروزماري (إكليل الجبل كامل ومجروش)",
    short_description_en: "Pure Rosmarinus officinalis with pine-woody essence, ideal for gourmet culinary and oleoresin extraction.",
    short_description_ar: "إكليل جبل نقي برائحة خشبية صنوبرية مميزة لتتبيل اللحوم واستخلاص مضادات الأكسدة الطبيعية.",
    description_en: "Carefully harvested needle-like leaves with robust cineole and carnosic acid antioxidant levels. Excellent color retention and uniform needle grading.",
    description_ar: "أوراق إبرية نقية مجففة بعناية مع الاحتفاظ بلونها الأخضر الطبيعي ونسبة عالية من مضادات الأكسدة الطبيعية.",
    image: "/images/product/Rosemary.jpg",
    images: ["/images/product/Rosemary.jpg"],
    category: { id: 1, name_en: "Herbs", name_ar: "أعشاب" },
    origin: "Beni Suef, Egypt",
    form: "Whole Needles & Cut",
    color: "Vibrant Forest Green",
    purity: "99.5% Machine Cleaned",
    moisture: "< 8.5%",
    packaging: "25kg Multi-Ply Paper Sacks",
    shelf_life: "24 Months",
    export_availability: "Available Year-Round",
    certifications: ["ISO 22000", "HACCP", "USDA Organic"],
    is_featured: true,
  },
];

export const getServerSideProps: GetServerSideProps<ProductDetailsProps> = async ({ params }) => {
  const rawParam = params?.id;
  const rawId = Array.isArray(rawParam) ? rawParam[0] : (rawParam || '');
  const cleanId = rawId.replace(/\/$/, '');

  // 1. First check if it matches our rich fallback database
  const fallbackMatch = fallbackProductCatalog.find((p) => p.id.toString() === cleanId);
  if (fallbackMatch) {
    const suggestedProducts = fallbackProductCatalog
      .filter((p) => p.id.toString() !== cleanId)
      .slice(0, 3);

    return {
      props: {
        product: fallbackMatch,
        suggestedProducts,
      },
    };
  }

  try {
    // 2. Attempt API fetch
    const productResponse = await api.get(`/products/${cleanId}`);
    const product = productResponse.data?.data || productResponse.data;

    if (product) {
      if (product.price) product.price = Number(product.price);
      
      let suggestedProducts: Product[] = [];
      if (product.category?.id) {
        try {
          const suggestedResponse = await api.get('/products', {
            params: { category_id: product.category.id },
          });
          const allSuggested = suggestedResponse.data?.data || suggestedResponse.data || [];
          suggestedProducts = allSuggested.filter((p: Product) => p.id !== product.id).slice(0, 3);
        } catch {}
      }

      if (suggestedProducts.length === 0) {
        suggestedProducts = fallbackProductCatalog.filter((p) => p.id !== product.id).slice(0, 3);
      }

      return {
        props: {
          product,
          suggestedProducts,
        },
      };
    }
  } catch {}

  // 3. Ultimate graceful fallback
  return {
    props: {
      product: fallbackProductCatalog[0],
      suggestedProducts: fallbackProductCatalog.slice(1, 4),
    },
  };
};

export default ProductDetails;
