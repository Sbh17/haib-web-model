import { Salon, User, Service, Appointment, Review, Promotion, SalonRequest, ServiceCategory, NewsItem } from "@/types";

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
  },
  {
    id: "4",
    email: "sarah.owner@example.com",
    name: "Sarah Thompson",
    phone: "+1555123456",
    role: "salon_owner",
    avatar: "https://i.pravatar.cc/150?img=9",
    createdAt: "2023-01-04T00:00:00Z"
  },
  {
    id: "5",
    email: "mike.client@example.com",
    name: "Mike Wilson",
    phone: "+1555654321",
    role: "user",
    avatar: "https://i.pravatar.cc/150?img=3",
    createdAt: "2023-01-05T00:00:00Z"
  },
  {
    id: "6",
    email: "emily.user@example.com",
    name: "Emily Davis",
    phone: "+1555789012",
    role: "user",
    avatar: "https://i.pravatar.cc/150?img=7",
    createdAt: "2023-01-06T00:00:00Z"
  },
  {
    id: "7",
    email: "alex.owner@example.com",
    name: "Alex Rodriguez",
    phone: "+1555345678",
    role: "salon_owner",
    avatar: "https://i.pravatar.cc/150?img=4",
    createdAt: "2023-01-07T00:00:00Z"
  },
  {
    id: "8",
    email: "lisa.client@example.com",
    name: "Lisa Brown",
    phone: "+1555901234",
    role: "user",
    avatar: "https://i.pravatar.cc/150?img=8",
    createdAt: "2023-01-08T00:00:00Z"
  }
];

// Service Categories
export const serviceCategories: ServiceCategory[] = [
  { id: "1", name: "Hair" },
  { id: "2", name: "Nails" },
  { id: "3", name: "Facial" },
  { id: "4", name: "Massage" },
  { id: "5", name: "Makeup" },
  { id: "6", name: "Eyebrows" },
  { id: "7", name: "Waxing" },
  { id: "8", name: "Body Treatments" }
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
    createdAt: "2023-01-10T00:00:00Z",
    socialMedia: {
      facebook: "https://facebook.com/elegantbeauty",
      instagram: "https://instagram.com/elegantbeauty",
      twitter: "https://twitter.com/elegantbeauty"
    }
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
    createdAt: "2023-02-15T00:00:00Z",
    socialMedia: {
      instagram: "https://instagram.com/urbancuts",
      youtube: "https://youtube.com/urbancuts"
    }
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
    createdAt: "2023-03-20T00:00:00Z",
    socialMedia: {
      facebook: "https://facebook.com/serenespa",
      instagram: "https://instagram.com/serenespa",
      linkedin: "https://linkedin.com/company/serenespa"
    }
  },
  {
    id: "4",
    name: "Glamour Hair Studio",
    description: "Trendy hair salon specializing in modern cuts and colors",
    address: "321 Fashion Ave",
    city: "Miami",
    location: { latitude: 25.7617, longitude: -80.1918 },
    coverImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    rating: 4.7,
    reviewCount: 156,
    ownerId: "4",
    services: [],
    promotions: [],
    status: "approved",
    createdAt: "2023-04-15T00:00:00Z",
    socialMedia: {
      instagram: "https://instagram.com/glamourhair",
      facebook: "https://facebook.com/glamourhair"
    }
  },
  {
    id: "5",
    name: "Bliss Nail Spa",
    description: "Premium nail and beauty treatments in a relaxing environment",
    address: "567 Wellness Blvd",
    city: "San Francisco",
    location: { latitude: 37.7749, longitude: -122.4194 },
    coverImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    rating: 4.6,
    reviewCount: 89,
    ownerId: "4",
    services: [],
    promotions: [],
    status: "approved",
    createdAt: "2023-05-10T00:00:00Z",
    socialMedia: {
      instagram: "https://instagram.com/blissnailspa",
      facebook: "https://facebook.com/blissnailspa"
    }
  },
  {
    id: "6",
    name: "The Grooming Lounge",
    description: "Upscale barbershop and men's grooming services",
    address: "890 Executive Plaza",
    city: "Dallas",
    location: { latitude: 32.7767, longitude: -96.7970 },
    coverImage: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    rating: 4.8,
    reviewCount: 167,
    ownerId: "7",
    services: [],
    promotions: [],
    status: "approved",
    createdAt: "2023-06-05T00:00:00Z",
    socialMedia: {
      instagram: "https://instagram.com/groominglounge",
      facebook: "https://facebook.com/groominglounge",
      linkedin: "https://linkedin.com/company/groominglounge"
    }
  }
];

// Mock Services
export const services: Service[] = [
  // Elegant Beauty Services
  {
    id: "1",
    name: "Women's Haircut",
    description: "Professional haircut with styling",
    price: 65,
    duration: 60,
    image: "https://images.unsplash.com/photo-1589710751893-a6dd7f485ae0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "1",
    categoryId: "1",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z"
  },
  {
    id: "2",
    name: "Manicure",
    description: "Classic manicure with polish",
    price: 35,
    duration: 45,
    image: "https://images.unsplash.com/photo-1610992235683-e39abbf36d75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "1",
    categoryId: "2",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z"
  },
  {
    id: "3",
    name: "Facial Treatment",
    description: "Deep cleansing facial",
    price: 85,
    duration: 75,
    image: "https://images.unsplash.com/photo-1643206782098-276574ebb874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "1",
    categoryId: "3",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z"
  },
  {
    id: "7",
    name: "Hair Coloring",
    description: "Professional hair coloring and highlights",
    price: 120,
    duration: 120,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "1",
    categoryId: "1",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z"
  },
  {
    id: "8",
    name: "Bridal Makeup",
    description: "Complete bridal makeup package",
    price: 150,
    duration: 90,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "1",
    categoryId: "5",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z"
  },
  
  // Urban Cuts Services
  {
    id: "4",
    name: "Men's Haircut",
    description: "Professional men's cut and style",
    price: 45,
    duration: 45,
    image: "https://images.unsplash.com/photo-1599351431608-5b35943bd7bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "2",
    categoryId: "1",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z"
  },
  {
    id: "5",
    name: "Pedicure",
    description: "Relaxing pedicure with polish",
    price: 45,
    duration: 60,
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "2",
    categoryId: "2",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z"
  },
  {
    id: "9",
    name: "Beard Trim",
    description: "Professional beard trimming and styling",
    price: 25,
    duration: 30,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "2",
    categoryId: "1",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z"
  },
  {
    id: "10",
    name: "Gel Manicure",
    description: "Long-lasting gel nail polish",
    price: 55,
    duration: 60,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "2",
    categoryId: "2",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z"
  },
  
  // Serene Spa Services
  {
    id: "6",
    name: "Swedish Massage",
    description: "Full body relaxation massage",
    price: 95,
    duration: 90,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "3",
    categoryId: "4",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2023-03-20T00:00:00Z"
  },
  {
    id: "11",
    name: "Deep Tissue Massage",
    description: "Therapeutic deep tissue massage for tension relief",
    price: 110,
    duration: 90,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "3",
    categoryId: "4",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2023-03-20T00:00:00Z"
  },
  {
    id: "12",
    name: "Hot Stone Massage",
    description: "Relaxing massage with heated stones",
    price: 125,
    duration: 90,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "3",
    categoryId: "4",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2023-03-20T00:00:00Z"
  },
  {
    id: "13",
    name: "Anti-Aging Facial",
    description: "Rejuvenating facial for mature skin",
    price: 120,
    duration: 90,
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "3",
    categoryId: "3",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2023-03-20T00:00:00Z"
  },
  {
    id: "14",
    name: "Body Wrap",
    description: "Detoxifying and moisturizing body treatment",
    price: 100,
    duration: 75,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "3",
    categoryId: "8",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2023-03-20T00:00:00Z"
  },
  
  // Glamour Hair Studio Services
  {
    id: "15",
    name: "Balayage Highlights",
    description: "Modern hand-painted highlights",
    price: 180,
    duration: 150,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "4",
    categoryId: "1",
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2023-04-15T00:00:00Z"
  },
  {
    id: "16",
    name: "Keratin Treatment",
    description: "Hair smoothing and strengthening treatment",
    price: 200,
    duration: 180,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "4",
    categoryId: "1",
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2023-04-15T00:00:00Z"
  },
  {
    id: "17",
    name: "Hair Extensions",
    description: "Professional hair extension application",
    price: 250,
    duration: 120,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "4",
    categoryId: "1",
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2023-04-15T00:00:00Z"
  },
  {
    id: "18",
    name: "Eyebrow Threading",
    description: "Precise eyebrow shaping",
    price: 20,
    duration: 20,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "4",
    categoryId: "6",
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2023-04-15T00:00:00Z"
  },
  
  // Bliss Nail Spa Services
  {
    id: "19",
    name: "Shellac Manicure",
    description: "Premium gel nail treatment",
    price: 65,
    duration: 60,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "5",
    categoryId: "2",
    createdAt: "2023-05-10T00:00:00Z",
    updatedAt: "2023-05-10T00:00:00Z"
  },
  {
    id: "20",
    name: "Acrylic Nails",
    description: "Full set of acrylic nail extensions",
    price: 85,
    duration: 90,
    image: "https://images.unsplash.com/photo-1610992235683-e39abbf36d75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "5",
    categoryId: "2",
    createdAt: "2023-05-10T00:00:00Z",
    updatedAt: "2023-05-10T00:00:00Z"
  },
  {
    id: "21",
    name: "Spa Pedicure",
    description: "Luxurious pedicure with massage",
    price: 70,
    duration: 75,
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "5",
    categoryId: "2",
    createdAt: "2023-05-10T00:00:00Z",
    updatedAt: "2023-05-10T00:00:00Z"
  },
  {
    id: "22",
    name: "Nail Art",
    description: "Custom nail art designs",
    price: 15,
    duration: 30,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "5",
    categoryId: "2",
    createdAt: "2023-05-10T00:00:00Z",
    updatedAt: "2023-05-10T00:00:00Z"
  },
  
  // The Grooming Lounge Services
  {
    id: "23",
    name: "Classic Shave",
    description: "Traditional hot towel shave",
    price: 40,
    duration: 45,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "6",
    categoryId: "1",
    createdAt: "2023-06-05T00:00:00Z",
    updatedAt: "2023-06-05T00:00:00Z"
  },
  {
    id: "24",
    name: "Executive Haircut",
    description: "Premium men's haircut and styling",
    price: 65,
    duration: 60,
    image: "https://images.unsplash.com/photo-1599351431608-5b35943bd7bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "6",
    categoryId: "1",
    createdAt: "2023-06-05T00:00:00Z",
    updatedAt: "2023-06-05T00:00:00Z"
  },
  {
    id: "25",
    name: "Mustache Trim",
    description: "Professional mustache grooming",
    price: 15,
    duration: 20,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "6",
    categoryId: "1",
    createdAt: "2023-06-05T00:00:00Z",
    updatedAt: "2023-06-05T00:00:00Z"
  },
  {
    id: "26",
    name: "Scalp Treatment",
    description: "Revitalizing scalp therapy",
    price: 50,
    duration: 45,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    salonId: "6",
    categoryId: "1",
    createdAt: "2023-06-05T00:00:00Z",
    updatedAt: "2023-06-05T00:00:00Z"
  }
];

// Add services to salons
salons[0].services = services.filter(service => service.salonId === "1");
salons[1].services = services.filter(service => service.salonId === "2");
salons[2].services = services.filter(service => service.salonId === "3");
salons[3].services = services.filter(service => service.salonId === "4");
salons[4].services = services.filter(service => service.salonId === "5");
salons[5].services = services.filter(service => service.salonId === "6");

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
  },
  {
    id: "3",
    userId: "5",
    salonId: "3",
    serviceId: "6",
    date: "2024-06-20T14:00:00Z",
    status: "confirmed",
    notes: "Regular client, prefers firm pressure",
    createdAt: "2024-06-03T11:20:00Z"
  },
  {
    id: "4",
    userId: "6",
    salonId: "4",
    serviceId: "15",
    date: "2024-06-25T13:30:00Z",
    status: "pending",
    notes: "Wants natural-looking highlights",
    createdAt: "2024-06-04T16:45:00Z"
  },
  {
    id: "5",
    userId: "8",
    salonId: "5",
    serviceId: "19",
    date: "2024-06-12T11:00:00Z",
    status: "confirmed",
    createdAt: "2024-06-05T09:30:00Z"
  },
  {
    id: "6",
    userId: "5",
    salonId: "6",
    serviceId: "23",
    date: "2024-06-18T16:00:00Z",
    status: "completed",
    notes: "Executive client, prefers traditional style",
    createdAt: "2024-06-06T13:15:00Z"
  },
  {
    id: "7",
    userId: "6",
    salonId: "1",
    serviceId: "8",
    date: "2024-07-05T09:00:00Z",
    status: "confirmed",
    notes: "Wedding makeup trial",
    createdAt: "2024-06-07T12:00:00Z"
  },
  {
    id: "8",
    userId: "8",
    salonId: "3",
    serviceId: "12",
    date: "2024-06-28T15:00:00Z",
    status: "pending",
    notes: "Birthday treat for herself",
    createdAt: "2024-06-08T10:30:00Z"
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
  },
  {
    id: "3",
    userId: "5",
    salonId: "3",
    rating: 5,
    comment: "The most relaxing massage I've ever had! Will definitely be back.",
    createdAt: "2024-05-22T14:30:00Z"
  },
  {
    id: "4",
    userId: "6",
    salonId: "4",
    rating: 5,
    comment: "Amazing balayage! The colorist really understood what I wanted.",
    createdAt: "2024-05-28T11:15:00Z"
  },
  {
    id: "5",
    userId: "8",
    salonId: "5",
    rating: 4,
    comment: "Beautiful nail art and great attention to detail.",
    createdAt: "2024-05-30T16:20:00Z"
  },
  {
    id: "6",
    userId: "5",
    salonId: "6",
    rating: 5,
    comment: "Perfect traditional shave experience. Professional and relaxing.",
    createdAt: "2024-06-02T10:45:00Z"
  },
  {
    id: "7",
    userId: "6",
    salonId: "1",
    rating: 5,
    comment: "The facial was incredibly relaxing and my skin feels amazing!",
    createdAt: "2024-06-05T13:30:00Z"
  },
  {
    id: "8",
    userId: "8",
    salonId: "2",
    rating: 4,
    comment: "Great beard trim, exactly what I was looking for.",
    createdAt: "2024-06-07T15:00:00Z"
  },
  {
    id: "9",
    userId: "3",
    salonId: "4",
    rating: 5,
    comment: "Love my new hair extensions! They look so natural.",
    createdAt: "2024-06-08T12:20:00Z"
  },
  {
    id: "10",
    userId: "5",
    salonId: "3",
    rating: 5,
    comment: "The hot stone massage was heavenly. Best spa experience!",
    createdAt: "2024-06-09T17:15:00Z"
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
  },
  {
    id: "3",
    salonId: "3",
    title: "Summer Wellness Package",
    description: "Get a relaxing spa treatment and massage combo at a special price!",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    startDate: "2024-05-15T00:00:00Z",
    endDate: "2024-07-15T23:59:59Z",
    discount: 25,
    createdAt: "2024-05-10T00:00:00Z"
  },
  {
    id: "4",
    salonId: "4",
    title: "New Client Special",
    description: "First-time clients get 30% off any hair service!",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    discount: 30,
    createdAt: "2024-05-20T00:00:00Z"
  },
  {
    id: "5",
    salonId: "5",
    title: "Mani-Pedi Combo Deal",
    description: "Book a manicure and pedicure together and save 15%!",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    startDate: "2024-06-15T00:00:00Z",
    endDate: "2024-09-15T23:59:59Z",
    discount: 15,
    createdAt: "2024-06-05T00:00:00Z"
  },
  {
    id: "6",
    salonId: "6",
    title: "Executive Package",
    description: "Haircut, shave, and scalp treatment for the modern gentleman - 20% off!",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-07-31T23:59:59Z",
    discount: 20,
    createdAt: "2024-05-25T00:00:00Z"
  }
];

// Add promotions to salons
salons[0].promotions = promotions.filter(promo => promo.salonId === "1");
salons[1].promotions = promotions.filter(promo => promo.salonId === "2");
salons[2].promotions = promotions.filter(promo => promo.salonId === "3");
salons[3].promotions = promotions.filter(promo => promo.salonId === "4");
salons[4].promotions = promotions.filter(promo => promo.salonId === "5");
salons[5].promotions = promotions.filter(promo => promo.salonId === "6");

// Mock News
export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "New Vegan Beauty Products Available",
    content: "We're excited to announce that all our salons now offer a range of vegan and cruelty-free beauty products. These products are not only ethical but also provide excellent results for your hair and skin. From shampoos to styling products, discover the benefits of plant-based beauty care.",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    date: "2024-06-01T00:00:00Z",
    category: "Products"
  },
  {
    id: "2",
    title: "Beauty Trends for Summer 2024",
    content: "From bold neon colors to subtle pastel tones, discover what's trending this summer season. Our stylists are ready to help you achieve the perfect summer look. This season is all about self-expression and vibrant colors that make you feel confident.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    date: "2024-05-15T00:00:00Z",
    category: "Trends"
  },
  {
    id: "3",
    title: "HAIB App Launches New Features",
    content: "We've updated our app with new appointment scheduling features and personalized recommendations. Book your next appointment with just a few taps! The new interface makes it easier than ever to find and book your favorite services.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80", 
    date: "2024-05-10T00:00:00Z",
    category: "App Updates"
  },
  {
    id: "4",
    title: "The Rise of Men's Grooming",
    content: "Men's grooming has evolved significantly in recent years. From traditional barbershops to modern spas, men are embracing self-care like never before. Discover the latest trends in men's grooming and wellness services.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    date: "2024-04-28T00:00:00Z",
    category: "Trends"
  },
  {
    id: "5",
    title: "Sustainable Beauty: Eco-Friendly Salon Practices",
    content: "Learn about how salons are adopting eco-friendly practices to reduce their environmental impact. From biodegradable products to energy-efficient equipment, the beauty industry is going green.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    date: "2024-04-20T00:00:00Z",
    category: "Industry"
  },
  {
    id: "6",
    title: "Wedding Season Beauty Tips",
    content: "Wedding season is here! Get expert tips on bridal beauty preparations, from skin care routines to the perfect wedding day makeup. Our professional stylists share their secrets for looking radiant on your special day.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    date: "2024-04-15T00:00:00Z",
    category: "Tips"
  },
  {
    id: "7",
    title: "Nail Art Revolution: Express Yourself",
    content: "Nail art has become a form of self-expression and creativity. From minimalist designs to elaborate patterns, discover how nail art is transforming the beauty industry and allowing clients to showcase their personality.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    date: "2024-04-10T00:00:00Z",
    category: "Trends"
  },
  {
    id: "8",
    title: "The Benefits of Regular Spa Treatments",
    content: "Regular spa treatments offer more than just relaxation. Learn about the health and wellness benefits of massages, facials, and body treatments. Discover how incorporating spa services into your routine can improve both physical and mental well-being.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    date: "2024-04-05T00:00:00Z",
    category: "Wellness"
  }
];

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
    createdAt: "2024-05-28T00:00:00Z",
    socialMedia: {
      instagram: "https://instagram.com/glamourstudio",
      facebook: "https://facebook.com/glamourstudio"
    }
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
    createdAt: "2024-06-01T00:00:00Z",
    socialMedia: {
      instagram: "https://instagram.com/naturalbeautyspa",
      twitter: "https://twitter.com/naturalbeauty"
    }
  }
];
