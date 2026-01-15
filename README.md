# Unnati - NGO Registration and Donation Management System

A modern, full-stack web application for NGOs to manage user registrations and donations with a beautiful Indian-themed UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-green)
![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-orange)

## Features

### User Features
- **User Registration & Authentication** - Secure signup/login with JWT-based sessions
- **User Dashboard** - View donation history, account status
- **Online Donations** - Secure payments via Razorpay integration
- **Profile Management** - View account information

### Admin Features
- **Admin Dashboard** - Overview of registrations, donations, and trends
- **Registration Management** - View, search, filter, and export user data
- **Donation Management** - Track all transactions with status filtering
- **CSV Export** - Export data for reporting

### Design
- **Indian Theme** - Saffron Orange (#FF9933) and India Green (#138808) color palette
- **Modern UI** - Clean, responsive design with smooth animations
- **Light Mode** - Premium light theme with gradients and shadows

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Custom CSS with design tokens
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT with HttpOnly cookies (jose)
- **Payments**: Razorpay integration
- **Password Security**: bcryptjs hashing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tansa1024/NGO-Registration-and-DMS.git
cd NGO-Registration-and-DMS
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env.local
```

4. Update `.env.local` with your credentials:
```env
JWT_SECRET=your-secret-key-here
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── donations/       # Donation endpoints
│   │   ├── razorpay/        # Payment integration
│   │   └── admin/           # Admin endpoints
│   ├── dashboard/
│   │   ├── admin/           # Admin dashboard pages
│   │   └── user/            # User dashboard pages
│   ├── donate/              # Donation page
│   ├── login/               # Combined login/register page
│   └── globals.css          # Design system
├── components/              # Reusable components
└── lib/                     # Utilities (auth, db)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for JWT token signing |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret |

## Admin Access

To register as an admin, use the admin secret: `admin123` during registration.

## License

This project is for educational purposes.

## Author

Built with ❤️ for India
