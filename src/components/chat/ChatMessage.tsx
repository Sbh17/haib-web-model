import React from 'react';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

interface ChatMessageProps {
  message: ChatMessage;
  onBookAppointment?: (bookingData: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onBookAppointment }) => {
  return (
    <div className={`flex gap-3 mb-4 animate-fade-in ${message.isAI ? 'justify-start' : 'justify-end'}`}>
      {message.isAI && (
        <Avatar className="h-8 w-8 bg-primary">
          <AvatarFallback>
            <Bot className="h-4 w-4 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${message.isAI ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.isAI
              ? 'bg-muted text-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {message.type === 'booking-suggestion' && message.bookingData && (
          <div className="mt-2 bg-card border rounded-xl p-4 shadow-sm">
            <h4 className="font-medium text-sm mb-2">Recommended Appointment</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Salon:</span>
                <span className="font-medium text-foreground">{message.bookingData.salonName}</span>
              </div>
              <div className="flex justify-between">
                <span>Service:</span>
                <span className="font-medium text-foreground">{message.bookingData.service}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="font-medium text-foreground">
                  {message.bookingData.date} at {message.bookingData.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-medium text-foreground">${message.bookingData.price}</span>
              </div>
            </div>
            <button
              onClick={() => onBookAppointment?.(message.bookingData)}
              className="w-full mt-3 bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Book This Appointment
            </button>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!message.isAI && (
        <Avatar className="h-8 w-8 bg-secondary">
          <AvatarFallback>
            <User className="h-4 w-4 text-secondary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;