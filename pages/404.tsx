import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function Custom404() {
  const { language } = useAppStore();
  const isEn = language === 'en';

  return (
    <Layout title={isEn ? "Page Not Found" : "الصفحة غير موجودة"}>
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-background text-on-surface px-6 text-center pt-24">
        <span className="font-headline-lg text-[96px] font-bold text-secondary mb-2 leading-none">404</span>
        <h1 className="font-headline-sm text-[32px] font-bold text-primary mb-4">
          {isEn ? "Page Not Found" : "الصفحة غير موجودة"}
        </h1>
        <p className="font-body-lg text-[16px] text-on-surface-variant max-w-md mb-8 leading-relaxed">
          {isEn
            ? "The page you are looking for might have been removed or is temporarily unavailable."
            : "قد تكون الصفحة التي تبحث عنها قد تم إزالتها أو أنها غير متاحة حالياً."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-surface font-label-sm text-[12px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors shadow-lg"
        >
          <FiHome className="w-4 h-4" />
          <span>{isEn ? "Back to Home" : "العودة للرئيسية"}</span>
        </Link>
      </div>
    </Layout>
  );
}
