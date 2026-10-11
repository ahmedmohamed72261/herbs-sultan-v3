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
      region: isEn ? "North America (USA & Canada)" : "أمريكا الشمالية (الولايات المتحدة وكندا)",
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
      region: isEn ? "Gulf Cooperation Council & Arab Markets" : "دول مجلس التعاون الخليجي والشرق الأوسط",
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
      region: isEn ? "Asia, Australia & Pacific Rim" : "شرق آسيا وأستراليا والمحيط الهادئ",
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
      title: isEn ? "Comprehensive Certificate of Analysis (COA)" : "شهادة التحليل المعملي الشامل (COA)",
      authority: isEn ? "ISO 17025 Accredited Laboratory" : "معمل معتمد دولياً طبقاً للمواصفة ISO 17025",
      desc: isEn
        ? "Exhaustive lot testing: volatile oil percentage via GC-MS, physical purity (99.8%), moisture (<8.0%), and heavy metal screening."
        : "تحليل دقيق للتشغيلة: نسبة الزيوت الطيارة، والنقاء الفيزيائي، ونسبة الرطوبة، وخلو الشحنة من المعادن الثقيلة.",
    },
    {
      title: isEn ? "Non-GMO & Multi-Residue Pesticide Screen" : "شهادة خلو المبيدات والكائنات المعدلة وراثياً",
      authority: isEn ? "Eurofins / SGS Partner Labs" : "مختبرات يوروفينز و SGS المعتمدة",
      desc: isEn
        ? "Screening against 500+ active pesticide compounds to guarantee compliance with European Union Maximum Residue Limits (MRL)."
        : "فحص لأكثر من 500 مركب مبيد حشري وفطري لضمان مطابقة معايير الاتحاد الأوروبي الصارمة.",
    },
    {
      title: isEn ? "Clean on Board Ocean Bill of Lading (B/L)" : "بوليصة الشحن البحري الرسمية (B/L)",
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
      useCase: isEn ? "Standard for dried herbs, rubbed leaves & chamomile" : "المعيار للأعشاب وأوراق النعناع والبابونج",
      features: isEn
        ? "3-ply heavy kraft with inner food-grade poly-barrier to prevent moisture absorption and aroma evaporation during sea voyage."
        : "3 طبقات كرافت سميكة مع بطانة داخلية عازلة للرطوبة تمنع تسرب الزيوت العطرية أثناء الرحلة البحرية.",
    },
    {
      title: isEn ? "Polypropylene Woven Bags with PE Liners" : "أكياس بولي بروبلين مبطنة بالبولي إيثيلين",
      capacity: "25 kg / 50 kg Net",
      useCase: isEn ? "Export standard for aromatic seeds (Fennel, Anise, Coriander)" : "معيار تصدير البذور العطرية والشمر والينسون",
      features: isEn
        ? "Heavy-gauge woven exterior resisting puncture and stacking friction, with food-grade inner film locking in purity."
        : "نسيج خارجي متين مقاوم للتمزق والاحتكاك مع بطانة غذائية تضمن النقاء التام.",
    },
    {
      title: isEn ? "High-Density Pressed Botanical Bales" : "بالات مكبوسة عالية الكثافة",
      capacity: "50 kg - 100 kg Net",
      useCase: isEn ? "Industrial volume optimization for extraction facilities" : "تعظيم حمولة الحاويات للمصانع وشركات الاستخلاص",
      features: isEn
        ? "Hydraulically compressed botanical leaves wrapped in moisture-resistant white poly sheeting and banded securely."
        : "ضغط هيدروليكي محكم مغلف بعوازل بيضاء مقاومة للرطوبة ومشدود بأشرطة تصديرية قوية.",
    },
    {
      title: isEn ? "Private Label Retail Pouches & Master Cartons" : "عبوات بيع بالتجزئة وكراتين شحن خاصة",
      capacity: "100g - 1 kg Pouches / 10 kg Cartons",
      useCase: isEn ? "Ready-to-shelf supermarkets and gourmet tea brands" : "جاهز للرف للمتاجر الكبرى وماركات الشاي الفاخرة",
      features: isEn
        ? "Stand-up zip pouches with full custom branding, nitrogen flushed for 36-month shelf life stability."
        : "أكياس قائمة بسحاب مع طباعة هويتك التجارية، وحقن بالنيتروجين لصلاحية تصل إلى 36 شهراً.",
    },
  ];

  return (
    <Layout title={t.nav.export}>
      
      {/* ══════════════════════════════════════════════════════
          §1  HERO — Global Freight & Maritime Trade Hub
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 sm:pt-40 pb-20 sm:pb-24 overflow-hidden bg-[#07130E] text-white ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[600px] h-[600px] bg-secondary/20 top-[-100px] left-[-100px]" />
        <Orb className="w-[600px] h-[600px] bg-primary/25 bottom-[-100px] right-[-100px]" />
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
              {isEn ? "Global Freight Network • Alexandria & Damietta Ports" : "شبكة الشحن الدولي • موانئ الإسكندرية ودمياط"}
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
                Global Botanical Export & <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  Ocean Container Logistics
                </span>
              </>
            ) : (
              <>
                خدمات التصدير والشحن البحري <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-[#81c784] bg-clip-text text-transparent">
                  للمحاصيل الطبية حول العالم
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
              ? "From our Beni Suef processing facilities to global seaports across Europe, North America, the Gulf, and Asia. We manage full container loads (FCL), consolidated pallets (LCL), phytosanitary documentation, and express ocean freight."
              : "من مصانعنا ومزارعنا في بني سويف إلى كبرى موانئ أوروبا وأمريكا والخليج وآسيا. ندير شحن الحاويات الكاملة (FCL) والشحنات الجزئية (LCL) مع توثيق صحي جمركي معتمد وتتبع ملاحي دقيق."}
          </motion.p>

          {/* Logistics Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">50+</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Global Port Destinations" : "ميناء دولي نصدر إليه"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">100%</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Phytosanitary Clearance" : "مطابقة للحجر الزراعي"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">8-12 d</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Fast Europe Sea Transit" : "زمن الشحن لأوروبا"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-emerald-400 font-extrabold text-2xl font-headline-sm">FOB / CIF / CFR</div>
              <div className="text-white/70 text-xs uppercase tracking-wider font-semibold mt-1">
                {isEn ? "Flexible Incoterms 2020" : "شروط تجارية معتمدة"}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  INTERACTIVE DESTINATION PORT MATRIX
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-24 sm:py-32 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <Orb className="w-[700px] h-[700px] bg-secondary/10 top-0 right-0" />
        <Orb className="w-[600px] h-[600px] bg-primary/5 bottom-0 left-0" />

        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <FaShip className="w-4 h-4" />
              {isEn ? "Maritime Shipping Routes" : "خطوط الملاحة البحرية الدولية"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight">
              {isEn ? "Global Port Destinations & Transit Schedules" : "موانئ الوصول الدولية ومواعيد الإبحار"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mt-4">
              {isEn
                ? "Select a destination trade region to review transit times, container configurations, and specific customs requirements."
                : "اختر المنطقة الجغرافية للاطلاع على أزمنة الإبحار ومواصفات الحاويات والاشتراطات الجمركية الخاصة بها."}
            </p>
          </Reveal>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {globalPortHubs.map((hub, idx) => (
              <button
                key={hub.id}
                onClick={() => setActivePortTab(idx)}
                className={`px-6 py-3.5 rounded-full font-label-sm text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                  activePortTab === idx
                    ? "bg-primary text-white shadow-lg ring-2 ring-primary/30"
                    : "bg-white/80 dark:bg-white/5 border border-outline-variant/50 text-on-surface-variant hover:border-secondary hover:text-secondary"
                }`}
              >
                {hub.region}
              </button>
            ))}
          </div>

          {/* Active Port Detail Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePortTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="rounded-[36px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-8 sm:p-12 shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider">
                    <FaShip className="w-3.5 h-3.5" />
                    <span>{globalPortHubs[activePortTab].transitTime}</span>
                  </div>

                  <h3 className="font-headline-sm text-[28px] sm:text-[34px] font-bold text-primary">
                    {globalPortHubs[activePortTab].region}
                  </h3>

                  <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed">
                    {globalPortHubs[activePortTab].notes}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40">
                      <strong className="text-primary text-xs uppercase tracking-wider block mb-1">
                        {isEn ? "Key Discharging Ports:" : "أبرز موانئ الوصول والتفريغ:"}
                      </strong>
                      <span className="text-sm text-on-surface-variant font-medium">
                        {globalPortHubs[activePortTab].ports}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40">
                      <strong className="text-primary text-xs uppercase tracking-wider block mb-1">
                        {isEn ? "Standard Container Capacities:" : "سعات الحاويات التصديرية:"}
                      </strong>
                      <span className="text-sm text-on-surface-variant font-medium">
                        {globalPortHubs[activePortTab].containers}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40">
                      <strong className="text-primary text-xs uppercase tracking-wider block mb-1">
                        {isEn ? "Import Standards & Tariffs:" : "اللوائح الجمركية والشهادات:"}
                      </strong>
                      <span className="text-sm text-on-surface-variant font-medium">
                        {globalPortHubs[activePortTab].regulations}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center items-center p-8 rounded-3xl bg-primary/10 border border-primary/20 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl mb-6 shadow-xl">
                    <FaShip />
                  </div>
                  <h4 className="font-headline-sm text-xl font-bold text-primary mb-2">
                    {isEn ? "Request Freight Estimate" : "طلب عرض أسعار شحن بحري"}
                  </h4>
                  <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mb-6 leading-relaxed">
                    {isEn
                      ? "Get current 20ft / 40ft container ocean freight rates, insurance, and booking dates for this route."
                      : "احصل على أسعار نولون الحاويات الحالية ومواعيد الحجز والإبحار المباشرة لهذا الخط الملاحي."}
                  </p>
                  <a
                    href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello Green Globe Herbs Freight Desk, I need a CIF shipping quote for destination region: ${globalPortHubs[activePortTab].region}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-shine w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>{isEn ? "WhatsApp Logistics Desk" : "تواصل مع مكتب الشحن"}</span>
                  </a>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  OFFICIAL EXPORT DOCUMENTATION DOSSIER
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-surface-container/50 py-24 sm:py-32 overflow-hidden border-y border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <FiFileText className="w-4 h-4" />
              {isEn ? "Regulatory Clearance Dossier" : "الملف الجمركي والصحي المتكامل"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight">
              {isEn ? "Full Export Documentation with Every Shipment" : "المستندات الرسمية المصاحبة لكل شحنة"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mt-4">
              {isEn
                ? "We eliminate customs clearance delays by providing audited, bilingual trade documents complying with international quarantine protocols."
                : "نضمن سهولة وسرعة الإفراج الجمركي من خلال توفير حزمة مستندات رسمية ثنائية اللغة متوافقة مع اشتراطات الحجر الصحي الدولي."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentationChecklist.map((doc, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <div className="rounded-[32px] p-8 h-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 hover:border-secondary/40 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xl mb-6 shadow-sm">
                    <FiFileText />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
                    {doc.authority}
                  </span>
                  <h3 className="font-headline-sm text-[20px] font-bold text-primary mb-3">
                    {doc.title}
                  </h3>
                  <p className="font-body-sm text-[14px] text-on-surface-variant leading-relaxed flex-1">
                    {doc.desc}
                  </p>
                  <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>{isEn ? "Certified & Attested" : "معتمد وموثق رسمياً"}</span>
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
      <section className={`relative w-full bg-background py-24 sm:py-32 overflow-hidden ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
          
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-2 font-label-sm text-[11px] tracking-widest text-secondary uppercase mb-3 font-bold">
              <FiPackage className="w-4 h-4" />
              {isEn ? "Export Packaging Architecture" : "معايير التعبئة والتغليف البحري"}
            </span>
            <h2 className="font-headline-lg text-[36px] md:text-[50px] font-bold text-primary tracking-tight">
              {isEn ? "Hermetic Container Packing & Moisture Protection" : "تعبئة محكمة لحماية الزيوت العطرية والنقاء"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mt-4">
              {isEn
                ? "Engineered packaging solutions protecting essential oils from humidity, UV radiation, and physical pressure across oceanic journeys."
                : "حلول تغليف متطورة تحمي الزيوت الطيارة من الرطوبة وأشعة الشمس والضغط الفيزيائي طوال مدة الشحن البحري."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packagingStandards.map((pkg, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="rounded-[36px] p-8 sm:p-10 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary/15 text-secondary">
                        {pkg.capacity}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        {isEn ? "Export Specification" : "مواصفة تصديرية"}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-[24px] font-bold text-primary mb-2">
                      {pkg.title}
                    </h3>
                    <p className="text-xs font-semibold text-secondary mb-4">
                      {pkg.useCase}
                    </p>
                    <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
                      {pkg.features}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">{isEn ? "Palletized or Loose Stowed" : "على منصات أو رص مباشر"}</span>
                    <strong className="text-primary font-bold">{isEn ? "Food-Grade Certified" : "مطابق لمعايير الغذاء"}</strong>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  FINAL LOGISTICS RFQ CALL TO ACTION
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-24 bg-surface-container/60 border-t border-outline-variant/30 ${isEn ? "" : "rtl"}`}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <div className="rounded-[40px] bg-gradient-to-br from-white/90 to-surface-container/70 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-12 lg:p-16 shadow-2xl">
            <span className="font-label-sm text-[11px] font-bold tracking-widest text-secondary uppercase mb-4 block">
              {isEn ? "Start Your First Container Shipment" : "ابدأ استيراد أول حاوية نباتية"}
            </span>
            <h2 className="font-headline-lg text-[32px] sm:text-[46px] font-bold text-primary tracking-tight mb-6">
              {isEn ? "Ready to Coordinate Your Ocean Container Booking?" : "جاهز لحجز حاويتك ومراجعة جدول الإبحار؟"}
            </h2>
            <p className="font-body-lg text-[16px] sm:text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              {isEn
                ? "Contact our marine logistics desk for real-time vessel schedules, CIF destination quotes, and COA sample dispatches via DHL/FedEx."
                : "تواصل مع مكتب الشحن البحري للحصول على جداول الإبحار اللحظية، وأسعار التوريد CIF، وشحن عينات التحليل عبر DHL و FedEx."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-shine inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-primary text-white font-label-sm text-[13px] font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-xl"
              >
                <span>{isEn ? "Request Freight Quotation" : "طلب تسعير شحن بحري"}</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/201278201346?text=Hello%20Green%20Globe%20Herbs,%20I%20would%20like%20to%20inquire%20about%20ocean%20container%20logistics."
                target="_blank"
                rel="noreferrer"
                className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-white font-label-sm text-[13px] font-bold uppercase tracking-widest transition-all shadow-md"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{isEn ? "WhatsApp Logistics Desk" : "واتساب مكتب الشحن"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Export;