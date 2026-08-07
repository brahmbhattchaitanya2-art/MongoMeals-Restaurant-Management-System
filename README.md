# MongoMeals — Premium Restaurant Experience (MERN)

MongoMeals is a premium, high-end fine-dining restaurant web application built using the MERN stack (MongoDB, Express, React, Node.js) with Vite, Framer Motion, and custom styling.

## Tech Stack
- **Frontend**: React (Vite), Framer Motion, TailwindCSS (v4), Lucide React
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Email Delivery**: Nodemailer (SMTP/Gmail App Passwords)
- **Security**: JSON Web Token (JWT) authorization, bcryptjs password hashing

---

## Core Features & Modules

### 1. User Authentication & Profile
- **Registration & Login**: Secure signup and sign-in powered by bcryptjs password hashing and JWT sessions.
- **Dynamic Loyalty Tiers**: User profiles calculate and display customer loyalty tiers based on points:
  - **Silver**: Under 1500 points
  - **Gold**: 1500 to 3999 points
  - **Platinum**: 4000+ points
- **Profile Logs**: Displays order history, upcoming reservations, and active rewards progress.

### 2. Gourmet Menu Catalog
- Interactive and beautifully designed luxury tasting menu.
- **Search**: Case-insensitive text search across names and descriptions.
- **Category Chips**: Filter items instantly by category (Starters, Main Course, Biryani, South Indian, Desserts, Beverages).
- **Price Filter**: Under Rs 1,000, Rs 1,000 - 2,500, and Above Rs 2,500.
- **Food Type Filter**: Veg (Veg & Vegan) vs. Non-Veg food type selection.
- **Sorting**: Recommended, Price (Low to High / High to Low), and Name (A-Z).

### 3. Table Reservation Floor Plan
- Interactive table booking selector representing real restaurant floor layouts.
- **Past-Date Validation**: Prevents users from booking tables in the past.
- **Race-Condition Protection**: Enforced by a compound unique MongoDB index on `{ date: 1, time: 1, table: 1 }` with a partial filter ignoring cancelled bookings, ensuring duplicate bookings of the same slot are strictly blocked at the database level even under concurrent requests.

### 4. Admin Dashboard
- Centralized administration console for managing:
  - **Users & Tiers**: Manage, view, and audit user records.
  - **Orders**: View customer orders.
  - **Reservations**: Track and update guest bookings.
  - **Reviews**: Approve or reject reviews. Approving a review awards +50 points to the user.
  - **Event Requests**: Track requests for private terrace, lounge, or pavilion venue bookings.

### 5. Email Broadcast & Newsletter Subscription
- **Newsletter Subscription**: "Join Our Community" footer subscription form connects directly to a `CommunitySubscriber` model. Gracefully handles deduplication and re-activation of subscribers.
- **Admin Email Broadcast Panel**:
  - Dynamically fetches and merges active recipients from both registered users and community subscribers.
  - Dedupes duplicate emails across lists and displays them once with a combined source tag (e.g., `Registered User & Community Subscriber`).
  - Search bar to filter emails.
  - Master "Select All" checkbox.
  - Checks fields and selection counts before allowing submission to prevent invalid sends.
  - **SMTP Delivery**: Sends individual personalized emails (BCC equivalent) using Nodemailer. Safely skips invalid email formats and continues sending to valid ones without crashing the request.

### 6. User Experience Design
- **Luxury Aesthetic**: Dynamic HSL gradients, dark/light theme toggle, glassmorphism containers, and smooth micro-animations.
- **Cart Drawer**: Fast shopping bag sliding sidebar drawer.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a cloud-hosted MongoDB Atlas URI.

### 1. Backend Setup
1. Open a terminal in the `server` directory:
   ```bash
   cd server
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your variables:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/mongo-meals
   PORT=5000
   JWT_SECRET=your_secret_jwt_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   NODE_ENV=development
   ```
4. Seed the database with default categories, menu items, and the admin user:
   ```bash
   node seed.js
   ```
   * **Default Admin Credentials**:
     - **Email**: `admin@mongomeals.com`
     - **Password**: `admin123`
5. Start the Express server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a terminal in the project root directory:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## Environment Variables Configuration

Use the `.env.example` file as a reference to create your local `.env` configuration:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Connection String (e.g., `mongodb://127.0.0.1:27017/mongo-meals`) |
| `PORT` | Backend Server Port (e.g., `5000`) |
| `JWT_SECRET` | Secret key used to sign JSON Web Tokens |
| `NODE_ENV` | Mode of operation (`development` or `production`) |
| `EMAIL_USER` | Gmail address for sending emails (e.g., `example@gmail.com`) |
| `EMAIL_PASS` | 16-character Gmail App Password |
