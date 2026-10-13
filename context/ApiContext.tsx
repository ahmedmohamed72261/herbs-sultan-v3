import React, { createContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import localCategories from '@/data/categories.json';
import localProducts from '@/data/products.json';
import localCertificates from '@/data/certificates.json';
import localTeam from '@/data/team.json';
import localCountries from '@/data/countries.json';
import localCatalogs from '@/data/catalogs.json';

export interface Category {
  id: number | string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  slug: string;
  image?: string | null;
}

export interface Product {
  id: number | string;
  name_en: string;
  name_ar: string;
  latin_name?: string;
  slug?: string;
  description_en?: string;
  description_ar?: string;
  short_description_en?: string;
  short_description_ar?: string;
  image?: string | null;
  images?: string[] | null;

  category?: {
    id?: number | string;
    slug?: string;
    name_en: string;
    name_ar: string;
  };
  form?: string;
  purity?: string;
  moisture?: string;
  origin?: string;
  color?: string;
  packaging?: string;
  shelf_life?: string;
  export_availability?: string;
  tags?: string[];
  certifications?: string[];
  is_featured?: boolean;
}

export interface TeamMember {
  id: number | string;
  name_en: string;
  name_ar: string;
  position_en: string;
  position_ar: string;
  bio_en: string;
  bio_ar: string;
  image: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
  specialty?: string;
}

export interface Certificate {
  id: number | string;
  title_en: string;
  title_ar: string;
  badge?: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  icon?: string | null;
  file?: string | null;
  issuer?: string | null;
  issuer_en?: string | null;
  issuer_ar?: string | null;
  scope?: string | null;
  scope_en?: string | null;
  scope_ar?: string | null;
  validity?: string | null;
}

export interface Catalog {
  id: number | string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  file: string | null;
  image: string | null;
  version: string | null;
  pages?: string;
  size?: string;
  highlights?: string[];
}

export interface ExportCountry {
  _id: string;
  name_en: string;
  name_ar: string;
  code?: string;
  region?: string;
  flag: string | null;
  cover?: string | null;
  display_order: number;
}

export interface ApiContextType {
  categories: Category[];
  products: Product[];
  teamMembers: TeamMember[];
  certificates: Certificate[];
  catalogs: Catalog[];
  exportCountries: ExportCountry[];
  loading: {
    categories: boolean;
    products: boolean;
    teamMembers: boolean;
    certificates: boolean;
    catalogs: boolean;
    exportCountries: boolean;
  };
  errors: {
    categories: boolean;
    products: boolean;
    teamMembers: boolean;
    certificates: boolean;
    catalogs: boolean;
    exportCountries: boolean;
  };
  fetchCategories: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchTeamMembers: () => Promise<void>;
  fetchCertificates: () => Promise<void>;
  fetchCatalogs: () => Promise<void>;
  fetchExportCountries: () => Promise<void>;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(localCategories as Category[]);
  const [products, setProducts] = useState<Product[]>(localProducts as Product[]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(localTeam as TeamMember[]);
  const [certificates, setCertificates] = useState<Certificate[]>(localCertificates as unknown as Certificate[]);
  const [catalogs, setCatalogs] = useState<Catalog[]>(localCatalogs as Catalog[]);
  const [exportCountries, setExportCountries] = useState<ExportCountry[]>(localCountries as ExportCountry[]);

  const [loading, setLoading] = useState({
    categories: false,
    products: false,
    teamMembers: false,
    certificates: false,
    catalogs: false,
    exportCountries: false,
  });

  const [errors, setErrors] = useState({
    categories: false,
    products: false,
    teamMembers: false,
    certificates: false,
    catalogs: false,
    exportCountries: false,
  });

  const fetchCategories = async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    setErrors((prev) => ({ ...prev, categories: false }));
    try {
      // Primary: local categories JSON (contains 5 curated categories)
      setCategories(localCategories as Category[]);
    } catch {
      setCategories(localCategories as Category[]);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const fetchProducts = async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    setErrors((prev) => ({ ...prev, products: false }));
    try {
      // Primary: local products JSON (contains all 51 products with updated images)
      setProducts(localProducts as Product[]);
    } catch {
      setProducts(localProducts as Product[]);
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const fetchTeamMembers = async () => {
    setLoading((prev) => ({ ...prev, teamMembers: true }));
    setErrors((prev) => ({ ...prev, teamMembers: false }));
    try {
      const response = await api.get('/team');
      const data = response.data?.data || response.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setTeamMembers(data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean));
      } else {
        setTeamMembers(localTeam as TeamMember[]);
      }
    } catch {
      setTeamMembers(localTeam as TeamMember[]);
      setErrors((prev) => ({ ...prev, teamMembers: false }));
    } finally {
      setLoading((prev) => ({ ...prev, teamMembers: false }));
    }
  };

  const fetchCertificates = async () => {
    setLoading((prev) => ({ ...prev, certificates: true }));
    setErrors((prev) => ({ ...prev, certificates: false }));
    try {
      const response = await api.get('/certificates');
      const data = response.data?.data || response.data || [];
      if (Array.isArray(data) && data.length > 0) {
        const merged = data.map((item: any) => {
          if (!item) return null;
          const local = (localCertificates as any[]).find(
            (c) => c.id === item.id || c.id === item.slug || c.title_en === item.title_en
          );
          return {
            ...item,
            id: item.id ?? item._id,
            image: local?.image || item.image || '/images/certificates/iso-9001.jpg',
            icon: local?.icon || item.icon,
          };
        }).filter(Boolean);
        setCertificates(merged.length > 0 ? merged : (localCertificates as unknown as Certificate[]));
      } else {
        setCertificates(localCertificates as unknown as Certificate[]);
      }
    } catch {
      setCertificates(localCertificates as unknown as Certificate[]);
      setErrors((prev) => ({ ...prev, certificates: false }));
    } finally {
      setLoading((prev) => ({ ...prev, certificates: false }));
    }
  };

  const fetchCatalogs = async () => {
    setLoading((prev) => ({ ...prev, catalogs: true }));
    setErrors((prev) => ({ ...prev, catalogs: false }));
    try {
      const response = await api.get('/catalogs');
      const data = response.data?.data || response.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setCatalogs(data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean));
      } else {
        setCatalogs(localCatalogs as Catalog[]);
      }
    } catch {
      setCatalogs(localCatalogs as Catalog[]);
      setErrors((prev) => ({ ...prev, catalogs: false }));
    } finally {
      setLoading((prev) => ({ ...prev, catalogs: false }));
    }
  };

  const fetchExportCountries = async () => {
    setLoading((prev) => ({ ...prev, exportCountries: true }));
    setErrors((prev) => ({ ...prev, exportCountries: false }));
    try {
      const response = await api.get('/export-countries');
      const data = response.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setExportCountries(data);
      } else {
        setExportCountries(localCountries as ExportCountry[]);
      }
    } catch {
      setExportCountries(localCountries as ExportCountry[]);
      setErrors((prev) => ({ ...prev, exportCountries: false }));
    } finally {
      setLoading((prev) => ({ ...prev, exportCountries: false }));
    }
  };

  // We expose everything to the context
  return (
    <ApiContext.Provider
      value={{
        categories,
        products,
        teamMembers,
        certificates,
        catalogs,
        exportCountries,
        loading,
        errors,
        fetchCategories,
        fetchProducts,
        fetchTeamMembers,
        fetchCertificates,
        fetchCatalogs,
        fetchExportCountries,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
