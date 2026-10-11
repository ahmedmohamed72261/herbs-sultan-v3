import { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import {
  FiTarget,
  FiEye,
  FiHeart,
  FiAward,
  FiGlobe,
  FiPlay,
  FiPause,
  FiShield,
  FiCheck,
} from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaHandsHelping, FaBookOpen } from 'react-icons/fa';
import Link from 'next/link';

/* ── Animated counter ──────────────────────────────────────── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (2500 / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Floating orb for Glassmorphism ────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
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

const About = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.aboutPage;
  const isEn = language === 'en';

  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const stats = [
    { number: 25, label: isEn ? "Years Experience" : "سنوات خبرة", suffix: "+" },
    { number: 500, label: isEn ? "Premium Products" : "منتجات فاخرة", suffix: "+" },
    { number: 50, label: isEn ? "Global Markets" : "أسواق عالمية", suffix: "+" },
    { number: 100, label: isEn ? "Client Satisfaction" : "رضا العملاء", suffix: "%" },
  ];

  const missionPillars = [
    {
      icon: FaSeedling,
      title: isEn ? "Premium Sourcing" : "مصادر فائقة الجودة",
      desc: isEn
        ? "We source the finest herbs, spices, and natural products from certified Egyptian farms, working directly with cultivators who share our values."
        : "نحصل على أرقى الأعشاب والتوابل والمنتجات الطبيعية من مزارع مصرية معتمدة، بالتعاون المباشر مع مزارعين يشاركوننا قيمنا.",
    },
    {
      icon: FiGlobe,
      title: isEn ? "Sustainable Practices" : "ممارسات مستدامة",
      desc: isEn
        ? "We support sustainable farming practices and fair trade, ensuring our business has a positive impact on agricultural communities and ecosystems."
        : "ندعم الممارسات الزراعية المستدامة والتجارة العادلة، لضمان تأثير إيجابي على المجتمعات الريفية والبيئة.",
    },
    {
      icon: FaBookOpen,
      title: isEn ? "Education & Awareness" : "الوعي والمعرفة",
      desc: isEn
        ? "We educate our partners about the benefits and optimal uses of natural botanical ingredients, empowering informed health and food choices."
        : "نشارك شركاءنا المعرفة حول فوائد واستخدامات النباتات الطبية الطبيعية لدعم قرارات صحية وغذائية مدروسة.",
    },
    {
      icon: FaHandsHelping,
      title: isEn ? "Exceptional Service" : "خدمة استثنائية",
      desc: isEn
        ? "We provide dedicated customer service and deep product expertise, building lasting international relationships based on trust and satisfaction."
        : "نقدم خدمة عملاء مخصصة وخبرة فنية عميقة بالمنتجات، لنبني شراكات دولية متينة قائمة على الثقة والرضا.",
    },
    {
      icon: FiHeart,
      title: isEn ? "Community Impact" : "أثر مجتمعي",
      desc: isEn
        ? "We contribute to rural health and economic prosperity through our fair purchasing partnerships and sustainable harvesting initiatives."
        : "نساهم في دعم الاقتصاد الريفي والرفاهية المجتمعية من خلال شراكات توريد عادلة ومبادرات حصاد مسؤولة.",
    },
    {
      icon: FaLeaf,
      title: isEn ? "Organic Excellence" : "تميز عضوي",
      desc: isEn
        ? "We are committed to organic farming principles, ensuring our botanicals are completely free from synthetic pesticides and harmful chemicals."
        : "ملتزمون بمبادئ الزراعة العضوية، لضمان خلو جميع محاصيلنا من المبيدات الاصطناعية والمواد الكيميائية الضارة.",
    },
  ];

  return (
    <Layout title={t.about.title}>
      
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Glassmorphism & Image Overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[65vh] min-h-[500px] sm:min-h-[600px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/about.jpg" alt="About Green Globe Herbs" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#07130E]/90 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 w-full text-center flex flex-col items-center mt-12 sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 mb-5 sm:mb-8 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
            <span className="font-label-sm text-[10px] sm:text-[11px] tracking-[0.2em] text-white uppercase font-bold">
              {page.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline-lg text-[32px] sm:text-[56px] md:text-[80px] font-bold text-white leading-[1.1] sm:leading-[1.05] tracking-tight mb-4 sm:mb-6 max-w-4xl"
          >
            {t.about.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/85 text-[15px] sm:text-[18px] md:text-[22px] leading-relaxed max-w-2xl font-body-lg"
          >
            {isEn ? "Pioneering the export of premium botanical ingredients with an unwavering commitment to quality and purity." : "ريادة في تصدير المكونات النباتية الفاخرة مع التزام راسخ بالجودة والنقاء."}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  OUR STORY — Glassmorphism Split with Video
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-16 sm:py-28 lg:py-36 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-secondary/15 top-0 left-0" />
        <Orb className="w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-primary/10 bottom-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            
            <Reveal>
              <div className="relative group">
                <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[4/3] sm:aspect-[16/10] relative shadow-2xl border border-white/20 dark:border-white/10 z-10 bg-black">
                  <video
                    ref={videoRef}
                    src="/assets/videos/intro.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={toggleVideo}
                    className="absolute bottom-6 right-6 z-20 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-white flex items-center justify-center hover:bg-secondary transition-all hover:scale-110 shadow-lg"
                    aria-label={isPlaying ? "Pause Video" : "Play Video"}
                  >
                    {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="absolute bottom-6 left-6 z-20 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                    🌱 {isEn ? "Egyptian Farm Harvest" : "حصاد المزارع المصرية"}
                  </div>
                </div>

                {/* Floating Glass Badge */}
                <motion.div
                  className="absolute -bottom-8 -right-6 z-20 rounded-3xl p-6 shadow-2xl bg-white/80 dark:bg-[#0B1A13]/90 backdrop-blur-2xl border border-white/50 dark:border-white/20 max-w-[240px] hidden md:block"
                  animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FiGlobe className="w-8 h-8 text-secondary mb-3 drop-shadow-md" />
                  <div className="font-headline-sm text-[18px] font-bold text-primary mb-1">Global Exporter</div>
                  <div className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">Trusted across Europe, Americas & Gulf.</div>
                </motion.div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-4 sm:mb-6 font-bold">
                <span className="w-5 h-px bg-secondary inline-block" />
                {page.storyBadge}
              </span>
              <h2 className="font-headline-lg text-[28px] sm:text-[40px] md:text-[50px] font-bold text-primary tracking-tight mb-5 sm:mb-6 leading-tight">
                {isEn ? "Rooted in Quality, Growing Globally." : "جذور في الجودة، ونمو عالمي."}
              </h2>
              
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg space-y-4">
                <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant leading-relaxed">
                  {page.storyDescriptionOne}
                </p>
                <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant leading-relaxed">
                  {page.storyDescriptionTwo}
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/20">
                    🌿 100% Certified Organic
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    🌍 ISO 22000 & HACCP
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/20">
                    ✨ Direct Egypt Sourcing
                  </span>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  STATS — Frosted Glass Cards
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-12 sm:py-20 overflow-hidden bg-surface-container/40 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-secondary/5 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
        
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="px-3 py-6 sm:px-6 sm:py-10 rounded-2xl sm:rounded-[32px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="font-headline-lg text-[32px] sm:text-[48px] md:text-[56px] font-bold text-secondary mb-1 sm:mb-3 flex items-center justify-center">
                    <CountUp target={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="font-label-sm text-[10px] sm:text-[12px] text-primary uppercase tracking-wider sm:tracking-widest font-bold">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  MISSION, VISION, VALUES — Premium 3-Card Grid
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-16 sm:py-28 lg:py-36 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-primary/10 top-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12 sm:mb-20">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {page.philosophyBadge}
            </span>
            <h2 className="font-headline-lg text-[28px] sm:text-[44px] md:text-[56px] font-bold text-primary tracking-tight">
              {page.philosophyTitle}
            </h2>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Mission */}
            <Reveal delay={0.1}>
              <div className="p-8 sm:p-10 h-full rounded-2xl sm:rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-300 group flex flex-col">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mb-6 shadow-inner group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                  <FiTarget className="w-7 h-7" />
                </div>
                <h3 className="font-headline-sm text-[22px] sm:text-[26px] font-bold text-primary mb-3">
                  {t.about.mission}
                </h3>
                <p className="font-body-md text-[14px] sm:text-[16px] text-on-surface-variant leading-relaxed flex-1">
                  {page.missionDescription}
                </p>
              </div>
            </Reveal>

            {/* Vision */}
            <Reveal delay={0.2}>
              <div className="p-8 sm:p-10 h-full rounded-2xl sm:rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-300 group flex flex-col">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-inner group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                  <FiEye className="w-7 h-7" />
                </div>
                <h3 className="font-headline-sm text-[22px] sm:text-[26px] font-bold text-primary mb-3">
                  {t.about.vision}
                </h3>
                <p className="font-body-md text-[14px] sm:text-[16px] text-on-surface-variant leading-relaxed flex-1">
                  {page.visionDescription}
                </p>
              </div>
            </Reveal>

            {/* Values */}
            <Reveal delay={0.3}>
              <div className="p-8 sm:p-10 h-full rounded-2xl sm:rounded-[32px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-300 group flex flex-col">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mb-6 shadow-inner group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                  <FiHeart className="w-7 h-7" />
                </div>
                <h3 className="font-headline-sm text-[22px] sm:text-[26px] font-bold text-primary mb-3">
                  {page.valuesTitle}
                </h3>
                <p className="font-body-md text-[14px] sm:text-[16px] text-on-surface-variant leading-relaxed flex-1">
                  {page.valuesDescription}
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  THE 6 CORE MISSION PILLARS (From Old Project)
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-16 sm:py-28 lg:py-36 overflow-hidden bg-surface-container/30 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[450px] h-[450px] bg-secondary/10 top-1/3 left-10" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12 sm:mb-20">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <span className="w-5 h-px bg-secondary inline-block" />
              {isEn ? "Pillars of Excellence" : "ركائز التميز"}
            </span>
            <h2 className="font-headline-lg text-[28px] sm:text-[44px] md:text-[52px] font-bold text-primary tracking-tight mb-4">
              {isEn ? "How We Deliver Pure Quality" : "كيف نضمن أعلى درجات الجودة"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto">
              {isEn
                ? "From sustainable seed selection to international freight, our operational philosophy rests on six pillars."
                : "من انتقاء البذور المستدامة حتى الشحن الدولي، ترتكز فلسفة عملنا على ست ركائز متكاملة."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {missionPillars.map((pillar, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-secondary/40 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-6 shadow-inner group-hover:bg-secondary group-hover:text-white transition-all">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline-sm text-[20px] font-bold text-primary mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-body-sm text-[15px] text-on-surface-variant leading-relaxed flex-1">
                    {pillar.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Reveal delay={0.4}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-surface font-label-sm text-[13px] font-bold tracking-widest uppercase hover:bg-secondary transition-colors shadow-xl btn-shine"
              >
                {isEn ? "Partner With Green Globe Herbs" : "كن شريكاً لجرين جلوب للأعشاب"}
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §6  WHY CHOOSE US — Full Feature Overview
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full border-t border-outline-variant/30 bg-background py-16 sm:py-28 lg:py-36 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-secondary/10 -bottom-20 left-10" />
        
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center relative z-10 mb-10 sm:mb-20">
          <Reveal>
            <span className="font-label-sm text-[11px] sm:text-[12px] tracking-widest text-secondary uppercase block mb-3 font-bold">
              {isEn ? "Excellence Guaranteed" : "التميز مضمون"}
            </span>
            <h2 className="font-headline-lg text-[26px] sm:text-[44px] md:text-[56px] font-bold text-primary tracking-tight mb-4 sm:mb-8 leading-tight">
              {page.whyChooseUsTitle}
            </h2>
            <div className="font-body-lg text-[15px] sm:text-[18px] text-on-surface-variant leading-relaxed">
              {page.whyChooseUsIntro}
            </div>
          </Reveal>
        </div>

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {page.whyChooseUsSections.map((section: any, i: number) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-lg hover:border-secondary/40 transition-colors h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl sm:rounded-full bg-secondary/15 flex items-center justify-center font-headline-sm text-secondary font-bold text-lg sm:text-xl">
                    0{i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-[18px] sm:text-[22px] font-bold text-primary mb-2 sm:mb-3">
                      {section.title}
                    </h3>
                    <p className="font-body-sm text-[14px] sm:text-[15px] text-on-surface-variant leading-relaxed">
                      {section.body}
                    </p>
                    {/* Quality Certifications Grid */}
                    {i === 1 && (
                      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {page.certifications.map((cert: string, j: number) => (
                          <div key={j} className="flex items-center gap-2 font-label-sm text-[12px] text-primary font-bold bg-white/40 dark:bg-white/5 px-3 py-1.5 rounded-lg sm:bg-transparent sm:p-0">
                            <FiAward className="text-secondary w-4 h-4 shrink-0" />
                            <span className="truncate">{cert}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default About;


