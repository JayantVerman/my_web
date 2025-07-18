# Quick Start Guide

## Local Development (5 minutes)

### Step 1: Prerequisites
- Install Node.js 18+: https://nodejs.org/
- Install PostgreSQL 13+: https://www.postgresql.org/download/

### Step 2: Setup
```bash
# 1. Extract project and navigate to folder
cd your-project-folder

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Create .env file with your database credentials
cp .env.example .env
# Edit .env with your database details
```

### Step 3: Database
```bash
# Create database
createdb portfolio_db

# Update .env with your database URL
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
JWT_SECRET=your-32-character-secret-key

# Push schema
npm run db:push
```

### Step 4: Run
```bash
npm run dev
```

Visit: http://localhost:5000
Admin: http://localhost:5000/admin (admin/admin123)

## Production Deployment (10 minutes)

### Option 1: Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Option 2: Railway
1. Connect GitHub repo
2. Add PostgreSQL service
3. Set environment variables
4. Deploy

### Option 3: Render
1. Connect GitHub repo
2. Create PostgreSQL database
3. Set environment variables
4. Deploy

## Environment Variables

### Required
```env
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-secret-key-32-characters-minimum
```

### Optional
```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

## Database Providers

### Free Options
- **Neon**: https://neon.tech/ (PostgreSQL)
- **PlanetScale**: https://planetscale.com/ (MySQL)
- **Supabase**: https://supabase.com/ (PostgreSQL)

### Paid Options
- **AWS RDS**
- **Google Cloud SQL**
- **Azure Database**

## Common Issues & Solutions

### Database Connection Failed
```bash
# Check if PostgreSQL is running
pg_ctl status

# Test connection
psql -U username -d database_name
```

### Port 5000 in Use
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in server/index.ts
```

### Build Failures
```bash
# Clear everything and reinstall
rm -rf node_modules dist
npm install
```

### Authentication Issues
- Ensure JWT_SECRET is set and 32+ characters
- Check admin credentials: admin/admin123
- Clear browser cookies and try again

## Next Steps

1. **Content Management**: Use admin dashboard to add your projects
2. **Customization**: Update colors in `client/src/index.css`
3. **Personal Info**: Update your details in admin panel
4. **Skills**: Add your technical skills
5. **Projects**: Showcase your work
6. **Contact**: Set up contact form (optional email integration)

## Support

- **Setup Issues**: Check [LOCAL_SETUP.md](LOCAL_SETUP.md)
- **Deployment**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Troubleshooting**: Review error logs in terminal

## File Structure Overview

```
portfolio-project/
├── client/src/          # React frontend
├── server/              # Express backend
├── shared/schema.ts     # Database schema
├── .env.example         # Environment template
├── setup.sh            # Setup script
├── LOCAL_SETUP.md      # Detailed setup guide
├── DEPLOYMENT_GUIDE.md # Deployment instructions
└── README.md           # Project overview
```

That's it! You now have a professional portfolio website with admin management capabilities.