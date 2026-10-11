import { FC } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getAssetUrl } from '@/lib/api';
import { useAppStore } from '@/store';

interface ProductCardProps {
  id: number | string;
  name: string;
  category: string;
  description: string;
  image?: string | null;
  isFeatured?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  category,
  description,
  image,
  isFeatured = false,
}) => {
  const { language } = useAppStore();
  const isEn = language === 'en';
  const viewDetailsLabel = isEn ? 'Explore' : 'استكشف';

  return (
    <article className="h-full rounded-[32px] overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 hover:border-secondary/50 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col relative group">
      
      {/* Floating Category Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
        <span className="font-label-sm text-[10px] px-3.5 py-1.5 rounded-full bg-primary/90 backdrop-blur-md text-white uppercase font-bold tracking-widest shadow-md">
          {category}
        </span>
        {isFeatured && (
          <span className="font-label-sm text-[10px] px-3.5 py-1.5 rounded-full bg-secondary text-white uppercase font-bold tracking-widest shadow-md">
            {isEn ? 'Featured' : 'مميز'}
          </span>
        )}
      </div>

      {/* Image Section */}
      <Link href={`/products/${id}`} className="relative overflow-hidden aspect-[4/3] bg-surface-container-high w-full block">
        {image ? (
          <img
            src={getAssetUrl(image)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-high text-outline">
            <span className="text-3xl mb-1">🌿</span>
            <span className="text-[10px] font-label-sm font-bold uppercase tracking-wider">{name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content Section */}
      <div className="p-6 md:p-7 flex flex-col flex-grow relative z-10 bg-white/60 dark:bg-white/5">
        <Link href={`/products/${id}`}>
          <h3 className="font-headline-sm text-[21px] font-bold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors cursor-pointer">
            {name}
          </h3>
        </Link>
        
        <p className="font-body-sm text-[14px] text-on-surface-variant leading-relaxed line-clamp-2 mb-6 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 gap-2 mt-auto">
          <Link
            href={`/products/${id}`}
            className="flex items-center gap-2 font-label-sm text-[12px] font-bold text-secondary group-hover:text-primary transition-colors uppercase tracking-wider"
          >
            <span>{viewDetailsLabel}</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href={`https://wa.me/201278201346?text=${encodeURIComponent(`Hello! I'm interested in ordering / getting a quote for ${name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-secondary/15 hover:bg-secondary text-secondary hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title="Inquire on WhatsApp"
          >
            <FaWhatsapp className="w-3.5 h-3.5" />
            <span>{isEn ? 'Quote' : 'تسعير'}</span>
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;