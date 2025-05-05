
import { 
  users, salons, services, appointments, reviews, 
  promotions, salonRequests, serviceCategories 
} from "./mockData";
import { 
  User, Salon, Service, Appointment, Review, 
  Promotion, SalonRequest, ServiceCategory, UserRole 
} from "@/types";

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate API error
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

// Mock authentication state
let currentUser: User | null = null;

// Mock API Service
export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(500);
      
      const user = users.find(u => u.email === email);
      if (!user || password !== "password") { // simple mock password check
        throw new ApiError("Invalid email or password", 401);
      }
      
      currentUser = user;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    },
    
    register: async (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }): Promise<User> => {
      await delay(700);
      
      const existingUser = users.find(u => u.email === data.email);
      if (existingUser) {
        throw new ApiError("Email already in use", 409);
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "user" as UserRole,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      currentUser = newUser;
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    },
    
    logout: async (): Promise<void> => {
      await delay(300);
      currentUser = null;
      localStorage.removeItem("user");
    },
    
    getCurrentUser: async (): Promise<User | null> => {
      await delay(300);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        currentUser = user;
        return user;
      }
      return null;
    },
    
    updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
      await delay(600);
      
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new ApiError("User not found", 404);
      }
      
      const updatedUser = { ...users[userIndex], ...data };
      users[userIndex] = updatedUser;
      
      if (currentUser?.id === userId) {
        currentUser = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    }
  },
  
  // Salons
  salons: {
    getAll: async (): Promise<Salon[]> => {
      await delay(500);
      return salons.filter(salon => salon.status === "approved");
    },
    
    getById: async (id: string): Promise<Salon> => {
      await delay(400);
      
      const salon = salons.find(s => s.id === id && s.status === "approved");
      if (!salon) {
        throw new ApiError("Salon not found", 404);
      }
      
      return salon;
    },
    
    getNearby: async (latitude: number, longitude: number, radius: number = 10): Promise<Salon[]> => {
      await delay(600);
      
      // Simple mock distance calculation (not accurate)
      const nearbySalons = salons
        .filter(salon => salon.status === "approved" && salon.location)
        .filter(salon => {
          if (!salon.location) return false;
          
          const latDiff = salon.location.latitude - latitude;
          const lonDiff = salon.location.longitude - longitude;
          const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
          
          // Convert to approximate kilometers (very rough calculation)
          return distance * 111 < radius;
        });
      
      return nearbySalons;
    },
    
    search: async (query: string): Promise<Salon[]> => {
      await delay(500);
      
      const lowercaseQuery = query.toLowerCase();
      return salons.filter(salon => 
        salon.status === "approved" && 
        (salon.name.toLowerCase().includes(lowercaseQuery) || 
         salon.description.toLowerCase().includes(lowercaseQuery) || 
         salon.city.toLowerCase().includes(lowercaseQuery))
      );
    },
    
    requestNewSalon: async (data: Omit<SalonRequest, "id" | "status" | "createdAt">): Promise<SalonRequest> => {
      await delay(800);
      
      const newRequest: SalonRequest = {
        ...data,
        id: `req_${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      salonRequests.push(newRequest);
      return newRequest;
    }
  },
  
  // Admin
  admin: {
    getAllUsers: async (): Promise<User[]> => {
      await delay(600);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ApiError("Unauthorized", 403);
      }
      return users;
    },
    
    deleteUser: async (userId: string): Promise<void> => {
      await delay(500);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ApiError("Unauthorized", 403);
      }
      
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new ApiError("User not found", 404);
      }
      
      users.splice(userIndex, 1);
    },
    
    resetUserPassword: async (userId: string): Promise<void> => {
      await delay(500);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ApiError("Unauthorized", 403);
      }
      
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new ApiError("User not found", 404);
      }
      
      // In a real app, this would generate a reset link or temporary password
      console.log(`Password reset for user ${userId}`);
    },
    
    getSalonRequests: async (): Promise<SalonRequest[]> => {
      await delay(600);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ApiError("Unauthorized", 403);
      }
      return salonRequests;
    },
    
    approveSalonRequest: async (requestId: string): Promise<void> => {
      await delay(700);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ApiError("Unauthorized", 403);
      }
      
      const requestIndex = salonRequests.findIndex(r => r.id === requestId);
      if (requestIndex === -1) {
        throw new ApiError("Salon request not found", 404);
      }
      
      const request = salonRequests[requestIndex];
      
      // Create owner account
      const newOwner: User = {
        id: `user_${Date.now()}`,
        email: request.ownerEmail,
        name: request.ownerName,
        phone: request.ownerPhone,
        role: "salon_owner",
        createdAt: new Date().toISOString()
      };
      users.push(newOwner);
      
      // Create salon
      const newSalon: Salon = {
        id: `salon_${Date.now()}`,
        name: request.name,
        description: request.description,
        address: request.address,
        city: request.city,
        coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
        rating: 0,
        reviewCount: 0,
        ownerId: newOwner.id,
        services: [],
        promotions: [],
        status: "approved",
        createdAt: new Date().toISOString()
      };
      salons.push(newSalon);
      
      // Update request status
      salonRequests[requestIndex] = {
        ...request,
        status: "approved"
      };
    },
    
    rejectSalonRequest: async (requestId: string): Promise<void> => {
      await delay(500);
      if (!currentUser || currentUser.role !== "admin") {
        throw new ApiError("Unauthorized", 403);
      }
      
      const requestIndex = salonRequests.findIndex(r => r.id === requestId);
      if (requestIndex === -1) {
        throw new ApiError("Salon request not found", 404);
      }
      
      salonRequests[requestIndex] = {
        ...salonRequests[requestIndex],
        status: "rejected"
      };
    }
  },
  
  // Salon Owner
  salonOwner: {
    getMySalons: async (): Promise<Salon[]> => {
      await delay(500);
      if (!currentUser || currentUser.role !== "salon_owner") {
        throw new ApiError("Unauthorized", 403);
      }
      
      return salons.filter(salon => salon.ownerId === currentUser?.id);
    },
    
    addService: async (salonId: string, serviceData: Omit<Service, "id" | "salonId">): Promise<Service> => {
      await delay(600);
      if (!currentUser || currentUser.role !== "salon_owner") {
        throw new ApiError("Unauthorized", 403);
      }
      
      const salon = salons.find(s => s.id === salonId && s.ownerId === currentUser?.id);
      if (!salon) {
        throw new ApiError("Salon not found or you don't have permission", 404);
      }
      
      const newService: Service = {
        ...serviceData,
        id: `service_${Date.now()}`,
        salonId
      };
      
      services.push(newService);
      salon.services.push(newService);
      
      return newService;
    },
    
    addPromotion: async (salonId: string, promotionData: Omit<Promotion, "id" | "salonId" | "createdAt">): Promise<Promotion> => {
      await delay(600);
      if (!currentUser || currentUser.role !== "salon_owner") {
        throw new ApiError("Unauthorized", 403);
      }
      
      const salon = salons.find(s => s.id === salonId && s.ownerId === currentUser?.id);
      if (!salon) {
        throw new ApiError("Salon not found or you don't have permission", 404);
      }
      
      const newPromotion: Promotion = {
        ...promotionData,
        id: `promo_${Date.now()}`,
        salonId,
        createdAt: new Date().toISOString()
      };
      
      promotions.push(newPromotion);
      salon.promotions.push(newPromotion);
      
      return newPromotion;
    },
    
    getSalonReviews: async (salonId: string): Promise<Review[]> => {
      await delay(400);
      if (!currentUser || currentUser.role !== "salon_owner") {
        throw new ApiError("Unauthorized", 403);
      }
      
      const salon = salons.find(s => s.id === salonId && s.ownerId === currentUser?.id);
      if (!salon) {
        throw new ApiError("Salon not found or you don't have permission", 404);
      }
      
      return reviews.filter(review => review.salonId === salonId);
    },
    
    getSalonAppointments: async (salonId: string): Promise<Appointment[]> => {
      await delay(500);
      if (!currentUser || currentUser.role !== "salon_owner") {
        throw new ApiError("Unauthorized", 403);
      }
      
      const salon = salons.find(s => s.id === salonId && s.ownerId === currentUser?.id);
      if (!salon) {
        throw new ApiError("Salon not found or you don't have permission", 404);
      }
      
      return appointments.filter(appointment => appointment.salonId === salonId);
    }
  },
  
  // Appointments
  appointments: {
    getMyAppointments: async (): Promise<Appointment[]> => {
      await delay(500);
      if (!currentUser) {
        throw new ApiError("Unauthorized", 403);
      }
      
      return appointments.filter(appointment => appointment.userId === currentUser?.id);
    },
    
    bookAppointment: async (data: Omit<Appointment, "id" | "status" | "createdAt">): Promise<Appointment> => {
      await delay(700);
      if (!currentUser) {
        throw new ApiError("Unauthorized", 403);
      }
      
      const newAppointment: Appointment = {
        ...data,
        id: `apt_${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      appointments.push(newAppointment);
      return newAppointment;
    },
    
    cancelAppointment: async (appointmentId: string): Promise<void> => {
      await delay(500);
      if (!currentUser) {
        throw new ApiError("Unauthorized", 403);
      }
      
      const appointmentIndex = appointments.findIndex(
        a => a.id === appointmentId && 
        (a.userId === currentUser.id || 
         (currentUser.role === "salon_owner" && 
          salons.some(s => s.id === a.salonId && s.ownerId === currentUser?.id)))
      );
      
      if (appointmentIndex === -1) {
        throw new ApiError("Appointment not found or you don't have permission", 404);
      }
      
      appointments[appointmentIndex] = {
        ...appointments[appointmentIndex],
        status: "cancelled"
      };
    }
  },
  
  // Reviews
  reviews: {
    getForSalon: async (salonId: string): Promise<Review[]> => {
      await delay(400);
      return reviews.filter(review => review.salonId === salonId);
    },
    
    addReview: async (data: Omit<Review, "id" | "createdAt">): Promise<Review> => {
      await delay(600);
      if (!currentUser) {
        throw new ApiError("Unauthorized", 403);
      }
      
      // Verify the user has visited this salon
      if (!appointments.some(
        a => a.salonId === data.salonId && 
        a.userId === currentUser.id && 
        a.status === "completed"
      )) {
        throw new ApiError("You can only review salons you've visited", 400);
      }
      
      const newReview: Review = {
        ...data,
        id: `review_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      reviews.push(newReview);
      
      // Update salon rating
      const salonReviews = reviews.filter(r => r.salonId === data.salonId);
      const salonIndex = salons.findIndex(s => s.id === data.salonId);
      
      if (salonIndex >= 0) {
        const totalRating = salonReviews.reduce((sum, r) => sum + r.rating, 0);
        salons[salonIndex] = {
          ...salons[salonIndex],
          rating: totalRating / salonReviews.length,
          reviewCount: salonReviews.length
        };
      }
      
      return newReview;
    }
  },
  
  // Services
  services: {
    getServiceCategories: async (): Promise<ServiceCategory[]> => {
      await delay(300);
      return serviceCategories;
    },
    
    getForSalon: async (salonId: string): Promise<Service[]> => {
      await delay(400);
      return services.filter(service => service.salonId === salonId);
    }
  },
  
  // Promotions
  promotions: {
    getActive: async (): Promise<Promotion[]> => {
      await delay(500);
      const now = new Date().toISOString();
      return promotions.filter(
        p => p.startDate <= now && p.endDate >= now && 
        salons.some(s => s.id === p.salonId && s.status === "approved")
      );
    },
    
    getForSalon: async (salonId: string): Promise<Promotion[]> => {
      await delay(400);
      return promotions.filter(promo => promo.salonId === salonId);
    }
  }
};

export default api;
