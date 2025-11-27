# Barber Place Management System

Sistem manajemen barber shop dengan admin dashboard dan landing page.

## Teknologi

- **Framework**: Next.js 14 (App Router)
- **Frontend**: TypeScript + Tailwind CSS
- **Database**: Prisma + Supabase PostgreSQL
- **Storage**: Supabase Storage
- **API**: Next.js API Routes

## Struktur Akses

- **Landing Page**: Publik (`/`)
- **Admin**: Full access ke semua data (`/admin`)
- **Kasir**: Access terbatas per cabang (`/kasir`)
- **Login**: Admin & Kasir (`/login`)
- **2 Cabang**: Laporan terpisah per cabang

## Setup Development

```bash
# Clone repository
git clone <repository-url>
cd barber-place

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan credentials yang benar

# Generate Prisma client (setelah setup database)
npx prisma generate

# Run development server
npm run dev
```

## Struktur Project

```
src/
├── app/                  # Pages & API routes
│   ├── page.tsx         # Landing page
│   ├── login/           # Login page
│   ├── admin/           # Admin dashboard
│   ├── kasir/           # Kasir dashboard
│   └── api/             # API endpoints
├── components/           # UI components
│   ├── landing/         # Landing page components
│   ├── admin/           # Admin components
│   └── ui/              # Shared components
├── lib/                  # Database & external clients
│   ├── prismaClient.ts  # Database client
│   └── supabaseClient.ts # Storage client
├── services/             # Business logic
├── repositories/         # Data access layer
└── types/               # TypeScript definitions
```

## Routes

- `/` - Landing page publik
- `/login` - Login admin & kasir
- `/admin` - Dashboard admin
- `/kasir` - Dashboard kasir
- `/api/auth` - Authentication endpoints
- `/api/admin` - Admin API endpoints
- `/api/kasir` - Kasir API endpoints

## Development

Open [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

### Environment Variables

Copy `.env.example` ke `.env.local` dan isi dengan:
- Database URL (Supabase PostgreSQL)
- Supabase URL & Keys
- NextAuth secrets (jika digunakan)

### Database Setup

1. Setup Supabase project
2. Update `DATABASE_URL` di `.env.local`
3. Run `npx prisma db push` (setelah schema dibuat)
4. Run `npx prisma generate`
