# Local Development Setup Guide

## Prerequisites

Before running the project locally, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **PostgreSQL** (v13 or higher)
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres`

## Installation Steps

### 1. Extract and Navigate to Project
```bash
# Extract the ZIP file and navigate to the project directory
cd your-project-folder
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL Database
1. Create a new database:
```sql
CREATE DATABASE portfolio_db;
```

2. Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

#### Option B: Using Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name portfolio-postgres \
  -e POSTGRES_DB=portfolio_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password123 \
  -p 5432:5432 \
  -d postgres:13

# Create .env file
echo "DATABASE_URL=postgresql://admin:password123@localhost:5432/portfolio_db" > .env
echo "JWT_SECRET=your-super-secret-jwt-key-here" >> .env
echo "NODE_ENV=development" >> .env
```

### 4. Initialize Database Schema
```bash
# Push database schema to your local database
npm run db:push
```

### 5. Run the Application
```bash
# Start the development server
npm run dev
```

The application will be available at: `http://localhost:5000`

## Environment Variables

Create a `.env` file in your project root with these variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Environment
NODE_ENV=development

# Optional: For production
CORS_ORIGIN=http://localhost:3000
```

## Database Schema Management

### Push Schema Changes
```bash
# Apply schema changes to database
npm run db:push
```

### View Database
```bash
# Open Drizzle Studio to view/edit database
npm run db:studio
```

## Default Admin Account

After running the application, you can log in with:
- **Username**: `admin`
- **Password**: `admin123`

Access the admin dashboard at: `http://localhost:5000/admin`

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities
│   │   └── hooks/       # Custom hooks
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── db.ts           # Database connection
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema
└── scripts/             # Build scripts
```

## Development Workflow

### Making Changes
1. **Frontend changes**: Edit files in `client/src/`
2. **Backend changes**: Edit files in `server/`
3. **Database changes**: Update `shared/schema.ts` and run `npm run db:push`

### Adding Dependencies
```bash
# Add frontend dependencies
npm install package-name

# Add backend dependencies  
npm install package-name
```

### Database Operations
```bash
# Reset database (careful - this deletes all data)
npm run db:reset

# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Permission Denied**
   - Check file permissions: `chmod +x scripts/*`
   - Verify database user has correct permissions

3. **Port Already in Use**
   - Kill process using port 5000: `lsof -ti:5000 | xargs kill -9`
   - Or change port in `server/index.ts`

4. **Missing Dependencies**
   - Delete node_modules: `rm -rf node_modules`
   - Clear npm cache: `npm cache clean --force`
   - Reinstall: `npm install`

### Database Issues
```bash
# Check database connection
npm run db:check

# View current schema
npm run db:introspect

# Reset everything (nuclear option)
npm run db:reset && npm run db:push
```

## Performance Tips

1. **Database Indexing**: Add indexes for frequently queried columns
2. **Image Optimization**: Use optimized images (WebP format recommended)
3. **Caching**: Consider Redis for session storage in production
4. **Bundle Size**: Use `npm run build` to check bundle size

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random secret (minimum 32 characters)
3. **Database**: Use strong passwords and limit access
4. **CORS**: Configure properly for production domains
5. **HTTPS**: Always use HTTPS in production

## Next Steps

1. Customize the portfolio content through the admin dashboard
2. Update styling in `client/src/index.css`
3. Add your own projects, skills, and personal information
4. Test all functionality locally before deployment