# Portfolio Website

A modern, full-stack portfolio website built with React, Node.js, Express, and PostgreSQL.

## Features

- 🎨 Modern and responsive design
- 🔒 Admin dashboard for content management
- 📱 Dynamic sections with multiple layouts
- 🚀 Fast and optimized performance
- 🔄 Real-time content updates
- 📊 Project showcase with categories
- 💼 Separate freelance section
- 🎯 SEO optimized

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Shadcn/ui components
- Framer Motion for animations
- TanStack Query for data fetching

### Backend
- Node.js with Express
- PostgreSQL database
- Drizzle ORM
- JWT authentication
- TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5000`

### Admin Access
- URL: `http://localhost:5000/admin`
- Default credentials:
  - Username: `admin`
  - Password: `admin123`

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Update database schema
- `npm run db:studio` - Open database UI

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

