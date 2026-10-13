import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api from '@/lib/api';
import { FiPhone, FiMail, FiMapPin, FiAward, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn, FaLeaf } from 'react-icons/fa';

const Footer = () => {
  const { language } = useAppStore();
  const [categories, setCategories] = useState<{ id: string; order: number; slug: string; label: string }[]>([]);
  const t = translations[language];
  const isEn = language === 'en';

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/categories');
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          const slugToKey: Record<string, string> = {
            herbs: t.nav.herbs,
            spices: t.nav.spices,
            seeds: t.nav.seeds,
            'dried-flowers': t.nav.driedFlowers,
            'herbal-teas': t.nav.herbalTeas,
            botanicals: t.nav.botanicals,
          };
          setCategories(
            data
              .filter((c: any) => c.is_active !== false)
              .map((c: any) => ({
                id: c._id || c.id,
                order: c.order ?? 0,
                slug: c.slug,
                label: slugToKey[c.slug] || (language === 'en' ? c.name_en : c.name_ar),
              }))
              .sort((a: any, b: any) => a.order - b.order)
          );
        }
      } catch {
        // fallback silently
      }
    })();
  }, [language, t.nav]);
  
  const footerText = {
    intro: isEn
        ? 'GREEN HERBS EG is a premier Egyptian exporter of high-grade medicinal herbs, legumes, spices, and seeds. Cultivated with sustainable organic farming and shipped to over 50 countries worldwide.'
        : 'جرين هيربس إيجيبت هي شركة رائدة في تصدير الأعشاب الطبية والبهارات والبذور والبقوليات العالية الجودة، المزروعة بأساليب عضوية مستدامة والمُصدرة لأكثر من 50 دولة حول العالم.',
    products: isEn ? 'Our Products' : 'منتجاتنا',
    company: isEn ? 'Quick Links' : 'روابط سريعة',
    contact: isEn ? 'Contact Us' : 'اتصل بنا',
    rights: isEn ? 'All Rights Reserved.' : 'جميع الحقوق محفوظة.',
    terms: isEn ? 'Terms of Service' : 'شروط الخدمة',
    privacy: isEn ? 'Privacy Policy' : 'سياسة الخصوصية',
  };

  const fallbackCategories = [
    { id: 'herbs', slug: 'herbs', label: isEn ? 'Medicinal Herbs' : 'أعشاب طبية' },
    { id: 'spices', slug: 'spices', label: isEn ? 'Aromatic Spices' : 'توابل عطرية' },
    { id: 'seeds', slug: 'seeds', label: isEn ? 'Botanical Seeds' : 'بذور زراعية' },
    { id: 'dried-flowers', slug: 'dried-flowers', label: isEn ? 'Dried Flowers & Teas' : 'زهور مجففة وشاي' },
    { id: 'legumes', slug: 'legumes', label: isEn ? 'Grains & Legumes' : 'حبوب وبقوليات' },
  ];
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/products', label: t.nav.products },
    { href: '/certificates', label: t.nav.certificates },
    { href: '/catalog', label: t.nav.catalog },
    { href: '/team', label: t.nav.team },
    { href: '/export', label: t.nav.export },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className={`relative w-full bg-surface-container-lowest border-t border-outline-variant/30 ${language === 'ar' ? 'rtl' : ''}`}>
      {/* Top Green Accent Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-[#81c784]" />

      <div className="max-w-[1240px] mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-outline-variant/30">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 flex flex-col pr-4">
            <Link href="/" className="flex items-center gap-4 group text-decoration-none mb-6" aria-label="Home">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full group-hover:scale-105 transition-all duration-300 drop-shadow-[0_4px_20px_rgba(37,211,102,0.25)] flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="GREEN HERBS EG Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="font-extrabold text-[16px] sm:text-[18px] text-primary dark:text-white tracking-[0.14em] leading-tight flex items-center gap-1.5 font-headline-sm">
                  <span>GREEN HERBS</span>
                  <span className="text-secondary font-black">EG</span>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.26em] uppercase text-secondary/80 leading-none mt-1">
                  {isEn ? "Botanical Exports • Egypt" : "تصدير الأعشاب الطبية • مصر"}
                </span>
              </div>
            </Link>
            <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed max-w-sm mb-6">
              {footerText.intro}
            </p>
            <div className="flex items-start gap-3 text-on-surface-variant text-[14px] mb-4">
              <FiMapPin className="text-secondary shrink-0 mt-1 w-4 h-4" />
              <span>{isEn ? 'Egypt, Beni Suef Governorate, Sumusta Al Waqf' : 'جمهورية مصر العربية، محافظة بني سويف، سمسطا الوقف'}</span>
            </div>

            {/* Social Icons from old project */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://wa.me/201278201346"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary/15 hover:bg-secondary text-secondary hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61579242369455"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/khaled_arafet/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-gradient-to-tr hover:from-orange-500 hover:to-pink-500 text-secondary hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/soltan-samy-4968b737a"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-[#0A66C2] text-primary hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-3 lg:col-start-6 space-y-6">
            <span className="font-headline-sm text-lg font-bold text-primary block relative">
              {footerText.products}
              <span className="block w-8 h-0.5 bg-secondary mt-2 rounded-full" />
            </span>
            <ul className="space-y-3 font-body-md text-[15px]">
              {displayCategories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.id}`} className="text-on-surface-variant hover:text-secondary cursor-pointer transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors" />
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <span className="font-headline-sm text-lg font-bold text-primary block relative">
              {footerText.company}
              <span className="block w-8 h-0.5 bg-secondary mt-2 rounded-full" />
            </span>
            <ul className="space-y-2.5 font-body-md text-[14px]">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-on-surface-variant hover:text-secondary cursor-pointer transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details from old project */}
          <div className="lg:col-span-3 space-y-6">
            <span className="font-headline-sm text-lg font-bold text-primary block relative">
              {footerText.contact}
              <span className="block w-8 h-0.5 bg-secondary mt-2 rounded-full" />
            </span>
            <div className="space-y-3 font-body-md text-[14px] text-on-surface-variant">
              <div className="flex items-center gap-2.5">
                <FiMail className="text-secondary w-4 h-4 shrink-0" />
                <a href="mailto:sales@greenherbseg.com" className="hover:text-secondary transition-colors truncate">sales@greenherbseg.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-secondary w-4 h-4 shrink-0" />
                <a href="tel:+201278201346" className="hover:text-secondary transition-colors">Sales: +20 127 820 1346</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-secondary w-4 h-4 shrink-0" />
                <a href="tel:+201023891035" className="hover:text-secondary transition-colors">CEO: +20 102 389 1035</a>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/201278201346?text=Hello! I'm interested in GREEN HERBS EG products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>{isEn ? 'Chat on WhatsApp' : 'تحدث عبر واتساب'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Certificates & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-[13px] text-on-surface-variant">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-primary">GREEN HERBS EG</strong>. {footerText.rights}
          </div>
          <div className="flex items-center gap-3 text-xs opacity-75">
            <span>ISO 22000</span>
            <span>&bull;</span>
            <span>HACCP</span>
            <span>&bull;</span>
            <span>USDA Organic</span>
            <span>&bull;</span>
            <span>EU Organic</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
