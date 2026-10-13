import { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import {
  FiCheckCircle, FiGlobe, FiPackage, FiTruck, FiShield,
  FiFileText, FiAnchor, FiClock, FiLayers, FiCompass,
  FiArrowRight, FiCheck, FiSend, FiMapPin
} from 'react-icons/fi';
import { FaWhatsapp, FaShip, FaPlane, FaLeaf } from 'react-icons/fa';
import Link from 'next/link';

function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
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

function SectionLabel({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
      {icon || <span className="w-5 h-px bg-secondary inline-block" />}
      {text}
    </span>
  );
}

const Export = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';

  const [activePortTab, setActivePortTab] = useState(0);

  const globalPortHubs = [
    {
      id: "europe",
      region: isEn ? "Europe & United Kingdom" : "أوروبا والمملكة المتحدة",
      ports: isEn ? "Rotterdam, Hamburg, Antwerp, Valencia, Genoa, Felixstowe" : "روتردام، هامبورغ، أنتويرب، فالنسيا، جنوة، فيليكسستو",
      transitTime: isEn ? "8 - 12 Days (Ocean Fast Freight)" : "8 - 12 يوماً (شحن بحري سريع)",
      containers: isEn ? "20ft FCL (6-8 Tons) / 40ft High Cube (14-18 Tons)" : "حاوية 20 قدم (6-8 أطنان) / حاوية 40 قدم (14-18 طناً)",
      regulations: isEn ? "EU Regulation (EU) 2018/848, EUR.1 Certificate, Eurofins pesticide-free COA" : "مطابقة للائحة الاتحاد الأوروبي للعضوية وشهادة يورو 1 وفحص بقايا المبيدات",
      notes: isEn
        ? "Weekly direct container sailings from Alexandria Port and Damietta Port to North Sea and Mediterranean hubs."
        : "رحلات إبحار أسبوعية مباشرة من ميناء الإسكندرية وميناء دمياط إلى موانئ بحر الشمال والبحر المتوسط.",
    },
    {
      id: "north-america",
      region: isEn ? "North America (USA & Canada)" : "أمريكا الشمالية (USA & Canada)",
      ports: isEn ? "New York, Norfolk, Houston, Long Beach, Montreal" : "نيويورك، نورفولك، هيوستن، لونغ بيتش، مونتريال",
      transitTime: isEn ? "18 - 22 Days (Direct Transatlantic)" : "18 - 22 يوماً (عبر الأطلسي)",
      containers: isEn ? "40ft Dry & High Cube palletized containers" : "حاويات 40 قدم جافة ومرتفعة على منصات خشبية معالجة",
      regulations: isEn ? "US FDA Prior Notice, USDA Organic (NOP), ISPM-15 Heat-Treated Pallets" : "تسجيل إشعار مسبق FDA واعتماد USDA العضوي ومنصات حرارية ISPM-15",
      notes: isEn
        ? "Full regulatory clearance dossier pre-filed with U.S. Customs and Border Protection (CBP) and FDA."
        : "تجهيز كامل للملفات الجمركية المسبقة لدى هيئة الجمارك الأمريكية وإدارة الغذاء والدواء.",
    },
    {
      id: "gulf-mena",
      region: isEn ? "Gulf & Arab Markets" : "الخليج والشرق الأوسط",
      ports: isEn ? "Jebel Ali (Dubai), Jeddah Islamic Port, Dammam, Shuwaikh (Kuwait)" : "جبل علي (دبي)، ميناء جدة الإسلامي، الدمام، الشويخ (الكويت)",
      transitTime: isEn ? "4 - 7 Days (Red Sea & Persian Gulf)" : "4 - 7 أيام (البحر الأحمر والخليج العربي)",
      containers: isEn ? "FCL, LCL, and Express Reefer Land/Sea routes" : "حاويات كاملة وجزئية وشحن مبرد بري وبحري سريع",
      regulations: isEn ? "SFDA Saber clearance, Halal Authority certification, Certificate of Origin" : "مطابقة منصة سابر وهيئة الغذاء والدواء السعودية وشهادة حلال",
      notes: isEn
        ? "Fast-track phytosanitary release with bilateral Arab League trade tariff exemption."
        : "إفراج صحي نباتي سريع مع الإعفاء الجمركي المتبادل لاتفاقية التجارة العربية.",
    },
    {
      id: "asia-pacific",
      region: isEn ? "Asia & Pacific Rim" : "آسيا والمحيط الهادئ",
      ports: isEn ? "Singapore, Port Klang, Tokyo, Yokohama, Busan, Sydney" : "سنغافورة، بورت كلانج، طوكيو، يوكوهاما، بوسان، سيدني",
      transitTime: isEn ? "22 - 28 Days (Suez Express Route)" : "22 - 28 يوماً (عبر قناة السويس)",
      containers: isEn ? "Hermetic moisture-barrier lined ocean containers" : "حاويات بحرية مبطنة بعوازل خاصة للرطوبة البحرية",
      regulations: isEn ? "AQIS compliant fumigation, Japanese MHLW positive list clearance" : "شهادات تبخير معتمدة ومطابقة لقوائم وزارة الصحة اليابانية",
      notes: isEn
        ? "Heavy desiccant placement throughout containers to shield botanicals across tropical waters."
        : "توزيع مجففات سيليكا متطورة داخل الحاويات لحماية المحاصيل من الرطوبة أثناء عبور المياه الاستوائية.",
    },
  ];

  const documentationChecklist = [
    {
      title: isEn ? "Official Phytosanitary Certificate" : "الشهادة الصحية النباتية الرسمية",
      authority: isEn ? "Egyptian Ministry of Agriculture (CAPQ)" : "الإدارة المركزية للحجر الزراعي المصري",
      desc: isEn
        ? "Official biological inspection proving all botanicals are free from quarantined pests, pathogens, and viable weed seeds."
        : "فحص رسمي معتمد يثبت خلو الشحنة تماماً من الآفات الحجرية والفطريات وبذور الحشائش.",
    },
    {
      title: isEn ? "Certificate of Analysis (COA)" : "شهادة التحليل المعملي الشامل (COA)",
      authority: isEn ? "ISO 17025 Accredited Laboratory" : "معمل معتمد دولياً طبقاً للمواصفة ISO 17025",
      desc: isEn
        ? "Exhaustive lot testing: volatile oil percentage via GC-MS, physical purity (99.8%), moisture (<8.0%), and heavy metal screening."
        : "تحليل دقيق للتشغيلة: نسبة الزيوت الطيارة، والنقاء الفيزيائي، ونسبة الرطوبة، وخلو الشحنة من المعادن الثقيلة.",
    },
    {
      title: isEn ? "Non-GMO & Pesticide Screen" : "شهادة خلو المبيدات والكائنات المعدلة وراثياً",
      authority: isEn ? "Eurofins / SGS Partner Labs" : "مختبرات يوروفينز و SGS المعتمدة",
      desc: isEn
        ? "Screening against 500+ active pesticide compounds to guarantee compliance with European Union Maximum Residue Limits (MRL)."
        : "فحص لأكثر من 500 مركب مبيد حشري وفطري لضمان مطابقة معايير الاتحاد الأوروبي الصارمة.",
    },
    {
      title: isEn ? "Ocean Bill of Lading (B/L)" : "بوليصة الشحن البحري الرسمية (B/L)",
      authority: isEn ? "Global Shipping Lines (Maersk, MSC, Hapag-Lloyd)" : "كبرى خطوط الملاحة الدولية (ميرسك، MSC)",
      desc: isEn
        ? "Original negotiable ocean bills of lading or express telex release issued promptly upon container vessel departure."
        : "بوالص شحن أصلية قابلة للتداول أو إفراج إلكتروني تيليكس سريع فور إبحار الحاوية.",
    },
    {
      title: isEn ? "Legalized Certificate of Origin" : "شهادة المنشأ الرسمية الموثقة",
      authority: isEn ? "Egyptian Chamber of Commerce & Customs" : "الغرفة التجارية ومصلحة الجمارك المصرية",
      desc: isEn
        ? "Proves authentic 100% Egyptian cultivation origin for preferential tariff treatment (EUR.1, GAFTA, or GSP)."
        : "تثبت المنشأ الزراعي المصري بنسبة 100% للاستفادة من الإعفاءات الجمركية والاتفاقيات الدولية.",
    },
    {
      title: isEn ? "Fumigation & Cleanliness Certificate" : "شهادة التبخير ونظافة الحاوية",
      authority: isEn ? "Certified International Fumigation Body" : "شركة تبخير وتطهير دولية معتمدة",
      desc: isEn
        ? "Phosphine / non-chemical treatment documentation certifying pristine pest-free container status prior to customs seal."
        : "توثيق التطهير والتبخير لضمان سلامة ونظافة الحاوية قبل وضع السيل الجمركي المعزول.",
    },
  ];

  const packagingStandards = [
    {
      title: isEn ? "Multi-Ply Kraft Paper Sacks" : "أكياس كرافت متعددة الطبقات",
      capacity: "20 kg / 25 kg Net",
      useCase: isEn ? "Dried herbs, rubbed leaves & chamomile" : "الأعشاب وأوراق النعناع والبابونج",
      features: isEn
        ? "3-ply heavy kraft with inner food-grade poly-barrier to prevent moisture absorption and aroma evaporation during sea voyage."
        : "3 طبقات كرافت سميكة مع بطانة داخلية عازلة للرطوبة تمنع تسرب الزيوت العطرية أثناء الرحلة البحرية.",
    },
    {
      title: isEn ? "PP Woven Bags with PE Liners" : "أكياس بولي بروبلين مبطنة بالبولي إيثيلين",
      capacity: "25 kg / 50 kg Net",
      useCase: isEn ? "Aromatic seeds (Fennel, Anise, Coriander)" : "البذور العطرية والشمر والينسون",
      features: isEn
        ? "Heavy-gauge woven exterior resisting puncture and stacking friction, with food-grade inner film locking in purity."
        : "نسيج خارجي متين مقاوم للتمزق والاحتكاك مع بطانة غذائية تضمن النقاء التام.",
    },
    {
      title: isEn ? "High-Density Pressed Botanical Bales" : "بالات مكبوسة عالية الكثافة",
      capacity: "50 kg - 100 kg Net",
      useCase: isEn ? "Industrial volume for extraction facilities" : "تعظيم حمولة الحاويات للمصانع",
      features: isEn
        ? "Hydraulically compressed botanical leaves wrapped in moisture-resistant white poly sheeting and banded securely."
        : "ضغط هيدروليكي محكم مغلف بعوازل بيضاء مقاومة للرطوبة ومشدود بأشرطة تصديرية قوية.",
    },
    {
      title: isEn ? "Private Label Retail Pouches" : "عبوات بيع بالتجزئة وكراتين خاصة",
      capacity: "100g - 1 kg / 10 kg Cartons",
      useCase: isEn ? "Supermarkets and gourmet tea brands" : "المتاجر الكبرى وماركات الشاي الفاخرة",
      features: isEn
        ? "Stand-up zip pouches with full custom branding, nitrogen flushed for 36-month shelf life stability."
        : "أكياس قائمة بسحاب مع طباعة هويتك التجارية، وحقن بالنيتروجين لصلاحية تصل إلى 36 شهراً.",
    },
  ];

  return (
    <Layout title={t.nav.export}>

      {/* ══════════════════════════════════════════════════════
          §1  HERO
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 sm:pt-40 pb-16 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/18 top-[-100px] left-[-100px]" />
        <Orb className="w-[600px] h-[600px] bg-primary/20 bottom-[-80px] right-[-100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(76,175,80,0.18),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center">

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xl mb-6 ring-1 ring-emerald-400/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-label-sm text-[11px] tracking-[0.2em] text-emerald-300 uppercase font-bold">
              {isEn ? "Global Freight Network • Alexandria & Damietta Ports" : "شبكة الشحن الدولي • موانئ الإسكندرية ودمياط"}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="font-headline-lg text-[38px] sm:text-[58px] lg:text-[68px] font-extrabold text-white leading-[1.08] tracking-tight mb-5 max-w-4xl">
            {isEn ? (
              <>Global Botanical Export & <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  Ocean Container Logistics
                </span>
              </>
            ) : (
              <>خدمات التصدير والشحن البحري <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  للمحاصيل الطبية حول العالم
                </span>
              </>
            )}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/75 text-[16px] sm:text-[18px] leading-relaxed max-w-2xl mb-10">
            {isEn
              ? "From our Beni Suef processing facilities to global seaports across Europe, North America, the Gulf, and Asia — full FCL/LCL container management with certified phytosanitary documentation."
              : "من مصانعنا في بني سويف إلى كبرى موانئ العالم — ندير شحن الحاويات الكاملة والجزئية مع توثيق صحي جمركي معتمد دولياً."}
          </motion.p>

          {/* Compact metric chips */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3">
            {[
              { value: "50+",         label_en: "Global Port Destinations", label_ar: "ميناء دولي نصدر إليه"   },
              { value: "100%",        label_en: "Phytosanitary Clearance",  label_ar: "مطابقة للحجر الزراعي"   },
              { value: "8-12 Days",   label_en: "Fast Europe Transit",      label_ar: "شحن سريع لأوروبا"       },
              { value: "FOB/CIF/CFR", label_en: "Flexible Incoterms 2020",  label_ar: "شروط تجارية معتمدة"     },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/8 border border-white/12 backdrop-blur-md">
                <span className="text-emerald-400 font-extrabold text-[14px] font-headline-sm">{m.value}</span>
                <span className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">
                  {isEn ? m.label_en : m.label_ar}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  INTERACTIVE DESTINATION PORT MATRIX
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-20 sm:py-28 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/10 top-0 right-0" />
        <Orb className="w-[500px] h-[500px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">

          <Reveal className="text-center mb-12">
            <SectionLabel text={isEn ? "Maritime Shipping Routes" : "خطوط الملاحة البحرية الدولية"} icon={<FaShip className="w-3.5 h-3.5" />} />
            <h2 className="font-headline-lg text-[30px] md:text-[46px] font-bold text-primary tracking-tight">
              {isEn ? "Global Port Destinations & Transit Schedules" : "موانئ الوصول الدولية ومواعيد الإبحار"}
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant max-w-xl mx-auto mt-3">
              {isEn
                ? "Select a destination region to review transit times, container specs, and customs requirements."
                : "اختر المنطقة الجغرافية للاطلاع على أزمنة الإبحار ومواصفات الحاويات والاشتراطات الجمركية."}
            </p>
          </Reveal>

          {/* Region Tabs — compact pills */}
          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              {globalPortHubs.map((hub, idx) => (
                <button key={hub.id} onClick={() => setActivePortTab(idx)}
                  className={`px-5 py-2.5 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-wide transition-all ${
                    activePortTab === idx
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 text-on-surface-variant hover:border-secondary hover:text-secondary"}`}>
                  {hub.region}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Active Panel */}
          <AnimatePresence mode="wait">
            <motion.div key={activePortTab}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
              className="rounded-[28px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-7 sm:p-10 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Details */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/12 text-secondary text-[11px] font-bold uppercase tracking-wider">
                      <FaShip className="w-3 h-3" />
                      {globalPortHubs[activePortTab].transitTime}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-[24px] sm:text-[30px] font-bold text-primary">
                    {globalPortHubs[activePortTab].region}
                  </h3>
                  <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
                    {globalPortHubs[activePortTab].notes}
                  </p>

                  {/* Info rows — horizontal list, not separate boxes */}
                  <dl className="space-y-3 pt-1">
                    {[
                      { label: isEn ? "Key Ports:" : "أبرز الموانئ:", value: globalPortHubs[activePortTab].ports },
                      { label: isEn ? "Container Types:" : "سعات الحاويات:", value: globalPortHubs[activePortTab].containers },
                      { label: isEn ? "Import Standards:" : "اللوائح الجمركية:", value: globalPortHubs[activePortTab].regulations },
                    ].map((item) => (
                      <div key={item.label} className="flex gap-3 text-sm border-b border-outline-variant/15 pb-3 last:border-0 last:pb-0">
                        <dt className="font-bold text-primary shrink-0 w-32 text-[12px] uppercase tracking-wide pt-0.5">{item.label}</dt>
                        <dd className="text-on-surface-variant leading-relaxed text-[13px]">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* CTA side */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-7 rounded-2xl bg-primary/8 border border-primary/15 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl mb-4 shadow-lg">
                    <FaShip />
                  </div>
                  <h4 className="font-headline-sm text-[17px] font-bold text-primary mb-2">
                    {isEn ? "Request Freight Estimate" : "طلب عرض أسعار شحن"}
                  </h4>
                  <p className="text-[12px] text-on-surface-variant mb-5 leading-relaxed">
                    {isEn
                      ? "Get current 20ft / 40ft container rates, insurance, and booking dates for this route."
                      : "احصل على أسعار نولون الحاويات الحالية ومواعيد الحجز والإبحار لهذا الخط."}
                  </p>
                  <a href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello Green Globe Herbs Freight Desk, I need a CIF shipping quote for: ${globalPortHubs[activePortTab].region}.`)}`}
                    target="_blank" rel="noreferrer"
                    className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all">
                    <FaWhatsapp className="w-4 h-4" />
                    {isEn ? "WhatsApp Logistics Desk" : "تواصل مع مكتب الشحن"}
                  </a>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  OFFICIAL EXPORT DOCUMENTATION
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-surface-container/30 py-20 sm:py-28 overflow-hidden border-y border-outline-variant/20 ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 bottom-0 left-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">

          <Reveal className="text-center mb-12">
            <SectionLabel text={isEn ? "Regulatory Clearance Dossier" : "الملف الجمركي والصحي المتكامل"} icon={<FiFileText className="w-3.5 h-3.5" />} />
            <h2 className="font-headline-lg text-[30px] md:text-[46px] font-bold text-primary tracking-tight">
              {isEn ? "Full Export Documentation with Every Shipment" : "المستندات الرسمية المصاحبة لكل شحنة"}
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant max-w-xl mx-auto mt-3">
              {isEn
                ? "We eliminate customs clearance delays by providing audited, bilingual trade documents complying with international quarantine protocols."
                : "نضمن سهولة وسرعة الإفراج الجمركي من خلال حزمة مستندات رسمية ثنائية اللغة متوافقة مع اشتراطات الحجر الصحي الدولي."}
            </p>
          </Reveal>

          {/* Documentation list — horizontal card layout for each doc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentationChecklist.map((doc, idx) => (
              <Reveal key={idx} delay={idx * 0.06}>
                <div className="flex gap-4 p-6 rounded-[22px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 hover:border-secondary/30 shadow-sm hover:shadow-md transition-all h-full">
                  {/* Number badge */}
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-secondary/12 text-secondary flex items-center justify-center font-bold text-[14px]">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">{doc.authority}</span>
                    <h3 className="font-headline-sm text-[16px] font-bold text-primary mb-1.5">{doc.title}</h3>
                    <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">{doc.desc}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      {isEn ? "Certified & Attested" : "معتمد وموثق رسمياً"}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  INDUSTRIAL PACKAGING STANDARDS
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-20 sm:py-28 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[500px] h-[500px] bg-primary/8 top-0 right-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">

          <Reveal className="text-center mb-12">
            <SectionLabel text={isEn ? "Export Packaging Architecture" : "معايير التعبئة والتغليف البحري"} icon={<FiPackage className="w-3.5 h-3.5" />} />
            <h2 className="font-headline-lg text-[30px] md:text-[46px] font-bold text-primary tracking-tight">
              {isEn ? "Hermetic Container Packing & Moisture Protection" : "تعبئة محكمة لحماية الزيوت العطرية والنقاء"}
            </h2>
            <p className="font-body-lg text-[15px] sm:text-[17px] text-on-surface-variant max-w-xl mx-auto mt-3">
              {isEn
                ? "Engineered packaging protecting essential oils from humidity, UV radiation, and physical pressure across oceanic journeys."
                : "حلول تغليف متطورة تحمي الزيوت الطيارة من الرطوبة وأشعة الشمس والضغط طوال مدة الشحن البحري."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {packagingStandards.map((pkg, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <div className="rounded-[24px] p-7 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm hover:shadow-lg hover:border-secondary/30 transition-all h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-secondary/12 text-secondary">{pkg.capacity}</span>
                    <span className="text-[11px] text-on-surface-variant font-medium">{isEn ? "Export Spec" : "مواصفة تصديرية"}</span>
                  </div>
                  <h3 className="font-headline-sm text-[20px] font-bold text-primary mb-1">{pkg.title}</h3>
                  <p className="text-[12px] font-semibold text-secondary mb-3">{pkg.useCase}</p>
                  <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed flex-1">{pkg.features}</p>
                  <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                    <span className="text-on-surface-variant">{isEn ? "Palletized or Loose Stowed" : "على منصات أو رص مباشر"}</span>
                    <strong className="text-primary font-bold flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5 text-secondary" />
                      {isEn ? "Food-Grade Certified" : "مطابق لمعايير الغذاء"}
                    </strong>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  FINAL LOGISTICS RFQ CTA
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-20 bg-[#07130E] overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[820px] mx-auto px-6 text-center relative z-10">
          <SectionLabel text={isEn ? "Start Your First Container Shipment" : "ابدأ استيراد أول حاوية نباتية"} />
          <h2 className="font-headline-lg text-[28px] sm:text-[44px] font-bold text-white tracking-tight mb-5">
            {isEn ? "Ready to Coordinate Your Ocean Container Booking?" : "جاهز لحجز حاويتك ومراجعة جدول الإبحار؟"}
          </h2>
          <p className="text-white/70 text-[15px] sm:text-[17px] max-w-xl mx-auto mb-9 leading-relaxed">
            {isEn
              ? "Contact our marine logistics desk for real-time vessel schedules, CIF destination quotes, and COA sample dispatches via DHL/FedEx."
              : "تواصل مع مكتب الشحن البحري للحصول على جداول الإبحار اللحظية، وأسعار التوريد CIF، وشحن عينات التحليل عبر DHL و FedEx."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact"
              className="btn-shine inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl w-full sm:w-auto">
              {isEn ? "Request Freight Quotation" : "طلب تسعير شحن بحري"}
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/201278201346?text=Hello%20Green%20Globe%20Herbs,%20I%20would%20like%20to%20inquire%20about%20ocean%20container%20logistics."
              target="_blank" rel="noreferrer"
              className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all shadow-md w-full sm:w-auto">
              <FaWhatsapp className="w-5 h-5" />
              {isEn ? "WhatsApp Logistics Desk" : "واتساب مكتب الشحن"}
            </a>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Export;
