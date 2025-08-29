
import cloudService from './CloudService';

// Legacy API service - now uses the new CloudService
// This provides backward compatibility for existing code
console.log('API Service: Using new CloudService architecture');

export default {
  auth: {
    login: cloudService.auth.login.bind(cloudService.auth),
    register: cloudService.auth.register.bind(cloudService.auth),
    logout: cloudService.auth.logout.bind(cloudService.auth),
    getCurrentUser: cloudService.auth.getCurrentUser.bind(cloudService.auth),
  },
  salons: {
    getAll: cloudService.salons.getAll.bind(cloudService.salons),
    getById: cloudService.salons.getById.bind(cloudService.salons),
    getNearby: cloudService.salons.getNearby.bind(cloudService.salons),
    search: cloudService.salons.search.bind(cloudService.salons),
    getWorkers: cloudService.salons.getWorkers.bind(cloudService.salons),
    requestNewSalon: cloudService.salons.requestNewSalon.bind(cloudService.salons),
  },
  services: {
    getAll: cloudService.services.getAll.bind(cloudService.services),
    getForSalon: cloudService.services.getForSalon.bind(cloudService.services),
    getServiceCategories: cloudService.services.getServiceCategories.bind(cloudService.services),
  },
  appointments: {
    getAll: cloudService.appointments.getAll.bind(cloudService.appointments),
    getMyAppointments: cloudService.appointments.getMyAppointments.bind(cloudService.appointments),
    bookAppointment: cloudService.appointments.bookAppointment.bind(cloudService.appointments),
    cancelAppointment: cloudService.appointments.cancelAppointment.bind(cloudService.appointments),
  },
  reviews: {
    getAll: cloudService.reviews.getAll.bind(cloudService.reviews),
    getForSalon: cloudService.reviews.getForSalon.bind(cloudService.reviews),
    create: cloudService.reviews.create.bind(cloudService.reviews),
  },
  news: {
    getAll: cloudService.news.getAll.bind(cloudService.news),
    getById: cloudService.news.getById.bind(cloudService.news),
    getLatest: cloudService.news.getLatest.bind(cloudService.news),
  },
  promotions: {
    getAll: cloudService.promotions.getAll.bind(cloudService.promotions),
    getActive: cloudService.promotions.getActive.bind(cloudService.promotions),
    getForSalon: cloudService.promotions.getForSalon.bind(cloudService.promotions),
  },
  admin: {
    getAllUsers: cloudService.admin.getAllUsers.bind(cloudService.admin),
    deleteUser: cloudService.admin.deleteUser.bind(cloudService.admin),
    resetUserPassword: cloudService.admin.resetUserPassword.bind(cloudService.admin),
    getAllSalons: cloudService.admin.getAllSalons.bind(cloudService.admin),
    getSalonById: cloudService.admin.getSalonById.bind(cloudService.admin),
    updateSalon: cloudService.admin.updateSalon.bind(cloudService.admin),
    deleteSalon: cloudService.admin.deleteSalon.bind(cloudService.admin),
    getSalonRequests: cloudService.admin.getSalonRequests.bind(cloudService.admin),
    approveSalonRequest: cloudService.admin.approveSalonRequest.bind(cloudService.admin),
    rejectSalonRequest: cloudService.admin.rejectSalonRequest.bind(cloudService.admin),
  },
  profiles: {
    updateProfile: cloudService.profiles.updateProfile.bind(cloudService.profiles),
    getProfile: cloudService.profiles.getProfile.bind(cloudService.profiles),
  },
};
