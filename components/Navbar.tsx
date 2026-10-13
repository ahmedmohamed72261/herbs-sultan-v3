import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api from '@/lib/api';
import { FiChevronDown, FiGlobe, FiMenu, FiMoon, FiSun, FiX, FiArrowRight, FiPhone } from 'react-icons/fi';
import { FaWhatsapp, FaLeaf } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, theme, setLanguage, toggleTheme } = useAppStore();
  const t = translations[language];
  const router = useRouter();
  const isEn = language === 'en';

  const [categories, setCategories] = useState<{ id: string; order: number; slug: string; label: string }[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                label: slugToKey[c.slug] || (isEn ? c.name_en : c.name_ar),
              }))
              .sort((a: any, b: any) => a.order - b.order)
          );
        }
      } catch {
        // fallback silently
      }
    })();
  }, [language, t.nav, isEn]);

  const defaultCategories = [
    { id: 'herbs', order: 1, slug: 'herbs', label: isEn ? 'Medicinal Herbs' : 'أعشاب طبية' },
    { id: 'spices', order: 2, slug: 'spices', label: isEn ? 'Aromatic Spices' : 'توابل عطرية' },
    { id: 'seeds', order: 3, slug: 'seeds', label: isEn ? 'Botanical Seeds' : 'بذور زراعية' },
    { id: 'dried-flowers', order: 4, slug: 'dried-flowers', label: isEn ? 'Dried Flowers & Teas' : 'زهور مجففة وشاي' },
    { id: 'legumes', order: 5, slug: 'legumes', label: isEn ? 'Grains & Legumes' : 'حبوب وبقوليات' },
  ];
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/products', label: t.nav.products, dropdown: true },
    { href: '/certificates', label: t.nav.certificates },
    { href: '/catalog', label: t.nav.catalog },
    { href: '/team', label: t.nav.team },
    { href: '/export', label: t.nav.export },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${
        isScrolled
          ? 'bg-[#07130E]/95 py-2.5 sm:py-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl'
          : 'bg-[#07130E]/85 py-3 sm:py-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-xl'
      } ${!isEn ? 'rtl' : ''}`}
    >
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo with Image and Text */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group text-decoration-none shrink-0" aria-label="Home">
            <div className="relative w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 shrink-0 rounded-full group-hover:scale-105 transition-all duration-300 drop-shadow-[0_4px_16px_rgba(37,211,102,0.35)] flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Green Globe Herbs Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-extrabold text-[13px] sm:text-[16px] md:text-[17px] text-white tracking-[0.1em] sm:tracking-[0.14em] leading-tight flex items-center gap-1 sm:gap-1.5 font-headline-sm whitespace-nowrap">
                <span>GREEN GLOBE</span>
                <span className="text-emerald-400 font-black">HERBS</span>
              </div>
              <span className="block text-[8px] sm:text-[9.5px] md:text-[10px] font-bold tracking-[0.16em] sm:tracking-[0.24em] uppercase text-emerald-300/80 leading-none mt-0.5 sm:mt-1 whitespace-nowrap">
                {isEn ? "Botanical Exports • Egypt" : "تصدير الأعشاب الطبية • مصر"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;

              return (
                <div key={link.href} className="relative group flex items-center">
                  {link.dropdown ? (
                    <div className="relative">
                      <Link
                        href="/products"
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full font-label-sm text-[12px] tracking-wider transition-all duration-200 ${
                          router.pathname.startsWith('/products')
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(37,211,102,0.25)] font-bold'
                            : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold'
                        }`}
                      >
                        <span>{link.label}</span>
                        <FiChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 text-emerald-400" />
                      </Link>

                      {/* Mega Dropdown Menu */}
                      <div
                        className={`invisible absolute top-full mt-2 w-64 rounded-2xl bg-[#07130E]/95 backdrop-blur-2xl border border-white/20 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.7)] opacity-0 scale-95 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:scale-100 ${
                          !isEn ? 'right-0' : 'left-0'
                        }`}
                      >
                        <div className="p-1.5">
                          <Link
                            href="/products"
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-label-sm text-[11px] font-bold tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all mb-1.5"
                          >
                            <span>{isEn ? 'All Botanical Crops' : 'جميع المحاصيل النباتية'}</span>
                            <FiArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          <div className="space-y-0.5">
                            {displayCategories.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/products?category=${cat.id}`}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-label-sm text-[12px] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                                <span>{cat.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm text-[12px] tracking-wider transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(37,211,102,0.25)] font-bold'
                          : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold'
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />}
                      <span>{link.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Language & Theme Switchers */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors backdrop-blur-md"
              title="Switch language"
            >
              <FiGlobe className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md"
              title="Toggle theme"
            >
              {theme === 'light' ? <FiMoon className="h-3.5 w-3.5" /> : <FiSun className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] sm:text-xs transition-colors shrink-0 backdrop-blur-md"
              title="Switch language"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>

            <button
              onClick={toggleTheme}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 backdrop-blur-md"
              title="Toggle theme"
            >
              {theme === 'light' ? <FiMoon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <FiSun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-emerald-500/20 text-white border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors shrink-0"
              aria-label="Toggle Mobile Navigation"
            >
              {isMenuOpen ? <FiX className="h-4 w-4 sm:h-5 sm:w-5 text-white" /> : <FiMenu className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-300" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#07130E]/95 backdrop-blur-3xl z-50 lg:hidden overflow-y-auto px-6 py-6 flex flex-col pointer-events-auto"
          >
            {/* Header in Mobile Menu */}
            <div className="flex items-center justify-between pb-6 border-b border-white/15">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center drop-shadow-md">
                  <img src="/images/logo.png" alt="Green Globe Herbs Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <div className="font-extrabold text-white text-base tracking-wider font-headline-sm flex items-center gap-1.5">
                    <span>GREEN GLOBE</span> <span className="text-emerald-400 font-black">HERBS</span>
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-emerald-300/80 leading-none mt-1">
                    {isEn ? "Botanical Exports • Egypt" : "تصدير الأعشاب الطبية • مصر"}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white border border-white/15"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-2 mt-6">
              {navLinks.map((link) => (
                <div key={link.href} className="border-b border-white/10 pb-2">
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => setIsProductsOpen(!isProductsOpen)}
                        className={`flex w-full items-center justify-between py-2 text-white ${!isEn ? 'flex-row-reverse' : ''}`}
                      >
                        <span className="font-headline-sm text-lg font-bold">{link.label}</span>
                        <FiChevronDown className={`h-5 w-5 transition-transform text-emerald-400 ${isProductsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-2 pl-4 pr-4 pb-2"
                          >
                            <Link
                              href="/products"
                              onClick={() => setIsMenuOpen(false)}
                              className="py-1.5 text-emerald-300 font-bold text-sm"
                            >
                              {isEn ? '→ All Botanical Crops' : '← جميع المحاصيل'}
                            </Link>
                            {displayCategories.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/products?category=${cat.id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="py-1 text-white/80 text-sm hover:text-white"
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-2 font-headline-sm text-lg font-bold text-white hover:text-emerald-300 transition-colors ${
                        !isEn ? 'text-right' : 'text-left'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="mt-auto pt-6 space-y-3">
              <a
                href={`https://wa.me/201278201346?text=${encodeURIComponent('Hello Green Globe Herbs!')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#25D366] text-white font-bold text-sm shadow-lg"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{isEn ? 'WhatsApp Export Desk' : 'واتساب المبيعات'}</span>
              </a>

              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="btn-shine flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm shadow-xl"
              >
                <span>{isEn ? 'Request Instant Quotation' : 'طلب تسعير فوري'}</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

