# Pizzeria Mirti

A modern restaurant management system built with Next.js, featuring a customer-facing website and comprehensive admin dashboard.

## Features

### Customer Website
- Modern, responsive design
- Interactive menu with categories
- Shopping cart functionality
- Order placement system

### Admin Dashboard
- Real-time order management
- Menu item management
- Customer analytics
- Sales reporting
- Restaurant settings

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB
- **Authentication**: Custom admin authentication
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd pizzeria-mirti
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update `.env.local` with your MongoDB connection string:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
\`\`\`

5. Initialize sample data (optional):
\`\`\`bash
npm run init-data
\`\`\`

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Admin Access

- URL: `/admin`
- Email: `admin@pizzeriamirti.com`
- Password: `admin123`

## Deployment

This application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `MONGODB_URI` environment variable in Vercel dashboard
4. Deploy!

## Project Structure

\`\`\`
app/
├── admin/                 # Admin dashboard pages
├── api/                   # API routes
├── cart/                  # Shopping cart page
├── menu/                  # Menu page
├── globals.css            # Global styles
├── layout.tsx             # Root layout
└── page.tsx               # Homepage
components/
├── ui/                    # shadcn/ui components
└── layout/                # Layout components
lib/
├── mongodb.ts             # Database connection
└── utils.ts               # Utility functions
\`\`\`

## License

MIT License - see LICENSE file for details.
