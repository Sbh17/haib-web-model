import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  type?: 'text' | 'booking-suggestion' | 'confirmation';
  bookingData?: {
    salonName: string;
    service: string;
    date: string;
    time: string;
    price: number;
  };
}

export interface UserPreferences {
  favoriteServices: string[];
  preferredTimeSlots: string[];
  budgetRange: { min: number; max: number };
  locationPreference: string;
  previousBookings: any[];
}

interface BeautyKnowledge {
  services: { [key: string]: { description: string; averagePrice: number; duration: string } };
  trends: string[];
  tips: { [key: string]: string[] };
}

export class EnhancedAIAgent {
  private preferences: UserPreferences;
  private conversationHistory: ChatMessage[];
  private sentiment: any = null;
  private embeddings: any = null;
  private beautyKnowledge: BeautyKnowledge;

  constructor() {
    this.preferences = {
      favoriteServices: [],
      preferredTimeSlots: [],
      budgetRange: { min: 0, max: 1000 },
      locationPreference: '',
      previousBookings: []
    };
    this.conversationHistory = [];
    this.beautyKnowledge = this.initializeBeautyKnowledge();
    this.initializeAI();
  }

  private async initializeAI() {
    try {
      // Initialize sentiment analysis (disabled for now)
      // this.sentiment = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      
      // Initialize embeddings for semantic search (disabled for now)
      // this.embeddings = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (error) {
      console.log('AI models not loaded, using fallback logic:', error);
    }
  }

  private initializeBeautyKnowledge(): BeautyKnowledge {
    return {
      services: {
        'haircut': { description: 'Professional women\'s hair cutting and styling', averagePrice: 80, duration: '1 hour' },
        'hair coloring': { description: 'Full hair coloring and color correction services', averagePrice: 150, duration: '2-3 hours' },
        'highlights': { description: 'Partial hair coloring with highlights and lowlights', averagePrice: 180, duration: '2.5 hours' },
        'blowout': { description: 'Professional hair washing, drying and styling', averagePrice: 65, duration: '45 minutes' },
        'hair treatment': { description: 'Deep conditioning and restorative hair treatments', averagePrice: 85, duration: '1 hour' },
        'makeup': { description: 'Professional makeup application for any occasion', averagePrice: 120, duration: '1.5 hours' },
        'bridal makeup': { description: 'Complete bridal makeup package with trial', averagePrice: 200, duration: '2 hours' },
        'eyebrows': { description: 'Professional eyebrow shaping and threading', averagePrice: 45, duration: '30 minutes' },
        'eyelash extensions': { description: 'Semi-permanent eyelash enhancement', averagePrice: 180, duration: '2 hours' },
        'manicure': { description: 'Professional nail care and polish application', averagePrice: 40, duration: '45 minutes' },
        'gel manicure': { description: 'Long-lasting gel nail polish treatment', averagePrice: 55, duration: '1 hour' },
        'french manicure': { description: 'Classic French manicure styling', averagePrice: 48, duration: '50 minutes' },
        'pedicure': { description: 'Complete foot and toenail care treatment', averagePrice: 50, duration: '1 hour' },
        'facial': { description: 'Deep cleansing and rejuvenating facial treatment', averagePrice: 100, duration: '1.5 hours' },
        'anti-aging facial': { description: 'Advanced anti-aging skincare treatment', averagePrice: 140, duration: '75 minutes' },
        'massage': { description: 'Relaxing therapeutic body massage', averagePrice: 120, duration: '1 hour' }
      },
      trends: [
        'Glass skin makeup techniques',
        'Curtain bangs and face-framing layers',
        'Sustainable and clean beauty products',
        'Bold graphic eyeliner looks',
        'Natural texture hair movement',
        'Chrome and metallic nail finishes',
        'Skin-first makeup approach',
        'Babylights hair coloring',
        'Russian volume lash extensions',
        'Gua sha facial treatments'
      ],
      tips: {
        'hair care': [
          'Use heat protectant before any heat styling tools',
          'Deep condition weekly for healthy, shiny hair',
          'Trim every 6-8 weeks to prevent split ends and maintain shape',
          'Sleep on silk pillowcases to reduce friction and frizz'
        ],
        'skin care': [
          'Always apply SPF 30+ daily, even when staying indoors',
          'Double cleanse in the evening to remove makeup and impurities',
          'Hydrate from within by drinking plenty of water throughout the day',
          'Use a serum with active ingredients suited to your skin concerns'
        ],
        'nail care': [
          'Always use a base coat to protect nails from staining',
          'Moisturize cuticles daily with nourishing oils',
          'Take breaks between gel manicures to let nails breathe',
          'File nails in one direction to prevent splitting'
        ],
        'makeup': [
          'Prime your skin for longer-lasting makeup application',
          'Blend eyeshadow in windshield wiper motions for seamless color',
          'Set your makeup with powder or setting spray',
          'Clean brushes weekly to prevent bacteria buildup'
        ]
      }
    };
  }

  async processMessage(message: string): Promise<ChatMessage> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isAI: false,
      timestamp: new Date()
    };

    this.conversationHistory.push(userMessage);

    // Analyze sentiment
    let sentimentScore = 0.5;
    if (this.sentiment) {
      try {
        const sentimentResult = await this.sentiment(message);
        sentimentScore = sentimentResult[0].label === 'POSITIVE' ? sentimentResult[0].score : 1 - sentimentResult[0].score;
      } catch (error) {
        console.log('Sentiment analysis failed, using neutral:', error);
      }
    }

    // Generate response based on message content and sentiment
    const response = await this.generateResponse(message, sentimentScore);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: response.content,
      isAI: true,
      timestamp: new Date(),
      type: response.type,
      bookingData: response.bookingData
    };

    this.conversationHistory.push(aiMessage);
    return aiMessage;
  }

  private async generateResponse(message: string, sentimentScore: number): Promise<{
    content: string;
    type?: 'text' | 'booking-suggestion' | 'confirmation';
    bookingData?: any;
  }> {
    const lowerMessage = message.toLowerCase();

    // Greeting responses with luxury tone
    if (this.isGreeting(lowerMessage)) {
      return {
        content: sentimentScore > 0.6 
          ? "Welcome to your personal beauty concierge! ✨ I'm delighted to assist you in discovering exquisite beauty experiences. What luxury service may I curate for you today?"
          : "Good day! I'm here to guide you through our premium beauty services. How may I elevate your beauty routine today?"
      };
    }

    // Service inquiries
    if (this.isServiceInquiry(lowerMessage)) {
      const service = this.extractService(lowerMessage);
      if (service && this.beautyKnowledge.services[service]) {
        const serviceInfo = this.beautyKnowledge.services[service];
        return {
          content: `Ah, ${service}! ${serviceInfo.description}. This exquisite treatment typically takes ${serviceInfo.duration} and averages around $${serviceInfo.averagePrice}. Shall I help you find the perfect salon for this service?`,
          type: 'booking-suggestion',
          bookingData: {
            service: service,
            estimatedPrice: serviceInfo.averagePrice,
            duration: serviceInfo.duration
          }
        };
      }
    }

  // Booking intent
  if (this.isBookingIntent(lowerMessage)) {
    return this.handleBookingRequest(lowerMessage);
  }

    // Beauty tips and advice
    if (this.isAdviceRequest(lowerMessage)) {
      return this.generateBeautyAdvice(lowerMessage);
    }

    // Trend inquiries
    if (this.isTrendInquiry(lowerMessage)) {
      const randomTrend = this.beautyKnowledge.trends[Math.floor(Math.random() * this.beautyKnowledge.trends.length)];
      return {
        content: `Currently trending: ${randomTrend}! This sophisticated approach to beauty is quite popular among our clientele. Would you like me to find salons that specialize in this trend?`
      };
    }

    // Default intelligent response
    return {
      content: this.generateContextualResponse(lowerMessage, sentimentScore)
    };
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isServiceInquiry(message: string): boolean {
    return Object.keys(this.beautyKnowledge.services).some(service => 
      message.includes(service) || message.includes('what is') || message.includes('tell me about')
    );
  }

  private extractService(message: string): string | null {
    for (const service of Object.keys(this.beautyKnowledge.services)) {
      if (message.includes(service)) return service;
    }
    return null;
  }

  private isBookingIntent(message: string): boolean {
    const bookingKeywords = ['book', 'appointment', 'schedule', 'reserve', 'when can i', 'available'];
    return bookingKeywords.some(keyword => message.includes(keyword));
  }

  private isAdviceRequest(message: string): boolean {
    const adviceKeywords = ['tip', 'advice', 'how to', 'should i', 'recommend', 'suggest'];
    return adviceKeywords.some(keyword => message.includes(keyword));
  }

  private isTrendInquiry(message: string): boolean {
    const trendKeywords = ['trend', 'popular', 'fashionable', 'latest', 'new', 'what\'s in'];
    return trendKeywords.some(keyword => message.includes(keyword));
  }

  private async handleBookingRequest(message: string): Promise<{
    content: string;
    type: 'text' | 'booking-suggestion' | 'confirmation';
    bookingData?: any;
  }> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          content: "I'd be delighted to help you book an appointment! However, you'll need to sign in first. Once you're logged in, I can check availability and make your reservation.",
          type: 'text'
        };
      }

      // Call the AI booking agent
      const response = await supabase.functions.invoke('ai-booking-agent', {
        body: {
          message: message,
          userId: user.id
        }
      });

      if (response.error) {
        console.error('Booking agent error:', response.error);
        return {
          content: "I apologize, but I'm having trouble accessing the booking system right now. Please try again in a moment, or feel free to browse available salons manually.",
          type: 'text'
        };
      }

      const result = response.data;

      if (result.success && result.booked) {
        // Successfully booked
        return {
          content: result.message,
          type: 'confirmation',
          bookingData: result.appointment
        };
      } else if (result.success && !result.booked && result.availability) {
        // Available but not booked (suggestions provided)
        return {
          content: result.message,
          type: 'booking-suggestion',
          bookingData: {
            salon: result.availability.salon,
            service: result.availability.service,
            suggestedTimes: result.availability.suggestedTimes
          }
        };
      } else {
        // Parsing or availability issue
        return {
          content: result.message || "I couldn't process your booking request. Please try specifying the service, date, and preferred time more clearly.",
          type: 'text'
        };
      }

    } catch (error) {
      console.error('Error in booking request:', error);
      return {
        content: "I'm experiencing some technical difficulties with the booking system. Please try again, or browse our salon directory to make a reservation directly.",
        type: 'text'
      };
    }
  }

  private generateBookingSuggestion(message: string): {
    content: string;
    type: 'booking-suggestion';
    bookingData: any;
  } {
    const service = this.extractService(message) || 'spa treatment';
    const serviceInfo = this.beautyKnowledge.services[service] || { averagePrice: 100, duration: '1 hour' };

    return {
      content: `I'd be delighted to arrange your ${service} appointment! Based on your preferences, I recommend booking this ${serviceInfo.duration} treatment. Shall I search for premium salons in your area?`,
      type: 'booking-suggestion',
      bookingData: {
        salonName: 'Premium Beauty Lounge',
        service: service,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '2:00 PM',
        price: serviceInfo.averagePrice
      }
    };
  }

  private generateBeautyAdvice(message: string): { content: string } {
    const categories = Object.keys(this.beautyKnowledge.tips);
    const category = categories.find(cat => message.includes(cat)) || categories[0];
    const tips = this.beautyKnowledge.tips[category];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return {
      content: `Here's a luxurious ${category} tip: ${randomTip} ✨ This professional advice will help maintain your beauty routine at the highest standard.`
    };
  }

  private generateContextualResponse(message: string, sentimentScore: number): string {
    const responses = [
      "I understand you're looking for beauty services. Could you tell me more about what you have in mind?",
      "Let me help you discover the perfect beauty experience. What type of treatment interests you?",
      "I'm here to curate the ideal beauty journey for you. What would you like to explore?",
      "Your beauty aspirations are my priority. How may I assist you in achieving them?"
    ];

    const enthusiasticResponses = [
      "How exciting! I love helping create perfect beauty moments. What's your vision?",
      "Wonderful! Beauty is such a personal journey. Tell me what you're dreaming of!",
      "I'm thrilled to be your beauty guide today! What luxurious experience shall we plan?"
    ];

    return sentimentScore > 0.7 
      ? enthusiasticResponses[Math.floor(Math.random() * enthusiasticResponses.length)]
      : responses[Math.floor(Math.random() * responses.length)];
  }

  getPreferences(): UserPreferences {
    return this.preferences;
  }

  updatePreferences(newPreferences: Partial<UserPreferences>) {
    this.preferences = { ...this.preferences, ...newPreferences };
  }

  resetConversation() {
    this.conversationHistory = [];
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }
}

export default EnhancedAIAgent;