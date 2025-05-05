
import { Salon, User, Service, Appointment, Review, Promotion, SalonRequest, ServiceCategory } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "1",
    email: "admin@beautyspot.com",
    name: "Admin User",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=1",
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "2",
    email: "salon1@example.com",
    name: "John Owner",
    phone: "+1234567890",
    role: "salon_owner",
    avatar: "https://i.pravatar.cc/150?img=2",
    createdAt: "2023-01-02T00:00:00Z"
  },
  {
    id: "3",
    email: "user@example.com",
    name: "Jane Client",
    phone: "+9876543210",
    role: "user",
    avatar: "https://i.pravatar.cc/150?img=5",
    createdAt: "2023-01-03T00:00:00Z"
  }
];

// Service Categories
export const serviceCategories: ServiceCategory[] = [
  { id: "1", name: "Hair" },
  { id: "2", name: "Nails" },
  { id: "3", name: "Facial" },
  { id: "4", name: "Massage" },
  { id: "5", name: "Makeup" }
];

// Mock Salons
export const salons: Salon[] = [
  {
    id: "1",
    name: "Elegant Beauty",
    description: "Luxury beauty salon with top-tier services",
    address: "123 Main St",
    city: "New York",
    location: { latitude: 40.7128, longitude: -74.0060 },
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    rating: 4.8,
    reviewCount: 120,
    ownerId: "2",
    services: [],
    promotions: [],
    status: "approved",
    createdAt: "2023-01-10T00:00:00Z"
  },
  {
    id: "2",
    name: "Urban Cuts",
    description: "Modern salon for the fashion-conscious individual",
    address: "456 Park Ave",
    city: "Chicago",
    location: { latitude: 41.8781, longitude: -87.6298 },
    coverImage: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    rating: 4.5,
    reviewCount: 95,
    ownerId: "2",
    services: [],
    promotions: [],
    status: "approved",
    createdAt: "2023-02-15T00:00:00Z"
  },
  {
    id: "3",
    name: "Serene Spa",
    description: "Relax and rejuvenate with our premium services",
    address: "789 Lake Dr",
    city: "Los Angeles",
    location: { latitude: 34.0522, longitude: -118.2437 },
    coverImage: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    rating: 4.9,
    reviewCount: 210,
    ownerId: "2",
    services: [],
    promotions: [],
    status: "approved",
    createdAt: "2023-03-20T00:00:00Z"
  },
];

// Mock Services
export const services: Service[] = [
  {
    id: "1",
    name: "Women's Haircut",
    description: "Professional haircut with styling",
    price: 65,
    duration: 60,
    image: "https://images.unsplash.com/photo-1589710751893-a6dd7f485ae0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "1",
    categoryId: "1"
  },
  {
    id: "2",
    name: "Manicure",
    description: "Classic manicure with polish",
    price: 35,
    duration: 45,
    image: "https://images.unsplash.com/photo-1610992235683-e39abbf36d75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "1",
    categoryId: "2"
  },
  {
    id: "3",
    name: "Facial Treatment",
    description: "Deep cleansing facial",
    price: 85,
    duration: 75,
    image: "https://images.unsplash.com/photo-1643206782098-276574ebb86d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "1",
    categoryId: "3"
  },
  {
    id: "4",
    name: "Men's Haircut",
    description: "Professional men's cut and style",
    price: 45,
    duration: 45,
    image: "https://images.unsplash.com/photo-1599351431608-5b35943bd7bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "2",
    categoryId: "1"
  },
  {
    id: "5",
    name: "Pedicure",
    description: "Relaxing pedicure with polish",
    price: 45,
    duration: 60,
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "2",
    categoryId: "2"
  },
  {
    id: "6",
    name: "Swedish Massage",
    description: "Full body relaxation massage",
    price: 95,
    duration: 90,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "3",
    categoryId: "4"
  },
];

// Add services to salons
salons[0].services = services.filter(service => service.salonId === "1");
salons[1].services = services.filter(service => service.salonId === "2");
salons[2].services = services.filter(service => service.salonId === "3");

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: "1",
    userId: "3",
    salonId: "1",
    serviceId: "1",
    date: "2024-06-10T10:00:00Z",
    status: "confirmed",
    notes: "First-time client",
    createdAt: "2024-06-01T14:30:00Z"
  },
  {
    id: "2",
    userId: "3",
    salonId: "2",
    serviceId: "4",
    date: "2024-06-15T15:00:00Z",
    status: "pending",
    createdAt: "2024-06-02T09:15:00Z"
  }
];

// Mock Reviews
export const reviews: Review[] = [
  {
    id: "1",
    userId: "3",
    salonId: "1",
    appointmentId: "1",
    rating: 5,
    comment: "Excellent service! My hair looks amazing.",
    createdAt: "2024-05-25T18:00:00Z"
  },
  {
    id: "2",
    userId: "3",
    salonId: "2",
    rating: 4,
    comment: "Good experience overall, but had to wait a bit.",
    createdAt: "2024-05-20T16:45:00Z"
  }
];

// Mock Promotions
export const promotions: Promotion[] = [
  {
    id: "1",
    salonId: "1",
    title: "Summer Special: 20% Off",
    description: "Get 20% off on all hair services this summer!",
    image: "https://images.unsplash.com/photo-1607748851687-ba9a10d47c3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-08-31T23:59:59Z",
    discount: 20,
    createdAt: "2024-05-15T00:00:00Z"
  },
  {
    id: "2",
    salonId: "2",
    title: "Father's Day Deal",
    description: "Buy one men's haircut, get one free!",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    startDate: "2024-06-10T00:00:00Z",
    endDate: "2024-06-20T23:59:59Z",
    discount: 100,
    createdAt: "2024-06-01T00:00:00Z"
  }
];

// Add promotions to salons
salons[0].promotions = promotions.filter(promo => promo.salonId === "1");
salons[1].promotions = promotions.filter(promo => promo.salonId === "2");

// Mock Salon Requests
export const salonRequests: SalonRequest[] = [
  {
    id: "1",
    name: "Glamour Studio",
    description: "High-end beauty studio with the latest trends",
    address: "101 Fashion St",
    city: "Miami",
    ownerEmail: "owner@glamourstudio.com",
    ownerName: "Emma Smith",
    ownerPhone: "+1987654321",
    status: "pending",
    createdAt: "2024-05-28T00:00:00Z"
  },
  {
    id: "2",
    name: "Natural Beauty",
    description: "Organic and natural beauty treatments",
    address: "202 Green Ave",
    city: "Seattle",
    ownerEmail: "owner@naturalbeauty.com",
    ownerName: "Michael Johnson",
    ownerPhone: "+1567891234",
    status: "pending",
    createdAt: "2024-06-01T00:00:00Z"
  }
];
