# Unnati - NGO Registration and Donation Management System

A modern, full-stack NGO platform built with Next.js that enables secure user registration, donation management, and administrative oversight.

![Unnati](https://img.shields.io/badge/Unnati-For%20a%20Better%20Tomorrow-orange)

## 🌟 Features

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

## 🎨 Design System

The application features an **Indian-themed light mode** design with:
- **Saffron Orange** (#FF9933) - Primary accent color
- **India Green** (#138808) - Secondary accent color
- Modern typography with Inter font
- Responsive layouts with mobile-first approach
- Smooth animations and micro-interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite
- **Authentication**: JWT with HTTP-only cookies
- **Payments**: Razorpay Integration
- **Styling**: Custom CSS with design tokens

## 📦 Installation

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
   JWT_SECRET=your_super_secret_jwt_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ADMIN_SECRET=your_admin_secret_for_registration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for JWT token signing |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret |
| `ADMIN_SECRET` | Secret code for admin registration |

## 📁 Project Structure

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

## 🚀 Usage

### User Registration
1. Navigate to `/login`
2. Click on "Register" tab
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

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based session management
- HTTP-only secure cookies
- Razorpay signature verification
- Role-based access control
- Protected API routes

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ for India

---

**Unnati** - Empowering communities through transparent giving.
