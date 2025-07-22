# HAIB Beauty Salon Platform - API Endpoints Documentation

## Base URL
```
Production: https://your-api.run.app/api
Development: http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All responses follow this format:
```json
{
  "success": true,
  "data": {...},
  "message": "Success message",
  "errors": []
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /auth/logout
Logout current user (requires authentication).

#### GET /auth/me
Get current user information (requires authentication).

### Users/Profiles

#### GET /profiles/:userId
Get user profile by ID.

#### PUT /profiles/:userId
Update user profile (requires authentication - own profile only).

**Request Body:**
```json
{
  "firstName": "Updated Name",
  "phone": "+9876543210",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### Salons

#### GET /salons
Get all salons with optional filtering.

**Query Parameters:**
- `search` - Search term for salon name
- `city` - Filter by city
- `services` - Comma-separated service IDs
- `lat` & `lng` - Location for distance sorting
- `radius` - Search radius in kilometers
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "salons": [...],
    "total": 50,
    "page": 1,
    "totalPages": 3
  }
}
```

#### GET /salons/:id
Get salon details by ID.

#### POST /salons
Create a new salon (requires authentication - salon_owner role).

**Request Body:**
```json
{
  "name": "Beautiful Hair Salon",
  "description": "Premium hair styling services",
  "phone": "+1234567890",
  "email": "contact@salon.com",
  "streetAddress": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "US",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "amenities": ["wifi", "parking", "wheelchair_accessible"],
  "paymentMethods": ["cash", "card", "digital_wallet"]
}
```

#### PUT /salons/:id
Update salon (requires authentication - salon owner only).

#### DELETE /salons/:id
Delete salon (requires authentication - salon owner or admin).

#### GET /salons/:id/reviews
Get reviews for a specific salon.

#### GET /salons/:id/services
Get services offered by a specific salon.

#### GET /salons/:id/workers
Get workers/staff of a specific salon.

#### GET /salons/nearby
Get nearby salons based on location.

**Query Parameters:**
- `lat` - Latitude (required)
- `lng` - Longitude (required)
- `radius` - Search radius in km (default: 10)

### Services

#### GET /services
Get all services.

**Query Parameters:**
- `salonId` - Filter by salon
- `categoryId` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

#### GET /services/:id
Get service details by ID.

#### POST /services
Create a new service (requires authentication - salon owner).

**Request Body:**
```json
{
  "salonId": "salon_uuid",
  "categoryId": "category_uuid",
  "name": "Hair Cut & Style",
  "description": "Professional haircut with styling",
  "duration": 60,
  "price": 45.00,
  "imageUrl": "https://example.com/service.jpg"
}
```

#### PUT /services/:id
Update service (requires authentication - salon owner).

#### DELETE /services/:id
Delete service (requires authentication - salon owner).

### Service Categories

#### GET /service-categories
Get all service categories.

### Appointments

#### GET /appointments
Get appointments for current user (requires authentication).

**Query Parameters:**
- `status` - Filter by status (pending, confirmed, completed, cancelled)
- `salonId` - Filter by salon
- `startDate` - Start date filter (YYYY-MM-DD)
- `endDate` - End date filter (YYYY-MM-DD)

#### GET /appointments/:id
Get appointment details by ID (requires authentication).

#### POST /appointments
Create a new appointment (requires authentication).

**Request Body:**
```json
{
  "salonId": "salon_uuid",
  "serviceId": "service_uuid",
  "workerId": "worker_uuid",
  "appointmentDate": "2024-01-15",
  "startTime": "14:00",
  "notes": "Please use organic products"
}
```

#### PUT /appointments/:id
Update appointment (requires authentication).

#### POST /appointments/:id/cancel
Cancel appointment (requires authentication).

**Request Body:**
```json
{
  "reason": "Emergency came up"
}
```

#### GET /appointments/available-slots
Get available time slots for booking.

**Query Parameters:**
- `salonId` - Salon ID (required)
- `serviceId` - Service ID (required)
- `workerId` - Worker ID (optional)
- `date` - Date (YYYY-MM-DD, required)

### Reviews

#### GET /reviews
Get all reviews with optional filtering.

**Query Parameters:**
- `salonId` - Filter by salon
- `userId` - Filter by user
- `rating` - Filter by rating (1-5)

#### POST /reviews
Create a new review (requires authentication).

**Request Body:**
```json
{
  "salonId": "salon_uuid",
  "workerId": "worker_uuid",
  "appointmentId": "appointment_uuid",
  "rating": 5,
  "title": "Excellent service!",
  "comment": "Amazing experience, highly recommend!",
  "images": ["https://example.com/img1.jpg"]
}
```

#### PUT /reviews/:id
Update review (requires authentication - own review only).

#### DELETE /reviews/:id
Delete review (requires authentication - own review or admin).

### Promotions

#### GET /promotions
Get all promotions.

**Query Parameters:**
- `salonId` - Filter by salon
- `active` - Filter by active status (true/false)

#### GET /promotions/active
Get currently active promotions.

#### POST /promotions
Create a new promotion (requires authentication - salon owner).

**Request Body:**
```json
{
  "salonId": "salon_uuid",
  "title": "20% Off First Visit",
  "description": "Get 20% off your first appointment",
  "type": "percentage",
  "value": 20.00,
  "minPurchaseAmount": 50.00,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-02-01T00:00:00Z",
  "promoCode": "FIRST20",
  "applicableServices": ["service_uuid1", "service_uuid2"]
}
```

### News

#### GET /news
Get news articles.

**Query Parameters:**
- `category` - Filter by category
- `page` - Page number
- `limit` - Items per page

#### GET /news/:id
Get news article by ID.

### Workers

#### GET /salons/:salonId/workers
Get workers for a specific salon.

#### POST /salons/:salonId/workers
Add a worker to salon (requires authentication - salon owner).

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@salon.com",
  "phone": "+1234567890",
  "specialties": ["hair_cutting", "hair_coloring"],
  "bio": "Experienced stylist with 10 years experience",
  "experienceYears": 10
}
```

### Favorites

#### GET /favorites
Get user's favorite salons (requires authentication).

#### POST /favorites
Add salon to favorites (requires authentication).

**Request Body:**
```json
{
  "salonId": "salon_uuid"
}
```

#### DELETE /favorites/:salonId
Remove salon from favorites (requires authentication).

### Admin Endpoints

#### GET /admin/dashboard
Get admin dashboard statistics (requires admin authentication).

#### GET /admin/salon-requests
Get pending salon registration requests (requires admin authentication).

#### POST /admin/salon-requests/:id/approve
Approve salon registration (requires admin authentication).

#### POST /admin/salon-requests/:id/reject
Reject salon registration (requires admin authentication).

**Request Body:**
```json
{
  "reason": "Incomplete documentation"
}
```

### File Upload

#### POST /upload
Upload file (requires authentication).

**Request:** Multipart form data with file field.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.googleapis.com/bucket/file.jpg",
    "filename": "file.jpg",
    "size": 1024
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "errors": []
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "errors": []
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "errors": []
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "errors": []
}
```

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

Paginated endpoints return:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```