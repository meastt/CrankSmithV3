# 🔧 CrankSmith Pro - Quick Start

## ⚠️ Important: Set Up Clerk Authentication

Your app now uses **Clerk** for authentication. To get it working:

### 1. Get Your Clerk API Keys (Free)

1. Go to https://clerk.com and sign up (free tier available)
2. Create a new application
3. Go to **API Keys** in the Clerk Dashboard
4. Copy your keys

### 2. Update Your .env File

Open `.env` and replace these placeholder values with your actual Clerk keys:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YOUR_ACTUAL_KEY_HERE"
CLERK_SECRET_KEY="sk_test_YOUR_ACTUAL_KEY_HERE"
```

### 3. Database Setup (if not already done)

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run the App

```bash
npm run dev
```

Visit http://localhost:3000

---

## 📱 Mobile App (iOS/Android)

The app is configured with Capacitor. To build for mobile:

```bash
# Build the web app first
npm run build

# Copy to native platforms
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

Clerk provides excellent mobile authentication support out of the box.

---

## 🔑 Key Features Now Working

- ✅ User authentication (sign-up/sign-in)
- ✅ Garage (save builds to user account)
- ✅ Builder interface
- ✅ Compatibility validation
- ✅ Performance metrics
- ✅ PWA support

---

## 📧 Need Help?

Check `ENV_SETUP.md` for detailed environment configuration.
