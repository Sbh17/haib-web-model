import { ChatMessage } from './ChatMessage';

export interface UserPreferences {
  serviceType?: string;
  preferredDate?: string;
  preferredTime?: string;
  maxPrice?: number;
  location?: string;
  salonPreference?: string;
}

export class AIBookingAgent {
  private userPreferences: UserPreferences = {};
  private conversationContext: string[] = [];

  constructor() {
    this.userPreferences = {};
    this.conversationContext = [];
  }

  async processMessage(userMessage: string): Promise<ChatMessage> {
    this.conversationContext.push(userMessage.toLowerCase());
    
    // Extract user preferences from the message
    this.extractPreferences(userMessage);

    // Generate appropriate response based on context
    const response = this.generateResponse(userMessage);
    
    return {
      id: Date.now().toString(),
      content: response.content,
      isAI: true,
      timestamp: new Date(),
      type: response.type,
      bookingData: response.bookingData
    };
  }

  private extractPreferences(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Extract service types
    const services = ['haircut', 'manicure', 'pedicure', 'massage', 'facial', 'color', 'highlights', 'blowout'];
    services.forEach(service => {
      if (lowerMessage.includes(service)) {
        this.userPreferences.serviceType = service;
      }
    });

    // Extract time preferences
    if (lowerMessage.includes('morning')) {
      this.userPreferences.preferredTime = 'morning';
    } else if (lowerMessage.includes('afternoon')) {
      this.userPreferences.preferredTime = 'afternoon';
    } else if (lowerMessage.includes('evening')) {
      this.userPreferences.preferredTime = 'evening';
    }

    // Extract date preferences
    const datePatterns = ['today', 'tomorrow', 'this week', 'next week', 'weekend'];
    datePatterns.forEach(pattern => {
      if (lowerMessage.includes(pattern)) {
        this.userPreferences.preferredDate = pattern;
      }
    });

    // Extract budget
    const budgetMatch = lowerMessage.match(/\$(\d+)/);
    if (budgetMatch) {
      this.userPreferences.maxPrice = parseInt(budgetMatch[1]);
    }
  }

  private generateResponse(userMessage: string): {
    content: string;
    type: 'text' | 'booking-suggestion' | 'confirmation';
    bookingData?: any;
  } {
    const lowerMessage = userMessage.toLowerCase();

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || this.conversationContext.length === 1) {
      return {
        content: "Hi there! I'm your AI booking assistant. I'm here to help you find the perfect appointment that fits your needs. What kind of service are you looking for today?",
        type: 'text'
      };
    }

    // Help with service selection
    if (lowerMessage.includes('help') || lowerMessage.includes('what') || lowerMessage.includes('options')) {
      return {
        content: "I can help you book appointments for various services like haircuts, manicures, pedicures, massages, facials, hair coloring, and more! Just tell me what you're interested in, your preferred time, and any budget considerations.",
        type: 'text'
      };
    }

    // When user asks about booking or has provided preferences
    if (this.userPreferences.serviceType || lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
      return this.generateBookingSuggestion();
    }

    // Ask for more details
    return {
      content: "That sounds great! To help you find the best appointment, could you tell me more about what you're looking for? For example, what service interests you, and do you have a preferred time or date?",
      type: 'text'
    };
  }

  private generateBookingSuggestion(): {
    content: string;
    type: 'booking-suggestion';
    bookingData: any;
  } {
    // Mock data - in real app, this would query your database
    const mockSalons = [
      { name: "Glamour Studio", rating: 4.8 },
      { name: "Beauty Bliss", rating: 4.9 },
      { name: "Style Haven", rating: 4.7 }
    ];

    const mockServices = {
      'haircut': { name: 'Signature Haircut', price: 65, duration: 60 },
      'manicure': { name: 'Classic Manicure', price: 35, duration: 45 },
      'pedicure': { name: 'Spa Pedicure', price: 45, duration: 60 },
      'massage': { name: 'Relaxation Massage', price: 85, duration: 90 },
      'facial': { name: 'Deep Cleansing Facial', price: 75, duration: 75 },
      'color': { name: 'Hair Color Service', price: 120, duration: 120 },
    };

    const serviceType = this.userPreferences.serviceType || 'haircut';
    const selectedService = mockServices[serviceType] || mockServices.haircut;
    const selectedSalon = mockSalons[Math.floor(Math.random() * mockSalons.length)];
    
    // Generate suggested date/time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const times = ['10:00 AM', '2:00 PM', '4:30 PM'];
    const selectedTime = times[Math.floor(Math.random() * times.length)];

    const content = `Perfect! Based on your preferences, I found a great match for you. Here's my top recommendation:`;

    return {
      content,
      type: 'booking-suggestion',
      bookingData: {
        salonName: selectedSalon.name,
        service: selectedService.name,
        date: tomorrow.toLocaleDateString(),
        time: selectedTime,
        price: selectedService.price
      }
    };
  }

  getPreferences(): UserPreferences {
    return { ...this.userPreferences };
  }

  resetConversation(): void {
    this.userPreferences = {};
    this.conversationContext = [];
  }
}

export default AIBookingAgent;