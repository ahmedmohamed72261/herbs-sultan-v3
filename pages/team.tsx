import { useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import {
  FiUsers, FiAward, FiMail, FiLinkedin,
  FiArrowRight, FiCheckCircle, FiShield
} from 'react-icons/fi';
import { FaWhatsapp, FaLeaf, FaSeedling } from 'react-icons/fa';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';

/* ── Floating ambient orb ──────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
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

const defaultTeamMembers = [
  {
    id: 1,
    name_en: "Eng. Sultan Abdel-Rahman",
    name_ar: "م. سلطان عبد الرحمن",
    position_en: "Executive Chairman & Founder",
    position_ar: "رئيس مجلس الإدارة والمؤسس",
    bio_en: "Over 30 years pioneering organic medicinal herb cultivation across Egypt's Nile basin. Champions direct contract farming and farmer equity in Beni Suef.",
    bio_ar: "أكثر من 30 عاماً من الريادة في زراعة وتصدير الأعشاب الطبية العضوية في حوض النيل. قاد تأسيس الزراعات التعاقدية ودعم مزارعي بني سويف.",
    email: "ceo@greenherbseg.com",
    phone: "+201023891035",
    specialty: "Agronomic Heritage & Global Partnerships",
  },
  {
    id: 2,
    name_en: "Dr. Mostafa El-Husseiny",
    name_ar: "د. مصطفى الحسيني",
    position_en: "Head of Agronomy & Organic Soil Science",
    position_ar: "رئيس قسم التغذية الزراعية والتربة العضوية",
    bio_en: "PhD in Botanical Plant Sciences. Supervises organic crop cycles, biological pest prevention, and regenerative Nile alluvial soil stewardship.",
    bio_ar: "دكتوراه في علوم النباتات الطبية. يشرف على دورات الزراعة العضوية، والمكافحة الحيوية للآفات، وخصوبة تربة طمي النيل المتجددة.",
    email: "agronomy@greenherbseg.com",
    phone: "+201278201346",
    specialty: "Soil Biology & Organic Non-GMO Seed Bank",
  },
  {
    id: 3,
    name_en: "Eng. Sarah Mansour",
    name_ar: "م. سارة منصور",
    position_en: "Director of Quality Control & GC-MS Lab",
    position_ar: "مديرة مراقبة الجودة ومختبر التحليل الكروماتوغرافي",
    bio_en: "Leads our ISO 17025 accredited analytical facility. Specializes in gas chromatography volatile oil profiling and EU pesticide residue screening.",
    bio_ar: "تقود مختبر الفحص الكيميائي والميكروبي. متخصصة في تحليل نسب الزيوت الطيارة بالكروماتوغرافيا ومطابقة شروط الاتحاد الأوروبي.",
    email: "qa@greenherbseg.com",
    phone: "+201278201346",
    specialty: "GC-MS Chromatography & Food Safety",
  },
  {
    id: 4,
    name_en: "Ahmed Radwan",
    name_ar: "أحمد رضوان",
    position_en: "VP of Global Logistics & Ocean Freight",
    position_ar: "نائب رئيس قطاع اللوجستيات والشحن البحري",
    bio_en: "Oversees direct ocean container sailings from Alexandria and Damietta ports. Expert in international Incoterms, phytosanitary seals, and customs release.",
    bio_ar: "يشرف على شحن الحاويات البحرية عبر موانئ الإسكندرية ودمياط. خبير في اللوائح التجارية الدولية، والإفراج الصحي النباتي، والشحن البحري.",
    email: "logistics@greenherbseg.com",
    phone: "+201278201346",
    specialty: "Ocean Freight & Customs Fast-Track",
  },
];

const Team = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';
  
  const { teamMembers, loading: apiLoading, fetchTeamMembers } = useApi();

  useEffect(() => {
    if (teamMembers.length === 0) {
      fetchTeamMembers();
    }
  }, [teamMembers.length]);

  const displayedTeam = teamMembers.length > 0 ? teamMembers : defaultTeamMembers;

  return (
    <Layout title={t.nav.team}>
      
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Agricultural & Export Leadership
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 sm:pt-40 pb-20 sm:pb-24 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/20 top-[-100px] left-[-100px]" />
        <Orb className="w-[500px] h-[500px] bg-primary/25 bottom-[-100px] right-[-100px]" />
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
              {isEn ? "Agronomic & Trade Leadership • Beni Suef, Egypt" : "القيادة الزراعية والتصديرية • بني سويف، مصر"}
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
                The Agronomists & <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  Export Trade Leadership
                </span>
              </>
            ) : (
              <>
                الخبراء الزراعيون <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  وفريق قيادة التجارة الدولية
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
              ? "Meet the agronomists, quality assurance scientists, and ocean freight specialists who ensure every GREEN HERBS EG botanical shipment represents the gold standard of Egyptian exports."
              : "تعرف على مهندسي الزراعة العضوية، وعلماء الجودة المعملية، وخبراء الملاحة البحرية الذين يضمنون خروج كل شحنة بأعلى معايير التميز المصري إلى أسواق العالم."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">25+ Yrs</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Agricultural Heritage" : "خبرة زراعية متوارثة"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">100%</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Direct Farm Oversight" : "إشراف حقلي مباشر"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">ISO 17025</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "In-House QA Lab" : "مختبر جودة معتمد"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">24/7</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Global Trade Desk" : "مكتب تصدير دائم"}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  LEADERSHIP DIRECTORY GRID
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-24 sm:py-32 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[700px] h-[700px] bg-secondary/10 top-0 right-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {displayedTeam.map((member: any, i: number) => {
              const memberName = isEn ? (member.name_en || member.name) : (member.name_ar || member.name);
              const memberRole = isEn ? (member.position_en || member.role) : (member.position_ar || member.role);
              const memberBio = isEn ? (member.bio_en || member.bio) : (member.bio_ar || member.bio);

              return (
                <Reveal key={member.id || i} delay={i * 0.1}>
                  <div className="rounded-[36px] p-8 sm:p-10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group hover:-translate-y-1">
                    
                    <div>
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-extrabold shadow-md shrink-0">
                          {memberName?.charAt(0) || "G"}
                        </div>
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-secondary/15 text-secondary font-label-sm text-[11px] font-bold uppercase tracking-wider mb-1.5">
                            {memberRole}
                          </span>
                          <h3 className="font-headline-sm text-[24px] font-bold text-primary group-hover:text-secondary transition-colors">
                            {memberName}
                          </h3>
                        </div>
                      </div>

                      <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed mb-6">
                        {memberBio}
                      </p>

                      {member.specialty && (
                        <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 text-xs mb-6">
                          <strong className="text-secondary text-[11px] uppercase tracking-wider block mb-0.5">
                            {isEn ? "Core Focus:" : "مجال التخصص:"}
                          </strong>
                          <span className="text-primary font-medium">{member.specialty}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between gap-4 mt-auto">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5"
                        >
                          <FiMail className="w-4 h-4 text-secondary" />
                          <span>{member.email}</span>
                        </a>
                      )}

                      <a
                        href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello GREEN HERBS EG, I would like to connect with ${member.name_en || member.name}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                        <span>{isEn ? "Direct Chat" : "محادثة"}</span>
                      </a>
                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  CONNECT WITH OUR EXPORT BOARD CTA
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-24 bg-surface-container/60 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <div className="rounded-[40px] bg-gradient-to-br from-white/90 to-surface-container/70 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-12 lg:p-16 shadow-2xl">
            <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase mb-4 block">
              {isEn ? "Executive Consultation" : "استشارة مباشرة مع الإدارة"}
            </span>
            <h2 className="font-headline-lg text-[32px] sm:text-[46px] font-bold text-primary tracking-tight mb-6">
              {isEn ? "Schedule a Strategic Meeting with Our Trade Directors" : "احجز اجتماعاً استراتيجياً مع مسؤولي التصدير والإدارة"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              {isEn
                ? "Discuss long-term contract cultivation, annual volume allocations, private label packaging, and exclusive seasonal harvest commitments."
                : "ناقش عقود التوريد السنوية طويلة الأجل، وحصص الإنتاج المخصصة لشركتكم، والتعبئة الخاصة بأسعار ثابتة للموسم."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-shine inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-primary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-xl"
              >
                <span>{isEn ? "Contact Export Office" : "تواصل مع مكتب الإدارة"}</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/201278201346?text=Hello%20Green%20Globe%20Herbs,%20I%20would%20like%20to%20schedule%20a%20meeting%20with%20your%20directors."
                target="_blank"
                rel="noreferrer"
                className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all shadow-md"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{isEn ? "WhatsApp Chairman Office" : "واتساب مكتب رئيس مجلس الإدارة"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Team;