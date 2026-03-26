# CrankSmith Pro - Environment Setup

## Required Environment Variables

### Database
```bash
POSTGRES_URL="your-postgres-connection-string"
POSTGRES_URL_NON_POOLING="your-postgres-non-pooling-connection-string"
```

### Clerk Authentication
Get your keys from: https://dashboard.clerk.com/last-active?path=api-keys

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### Optional: Customize Clerk URLs
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/builder
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/builder
```

### Email Configuration (for contact form)
```bash
EMAIL_SERVER="smtp://username:password@smtp.zoho.com:587"
EMAIL_FROM="noreply@yourdomain.com"
```

## Setup Instructions

1. Copy this template to your `.env` file
2. Sign up for Clerk at https://clerk.com (free tier available)
3. Create a new application in Clerk Dashboard
4. Copy your API keys to the `.env` file
5. Set up your PostgreSQL database (Vercel Postgres recommended)
6. Run `npm install` to install dependencies
7. Run `npx prisma generate` to generate Prisma client
8. Run `npx prisma db push` to sync database schema
9. Run `npm run dev` to start development server

## For Mobile Apps (iOS/Android)

The app is configured with Capacitor for mobile deployment. Clerk provides native SDKs for smooth mobile authentication.
