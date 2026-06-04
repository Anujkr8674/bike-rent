# Nextgen Bike Rent Service

Premium full-stack bike rental platform built with Next.js App Router, TypeScript, Tailwind, Prisma, OTP auth, JWT sessions, and Razorpay-ready payment flow.

## Tech Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion
- Prisma ORM + PostgreSQL (Supabase-compatible)
- Email OTP auth (SMTP) + JWT cookie session
- Razorpay order creation + signature verification

## Setup

1. Copy `.env.example` to `.env` and fill all values.
2. Install deps: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Start app: `npm run dev`

## Available Routes

- Public: `/`, `/bikes`, `/login`
- User: `/book`, `/dashboard`, `/booking/success`
- Admin: `/admin`

## Core API Endpoints

- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET /api/bikes`
- `GET|POST /api/bookings`
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `GET /api/admin/analytics`

## Database Models

- `users`, `admins`, `bikes`, `bookings`, `payments`
- `otp_verifications`, `reviews`, `cities`, `coupons`
- `saved_bikes`, `notifications`
