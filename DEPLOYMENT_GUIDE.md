# Deployment Guide

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is ideal for this full-stack application with built-in database support.

#### Prerequisites
1. GitHub account
2. Vercel account (free tier available)
3. Database provider (Neon, PlanetScale, or Supabase)

#### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. **Set up Database**
   - **Neon (Recommended)**: https://neon.tech/
   - **PlanetScale**: https://planetscale.com/
   - **Supabase**: https://supabase.com/

3. **Deploy to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Configure environment variables:
     ```
     DATABASE_URL=your-database-connection-string
     JWT_SECRET=your-jwt-secret-32-characters-minimum
     NODE_ENV=production
     ```

4. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Vercel Configuration
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/index.html"
    }
  ]
}
```

### Option 2: Railway

Railway offers simple deployment with PostgreSQL included.

#### Steps
1. **Create Railway Account**: https://railway.app/
2. **Connect GitHub Repository**
3. **Add PostgreSQL Service**
4. **Configure Environment Variables**
5. **Deploy**

### Option 3: Render

Render provides free tier hosting with PostgreSQL.

#### Steps
1. **Create Render Account**: https://render.com/
2. **Create PostgreSQL Database**
3. **Create Web Service**
4. **Configure Build & Start Commands**:
   - Build: `npm install && npm run build`
   - Start: `npm start`

### Option 4: DigitalOcean App Platform

Full-featured platform with scalable infrastructure.

#### Steps
1. **Create DigitalOcean Account**
2. **Connect GitHub Repository**
3. **Add Managed Database**
4. **Configure Environment Variables**
5. **Deploy**

## Environment Variables for Production

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Environment
NODE_ENV=production

# CORS (your domain)
CORS_ORIGIN=https://yourdomain.com

# Optional: Email configuration for contact form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Database Setup for Production

### Using Neon (Recommended)
1. Create account at https://neon.tech/
2. Create new project
3. Copy connection string
4. Add to environment variables

### Using PlanetScale
1. Create account at https://planetscale.com/
2. Create database
3. Create deploy request
4. Get connection string

### Using Supabase
1. Create account at https://supabase.com/
2. Create new project
3. Go to Settings > Database
4. Copy connection string

## Pre-deployment Checklist

### Code Preparation
- [ ] All environment variables configured
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Build process working (`npm run build`)
- [ ] Admin account created
- [ ] All API endpoints tested
- [ ] CORS configured for production domain

### Security Checklist
- [ ] JWT secret is strong (32+ characters)
- [ ] Database credentials secure
- [ ] Environment variables not in code
- [ ] HTTPS enforced
- [ ] Rate limiting implemented (if needed)

### Performance Optimization
- [ ] Images optimized
- [ ] Database indexes added
- [ ] Bundle size optimized
- [ ] Caching configured

## Post-deployment Steps

### 1. Initialize Database
```bash
# Run this after first deployment
npm run db:push
```

### 2. Create Admin Account
Access your deployed app and create the first admin account through the signup process.

### 3. Test All Features
- [ ] Login/logout works
- [ ] Admin dashboard accessible
- [ ] Projects CRUD operations
- [ ] Contact form submission
- [ ] File uploads (if any)
- [ ] Email notifications (if configured)

### 4. Set up Monitoring
- Configure error tracking (Sentry, Bugsnag)
- Set up uptime monitoring
- Monitor database performance
- Set up backup schedules

## Domain Configuration

### Custom Domain Setup
1. **Purchase Domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS**:
   - Add A record pointing to your hosting provider
   - Add CNAME for www subdomain
3. **SSL Certificate**: Most platforms auto-provision SSL

### DNS Configuration Example
```
Type  Name  Value
A     @     your-server-ip
CNAME www   your-app-domain.com
```

## Backup Strategy

### Database Backups
1. **Automated Backups**: Configure daily backups
2. **Manual Backups**: Before major updates
3. **Recovery Testing**: Test restore procedures

### Code Backups
1. **Git Repository**: Primary backup
2. **Multiple Remotes**: GitHub + GitLab/Bitbucket
3. **Local Backups**: Regular pulls

## Monitoring and Maintenance

### Key Metrics to Monitor
- Server response times
- Database query performance
- Error rates
- User engagement
- Storage usage

### Regular Maintenance
- Update dependencies monthly
- Monitor security vulnerabilities
- Review and optimize database queries
- Check backup integrity
- Update content regularly

## Troubleshooting Deployment Issues

### Common Problems

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Review build logs

2. **Database Connection Issues**
   - Verify connection string format
   - Check database server status
   - Ensure firewall allows connections

3. **Environment Variables**
   - Confirm all required vars set
   - Check for typos in variable names
   - Verify sensitive data not exposed

4. **CORS Issues**
   - Update CORS_ORIGIN for production domain
   - Check preflight request handling
   - Verify API endpoints accessible

### Debug Commands
```bash
# Check build output
npm run build

# Test database connection
npm run db:check

# View production logs
npm run logs

# Test production build locally
npm run start
```

## Scaling Considerations

### Database Scaling
- Connection pooling
- Read replicas
- Query optimization
- Indexing strategy

### Application Scaling
- Load balancing
- CDN for static assets
- Caching layers
- Background job processing

### Cost Optimization
- Monitor resource usage
- Optimize database queries
- Implement efficient caching
- Use appropriate hosting tiers

## Support Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Community
- Stack Overflow
- GitHub Issues
- Discord communities
- Reddit r/webdev

Remember to test thoroughly in a staging environment before deploying to production!