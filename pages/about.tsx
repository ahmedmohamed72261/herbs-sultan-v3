import { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import {
  FiTarget, FiEye, FiHeart, FiAward, FiGlobe,
  FiPlay, FiPause, FiShield, FiCheck,
} from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaHandsHelping, FaBookOpen } from 'react-icons/fa';
import Link from 'next/link';

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

function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
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

const About = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.aboutPage;
  const isEn = language === 'en';

  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else { videoRef.current.play(); setIsPlaying(true); }
  };

  const stats = [
    { number: 25,  suffix: "+", label: isEn ? "Years Experience"    : "سنوات خبرة"     },
    { number: 500, suffix: "+", label: isEn ? "Premium Products"    : "منتجات فاخرة"   },
    { number: 50,  suffix: "+", label: isEn ? "Global Markets"      : "أسواق عالمية"   },
    { number: 100, suffix: "%", label: isEn ? "Client Satisfaction" : "رضا العملاء"    },
  ];

  const missionPillars = [
    {
      icon: FaSeedling,
      title: isEn ? "Premium Sourcing" : "مصادر فائقة الجودة",
      desc: isEn
        ? "We source the finest herbs, spices, and natural products from certified Egyptian farms, working directly with cultivators who share our values."
        : "نحصل على أرقى الأعشاب والتوابل من مزارع مصرية معتمدة بالتعاون المباشر مع مزارعين يشاركوننا قيمنا.",
    },
    {
      icon: FiGlobe,
      title: isEn ? "Sustainable Practices" : "ممارسات مستدامة",
      desc: isEn
        ? "We support sustainable farming and fair trade, ensuring a positive impact on agricultural communities and ecosystems."
        : "ندعم الزراعة المستدامة والتجارة العادلة لضمان أثر إيجابي على المجتمعات الريفية والبيئة.",
    },
    {
      icon: FaBookOpen,
      title: isEn ? "Education & Awareness" : "الوعي والمعرفة",
      desc: isEn
        ? "We educate our partners about the benefits of natural botanical ingredients, empowering informed health and food choices."
        : "نشارك شركاءنا المعرفة حول فوائد النباتات الطبية لدعم قرارات صحية وغذائية مدروسة.",
    },
    {
      icon: FaHandsHelping,
      title: isEn ? "Exceptional Service" : "خدمة استثنائية",
      desc: isEn
        ? "We provide dedicated customer service and deep product expertise, building lasting international relationships based on trust."
        : "نقدم خدمة عملاء مخصصة وخبرة فنية عميقة لبناء شراكات دولية متينة قائمة على الثقة.",
    },
    {
      icon: FiHeart,
      title: isEn ? "Community Impact" : "أثر مجتمعي",
      desc: isEn
        ? "We contribute to rural health and economic prosperity through fair purchasing partnerships and sustainable harvesting."
        : "نساهم في دعم الاقتصاد الريفي عبر شراكات توريد عادلة ومبادرات حصاد مسؤولة.",
    },
    {
      icon: FaLeaf,
      title: isEn ? "Organic Excellence" : "تميز عضوي",
      desc: isEn
        ? "We are committed to organic farming principles, ensuring our botanicals are completely free from synthetic pesticides."
        : "ملتزمون بمبادئ الزراعة العضوية لضمان خلو جميع محاصيلنا من المبيدات الاصطناعية.",
    },
  ];

  return (
    <Layout title={t.about.title}>

      {/* ══════════════════════════════════════════════════════
          §1  HERO — Full-bleed overlay
      ════════════════════════════════════════════════════ */}
      <section className={`relative h-[62vh] min-h-[480px] flex flex-col justify-center overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="absolute inset-0 z-0">
          <img src="/images/about.jpg" alt="About GREEN HERBS EG" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-[#07130E]/90" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 mb-5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-white uppercase font-bold">{page.heroBadge}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline-lg text-[36px] sm:text-[60px] md:text-[76px] font-bold text-white leading-[1.08] tracking-tight mb-5 max-w-4xl">
            {t.about.title}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }}
            className="text-white/80 text-[16px] sm:text-[19px] leading-relaxed max-w-xl">
            {isEn
              ? "Pioneering the export of premium botanical ingredients with an unwavering commitment to quality and purity."
              : "ريادة في تصدير المكونات النباتية الفاخرة مع التزام راسخ بالجودة والنقاء."}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  OUR STORY — Video + Text split
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-20 sm:py-28 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/12 top-0 left-0" />
        <Orb className="w-[500px] h-[500px] bg-primary/8 bottom-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Video */}
            <Reveal>
              <div className="relative">
                <div className="rounded-[28px] overflow-hidden aspect-[16/10] relative shadow-2xl border border-white/20 dark:border-white/10 bg-black">
                  <video ref={videoRef} src="/assets/videos/intro.mp4" autoPlay loop muted playsInline
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                  <button onClick={toggleVideo}
                    className="absolute bottom-5 right-5 z-20 w-11 h-11 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white flex items-center justify-center hover:bg-secondary transition-all shadow-lg"
                    aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="absolute bottom-5 left-5 z-20 text-white text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                    🌱 {isEn ? "Egyptian Farm Harvest" : "حصاد المزارع المصرية"}
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-7 -right-5 z-20 rounded-2xl p-5 shadow-2xl bg-white/85 dark:bg-[#0B1A13]/90 backdrop-blur-2xl border border-white/50 dark:border-white/20 hidden md:block"
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <FiGlobe className="w-7 h-7 text-secondary mb-2" />
                  <div className="font-bold text-[16px] text-primary mb-0.5">Global Exporter</div>
                  <div className="text-[12px] text-on-surface-variant">Trusted across Europe, Americas & Gulf.</div>
                </motion.div>
              </div>
            </Reveal>

            {/* Text */}
            <Reveal delay={0.18}>
              <SectionLabel text={page.storyBadge} />
              <h2 className="font-headline-lg text-[30px] sm:text-[42px] font-bold text-primary tracking-tight mb-6 leading-tight">
                {isEn ? "Rooted in Quality, Growing Globally." : "جذور في الجودة، ونمو عالمي."}
              </h2>
              <div className="space-y-4 mb-6">
                <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant leading-relaxed">
                  {page.storyDescriptionOne}
                </p>
                <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant leading-relaxed">
                  {page.storyDescriptionTwo}
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {["🌿 100% Certified Organic", "🌍 ISO 22000 & HACCP", "✨ Direct Egypt Sourcing"].map((chip) => (
                  <span key={chip} className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-secondary/12 text-secondary border border-secondary/20">
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  STATS — 4 clean cards
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-16 overflow-hidden bg-surface-container/30 border-y border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="px-5 py-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm text-center hover:-translate-y-1 transition-all duration-300">
                  <div className="font-headline-lg text-[38px] sm:text-[52px] font-bold text-secondary mb-1">
                    <CountUp target={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="font-label-sm text-[11px] text-primary uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  MISSION, VISION, VALUES — 3 feature cards
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-20 sm:py-28 overflow-hidden bg-background ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-primary/10 top-0 right-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-14">
            <SectionLabel text={page.philosophyBadge} />
            <h2 className="font-headline-lg text-[30px] sm:text-[46px] font-bold text-primary tracking-tight">
              {page.philosophyTitle}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FiTarget, color: "secondary", iconColor: "text-secondary", bg: "bg-secondary/12", title: t.about.mission, body: page.missionDescription },
              { icon: FiEye, color: "primary", iconColor: "text-primary", bg: "bg-primary/10", title: t.about.vision, body: page.visionDescription },
              { icon: FiHeart, color: "secondary", iconColor: "text-secondary", bg: "bg-secondary/12", title: page.valuesTitle, body: page.valuesDescription },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`p-8 h-full rounded-[28px] bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:border-secondary/30 transition-all duration-300 group flex flex-col`}>
                  <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center mb-5 shadow-inner group-hover:bg-secondary group-hover:text-white transition-colors ${card.iconColor}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline-sm text-[21px] font-bold text-primary mb-3">{card.title}</h3>
                  <p className="font-body-md text-[14px] sm:text-[15px] text-on-surface-variant leading-relaxed flex-1">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  HOW WE DELIVER — 6 Pillars in alternating 2-col layout
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full py-20 sm:py-28 overflow-hidden bg-surface-container/25 border-t border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[450px] h-[450px] bg-secondary/10 top-1/3 left-0" />

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-14">
            <SectionLabel text={isEn ? "Pillars of Excellence" : "ركائز التميز"} />
            <h2 className="font-headline-lg text-[30px] sm:text-[46px] font-bold text-primary tracking-tight mb-3">
              {isEn ? "How We Deliver Pure Quality" : "كيف نضمن أعلى درجات الجودة"}
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant max-w-xl mx-auto">
              {isEn
                ? "From sustainable seed selection to international freight, our operational philosophy rests on six pillars."
                : "من انتقاء البذور المستدامة حتى الشحن الدولي، ترتكز فلسفة عملنا على ست ركائز متكاملة."}
            </p>
          </Reveal>

          {/* 3-column grid — larger cards with more space */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {missionPillars.map((pillar, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="p-7 rounded-[24px] bg-white/65 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-lg hover:border-secondary/35 hover:-translate-y-1 transition-all duration-300 flex gap-5 group h-full">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary/12 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-[17px] font-bold text-primary mb-2">{pillar.title}</h3>
                    <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Reveal delay={0.3}>
              <Link href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-surface font-label-sm text-[13px] font-bold tracking-widest uppercase hover:bg-secondary transition-colors shadow-xl btn-shine">
                {isEn ? "Partner With GREEN HERBS EG" : "كن شريكاً لجرين هيربس إيجيبت"}
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §6  WHY CHOOSE US — Full Feature Overview
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full border-t border-outline-variant/20 bg-background py-20 sm:py-28 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 -bottom-20 left-10" />

        <div className="max-w-[860px] mx-auto px-6 text-center relative z-10 mb-14">
          <Reveal>
            <SectionLabel text={isEn ? "Excellence Guaranteed" : "التميز مضمون"} />
            <h2 className="font-headline-lg text-[30px] sm:text-[46px] font-bold text-primary tracking-tight mb-4 leading-tight">
              {page.whyChooseUsTitle}
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant leading-relaxed">
              {page.whyChooseUsIntro}
            </p>
          </Reveal>
        </div>

        <div className="max-w-[1240px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {page.whyChooseUsSections.map((section: any, i: number) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="flex gap-5 p-7 rounded-[24px] bg-white/65 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-sm hover:border-secondary/35 hover:shadow-md transition-all h-full">
                  {/* Number badge */}
                  <div className="w-11 h-11 shrink-0 rounded-full bg-secondary/12 flex items-center justify-center font-headline-sm text-secondary font-bold text-[15px]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-[18px] font-bold text-primary mb-2">{section.title}</h3>
                    <p className="font-body-sm text-[13px] sm:text-[14px] text-on-surface-variant leading-relaxed">{section.body}</p>
                    {/* Certifications only on card index 1 */}
                    {i === 1 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {page.certifications.map((cert: string, j: number) => (
                          <div key={j} className="flex items-center gap-2 font-label-sm text-[11px] text-primary font-bold">
                            <FiAward className="text-secondary w-3.5 h-3.5 shrink-0" />
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
