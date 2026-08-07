# MongoMeals — Premium Restaurant Experience (MERN)

MongoMeals is a premium, high-end fine-dining restaurant web experience built using the MERN stack (MongoDB, Express, React, Node.js) with Vite and custom styling.

## Highlights
- **Vibrant & Luxury Theme**: Designed with a luxury dark/light mode toggle.
- **Interactive Floor Plan**: Book specific tables dynamically based on date and time availability.
- **Menu Catalog**: Browse gourmet items, search, sort, and filter by price.
- **Private Events & Request Quote**: Request pavilion, terrace, or lounge event venue bookings with automated past-date blocking and double-booking conflict checks.
- **Rewards & Loyalty System**: Earn points on orders, profile completions, and table bookings. Redeem points for custom rewards.
- **Admin Dashboard**: Manage users, orders, reservations, reviews, and event requests in a centralized admin console.

---

## Getting Started

### 1. Database Setup
Make sure you have MongoDB running locally or have a MongoDB connection URI ready.
- Default local URI: `mongodb://127.0.0.1:27017/mongo-meals`

### 2. Backend Setup
1. Open a terminal in the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and configure your variables:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/mongo-meals
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
4. Seed the database with menu items and the default admin user:
   Open your browser and visit: `http://localhost:5000/api/seed` after starting the server.
    * Default Admin Credentials:
      * **Email**: `admin@mongomeals.com`
      * **Password**: `admin123`
    * Standard User Accounts:
      * Standard users can register their own accounts via the **Register** page on the frontend.
      * New registered users receive a welcome email and a sign-up bonus of 50 loyalty points.
      * Any registered user can log in to view their profile, earn points, track visits, and redeem rewards.

5. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Open a terminal in the project root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
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

## Environment Variables Documentation

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Connection String | `mongodb://127.0.0.1:27017/mongo-meals` |
| `PORT` | Backend Server Port | `5000` |
| `JWT_SECRET` | Secret key used to sign JWTs | `supersecretjwtkey12345` |
| `NODE_ENV` | Run Mode | `development` / `production` |
| `EMAIL_USER` | Nodemailer Gmail email address | `example@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `abcd efgh ijkl mnop` |
