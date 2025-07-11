import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export class PushNotificationService {
  static async requestPermissions() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications only available on native platforms');
      return false;
    }

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === 'granted') {
      await PushNotifications.register();
      return true;
    }
    return false;
  }

  static async initialize() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // Request permissions and register for push notifications
    await this.requestPermissions();

    // Listen for registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // Store the token in your backend for sending notifications
      this.storeDeviceToken(token.value);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Registration error: ', error);
    });

    // Listen for incoming notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
    });

    // Listen for notification actions
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification);
      // Handle the notification tap - maybe navigate to appointments page
    });
  }

  private static async storeDeviceToken(token: string) {
    try {
      // Store the device token in localStorage for now
      // In production, you'd want to send this to your backend
      localStorage.setItem('pushToken', token);
      
      // TODO: Send token to your backend API
      // await fetch('/api/store-push-token', {
      //   method: 'POST',
      //   body: JSON.stringify({ token, userId: currentUserId })
      // });
    } catch (error) {
      console.error('Error storing device token:', error);
    }
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('pushToken');
  }
}