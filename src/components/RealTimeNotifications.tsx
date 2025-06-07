
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, Calendar, Heart, Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'appointment' | 'promotion' | 'reminder' | 'review' | 'favorite';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface RealTimeNotificationsProps {
  className?: string;
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock notifications for demo
  useEffect(() => {
    if (user) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'appointment',
          title: 'Appointment Confirmed',
          message: 'Your haircut appointment at Elegant Beauty is confirmed for tomorrow at 2:00 PM',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isRead: false,
          priority: 'high',
          actionUrl: '/appointments'
        },
        {
          id: '2',
          type: 'promotion',
          title: 'Special Offer!',
          message: '20% off on all facial treatments this week at Urban Cuts',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
          priority: 'medium',
          actionUrl: '/promotions'
        },
        {
          id: '3',
          type: 'reminder',
          title: 'Appointment Reminder',
          message: 'Don\'t forget your appointment at Serene Spa tomorrow at 10:00 AM',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          priority: 'high',
          actionUrl: '/appointments'
        }
      ];
      setNotifications(mockNotifications);
    }
  }, [user]);

  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Simulate real-time notifications
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Random chance to show a new notification
      if (Math.random() < 0.1) { // 10% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['appointment', 'promotion', 'reminder'][Math.floor(Math.random() * 3)] as any,
          title: 'New Notification',
          message: 'You have a new update',
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: 'medium'
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
        
        // Show toast for high priority notifications
        if (newNotification.priority === 'high') {
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'promotion':
        return Gift;
      case 'reminder':
        return Clock;
      case 'review':
        return Star;
      case 'favorite':
        return Heart;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!user) return null;

  return (
    <div className={cn('relative', className)}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden z-50 shadow-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors',
                      !notification.isRead && 'bg-blue-50'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="p-2 bg-beauty-primary/10 rounded-full">
                          <Icon className="h-4 w-4 text-beauty-primary" />
                        </div>
                        {!notification.isRead && (
                          <div className={cn(
                            'absolute -top-1 -right-1 w-3 h-3 rounded-full',
                            getPriorityColor(notification.priority)
                          )} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            'text-sm',
                            !notification.isRead ? 'font-semibold' : 'font-medium'
                          )}>
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RealTimeNotifications;
