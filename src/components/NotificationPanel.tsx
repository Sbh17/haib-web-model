import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Calendar, Star, Gift, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'promotion' | 'review' | 'general';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Appointment Reminder',
    message: 'Your appointment at Beauty Salon tomorrow at 2:00 PM',
    type: 'appointment',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: '/appointments'
  },
  {
    id: '2',
    title: 'Special Offer!',
    message: '20% off on all hair treatments this weekend',
    type: 'promotion',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionUrl: '/promotions'
  },
  {
    id: '3',
    title: 'Review Request',
    message: 'How was your experience at Glamour Studio? Leave a review!',
    type: 'review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  },
  {
    id: '4',
    title: 'New Feature',
    message: 'Try our new AI beauty consultant for personalized recommendations',
    type: 'general',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'appointment':
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case 'promotion':
      return <Gift className="h-5 w-5 text-green-500" />;
    case 'review':
      return <Star className="h-5 w-5 text-yellow-500" />;
    default:
      return <TrendingUp className="h-5 w-5 text-purple-500" />;
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const NotificationPanel: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-beauty-dark hover:text-beauty-accent hover:bg-beauty-accent/10 transition-all duration-300 rounded-sm"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md bg-gradient-to-b from-beauty-light/95 to-beauty-cream/90 backdrop-blur-lg border-l border-beauty-accent/20">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 dior-heading-sm text-beauty-dark">
              <Bell className="h-5 w-5 text-beauty-accent" />
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs border-beauty-accent/30 text-beauty-dark bg-beauty-light/50 hover:bg-beauty-accent/10 hover:border-beauty-accent transition-all duration-300 rounded-sm"
              >
                Mark all read
              </Button>
            )}
          </div>
          <SheetDescription className="dior-body-sm text-beauty-dark/70">
            Stay updated with your appointments and offers
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-beauty-dark/60">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50 text-beauty-accent" />
                <p className="dior-body">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 rounded-sm border cursor-pointer transition-colors hover:bg-beauty-accent/10 ${
                      !notification.read ? 'bg-beauty-accent/5 border-beauty-accent/20' : 'bg-beauty-cream/30 border-beauty-accent/10'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`dior-body font-medium ${!notification.read ? 'text-beauty-dark' : 'text-beauty-dark/60'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-beauty-accent rounded-full flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="dior-body-sm text-beauty-dark/70 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="dior-body-sm text-beauty-dark/50">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          {notification.actionUrl && (
                            <Badge variant="outline" className="text-xs border-beauty-accent/30 text-beauty-dark bg-beauty-light/50 rounded-sm">
                              Tap to view
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < notifications.length - 1 && <Separator className="my-2 bg-beauty-accent/20" />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;