import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';
import { PageTransition } from './Motion';
import FloatingWhatsApp from './FloatingWhatsApp';
import GoToTop from './GoToTop';
// import ChatAgent from './ChatAgent';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout = ({ children, title, description }: LayoutProps) => {
  const defaultTitle = 'Green Globe Herbs — Premium Organic Herbs & Spices Exporter';
  const defaultDescription = 'Green Globe Herbs is a leading Egyptian exporter of organic medicinal herbs, spices, legumes, and seeds to global markets. Sourced from sustainable farms.';

  return (
    <>
      <Head>
        <title>{title ? `${title} | Green Globe Herbs` : defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/logo.png" />
        <link rel="shortcut icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:image:alt" content="Green Globe Herbs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/images/logo.png" />
      </Head>
      <div className="min-h-screen flex flex-col font-sans bg-[#f6f4ee] text-[#102116] selection:bg-[#d6a757] selection:text-[#102116] dark:bg-[#08140d] dark:text-[#f8f1dc] overflow-x-hidden w-full max-w-full">
        <Navbar />
        <main className="flex-grow w-full max-w-full overflow-x-hidden">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <FloatingWhatsApp />
        <GoToTop />
        {/* <ChatAgent /> */}
      </div>
    </>
  );
};

export default Layout;
