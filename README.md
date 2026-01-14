# NGO Campaign Management System

## Overview
A secure, backend-driven system for NGOs to manage online campaigns, registrations, and donations. built with Next.js 15, SQLite, and Secure Authentication.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite (local `ngo.db` file)
- **Authentication**: Custom JWT in HttpOnly Cookies
- **Styling**: Vanilla CSS (Tailored variables for Dark/Premium UI)

## Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access Application**:
   Open [http://localhost:3000](http://localhost:3000)

## Features
- **User**: Register, Login, Donate (Mock Payment), View History.
- **Admin**: Dashboard with Stats, View/Filter Registrations & Donations, Export CSV.
- **Security**: Passwords hashed with bcrypt, Session management via JWT.

## Admin Access
To create an admin account, register with the **Admin Code**: `admin123`.
Or use the demo admin credentials (if you create one):
- Email: `admin@ngo.org`
- Password: (Whichever you set)

## Payment Gateway
The system includes a Mock Payment Gateway. When you donate, you are redirected to a secure-looking page where you can simulate "Success" or "Failure" of the payment.
