import { motion } from 'motion/react';
import { FaWhatsapp } from 'react-icons/fa';

const PHONE = '201553190955';
const WHATSAPP_URL = `https://wa.me/${PHONE}`;

const WhatsAppFloat = () => (
  <motion.a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)]"
    aria-label="Contact via WhatsApp"
  >
    <FaWhatsapp className="h-7 w-7" />
  </motion.a>
);

export default WhatsAppFloat;
