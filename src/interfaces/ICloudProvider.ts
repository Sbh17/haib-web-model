// Cloud Provider Interface
// This interface defines the contract that all cloud providers must implement
// to ensure consistent behavior across different backends

import { User, Salon, Service, Appointment, Review, NewsItem, Promotion, SalonWorker, SalonRequest, ServiceCategory } from '@/types';

// Base response wrapper for consistent error handling
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

// Authentication interface
export interface IAuthProvider {
  login(email: string, password: string): Promise<User>;
  register(userData: { name: string; email: string; password: string; phone?: string }): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateProfile(userId: string, profileData: Partial<User>): Promise<User>;
  getProfile(userId: string): Promise<User | null>;
}

// Database interface
export interface IDatabaseProvider {
  // Generic CRUD operations
  create<T>(table: string, data: Partial<T>): Promise<T>;
  read<T>(table: string, id: string): Promise<T | null>;
  update<T>(table: string, id: string, data: Partial<T>): Promise<T>;
  delete(table: string, id: string): Promise<void>;
  list<T>(table: string, filters?: Record<string, any>, options?: { limit?: number; offset?: number; orderBy?: string }): Promise<T[]>;
  search<T>(table: string, searchTerm: string, fields: string[]): Promise<T[]>;
  
  // Real-time subscriptions
  subscribe<T>(table: string, callback: (data: T[]) => void, filters?: Record<string, any>): () => void;
}

// Storage interface
export interface IStorageProvider {
  uploadFile(bucket: string, path: string, file: File): Promise<string>;
  downloadFile(bucket: string, path: string): Promise<Blob>;
  deleteFile(bucket: string, path: string): Promise<void>;
  getPublicUrl(bucket: string, path: string): string;
  createBucket(name: string, isPublic?: boolean): Promise<void>;
}

// Business logic interfaces
export interface ISalonProvider {
  getAll(): Promise<Salon[]>;
  getById(id: string): Promise<Salon | null>;
  getNearby(lat: number, lng: number, radius?: number): Promise<Salon[]>;
  search(query: string): Promise<Salon[]>;
  getWorkers(salonId: string): Promise<SalonWorker[]>;
  requestNewSalon(salonData: Omit<SalonRequest, 'id' | 'createdAt' | 'status'>): Promise<SalonRequest>;
}

export interface IServiceProvider {
  getAll(): Promise<Service[]>;
  getForSalon(salonId: string): Promise<Service[]>;
  getServiceCategories(): Promise<ServiceCategory[]>;
}

export interface IAppointmentProvider {
  getAll(): Promise<Appointment[]>;
  getMyAppointments(userId: string): Promise<Appointment[]>;
  bookAppointment(appointmentData: Omit<Appointment, 'id'>): Promise<Appointment>;
  cancelAppointment(appointmentId: string): Promise<void>;
  getAvailableSlots?(salonId: string, serviceId: string, date: string): Promise<string[]>;
}

export interface IReviewProvider {
  getAll(): Promise<Review[]>;
  getForSalon(salonId: string): Promise<Review[]>;
  create(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
}

export interface INewsProvider {
  getAll(): Promise<NewsItem[]>;
  getById(id: string): Promise<NewsItem | null>;
  getLatest(limit?: number): Promise<NewsItem[]>;
}

export interface IPromotionProvider {
  getAll(): Promise<Promotion[]>;
  getActive(): Promise<Promotion[]>;
  getForSalon(salonId: string): Promise<Promotion[]>;
}

export interface IAdminProvider {
  getAllUsers(): Promise<User[]>;
  deleteUser(userId: string): Promise<void>;
  resetUserPassword(userId: string): Promise<void>;
  getAllSalons(): Promise<Salon[]>;
  getSalonById(salonId: string): Promise<Salon | null>;
  updateSalon(salonId: string, salonData: Partial<Salon>): Promise<Salon>;
  deleteSalon(salonId: string): Promise<void>;
  getSalonRequests(): Promise<SalonRequest[]>;
  approveSalonRequest(requestId: string): Promise<void>;
  rejectSalonRequest(requestId: string): Promise<void>;
}

// Main cloud provider interface
export interface ICloudProvider {
  // Provider metadata
  name: string;
  version: string;
  
  // Core services
  auth: IAuthProvider;
  database: IDatabaseProvider;
  storage: IStorageProvider;
  
  // Business logic services
  salons: ISalonProvider;
  services: IServiceProvider;
  appointments: IAppointmentProvider;
  reviews: IReviewProvider;
  news: INewsProvider;
  promotions: IPromotionProvider;
  admin: IAdminProvider;
  profiles: {
    updateProfile: IAuthProvider['updateProfile'];
    getProfile: IAuthProvider['getProfile'];
  };
  
  // Provider-specific methods
  initialize(config: Record<string, any>): Promise<void>;
  isConnected(): boolean;
  getConnectionStatus(): { connected: boolean; message?: string };
  
  // Migration helpers
  exportData?(): Promise<Record<string, any>>;
  importData?(data: Record<string, any>): Promise<void>;
}

// Provider configuration interfaces
export interface IProviderConfig {
  name: 'supabase' | 'azure' | 'gcp' | 'firebase' | 'custom';
  credentials: Record<string, string>;
  settings?: Record<string, any>;
}

export interface ICloudServiceConfig {
  primary: IProviderConfig;
  fallback?: IProviderConfig;
  features: {
    auth: boolean;
    database: boolean;
    storage: boolean;
    realtime: boolean;
    analytics: boolean;
  };
}