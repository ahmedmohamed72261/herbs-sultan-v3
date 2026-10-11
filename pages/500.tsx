import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

export default function Custom500() {
  const { language } = useAppStore();
  const isEn = language === 'en';

  return (
    <Layout title={isEn ? "Server Error" : "خطأ في الخادم"}>
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-background text-on-surface px-6 text-center pt-24">
        <div className="w-20 h-20 rounded-full bg-error/10 text-error flex items-center justify-center mb-6">
          <FiAlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="font-headline-sm text-[32px] font-bold text-primary mb-4">
          {isEn ? "Internal Server Error" : "حدث خطأ غير متوقع"}
        </h1>
        <p className="font-body-lg text-[16px] text-on-surface-variant max-w-md mb-8 leading-relaxed">
          {isEn
            ? "We are experiencing a temporary issue. Please try again later."
            : "نحن نواجه مشكلة مؤقتة. يرجى المحاولة مرة أخرى لاحقاً."}
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
