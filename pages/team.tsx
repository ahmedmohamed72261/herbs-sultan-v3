import { useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import {
  FiPhone, FiMail, FiArrowRight, FiCheckCircle
} from 'react-icons/fi';
import { FaWhatsapp, FaLeaf } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

/* ── Floating ambient orb (opacity only to prevent mobile vibration) ── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none select-none max-w-full ${className}`}
      animate={{ opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── Scroll-triggered reveal ───────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Real Executive Team ───────────────────────────────────── */
const teamMembers = [
  {
    id: 1,
    name_en: "Soltan Samy",
    name_ar: "سلطان سامي",
    position_en: "Chief Executive Officer & Founder",
    position_ar: "الرئيس التنفيذي والمؤسس",
    badge_en: "Executive Leadership",
    badge_ar: "القيادة التنفيذية",
    role_tag_en: "CEO",
    role_tag_ar: "الرئيس التنفيذي",
    bio_en: "Pioneering the export of premium Egyptian organic herbs and botanicals to international markets. Leading GREEN HERBS EG's global trade relations, contract farming standards in Beni Suef, and long-term partnerships across Europe, North America, and the Gulf.",
    bio_ar: "يقود استراتيجية تصدير أجود الأعشاب والنباتات الطبية المصرية إلى الأسواق العالمية. يشرف على الشراكات الدولية وتطبيق أعلى معايير الزراعة التعاقدية في بني سويف وعقود التوريد المباشرة لأوروبا وأمريكا الشمالية ودول الخليج.",
    phone: "+20 102 389 1035",
    phone_clean: "201023891035",
    email: "ceo@greenherbseg.com",
    photo: "/images/team/Soltan_Samy.jpeg",
    photoFocus: "object-[center_18%]",
    specialty_en: "Strategic Partnerships & Global Herb Export",
    specialty_ar: "الشراكات الدولية والاستراتيجية وتصدير الأعشاب الطبية",
    stats: [
      { val: "25+", en: "Years Experience", ar: "عاماً من الخبرة" },
      { val: "30+", en: "Export Countries", ar: "دولة مستوردة" },
    ]
  },
  {
    id: 2,
    name_en: "Ahmed Samy",
    name_ar: "أحمد سامي",
    position_en: "Head of International Sales",
    position_ar: "رئيس قطاع المبيعات والتصدير",
    badge_en: "Global Trade Desk",
    badge_ar: "قطاع التصدير والمبيعات",
    role_tag_en: "Head of Sales",
    role_tag_ar: "رئيس المبيعات",
    bio_en: "Direct point of contact for international buyers, importers, and food processors worldwide. Directing global quotations, container bookings, custom harvest allocations, and end-to-end client satisfaction from inquiry to ocean delivery.",
    bio_ar: "نقطة الاتصال المباشرة مع المستوردين العالميين وكبرى شركات الصناعات الغذائية والدوائية. يدير عروض الأسعار الدولية، وتجهيز الحاويات وشحنات المواسم، وضمان أسرع استجابة وتواصل على مدار الساعة.",
    phone: "+20 127 820 1346",
    phone_clean: "201278201346",
    email: "sales@greenherbseg.com",
    photo: "/images/team/Ahmed_Samy.jpeg",
    photoFocus: "object-[center_11%]",
    specialty_en: "Client Negotiations, Fast Quotations & Order Delivery",
    specialty_ar: "التفاوض التجاري، عروض الأسعار السريعة ومتابعة الشحنات",
    stats: [
      { val: "24/7", en: "Sales Desk Support", ar: "دعم مستمر للمبيعات" },
      { val: "100%", en: "Order Fulfillment", ar: "التزام بتسليم الشحنات" },
    ]
  },
];

/* ══════════════════════════════════════════════════════════════
   Team Page Component
════════════════════════════════════════════════════════════════ */
const Team = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';

  return (
    <Layout title={isEn ? "Executive Team • GREEN HERBS EG" : "فريق القيادة • جرين هيربس إيجيبت"}>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════ */}
      <section
        className={`relative pt-36 sm:pt-44 pb-20 sm:pb-28 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}
      >
        <Orb className="w-[600px] h-[600px] bg-emerald-500/20 top-[-100px] left-[-100px]" />
        <Orb className="w-[500px] h-[500px] bg-green-400/15 bottom-[-80px] right-[-80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(76,175,80,0.22),transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-[1360px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center">

          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xl mb-6 ring-1 ring-emerald-400/20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] text-emerald-300 uppercase font-bold">
              {isEn ? "Direct Executive Access • Beni Suef, Egypt" : "تواصل مباشر مع الإدارة • بني سويف، مصر"}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[36px] sm:text-[54px] lg:text-[68px] font-extrabold text-white leading-[1.12] tracking-tight mb-6 max-w-4xl"
          >
            {isEn ? (
              <>
                Executive Leadership & <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  International Trade Desk
                </span>
              </>
            ) : (
              <>
                القيادة التنفيذية <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  وقطاع التجارة الدولية
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/80 text-[16px] sm:text-[19px] leading-relaxed max-w-2xl mb-10"
          >
            {isEn
              ? "Connect directly with GREEN HERBS EG decision makers. We prioritize transparent communication, swift contract finalization, and dedicated customer care."
              : "تواصل مباشرةً مع أصحاب القرار في جرين هيربس إيجيبت. نضمن لكم شفافية كاملة، وسرعة في إبرام عقود التصدير، ومتابعة فورية على مدار الساعة."}
          </motion.p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXECUTIVE CARDS SHOWCASE (REFINED UI/UX)
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-[#050e0a] py-20 sm:py-28 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[700px] h-[700px] bg-emerald-600/10 top-1/4 right-[-10%]" />
        <Orb className="w-[600px] h-[600px] bg-green-500/10 bottom-0 left-[-10%]" />

        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {teamMembers.map((member, i) => {
              const memberName = isEn ? member.name_en : member.name_ar;
              const memberPosition = isEn ? member.position_en : member.position_ar;
              const memberBadge = isEn ? member.badge_en : member.badge_ar;
              const memberRoleTag = isEn ? member.role_tag_en : member.role_tag_ar;
              const memberBio = isEn ? member.bio_en : member.bio_ar;
              const memberSpecialty = isEn ? member.specialty_en : member.specialty_ar;

              return (
                <Reveal key={member.id} delay={i * 0.15}>
                  <div className="group relative rounded-[32px] overflow-hidden bg-[#0A1A13]/90 border border-emerald-500/25 shadow-2xl hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full">

                    {/* ── CARD TOP: Large Executive Portrait Header ── */}
                    <div className="relative w-full h-[380px] sm:h-[420px] bg-[#07130E] overflow-hidden">
                      <Image
                        src={member.photo}
                        alt={memberName}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className={`object-cover ${member.photoFocus} transition-transform duration-700 group-hover:scale-105`}
                      />

                      {/* Top status bar badge */}
                      <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider shadow-lg">
                          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                          <span>{memberRoleTag}</span>
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 backdrop-blur-md border border-emerald-500/30 text-emerald-200 text-[11px] font-semibold">
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{memberBadge}</span>
                        </span>
                      </div>

                      {/* Bottom Gradient Fade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A13] via-[#0A1A13]/40 to-transparent pointer-events-none" />

                      {/* Overlay Title on photo base */}
                      <div className="absolute bottom-4 inset-x-6 z-10">
                        <h2 className="text-[28px] sm:text-[34px] font-extrabold text-white leading-tight drop-shadow-md">
                          {memberName}
                        </h2>
                        <p className="text-emerald-400 text-[14px] sm:text-[15px] font-semibold mt-1">
                          {memberPosition}
                        </p>
                      </div>
                    </div>

                    {/* ── CARD BODY: Bio, Focus & Stats ── */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">

                      <div>
                        {/* Bio text */}
                        <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed mb-6 font-normal">
                          {memberBio}
                        </p>

                        {/* Core Focus Block */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/15 mb-6">
                          <span className="text-emerald-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block mb-1">
                            {isEn ? "Core Specialty & Focus" : "مجال التخصص والمسؤولية"}
                          </span>
                          <span className="text-white/95 text-[13px] sm:text-[14px] font-medium leading-snug block">
                            {memberSpecialty}
                          </span>
                        </div>

                        {/* Quick Stats Pill Row */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {member.stats.map((st, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                              <span className="text-emerald-400 font-extrabold text-lg sm:text-xl block">
                                {st.val}
                              </span>
                              <span className="text-white/60 text-[11px] uppercase tracking-wider font-medium block mt-0.5">
                                {isEn ? st.en : st.ar}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── CARD FOOTER: Premium Contact Buttons ── */}
                      <div className="pt-6 border-t border-emerald-500/20 space-y-3">

                        {/* 1. Primary Action: WhatsApp Direct Button (Full width) */}
                        <a
                          href={`https://wa.me/${member.phone_clean}?text=${encodeURIComponent(
                            isEn
                              ? `Hello ${member.name_en}, I would like to inquire about GREEN HERBS EG products.`
                              : `مرحباً ${member.name_ar}، أود الاستفسار عن منتجات وتصدير جرين هيربس إيجيبت.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] hover:from-[#20ba59] hover:to-[#179b4a] text-white font-bold text-[14px] shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/30 transition-all duration-300"
                        >
                          <FaWhatsapp className="w-5 h-5 text-white shrink-0" />
                          <span>{isEn ? `Chat on WhatsApp` : `تواصل عبر واتساب مباشرة`}</span>
                          <span className="opacity-80 text-xs" dir="ltr">({member.phone})</span>
                        </a>

                        {/* 2. Secondary Actions Grid: Call & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                          {/* Direct Phone Call */}
                          <a
                            href={`tel:${member.phone.replace(/\s+/g, '')}`}
                            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-emerald-400/40 text-white text-[13px] font-semibold transition-all group/btn"
                          >
                            <FiPhone className="w-4 h-4 text-emerald-400 group-hover/btn:scale-110 transition-transform shrink-0" />
                            <span dir="ltr" className="tracking-wide">{member.phone}</span>
                          </a>

                          {/* Direct Email */}
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-emerald-400/40 text-white text-[13px] font-semibold transition-all group/btn"
                          >
                            <FiMail className="w-4 h-4 text-emerald-400 group-hover/btn:scale-110 transition-transform shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </a>

                        </div>

                      </div>

                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BOTTOM CTA SECTION
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-24 bg-[#07130E] border-t border-emerald-500/20 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 text-center">
          <div className="rounded-[36px] bg-gradient-to-br from-[#0c2219] to-[#07130E] border border-emerald-500/30 p-10 sm:p-14 lg:p-16 shadow-2xl">

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <FaLeaf className="w-7 h-7 text-emerald-400" />
            </div>

            <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase mb-3 block">
              {isEn ? "Direct Export Assistance" : "تواصل مباشر مع المصنع"}
            </span>
            <h3 className="text-[26px] sm:text-[38px] font-extrabold text-white tracking-tight mb-4 leading-tight">
              {isEn
                ? "Looking for Custom Specifications or Bulk Orders?"
                : "هل تبحث عن مواصفات تصديرية خاصة أو طلبيات كبرى؟"}
            </h3>
            <p className="text-[15px] sm:text-[17px] text-white/75 max-w-2xl mx-auto mb-8 leading-relaxed">
              {isEn
                ? "Our team provides certificate-backed samples, real-time crop pricing, and flexible shipment schedules tailored to your port of destination."
                : "يقدم فريقنا عينات موثقة بالتحاليل المخبرية، وأسعاراً فورية للمحاصيل، وجداول شحن مرنة بحسب ميناء الوصول الخاص بكم."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[13px] uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>{isEn ? "Official Inquiry Form" : "نموذج طلب عرض أسعار"}</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/201278201346?text=Hello%20GREEN%20HERBS%20EG,%20I%20would%20like%20to%20request%20a%20quotation."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[13px] uppercase tracking-wider transition-all shadow-md"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{isEn ? "WhatsApp Export Desk" : "واتساب مكتب التصدير"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Team;