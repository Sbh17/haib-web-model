import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ar' | 'it';

interface Translations {
  // Common UI
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  back: string;
  search: string;
  
  // Navigation
  home: string;
  appointments: string;
  settings: string;
  profile: string;
  news: string;
  promotions: string;
  
  // AI Chat
  aiAssistant: string;
  aiAssistantHaib: string;
  chatPlaceholder: string;
  aiThinking: string;
  listeningNow: string;
  bookAppointment: string;
  findSalon: string;
  viewSchedule: string;
  askQuestion: string;
  welcomeMessage: string;
  welcomeSubMessage: string;
  
  // Notifications
  notifications: string;
  markAllRead: string;
  notificationSubtext: string;
  noNotifications: string;
  tapToView: string;
  
  // Time
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  
  // Welcome Page
  welcomeTitle: string;
  welcomeDescription: string;
  startJourney: string;
  signIn: string;
  howItWorks: string;
  howItWorksDescription: string;
  discover: string;
  discoverDescription: string;
  book: string;
  bookDescription: string;
  experience: string;
  experienceDescription: string;
  exploreHaib: string;
  exploreDescription: string;
  premiumSalons: string;
  premiumSalonsDescription: string;
  exploreSalons: string;
  exclusiveOffers: string;
  exclusiveOffersDescription: string;
  viewOffers: string;
  startBeautyJourney: string;
  startBeautyDescription: string;
  startNow: string;
  beautyExcellence: string;
  followUs: string;
  allRightsReserved: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common UI
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    search: 'Search',
    
    // Navigation
    home: 'Home',
    appointments: 'Appointments',
    settings: 'Settings',
    profile: 'Profile',
    news: 'News',
    promotions: 'Promotions',
    
    // AI Chat
    aiAssistant: 'AI Assistant',
    aiAssistantHaib: 'HAIB Beauty Assistant',
    chatPlaceholder: 'Ask your beauty assistant for advice...',
    aiThinking: 'AI is thinking...',
    listeningNow: 'Listening... Speak now',
    bookAppointment: 'Book Appointment',
    findSalon: 'Find Salon',
    viewSchedule: 'View Schedule',
    askQuestion: 'Ask your question...',
    welcomeMessage: 'Hello, I am your beauty assistant.',
    welcomeSubMessage: 'Ask me about treatments, appointments and salons!',
    
    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    notificationSubtext: 'Stay updated with your appointments and offers',
    noNotifications: 'No notifications yet',
    tapToView: 'Tap to view',
    
    // Time
    minutesAgo: 'm ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
    
    // Welcome Page
    welcomeTitle: '',
    welcomeDescription: 'AI-powered beauty experiences. Discover premium salons, book instantly, and let our intelligent assistant guide your perfect beauty journey.',
    startJourney: 'Start Your Journey',
    signIn: 'Sign In',
    howItWorks: 'How It Works',
    howItWorksDescription: 'AI-powered beauty in three simple steps',
    discover: 'AI Discovery',
    discoverDescription: 'Our AI finds your perfect salon match instantly.',
    book: 'Smart Booking',
    bookDescription: 'Book appointments with intelligent scheduling.',
    experience: 'Premium Experience',
    experienceDescription: 'Enjoy luxury treatments with AI-enhanced service.',
    exploreHaib: 'Explore HAIB AI',
    exploreDescription: 'Where artificial intelligence meets beauty excellence',
    premiumSalons: 'AI-Curated Salons',
    premiumSalonsDescription: 'Our AI selects the finest salons for your perfect match.',
    exploreSalons: 'Explore Salons',
    exclusiveOffers: 'Smart Offers',
    exclusiveOffersDescription: 'AI-personalized deals just for you.',
    viewOffers: 'View Offers',
    startBeautyJourney: 'Start Your AI Beauty Journey',
    startBeautyDescription: 'Experience the future of beauty with HAIB\'s AI-powered platform. Intelligent recommendations, seamless booking, premium experiences.',
    startNow: 'Start Now',
    beautyExcellence: 'AI-Powered Beauty Excellence',
    followUs: 'Follow us on',
    allRightsReserved: 'All rights reserved.',
  },
  ar: {
    // Common UI
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    back: 'رجوع',
    search: 'بحث',
    
    // Navigation
    home: 'الرئيسية',
    appointments: 'المواعيد',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    news: 'الأخبار',
    promotions: 'العروض',
    
    // AI Chat
    aiAssistant: 'المساعد الذكي',
    aiAssistantHaib: 'مساعد الجمال هايب',
    chatPlaceholder: 'اسأل مساعد الجمال للحصول على النصيحة...',
    aiThinking: 'الذكاء الاصطناعي يفكر...',
    listeningNow: 'الاستماع... تحدث الآن',
    bookAppointment: 'حجز موعد',
    findSalon: 'العثور على صالون',
    viewSchedule: 'عرض الجدول',
    askQuestion: 'اطرح سؤالك...',
    welcomeMessage: 'مرحباً، أنا مساعد الجمال الخاص بك.',
    welcomeSubMessage: 'اسألني عن العلاجات والمواعيد والصالونات!',
    
    // Notifications
    notifications: 'الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    notificationSubtext: 'ابق محدثاً بمواعيدك وعروضك',
    noNotifications: 'لا توجد إشعارات بعد',
    tapToView: 'انقر للعرض',
    
    // Time
    minutesAgo: 'د',
    hoursAgo: 'س',
    daysAgo: 'ي',
    
    // Welcome Page
    welcomeTitle: '',
    welcomeDescription: 'تجارب جمال مدعومة بالذكاء الاصطناعي. اكتشف الصالونات المميزة، احجز فوراً، ودع مساعدنا الذكي يوجه رحلة جمالك المثالية.',
    startJourney: 'ابدأ رحلتك',
    signIn: 'تسجيل الدخول',
    howItWorks: 'كيف يعمل',
    howItWorksDescription: 'الجمال المدعوم بالذكاء الاصطناعي في ثلاث خطوات بسيطة',
    discover: 'الاكتشاف الذكي',
    discoverDescription: 'ذكاؤنا الاصطناعي يجد لك الصالون المثالي فوراً.',
    book: 'الحجز الذكي',
    bookDescription: 'احجز المواعيد بجدولة ذكية.',
    experience: 'تجربة مميزة',
    experienceDescription: 'استمتع بعلاجات فاخرة مع خدمة محسنة بالذكاء الاصطناعي.',
    exploreHaib: 'استكشف هايب الذكي',
    exploreDescription: 'حيث يلتقي الذكاء الاصطناعي مع تميز الجمال',
    premiumSalons: 'صالونات منتقاة بالذكاء الاصطناعي',
    premiumSalonsDescription: 'ذكاؤنا الاصطناعي يختار أفضل الصالونات لتطابقك المثالي.',
    exploreSalons: 'استكشف الصالونات',
    exclusiveOffers: 'عروض ذكية',
    exclusiveOffersDescription: 'صفقات شخصية بالذكاء الاصطناعي خاصة بك.',
    viewOffers: 'عرض العروض',
    startBeautyJourney: 'ابدأ رحلة جمالك بالذكاء الاصطناعي',
    startBeautyDescription: 'اختبر مستقبل الجمال مع منصة هايب المدعومة بالذكاء الاصطناعي. توصيات ذكية، حجز سلس، تجارب مميزة.',
    startNow: 'ابدأ الآن',
    beautyExcellence: 'تميز الجمال المدعوم بالذكاء الاصطناعي',
    followUs: 'تابعنا على',
    allRightsReserved: 'جميع الحقوق محفوظة.',
  },
  it: {
    // Common UI
    loading: 'Caricamento...',
    save: 'Salva',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica',
    back: 'Indietro',
    search: 'Cerca',
    
    // Navigation
    home: 'Home',
    appointments: 'Appuntamenti',
    settings: 'Impostazioni',
    profile: 'Profilo',
    news: 'Notizie',
    promotions: 'Promozioni',
    
    // AI Chat
    aiAssistant: 'Assistente IA',
    aiAssistantHaib: 'Assistente Bellezza HAIB',
    chatPlaceholder: 'Chiedi consiglio al tuo assistente di bellezza...',
    aiThinking: 'L\'IA sta pensando...',
    listeningNow: 'In ascolto... Parla ora',
    bookAppointment: 'Prenota Appuntamento',
    findSalon: 'Trova Salone',
    viewSchedule: 'Visualizza Agenda',
    askQuestion: 'Fai la tua domanda...',
    welcomeMessage: 'Ciao, sono il tuo assistente di bellezza.',
    welcomeSubMessage: 'Chiedimi di trattamenti, appuntamenti e saloni!',
    
    // Notifications
    notifications: 'Notifiche',
    markAllRead: 'Segna tutto come letto',
    notificationSubtext: 'Rimani aggiornato sui tuoi appuntamenti e offerte',
    noNotifications: 'Nessuna notifica ancora',
    tapToView: 'Tocca per visualizzare',
    
    // Time
    minutesAgo: 'min fa',
    hoursAgo: 'ore fa',
    daysAgo: 'giorni fa',
    
    // Welcome Page
    welcomeTitle: '',
    welcomeDescription: 'Esperienze di bellezza potenziate dall\'AI. Scopri saloni premium, prenota all\'istante e lascia che il nostro assistente intelligente guidi il tuo viaggio di bellezza perfetto.',
    startJourney: 'Inizia il Tuo Viaggio',
    signIn: 'Accedi',
    howItWorks: 'Come Funziona',
    howItWorksDescription: 'Bellezza potenziata dall\'AI in tre semplici passi',
    discover: 'Scoperta AI',
    discoverDescription: 'La nostra AI trova istantaneamente il tuo salon perfetto.',
    book: 'Prenotazione Intelligente',
    bookDescription: 'Prenota appuntamenti con programmazione intelligente.',
    experience: 'Esperienza Premium',
    experienceDescription: 'Goditi trattamenti di lusso con servizio potenziato dall\'AI.',
    exploreHaib: 'Esplora HAIB AI',
    exploreDescription: 'Dove l\'intelligenza artificiale incontra l\'eccellenza della bellezza',
    premiumSalons: 'Saloni Curati dall\'AI',
    premiumSalonsDescription: 'La nostra AI seleziona i migliori saloni per la tua corrispondenza perfetta.',
    exploreSalons: 'Esplora i Saloni',
    exclusiveOffers: 'Offerte Intelligenti',
    exclusiveOffersDescription: 'Offerte personalizzate dall\'AI solo per te.',
    viewOffers: 'Vedi le Offerte',
    startBeautyJourney: 'Inizia il Tuo Viaggio di Bellezza AI',
    startBeautyDescription: 'Sperimenta il futuro della bellezza con la piattaforma AI di HAIB. Raccomandazioni intelligenti, prenotazioni fluide, esperienze premium.',
    startNow: 'Inizia Ora',
    beautyExcellence: 'Eccellenza di Bellezza Potenziata dall\'AI',
    followUs: 'Seguici su',
    allRightsReserved: 'Tutti i diritti riservati.',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const isRTL = language === 'ar';
  
  // Update document direction and language
  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Provide fallback values instead of throwing error
    console.warn('useLanguage called outside LanguageProvider, using fallback');
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: translations['en'],
      isRTL: false
    };
  }
  return context;
};