import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { useAppStore } from '@/store';

interface Message {
  id: string;
  type: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

const translations = {
  en: {
    chatTitle: 'Herba Support',
    chatSubtitle: 'How can we help?',
    inputPlaceholder: 'Ask a question...',
    sendButton: 'Send',
    suggestedQuestions: 'Suggested questions:',
    greetings: [
      'Hello! 👋 How can we assist you today?',
      'Welcome to Herba! What would you like to know?',
      'Hi there! Feel free to ask us anything about our products.',
    ],
    quickQuestions: [
      '📦 What products do you offer?',
      '💰 How much do your products cost?',
      '🚚 What are your shipping options?',
      '❓ How do I contact you?',
    ],
    responses: {
      products:
        'We offer premium herbs, spices, and natural seeds. All products are carefully sourced and tested for quality.',
      ordering:
        'You can browse and order our products directly on our website. We provide worldwide shipping with competitive rates.',
      pricing: 'Prices vary by product and quantity. Please visit our Products page for current pricing.',
      shipping:
        'We ship worldwide! Delivery times typically range from 7-21 business days depending on location.',
      quality:
        'All our products undergo strict quality control. We are committed to providing the finest natural products.',
      contact:
        'You can reach us via WhatsApp (bottom right), email at info@herba.com, or through our contact form.',
      payment:
        'We accept major credit cards, bank transfers, and other secure payment methods at checkout.',
      storage:
        'Store our products in a cool, dry place away from direct sunlight in an airtight container for maximum freshness.',
    },
  },
  ar: {
    chatTitle: 'دعم Herba',
    chatSubtitle: 'كيف يمكننا مساعدتك؟',
    inputPlaceholder: 'اطرح سؤالا...',
    sendButton: 'إرسال',
    suggestedQuestions: 'أسئلة مقترحة:',
    greetings: [
      'مرحبا! 👋 كيف يمكننا مساعدتك اليوم؟',
      'أهلا بك في Herba! ماذا تريد أن تعرف؟',
      'مرحبا! لا تتردد في السؤال عن منتجاتنا.',
    ],
    quickQuestions: [
      '📦 ما هي المنتجات التي تقدمونها؟',
      '💰 ما هي تكاليف منتجاتكم؟',
      '🚚 ما هي خيارات الشحن؟',
      '❓ كيف يمكنني التواصل معكم؟',
    ],
    responses: {
      products:
        'نحن نقدم أعشابا وبهارات وبذورا طبيعية ممتازة. جميع المنتجات مختارة بعناية واختبرت للجودة.',
      ordering: 'يمكنك تصفح والطلب من منتجاتنا مباشرة على موقعنا. نقدم شحنا عالميا برسوم تنافسية.',
      pricing:
        'تختلف الأسعار حسب المنتج والكمية. يرجى زيارة صفحة المنتجات للأسعار الحالية.',
      shipping: 'نشحن في جميع أنحاء العالم! مدات التسليم عادة 7-21 يوم عمل حسب الموقع.',
      quality:
        'جميع منتجاتنا تخضع لمراقبة جودة صارمة. نلتزم بتقديم أفضل المنتجات الطبيعية.',
      contact:
        'يمكنك التواصل معنا عبر WhatsApp (الزاوية السفلى)، البريد الإلكتروني info@herba.com، أو نموذج التواصل.',
      payment:
        'نقبل بطاقات الائتمان الرئيسية والتحويلات البنكية وطرق دفع آمنة أخرى.',
      storage:
        'احفظ منتجاتنا في مكان بارد وجاف بعيدا عن أشعة الشمس المباشرة في حاوية محكمة الإغلاق.',
    },
  },
};

const getAgentResponse = (userMessage: string, language: 'en' | 'ar'): string => {
  const lowerMessage = userMessage.toLowerCase();
  const t = translations[language];

  if (
    lowerMessage.includes('product') ||
    lowerMessage.includes('herb') ||
    lowerMessage.includes('spice') ||
    lowerMessage.includes('منتج') ||
    lowerMessage.includes('عشب')
  ) {
    return t.responses.products;
  }
  if (
    lowerMessage.includes('order') ||
    lowerMessage.includes('buy') ||
    lowerMessage.includes('purchase') ||
    lowerMessage.includes('طلب') ||
    lowerMessage.includes('شراء')
  ) {
    return t.responses.ordering;
  }
  if (
    lowerMessage.includes('price') ||
    lowerMessage.includes('cost') ||
    lowerMessage.includes('سعر')
  ) {
    return t.responses.pricing;
  }
  if (
    lowerMessage.includes('ship') ||
    lowerMessage.includes('delivery') ||
    lowerMessage.includes('shipping') ||
    lowerMessage.includes('شحن') ||
    lowerMessage.includes('توصيل')
  ) {
    return t.responses.shipping;
  }
  if (
    lowerMessage.includes('quality') ||
    lowerMessage.includes('organic') ||
    lowerMessage.includes('guarantee') ||
    lowerMessage.includes('جودة')
  ) {
    return t.responses.quality;
  }
  if (
    lowerMessage.includes('contact') ||
    lowerMessage.includes('reach') ||
    lowerMessage.includes('email') ||
    lowerMessage.includes('phone') ||
    lowerMessage.includes('اتصال') ||
    lowerMessage.includes('رقم')
  ) {
    return t.responses.contact;
  }
  if (
    lowerMessage.includes('payment') ||
    lowerMessage.includes('pay') ||
    lowerMessage.includes('credit') ||
    lowerMessage.includes('دفع')
  ) {
    return t.responses.payment;
  }
  if (
    lowerMessage.includes('store') ||
    lowerMessage.includes('storage') ||
    lowerMessage.includes('keep') ||
    lowerMessage.includes('حفظ') ||
    lowerMessage.includes('تخزين')
  ) {
    return t.responses.storage;
  }

  return language === 'en'
    ? 'Thanks for your question! For more specific inquiries, please contact us via WhatsApp or email at info@herba.com.'
    : 'شكرا لسؤالك! للاستفسارات الأكثر تحديدا، يرجى التواصل معنا عبر WhatsApp أو البريد الإلكتروني info@herba.com.';
};

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useAppStore();
  const t = translations[language];
  const isRTL = language === 'ar';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting =
        t.greetings[Math.floor(Math.random() * t.greetings.length)];
      setMessages([
        {
          id: '1',
          type: 'agent',
          text: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate response delay
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        text: getAgentResponse(inputValue, language),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsLoading(false);
      setShowQuestions(true);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={language === 'en' ? 'Chat with us' : 'تحدث معنا'}
        aria-label="Chat agent"
        className={`fixed bottom-28 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-herba-yellow to-yellow-400 text-herba-dark shadow-lg ring-2 ring-white/20 transition-all duration-300 hover:ring-white/40 focus:outline-none focus:ring-4 focus:ring-herba-yellow/50 group ${isRTL ? 'left-8' : 'right-8'}`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiX className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiMessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Ring Animation */}
        {!isOpen && (
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(214, 167, 87, 0.5)',
                '0 0 0 12px rgba(214, 167, 87, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute inset-0 rounded-full"
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed bottom-32 z-40 w-96 max-w-[calc(100vw-2rem)] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col h-96 dark:bg-gray-800 ${isRTL ? 'left-8' : 'right-8'}`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-herba-dark to-herba-green p-6 text-white">
              <h3 className="text-xl font-bold">{t.chatTitle}</h3>
              <p className="text-sm opacity-90">{t.chatSubtitle}</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-herba-light to-white dark:from-gray-700 dark:to-gray-800">
              <AnimatePresence>
                {showQuestions && messages.some((m) => m.type === 'agent') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-3 mb-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                        {t.suggestedQuestions}
                      </p>
                      <motion.button
                        onClick={() => setShowQuestions(false)}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title={language === 'en' ? 'Close' : 'إغلاق'}
                      >
                        <FiX className="h-5 w-5" />
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {t.quickQuestions.map((question, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => {
                            setInputValue(question);
                            setShowQuestions(false);
                            setTimeout(() => handleSendMessage(), 50);
                          }}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02, x: isRTL ? 15 : -15 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.3, delay: idx * 0.08 }}
                          className="text-left px-3 py-2 text-sm bg-gradient-to-r from-herba-light to-white dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-500 rounded-lg hover:bg-herba-green hover:text-white hover:border-herba-green transition-all duration-200 truncate"
                        >
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-herba-green text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none dark:bg-gray-600 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none dark:bg-gray-600">
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-end gap-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.inputPlaceholder}
                  rows={1}
                  className={`flex-1 px-4 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-herba-green dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-herba-green text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <FiSend className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
