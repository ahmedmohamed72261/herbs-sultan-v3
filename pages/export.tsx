import { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import {
  FiCheckCircle, FiFileText, FiPackage, FiArrowRight, FiCheck,
} from 'react-icons/fi';
import { FaWhatsapp, FaShip, FaLeaf } from 'react-icons/fa';
import Link from 'next/link';

/* ── helpers ──────────────────────────────────────────────── */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] pointer-events-none select-none max-w-full ${className}`}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
const Export = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';
  const [activePortTab, setActivePortTab] = useState(0);

  const globalPortHubs = [
    {
      id: 'europe',
      emoji: '🇪🇺',
      region: isEn ? 'Europe & UK' : 'أوروبا والمملكة المتحدة',
      transit: isEn ? '8 – 12 Days' : '8 – 12 يوماً',
      ports: isEn ? 'Rotterdam, Hamburg, Antwerp, Valencia, Genoa, Felixstowe' : 'روتردام، هامبورغ، أنتويرب، فالنسيا، جنوة، فيليكسستو',
      containers: isEn ? '20ft FCL (6–8 T) / 40ft High Cube (14–18 T)' : 'حاوية 20 قدم (6–8 أطنان) / حاوية 40 قدم (14–18 طناً)',
      regulations: isEn ? 'EU 2018/848 Organic · EUR.1 Certificate · Eurofins MRL Screening' : 'اللائحة الأوروبية العضوية · شهادة يورو 1 · فحص مبيدات يوروفينز',
      notes: isEn
        ? 'Weekly direct container sailings from Alexandria Port and Damietta Port to North Sea and Mediterranean hubs.'
        : 'رحلات إبحار أسبوعية مباشرة من ميناء الإسكندرية وميناء دمياط إلى موانئ بحر الشمال والمتوسط.',
    },
    {
      id: 'north-america',
      emoji: '🇺🇸',
      region: isEn ? 'USA & Canada' : 'أمريكا الشمالية',
      transit: isEn ? '18 – 22 Days' : '18 – 22 يوماً',
      ports: isEn ? 'New York, Norfolk, Houston, Long Beach, Montreal' : 'نيويورك، نورفولك، هيوستن، لونغ بيتش، مونتريال',
      containers: isEn ? '40ft Dry & High Cube — palletized ISPM-15' : 'حاويات 40 قدم على منصات حرارية ISPM-15',
      regulations: isEn ? 'US FDA Prior Notice · USDA NOP Organic · ISPM-15 Pallets' : 'إشعار مسبق FDA · اعتماد USDA العضوي · منصات حرارية ISPM-15',
      notes: isEn
        ? 'Full regulatory dossier pre-filed with U.S. Customs & Border Protection and FDA before vessel departure.'
        : 'تجهيز كامل للملفات الجمركية المسبقة لدى هيئة الجمارك الأمريكية وإدارة الغذاء والدواء قبل الإبحار.',
    },
    {
      id: 'gulf-mena',
      emoji: '🌙',
      region: isEn ? 'Gulf & Arab Markets' : 'الخليج والشرق الأوسط',
      transit: isEn ? '4 – 7 Days' : '4 – 7 أيام',
      ports: isEn ? 'Jebel Ali (Dubai), Jeddah Islamic Port, Dammam, Shuwaikh (Kuwait)' : 'جبل علي دبي، جدة الإسلامي، الدمام، الشويخ الكويت',
      containers: isEn ? 'FCL, LCL, Express Land/Sea Reefer Routes' : 'حاويات كاملة وجزئية وشحن مبرد بري وبحري',
      regulations: isEn ? 'SFDA Saber Clearance · Halal Certification · Certificate of Origin' : 'منصة سابر SFDA · شهادة حلال · شهادة منشأ',
      notes: isEn
        ? 'Fast-track phytosanitary release with bilateral Arab League trade tariff exemption for Egyptian products.'
        : 'إفراج صحي نباتي سريع مع الإعفاء الجمركي المتبادل في إطار اتفاقية التجارة العربية.',
    },
    {
      id: 'asia-pacific',
      emoji: '🌏',
      region: isEn ? 'Asia & Pacific Rim' : 'آسيا والمحيط الهادئ',
      transit: isEn ? '22 – 28 Days' : '22 – 28 يوماً',
      ports: isEn ? 'Singapore, Port Klang, Tokyo, Yokohama, Busan, Sydney' : 'سنغافورة، بورت كلانج، طوكيو، يوكوهاما، بوسان، سيدني',
      containers: isEn ? 'Hermetic moisture-barrier lined ocean containers' : 'حاويات بحرية مبطنة بعوازل رطوبة خاصة',
      regulations: isEn ? 'AQIS Fumigation · Japanese MHLW Positive List Compliance' : 'شهادات تبخير AQIS · مطابقة القائمة الإيجابية اليابانية MHLW',
      notes: isEn
        ? 'Heavy desiccant deployment throughout container to protect botanicals across tropical shipping lanes.'
        : 'توزيع مجففات سيليكا متطورة داخل الحاويات لحماية المحاصيل عبر الممرات البحرية الاستوائية.',
    },
  ];

  const documentationChecklist = [
    {
      num: '01',
      title: isEn ? 'Phytosanitary Certificate' : 'الشهادة الصحية النباتية',
      authority: isEn ? 'Egyptian Ministry of Agriculture (CAPQ)' : 'الحجر الزراعي المصري (CAPQ)',
      desc: isEn
        ? 'Official biological inspection proving all botanicals are free from quarantined pests, pathogens, and viable weed seeds.'
        : 'فحص رسمي يثبت خلو الشحنة من الآفات الحجرية والفطريات وبذور الحشائش.',
    },
    {
      num: '02',
      title: isEn ? 'Certificate of Analysis (COA)' : 'شهادة التحليل المعملي (COA)',
      authority: isEn ? 'ISO 17025 Accredited Laboratory' : 'معمل معتمد ISO 17025',
      desc: isEn
        ? 'Full lot testing: volatile oil % via GC-MS, physical purity (99.8%), moisture (<8%), and heavy metal screening.'
        : 'تحليل كامل: نسبة الزيوت الطيارة، النقاء الفيزيائي، نسبة الرطوبة، وخلو من المعادن الثقيلة.',
    },
    {
      num: '03',
      title: isEn ? 'Non-GMO & Pesticide Screen' : 'شهادة خلو المبيدات',
      authority: isEn ? 'Eurofins / SGS Partner Labs' : 'مختبرات يوروفينز وSGS',
      desc: isEn
        ? 'Screening against 500+ active pesticide compounds ensuring compliance with EU Maximum Residue Limits (MRL).'
        : 'فحص لأكثر من 500 مركب مبيد لضمان مطابقة معايير الاتحاد الأوروبي الصارمة.',
    },
    {
      num: '04',
      title: isEn ? 'Ocean Bill of Lading (B/L)' : 'بوليصة الشحن البحري (B/L)',
      authority: isEn ? 'Maersk, MSC, Hapag-Lloyd' : 'ميرسك، MSC، هاباغ لويد',
      desc: isEn
        ? 'Original negotiable ocean bills of lading or express telex release issued upon container vessel departure.'
        : 'بوالص شحن أصلية قابلة للتداول أو إفراج إلكتروني تيليكس سريع فور إبحار الحاوية.',
    },
    {
      num: '05',
      title: isEn ? 'Certificate of Origin' : 'شهادة المنشأ الموثقة',
      authority: isEn ? 'Egyptian Chamber of Commerce & Customs' : 'الغرفة التجارية ومصلحة الجمارك',
      desc: isEn
        ? 'Proves authentic 100% Egyptian origin for preferential tariff treatment (EUR.1, GAFTA, or GSP).'
        : 'تثبت المنشأ المصري بنسبة 100% للاستفادة من الإعفاءات الجمركية والاتفاقيات الدولية.',
    },
    {
      num: '06',
      title: isEn ? 'Fumigation Certificate' : 'شهادة التبخير والتطهير',
      authority: isEn ? 'Certified International Fumigation Body' : 'شركة تبخير دولية معتمدة',
      desc: isEn
        ? 'Phosphine or non-chemical treatment documentation certifying pest-free container status before customs seal.'
        : 'توثيق التطهير والتبخير لضمان سلامة الحاوية قبل وضع السيل الجمركي.',
    },
  ];

  const packagingStandards = [
    {
      icon: '📦',
      title: isEn ? 'Multi-Ply Kraft Paper Sacks' : 'أكياس كرافت متعددة الطبقات',
      capacity: '20 / 25 kg',
      useCase: isEn ? 'Dried herbs, rubbed leaves & chamomile' : 'الأعشاب وأوراق النعناع والبابونج',
      features: isEn
        ? '3-ply heavy kraft with inner food-grade poly-barrier preventing moisture absorption and aroma evaporation during sea voyage.'
        : '3 طبقات كرافت مع بطانة داخلية عازلة تمنع تسرب الزيوت العطرية أثناء الرحلة البحرية.',
    },
    {
      icon: '🌾',
      title: isEn ? 'PP Woven Bags with PE Liners' : 'أكياس بولي بروبلين مبطنة',
      capacity: '25 / 50 kg',
      useCase: isEn ? 'Aromatic seeds — Fennel, Anise, Coriander' : 'البذور العطرية والشمر والينسون',
      features: isEn
        ? 'Heavy-gauge woven exterior resisting puncture and stacking friction with food-grade inner film locking in purity.'
        : 'نسيج خارجي متين مقاوم للتمزق مع بطانة غذائية تضمن النقاء التام.',
    },
    {
      icon: '🏭',
      title: isEn ? 'Hydraulic Botanical Bales' : 'بالات مكبوسة عالية الكثافة',
      capacity: '50 – 100 kg',
      useCase: isEn ? 'Industrial volume for extraction facilities' : 'تعظيم حمولة الحاويات للمصانع',
      features: isEn
        ? 'Hydraulically compressed leaves wrapped in moisture-resistant white poly sheeting, banded securely for container stowage.'
        : 'ضغط هيدروليكي محكم مغلف بعوازل بيضاء مقاومة للرطوبة ومشدود بأشرطة تصديرية قوية.',
    },
    {
      icon: '🏷️',
      title: isEn ? 'Private Label Retail Pouches' : 'عبوات تجزئة وعلامة خاصة',
      capacity: '100g – 1 kg',
      useCase: isEn ? 'Supermarkets and gourmet tea brands' : 'المتاجر الكبرى وماركات الشاي',
      features: isEn
        ? 'Stand-up zip pouches with full custom branding, nitrogen flushed for 36-month shelf life stability.'
        : 'أكياس قائمة بسحاب مع طباعة هويتك التجارية وحقن نيتروجين لصلاحية تصل إلى 36 شهراً.',
    },
  ];

  return (
    <Layout title={t.nav.export}>

      {/* ══════════════════════════════════════════════════════
          §1  DARK HERO
      ════════════════════════════════════════════════════ */}
      <section className={`relative pt-36 pb-20 overflow-hidden bg-[#07130E] text-white ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[700px] h-[700px] bg-emerald-700/20 -top-40 -left-40" />
        <Orb className="w-[600px] h-[600px] bg-green-500/15 -bottom-20 -right-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_0%,rgba(76,175,80,0.22),transparent)] pointer-events-none" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(76,175,80,1) 1px,transparent 1px),linear-gradient(90deg,rgba(76,175,80,1) 1px,transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 backdrop-blur-md mb-7"
          >
            <FaShip className="text-emerald-400 w-3.5 h-3.5" />
            <span className="text-emerald-300 text-[11px] font-bold uppercase tracking-[0.22em]">
              {isEn ? 'Global Freight · Alexandria & Damietta Ports' : 'شحن دولي · موانئ الإسكندرية ودمياط'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[40px] sm:text-[60px] lg:text-[72px] font-extrabold text-white leading-[1.06] tracking-tight mb-5 max-w-5xl"
          >
            {isEn ? (
              <>Global Botanical Export &{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent">
                  Ocean Logistics
                </span>
              </>
            ) : (
              <>تصدير الأعشاب الطبية{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-300 bg-clip-text text-transparent">
                  والشحن البحري الدولي
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/65 text-[16px] sm:text-[19px] leading-relaxed max-w-2xl mb-12"
          >
            {isEn
              ? 'From our Beni Suef facilities to ports across Europe, North America, the Gulf, and Asia — full FCL/LCL container management with certified phytosanitary documentation.'
              : 'من مصانعنا في بني سويف إلى كبرى موانئ العالم — ندير الحاويات الكاملة والجزئية مع توثيق صحي جمركي معتمد دولياً.'}
          </motion.p>

          {/* Metric chips */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { val: '50+',         en: 'Port Destinations',     ar: 'ميناء دولي' },
              { val: '8–12 Days',   en: 'Fast Europe Transit',   ar: 'شحن سريع لأوروبا' },
              { val: '100%',        en: 'Phyto Clearance',       ar: 'مطابق للحجر الزراعي' },
              { val: 'FOB/CIF/CFR', en: 'Flexible Incoterms',    ar: 'شروط دولية معتمدة' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/8 border border-white/10 backdrop-blur-md">
                <span className="text-emerald-400 font-extrabold text-[14px]">{m.val}</span>
                <span className="text-white/55 text-[11px] font-semibold uppercase tracking-wider">{isEn ? m.en : m.ar}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2  DESTINATION PORT MATRIX — still dark bg
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-[#07130E] py-20 sm:py-28 overflow-hidden border-t border-emerald-900/40 ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[600px] h-[600px] bg-emerald-800/15 top-0 right-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-emerald-400 text-[11px] font-bold uppercase tracking-widest mb-4">
              <FaShip className="w-3.5 h-3.5" />
              {isEn ? 'Maritime Shipping Routes' : 'خطوط الملاحة البحرية الدولية'}
            </span>
            <h2 className="text-white text-[30px] md:text-[46px] font-extrabold tracking-tight mb-3">
              {isEn ? 'Global Port Destinations' : 'موانئ الوصول الدولية'}
            </h2>
            <p className="text-white/50 text-[15px] sm:text-[17px] max-w-xl mx-auto">
              {isEn
                ? 'Select a destination region to review transit times, container specs, and customs requirements.'
                : 'اختر المنطقة لمراجعة أزمنة الإبحار ومواصفات الحاويات والاشتراطات الجمركية.'}
            </p>
          </Reveal>

          {/* Region Tab Buttons */}
          <Reveal delay={0.08}>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {globalPortHubs.map((hub, idx) => (
                <button
                  key={hub.id}
                  onClick={() => setActivePortTab(idx)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-wide transition-all ${
                    activePortTab === idx
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:border-emerald-500/40 hover:text-white'
                  }`}
                >
                  <span>{hub.emoji}</span>
                  {hub.region}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Active Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePortTab}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.32 }}
              className="rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-xl p-7 sm:p-10 shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-3xl">{globalPortHubs[activePortTab].emoji}</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                      <FaShip className="w-3 h-3" />
                      {globalPortHubs[activePortTab].transit}
                    </span>
                  </div>

                  <h3 className="text-white text-[26px] sm:text-[32px] font-extrabold tracking-tight">
                    {globalPortHubs[activePortTab].region}
                  </h3>
                  <p className="text-white/55 text-[15px] leading-relaxed">
                    {globalPortHubs[activePortTab].notes}
                  </p>

                  <dl className="space-y-4 pt-2">
                    {[
                      { label: isEn ? 'Key Ports' : 'أبرز الموانئ', value: globalPortHubs[activePortTab].ports },
                      { label: isEn ? 'Container Types' : 'الحاويات', value: globalPortHubs[activePortTab].containers },
                      { label: isEn ? 'Import Standards' : 'اللوائح الجمركية', value: globalPortHubs[activePortTab].regulations },
                    ].map(item => (
                      <div key={item.label} className="flex gap-4 pb-4 border-b border-white/8 last:border-0 last:pb-0">
                        <dt className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider shrink-0 w-32 pt-0.5">{item.label}</dt>
                        <dd className="text-white/60 text-[13px] leading-relaxed">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* CTA Side */}
                <div className="lg:col-span-4 flex flex-col items-center text-center p-7 rounded-2xl bg-emerald-900/30 border border-emerald-700/30">
                  <div className="w-14 h-14 rounded-full bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mb-4">
                    <FaShip />
                  </div>
                  <h4 className="text-white font-bold text-[16px] mb-2">
                    {isEn ? 'Request Freight Estimate' : 'طلب عرض أسعار شحن'}
                  </h4>
                  <p className="text-white/40 text-[12px] mb-5 leading-relaxed">
                    {isEn
                      ? 'Get real-time vessel schedules, CIF quotes, and booking dates for this route.'
                      : 'احصل على جداول الإبحار اللحظية وأسعار التوريد CIF ومواعيد الحجز لهذا الخط.'}
                  </p>
                  <a
                    href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello GREEN HERBS EG, I need a shipping quote for: ${globalPortHubs[activePortTab].region}.`)}`}
                    target="_blank" rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    {isEn ? 'WhatsApp Logistics Desk' : 'واتساب مكتب الشحن'}
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3  EXPORT DOCUMENTATION
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-background py-20 sm:py-28 overflow-hidden border-t border-outline-variant/20 ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[500px] h-[500px] bg-secondary/10 bottom-0 left-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-secondary text-[11px] font-bold uppercase tracking-widest mb-4">
              <FiFileText className="w-3.5 h-3.5" />
              {isEn ? 'Regulatory Clearance Dossier' : 'الملف الجمركي والصحي المتكامل'}
            </span>
            <h2 className="text-[30px] md:text-[46px] font-extrabold text-primary tracking-tight mb-3">
              {isEn ? 'Full Documentation with Every Shipment' : 'المستندات الرسمية لكل شحنة'}
            </h2>
            <p className="text-on-surface-variant text-[15px] sm:text-[17px] max-w-xl mx-auto">
              {isEn
                ? 'We eliminate customs clearance delays by providing bilingual trade documents complying with international quarantine protocols.'
                : 'نضمن سرعة الإفراج الجمركي بحزمة مستندات رسمية ثنائية اللغة متوافقة مع الحجر الصحي الدولي.'}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentationChecklist.map((doc, idx) => (
              <Reveal key={idx} delay={idx * 0.06}>
                <div className="h-full flex flex-col p-6 rounded-[22px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 hover:border-secondary/30 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="w-9 h-9 shrink-0 rounded-xl bg-secondary/12 text-secondary flex items-center justify-center font-black text-[12px]">
                      {doc.num}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-0.5">{doc.authority}</p>
                      <h3 className="font-bold text-primary text-[15px] leading-snug">{doc.title}</h3>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-[13px] leading-relaxed flex-1">{doc.desc}</p>
                  <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    {isEn ? 'Certified & Attested' : 'معتمد وموثق رسمياً'}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4  PACKAGING STANDARDS
      ════════════════════════════════════════════════════ */}
      <section className={`relative w-full bg-surface-container/30 py-20 sm:py-28 overflow-hidden border-t border-outline-variant/20 ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[500px] h-[500px] bg-primary/8 top-0 right-0" />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-secondary text-[11px] font-bold uppercase tracking-widest mb-4">
              <FiPackage className="w-3.5 h-3.5" />
              {isEn ? 'Export Packaging Architecture' : 'معايير التعبئة والتغليف البحري'}
            </span>
            <h2 className="text-[30px] md:text-[46px] font-extrabold text-primary tracking-tight mb-3">
              {isEn ? 'Hermetic Packing & Moisture Protection' : 'تعبئة محكمة وحماية من الرطوبة'}
            </h2>
            <p className="text-on-surface-variant text-[15px] sm:text-[17px] max-w-xl mx-auto">
              {isEn
                ? 'Engineered packaging protecting essential oils from humidity, UV radiation, and physical pressure across oceanic journeys.'
                : 'حلول تغليف متطورة تحمي الزيوت الطيارة من الرطوبة وأشعة الشمس والضغط طوال مدة الشحن.'}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {packagingStandards.map((pkg, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <div className="h-full flex flex-col rounded-[24px] p-7 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 hover:border-secondary/30 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl">{pkg.icon}</span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-secondary/12 text-secondary">{pkg.capacity}</span>
                  </div>
                  <h3 className="font-extrabold text-primary text-[18px] sm:text-[20px] mb-1">{pkg.title}</h3>
                  <p className="text-secondary font-semibold text-[12px] mb-4">{pkg.useCase}</p>
                  <p className="text-on-surface-variant text-[13px] leading-relaxed flex-1">{pkg.features}</p>
                  <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                    <span className="text-on-surface-variant">{isEn ? 'Palletized or Loose Stowed' : 'على منصات أو رص مباشر'}</span>
                    <span className="text-primary font-bold flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5 text-secondary" />
                      {isEn ? 'Food-Grade' : 'مطابق غذائي'}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5  FINAL CTA
      ════════════════════════════════════════════════════ */}
      <section className={`relative py-24 bg-[#07130E] overflow-hidden ${isEn ? '' : 'rtl'}`}>
        <Orb className="w-[700px] h-[700px] bg-emerald-700/18 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-[820px] mx-auto px-6 text-center relative z-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-emerald-400 text-[11px] font-bold uppercase tracking-widest mb-5">
              <FaLeaf className="w-3.5 h-3.5" />
              {isEn ? 'Start Your First Container Shipment' : 'ابدأ استيراد أول حاوية نباتية'}
            </span>
            <h2 className="text-white text-[28px] sm:text-[46px] font-extrabold tracking-tight mb-5">
              {isEn ? 'Ready to Book Your Ocean Container?' : 'جاهز لحجز حاويتك البحرية؟'}
            </h2>
            <p className="text-white/55 text-[15px] sm:text-[18px] max-w-xl mx-auto mb-10 leading-relaxed">
              {isEn
                ? 'Contact our marine logistics desk for real-time vessel schedules, CIF destination quotes, and COA sample dispatches.'
                : 'تواصل مع مكتب الشحن البحري للحصول على جداول الإبحار الفورية وأسعار CIF وشحن عينات التحليل.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-shine inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[13px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/40 w-full sm:w-auto"
              >
                {isEn ? 'Request Freight Quotation' : 'طلب تسعير شحن بحري'}
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/201278201346?text=Hello%20GREEN%20HERBS%20EG%2C%20I%20would%20like%20to%20inquire%20about%20ocean%20container%20logistics."
                target="_blank" rel="noreferrer"
                className="whatsapp-glow inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[13px] uppercase tracking-widest transition-all shadow-md w-full sm:w-auto"
              >
                <FaWhatsapp className="w-5 h-5" />
                {isEn ? 'WhatsApp Logistics Desk' : 'واتساب مكتب الشحن'}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

    </Layout>
  );
};

export default Export;
