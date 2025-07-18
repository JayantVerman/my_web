# Jayant's Data Engineer Portfolio

## Overview

This is a professional full-stack portfolio website for a Data Engineer built with modern web technologies. The application features a clean, cream-colored design with dynamic content management through an admin panel. It showcases projects, skills, and provides freelancing services information while maintaining a professional appearance optimized for the data engineering field.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 18, 2025)

✓ Added comprehensive skills management system with database integration
✓ Created admin login button in navbar for easy access
✓ Enhanced admin dashboard with skills CRUD operations
✓ Updated freelancing page with category filtering (Data Engineering vs Web Development)
✓ Added sample data for both data engineering and web development projects
✓ Implemented dynamic skills display with customizable icons, colors, and categories
✓ All admin functionality working: add/edit/delete projects, skills, and manage contacts
✓ Fixed critical admin login redirect issue - authentication now works properly
✓ Added "Back to Main Website" button on admin login page for better navigation
✓ Fixed footer links with proper social media URLs and cross-page navigation

## System Architecture

### Full-Stack Architecture
The application follows a monolithic full-stack architecture with clear separation between client and server components:

- **Frontend**: React.js with TypeScript for type safety
- **Backend**: Node.js with Express.js for API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Styling**: Tailwind CSS with custom cream color theme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth transitions

### Design Philosophy
The application prioritizes:
- **Security**: Helmet.js for security headers, CORS configuration, and secure authentication
- **Performance**: Vite for fast development and optimized builds
- **Maintainability**: TypeScript throughout, component-based architecture
- **User Experience**: Responsive design, smooth animations, and accessible UI components

## Key Components

### Frontend Components
- **Header**: Navigation with smooth scroll to sections
- **Hero**: Professional introduction with call-to-action
- **Skills**: Animated skill showcase with icons
- **Projects**: Dynamic project display from database
- **Contact**: Contact form with backend integration
- **Footer**: Professional footer with social links
- **Admin Components**: Project management forms and dashboard

### Backend Components
- **Authentication Middleware**: JWT token verification and admin authorization
- **Database Storage**: Abstracted storage interface with PostgreSQL implementation
- **API Routes**: RESTful endpoints for projects, contacts, testimonials, and auth
- **Security**: Helmet, CORS, and bcrypt integration

### Database Schema
- **Users**: Admin authentication with role-based access
- **Projects**: Portfolio projects with categories (regular/freelance)
- **Contacts**: Contact form submissions with read status
- **Testimonials**: Client testimonials with active status

## Data Flow

### Public Pages
1. **Home Page**: Displays hero, skills, featured projects, and contact form
2. **Freelancing Page**: Shows freelance-specific projects and services
3. **Project Detail**: Individual project pages with full descriptions

### Admin Flow
1. **Login**: JWT authentication with username/password
2. **Dashboard**: CRUD operations for projects, contacts, and testimonials
3. **Content Management**: Dynamic content updates reflected on public pages

### API Endpoints
- `GET /api/projects` - Fetch all projects or by category
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contacts (admin only)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Token verification

## External Dependencies

### UI Framework
- **Shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework

### Database & ORM
- **Neon Database**: PostgreSQL serverless database
- **Drizzle ORM**: Type-safe SQL query builder
- **Drizzle Kit**: Database migration and schema management

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety throughout the application
- **ESBuild**: Fast JavaScript bundler for production

### Animation & Interaction
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations handle schema changes

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Authentication**: Uses `JWT_SECRET` for token signing
- **CORS**: Configurable for production frontend URL

### Production Considerations
- **Security**: Helmet.js configured for production security headers
- **Performance**: Static file serving with Express
- **Scalability**: Database connection pooling with Neon
- **Monitoring**: Request logging middleware for API endpoints

### Development Setup
- **Hot Reloading**: Vite development server with HMR
- **Type Checking**: TypeScript compilation with strict mode
- **Database**: Push schema changes with `npm run db:push`
- **Development Scripts**: `npm run dev` for concurrent client/server development

The application is designed to be easily deployable to platforms like Vercel, Render, or similar services with minimal configuration changes.