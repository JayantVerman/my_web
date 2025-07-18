# Jayant's Data Engineer Portfolio

A professional full-stack portfolio website for a Data Engineer, built with React.js, Node.js, Express.js, and PostgreSQL.

## 🚀 Features

- **Modern Tech Stack**: React.js, Node.js, Express.js, PostgreSQL
- **Authentication**: JWT-based admin authentication with bcrypt password hashing
- **Dynamic Content**: All projects and content managed through admin panel
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Framer Motion for professional animations
- **Security**: Helmet.js, CORS, and secure password handling
- **Professional Theme**: Cream-colored design with excellent contrast

## 🛠️ Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Wouter for routing
- React Hook Form for form handling
- TanStack Query for API state management
- Shadcn/ui components

### Backend
- Node.js with Express.js
- PostgreSQL database
- Drizzle ORM for database operations
- JWT authentication
- bcrypt for password hashing
- Helmet.js for security headers
- CORS for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- PostgreSQL 13+
- npm or yarn

### Local Setup
1. **Clone/Download the project**
2. **Run setup script**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
3. **Configure environment**:
   - Edit `.env` with your database credentials
   - Set a strong JWT_SECRET
4. **Initialize database**:
   ```bash
   npm run db:push
   ```
5. **Start development**:
   ```bash
   npm run dev
   ```

Visit `http://localhost:5000` - Admin login: `admin/admin123`

## 📖 Documentation

- **[Local Setup Guide](LOCAL_SETUP.md)** - Complete local development setup
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions

## 🏗️ Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and configurations
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── db.ts           # Database connection
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema with Drizzle
└── scripts/             # Build and utility scripts
```

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:studio    # Open database studio (if installed)
```

## 🚀 Deployment

### Recommended Platforms
1. **Vercel** - Best for full-stack apps
2. **Railway** - Simple deployment with database
3. **Render** - Free tier available
4. **DigitalOcean** - Scalable infrastructure

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🐛 Troubleshooting

### Common Issues
1. **Database connection errors**: Check DATABASE_URL format
2. **Port conflicts**: Change port in `server/index.ts`
3. **Build failures**: Verify Node.js version compatibility
4. **Authentication issues**: Ensure JWT_SECRET is set

### Debug Commands
```bash
# Reset everything if needed
rm -rf node_modules dist && npm install
```

## 📱 Admin Features

### Content Management
- **Projects**: Create, edit, delete portfolio projects
- **Skills**: Manage technical skills with categories
- **Personal Info**: Update profile information
- **Contacts**: View and manage contact submissions
- **Website Sections**: Custom content management

Access admin dashboard at `/admin/dashboard` with credentials: `admin/admin123`

