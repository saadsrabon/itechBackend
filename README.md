# I-Tech Park Dashboard Backend

Backend API for managing website content through a dashboard interface.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

3. Update the `.env` file with your MongoDB URI and other settings.

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

5. Seed initial data (optional):
```bash
node seeders/heroSeeder.js
```

## API Endpoints

### Hero Section

#### Get Active Hero Section
- **GET** `/api/sections/hero`
- **Description**: Get the currently active hero section
- **Access**: Public
- **Response**: Hero section data

#### Get All Hero Sections (Admin)
- **GET** `/api/sections/hero/all`
- **Description**: Get all hero sections
- **Access**: Private (Admin)
- **Response**: Array of all hero sections

#### Create Hero Section
- **POST** `/api/sections/hero`
- **Description**: Create a new hero section
- **Access**: Private (Admin)
- **Body**:
```json
{
  "title": "Result Driven Digital Agency",
  "description": "Your description here...",
  "primaryButton": {
    "text": "Book a Call",
    "link": "https://calendly.com/abchowdhury-m/30min",
    "target": "_blank"
  },
  "secondaryButton": {
    "text": "See Our Works",
    "link": "#works",
    "target": "_self"
  },
  "videoUrl": "https://www.youtube.com/watch?v=4HQs-yyCrr",
  "isActive": true,
  "order": 1
}
```

#### Update Hero Section
- **PUT** `/api/sections/hero/:id`
- **Description**: Update an existing hero section
- **Access**: Private (Admin)
- **Body**: Same as create

#### Delete Hero Section
- **DELETE** `/api/sections/hero/:id`
- **Description**: Delete a hero section
- **Access**: Private (Admin)

#### Activate Hero Section
- **PATCH** `/api/sections/hero/:id/activate`
- **Description**: Set a hero section as active (deactivates others)
- **Access**: Private (Admin)

## Data Models

### Hero Section
```javascript
{
  title: String,           // Main heading
  description: String,     // Description text
  primaryButton: {
    text: String,          // Button text
    link: String,          // Button URL
    target: String         // "_blank" or "_self"
  },
  secondaryButton: {
    text: String,          // Button text
    link: String,          // Button URL
    target: String         // "_blank" or "_self"
  },
  videoUrl: String,        // YouTube video URL
  isActive: Boolean,       // Is this the active section
  order: Number,           // Display order
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

### Services Section

#### Get All Services (Grouped by Section)
- **GET** `/api/sections/services`
- **Description**: Get all active services grouped by section
- **Access**: Public
- **Response**: Services grouped by section

#### Get Services by Section
- **GET** `/api/sections/services/section/:section`
- **Description**: Get all services for a specific section
- **Access**: Public
- **Response**: Array of services for the section

#### Get Service by ID
- **GET** `/api/sections/services/:id`
- **Description**: Get a specific service by ID
- **Access**: Public
- **Response**: Service data

#### Get All Services (Admin)
- **GET** `/api/sections/services/admin/all?section=Design&page=1&limit=20`
- **Description**: Get all services with pagination and filtering
- **Access**: Private (Admin)
- **Query Parameters**: 
  - `section` (optional): Filter by section
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 20)
- **Response**: Paginated services list

#### Create Service
- **POST** `/api/sections/services`
- **Description**: Create a new service with image uploads
- **Access**: Private (Admin)
- **Content-Type**: `multipart/form-data`
- **Body**:
```
section: "Design"
title: "Graphic Design"
content: "Service description..."
images: [File1, File2, ...] (up to 10 images)
imageAlts: ["Alt text 1", "Alt text 2", ...] (optional)
order: 1
isActive: true
```

#### Update Service
- **PUT** `/api/sections/services/:id`
- **Description**: Update an existing service
- **Access**: Private (Admin)
- **Content-Type**: `multipart/form-data`
- **Body**: Same as create, plus:
```
existingImages: "[{...}]" (JSON string of existing images)
```

#### Delete Service
- **DELETE** `/api/sections/services/:id`
- **Description**: Delete a service and its images
- **Access**: Private (Admin)

#### Delete Service Image
- **DELETE** `/api/sections/services/:id/images/:imageIndex`
- **Description**: Delete a specific image from a service
- **Access**: Private (Admin)

#### Update Service Order
- **PATCH** `/api/sections/services/:id/order`
- **Description**: Update the display order of a service
- **Access**: Private (Admin)
- **Body**:
```json
{
  "order": 2
}
```

### Blog Section

#### Get Active Blogs
- **GET** `/api/sections/blogs`
- **Description**: Get all active blogs ordered by `order` and `createdAt`
- **Access**: Public
- **Response**: Array of blogs

#### Get All Blogs (Admin)
- **GET** `/api/sections/blogs/admin/all?page=1&limit=20`
- **Description**: Get all blogs with pagination
- **Access**: Private (Admin/Editor)

#### Get Blog by ID
- **GET** `/api/sections/blogs/:id`
- **Description**: Get a specific blog
- **Access**: Public

#### Create Blog
- **POST** `/api/sections/blogs`
- **Description**: Create a blog with image upload
- **Access**: Private (Admin/Editor)
- **Content-Type**: `multipart/form-data`
- **Body**:
```
title: "Top Digital Marketing Trends for 2024"
content: "..."
image: File (or skip to use existing URL in `image`)
isActive: true
order: 1
```

#### Update Blog
- **PUT** `/api/sections/blogs/:id`
- **Description**: Update a blog
- **Access**: Private (Admin/Editor)
- **Content-Type**: `multipart/form-data`

#### Delete Blog
- **DELETE** `/api/sections/blogs/:id`
- **Description**: Delete a blog
- **Access**: Private (Admin)

#### Update Blog Order
- **PATCH** `/api/sections/blogs/:id/order`
- **Description**: Update display order
- **Access**: Private (Admin/Editor)
- **Body**:
```json
{
  "order": 2
}
```

### Contact Section

#### Submit Contact Message
- **POST** `/api/sections/contacts`
- **Description**: Submit a contact message
- **Access**: Public
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

#### List Messages (Admin)
- **GET** `/api/sections/contacts/admin/all?page=1&limit=20&status=new|read|resolved`
- **Access**: Private (Admin/Editor)

#### Get Message by ID (Admin)
- **GET** `/api/sections/contacts/:id`
- **Access**: Private (Admin/Editor)

#### Update Status (Admin)
- **PATCH** `/api/sections/contacts/:id/status`
- **Body**:
```json
{ "status": "read" }
```

#### Delete Message (Admin)
- **DELETE** `/api/sections/contacts/:id`
- **Access**: Private (Admin)

### Success Section

#### Get Active Success Stories
- **GET** `/api/sections/success`
- **Description**: Get all active success stories ordered by `order`
- **Access**: Public

#### Get All Success Stories (Admin)
- **GET** `/api/sections/success/admin/all?page=1&limit=20`
- **Description**: Get all success stories with pagination
- **Access**: Private (Admin/Editor)

#### Get Success Story by ID
- **GET** `/api/sections/success/:id`
- **Access**: Public

#### Create Success Story
- **POST** `/api/sections/success`
- **Content-Type**: `multipart/form-data`
- **Access**: Private (Admin/Editor)

#### Update Success Story
- **PUT** `/api/sections/success/:id`
- **Content-Type**: `multipart/form-data`
- **Access**: Private (Admin/Editor)

#### Delete Success Story
- **DELETE** `/api/sections/success/:id`
- **Access**: Private (Admin)

#### Update Success Story Order
- **PATCH** `/api/sections/success/:id/order`
- **Body**:
```json
{ "order": 2 }
```

### About Section

#### Get Active About Items
- **GET** `/api/sections/about`
- **Access**: Public

#### Get All About Items (Admin)
- **GET** `/api/sections/about/admin/all?page=1&limit=20`
- **Access**: Private (Admin/Editor)

#### Get About by ID
- **GET** `/api/sections/about/:id`
- **Access**: Public

#### Create About
- **POST** `/api/sections/about`
- **Content-Type**: `multipart/form-data`
- **Access**: Private (Admin/Editor)

#### Update About
- **PUT** `/api/sections/about/:id`
- **Content-Type**: `multipart/form-data`
- **Access**: Private (Admin/Editor)

#### Delete About
- **DELETE** `/api/sections/about/:id`
- **Access**: Private (Admin)

#### Update About Order
- **PATCH** `/api/sections/about/:id/order`
- **Body**:
```json
{ "order": 2 }
```

## Data Models

### Hero Section
```javascript
{
  title: String,           // Main heading
  description: String,     // Description text
  primaryButton: {
    text: String,          // Button text
    link: String,          // Button URL
    target: String         // "_blank" or "_self"
  },
  secondaryButton: {
    text: String,          // Button text
    link: String,          // Button URL
    target: String         // "_blank" or "_self"
  },
  videoUrl: String,        // YouTube video URL
  isActive: Boolean,       // Is this the active section
  order: Number,           // Display order
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

### Service Section
```javascript
{
  section: String,         // Section name (Design, Web Development, etc.)
  title: String,           // Service title
  content: String,         // Service description
  images: [{               // Array of images
    image: String,         // Image URL
    alt: String,           // Alt text
    order: Number          // Display order
  }],
  isActive: Boolean,       // Is service active
  order: Number,           // Display order within section
  slug: String,            // Auto-generated slug from title
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

### Blog
```javascript
{
  title: String,        // Blog title
  content: String,      // Blog content
  image: String,        // Image URL
  isActive: Boolean,    // Active flag
  order: Number,        // Display order
  slug: String,         // Derived from title
  createdAt: Date,
  updatedAt: Date
}
```

### ContactMessage
```javascript
{
  name: String,
  email: String,
  message: String,
  status: 'new' | 'read' | 'resolved',
  createdAt: Date,
  updatedAt: Date
}
```

### SuccessStory
```javascript
{
  name: String,
  designation: String,
  description: String,
  image: String,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### About
```javascript
{
  title: String,
  content: String,
  image: String,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Features

- ✅ CRUD operations for Hero section
- ✅ CRUD operations for Services section
- ✅ Image upload handling with Multer
- ✅ Multiple images per service (up to 10)
- ✅ Section-based organization
- ✅ Data validation
- ✅ Error handling
- ✅ Only one active hero section at a time
- ✅ YouTube URL validation
- ✅ Structured API responses
- ✅ Timestamps for all records
- ✅ Automatic file cleanup on deletion
- ✅ Pagination for admin endpoints
# itechBackend
