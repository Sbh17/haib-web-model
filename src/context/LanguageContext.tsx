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
    welcomeTitle: 'HAIB',
    welcomeDescription: 'Discover and book exceptional beauty services in the most beautiful salons. Experience luxury, sophistication and unmatched quality at every appointment.',
    startJourney: 'Start Your Journey',
    signIn: 'Sign In',
    howItWorks: 'How It Works',
    howItWorksDescription: 'Three simple steps to your perfect beauty experience',
    discover: 'Discover',
    discoverDescription: 'Find exceptional beauty salons in your area with detailed information, authentic reviews and premium services.',
    book: 'Book',
    bookDescription: 'Schedule your appointments effortlessly with our sophisticated booking system designed for your comfort.',
    experience: 'Experience',
    experienceDescription: 'Treat yourself to premium beauty treatments and share your exceptional experience with our community.',
    exploreHaib: 'Explore HAIB',
    exploreDescription: 'Discover the sophisticated world of premium beauty services',
    premiumSalons: 'Premium Salons',
    premiumSalonsDescription: 'Discover the most beautiful beauty salons in your area, explore exclusive services and read authentic reviews from our discerning community.',
    exploreSalons: 'Explore Salons',
    exclusiveOffers: 'Exclusive Offers',
    exclusiveOffersDescription: 'Access exclusive promotions and special privileges from the most prestigious salons, reserved for our valued members.',
    viewOffers: 'View Offers',
    startBeautyJourney: 'Start Your Beauty Journey',
    startBeautyDescription: 'Join HAIB today and discover a world of exceptional beauty services, where luxury meets convenience and every appointment becomes a memorable experience.',
    startNow: 'Start Now',
    beautyExcellence: 'Excellence in Beauty Services',
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
    welcomeTitle: 'هايب',
    welcomeDescription: 'اكتشف واحجز خدمات الجمال الاستثنائية في أجمل الصالونات. اختبر الفخامة والرقي والجودة التي لا مثيل لها في كل موعد.',
    startJourney: 'ابدأ رحلتك',
    signIn: 'تسجيل الدخول',
    howItWorks: 'كيف يعمل',
    howItWorksDescription: 'ثلاث خطوات بسيطة إلى تجربة الجمال المثالية',
    discover: 'اكتشف',
    discoverDescription: 'اعثر على صالونات الجمال الاستثنائية في منطقتك مع معلومات مفصلة ومراجعات أصيلة وخدمات مميزة.',
    book: 'احجز',
    bookDescription: 'جدول مواعيدك بسهولة مع نظام الحجز المتطور المصمم لراحتك.',
    experience: 'التجربة',
    experienceDescription: 'دلل نفسك بعلاجات الجمال المميزة وشارك تجربتك الاستثنائية مع مجتمعنا.',
    exploreHaib: 'استكشف هايب',
    exploreDescription: 'اكتشف العالم المتطور لخدمات الجمال المميزة',
    premiumSalons: 'الصالونات المميزة',
    premiumSalonsDescription: 'اكتشف أجمل صالونات الجمال في منطقتك، واستكشف الخدمات الحصرية واقرأ المراجعات الأصيلة من مجتمعنا المميز.',
    exploreSalons: 'استكشف الصالونات',
    exclusiveOffers: 'عروض حصرية',
    exclusiveOffersDescription: 'احصل على العروض الحصرية والامتيازات الخاصة من أرقى الصالونات، المخصصة لأعضائنا المميزين.',
    viewOffers: 'عرض العروض',
    startBeautyJourney: 'ابدأ رحلة الجمال',
    startBeautyDescription: 'انضم إلى هايب اليوم واكتشف عالماً من خدمات الجمال الاستثنائية، حيث يلتقي الفخامة مع الراحة ويصبح كل موعد تجربة لا تُنسى.',
    startNow: 'ابدأ الآن',
    beautyExcellence: 'التميز في خدمات الجمال',
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
    welcomeTitle: 'HAIB',
    welcomeDescription: 'Scopri e prenota servizi di bellezza eccezionali nei saloni più belli. Vivi il lusso, la raffinatezza e la qualità ineguagliabile ad ogni appuntamento.',
    startJourney: 'Inizia il Tuo Viaggio',
    signIn: 'Accedi',
    howItWorks: 'Come Funziona',
    howItWorksDescription: 'Tre semplici passi verso la tua esperienza di bellezza perfetta',
    discover: 'Scopri',
    discoverDescription: 'Trova saloni di bellezza eccezionali nella tua zona con informazioni dettagliate, recensioni autentiche e servizi premium.',
    book: 'Prenota',
    bookDescription: 'Programma i tuoi appuntamenti senza sforzo con il nostro sistema di prenotazione sofisticato progettato per il tuo comfort.',
    experience: 'Esperienza',
    experienceDescription: 'Concediti trattamenti di bellezza premium e condividi la tua esperienza eccezionale con la nostra comunità.',
    exploreHaib: 'Esplora HAIB',
    exploreDescription: 'Scopri il mondo sofisticato dei servizi di bellezza premium',
    premiumSalons: 'Saloni Premium',
    premiumSalonsDescription: 'Scopri i saloni di bellezza più belli della tua zona, esplora servizi esclusivi e leggi recensioni autentiche dalla nostra comunità esigente.',
    exploreSalons: 'Esplora i Saloni',
    exclusiveOffers: 'Offerte Esclusive',
    exclusiveOffersDescription: 'Accedi a promozioni esclusive e privilegi speciali dai saloni più prestigiosi, riservati ai nostri membri stimati.',
    viewOffers: 'Vedi le Offerte',
    startBeautyJourney: 'Inizia il Tuo Viaggio di Bellezza',
    startBeautyDescription: 'Unisciti a HAIB oggi e scopri un mondo di servizi di bellezza eccezionali, dove il lusso incontra la comodità e ogni appuntamento diventa un\'esperienza memorabile.',
    startNow: 'Inizia Ora',
    beautyExcellence: 'Eccellenza nei Servizi di Bellezza',
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};