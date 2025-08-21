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