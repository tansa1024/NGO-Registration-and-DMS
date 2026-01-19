# Unnati - NGO Registration and Donation Management System

Non-governmental organisations often run online campaigns where individuals register to support a cause and may choose to donate. In many cases, user data is lost if a donation is not completed, and administrators lack clear visibility into registrations and donations. This project focuses on building a backend-driven system that separates user registration from donation flow, ensuring data integrity, transparency, and ethical handling of payments.

## Features

### For Users
- **Secure Registration & Login** - JWT-based authentication with password hashing
- **Donation Management** - Make donations via Razorpay payment gateway
- **Dashboard** - Track donation history and account status
- **Profile Management** - View and manage account information

### For Administrators
- **Admin Dashboard** - Overview of registrations, donations, and system health
- **Registration Management** - View, search, filter, and export user data
- **Donation Management** - Track all transactions with status filtering
- **Export Functionality** - Download data as CSV for reporting

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite
- **Authentication**: JWT with HTTP-only cookies
- **Payments**: Razorpay Integration
- 
## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tansa1024/NGO-Registration-and-DMS.git
   cd NGO-Registration-and-DMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   JWT_SECRET=super-secret-key-change-me
   RAZORPAY_KEY_ID=rzp_test_S3SGdUFoKb8CaM
   RAZORPAY_KEY_SECRET=TiKRFj5hSQiCPwlywVOjYSbD
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables
A CSV File containing API keys has also been uploaded.

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | super-secret-key-change-me |
| `RAZORPAY_KEY_ID` | rzp_test_S3SGdUFoKb8CaM |
| `RAZORPAY_KEY_SECRET` | TiKRFj5hSQiCPwlywVOjYSbD |
| `ADMIN_SECRET` | admin123 |

## Project Structure

```
ngo-system/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── donations/    # Donation endpoints
│   │   │   ├── razorpay/     # Payment endpoints
│   │   │   └── admin/        # Admin endpoints
│   │   ├── dashboard/
│   │   │   ├── admin/        # Admin dashboard pages
│   │   │   └── user/         # User dashboard pages
│   │   ├── login/            # Auth page (Login/Register)
│   │   ├── donate/           # Donation page
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   └── lib/                  # Utilities (auth, db)
├── public/                   # Static assets
└── package.json
```

## Usage

### User Registration
1. Navigate to `/login`
2. Click on the "Register" tab
3. Fill in your details
4. For admin access, select "Admin" role and enter the admin secret code

### Making a Donation
1. Log in to your account
2. Click "Make a Donation" or navigate to `/donate`
3. Enter the amount or select a quick amount
4. Complete payment via Razorpay

### Admin Features
1. Access the admin dashboard at `/dashboard/admin`
2. View registrations and donations
3. Use search and filter options
4. Export data as CSV

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/me` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/razorpay/order` | Create payment order |
| POST | `/api/razorpay/verify` | Verify payment |
| GET | `/api/donations` | Get donations |
| GET | `/api/admin/export` | Export data as CSV |

## Test Cards for Indian Payments

| Card Network | Card Number | CVV | Expiry Date |
| :--- | :--- | :--- | :--- |
| **Mastercard** | `5500 6700 0000 1002` | Random CVV | Any future date |
| **Visa** | `4100 2800 0000 1007` | Random CVV | Any future date |

## Test Cards for International Payments

| Card Network | Card Number | CVV | Expiry Date |
| :--- | :--- | :--- | :--- |
| **Mastercard** | `5421 1393 0609 0628` | Random CVV | Any future date |
| **Mastercard** | `5105 1051 0510 5100` | Random CVV | Any future date |
| **Mastercard** | `5104 0600 0000 0008` | Random CVV | Any future date |
| **Visa** | `4012 8888 8888 1881` | Random CVV | Any future date |

## Video Demo
https://drive.google.com/file/d/1S--mNGVVnRdSMnqRy78PPt6zY7couhGX/view?usp=sharing

