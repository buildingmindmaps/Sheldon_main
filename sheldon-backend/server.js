const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session'); // For Passport.js if using OAuth
const passport = require('passport');       // For OAuth

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require('./config/db');
connectDB();

// Passport configuration (if using OAuth)
require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// --- Middleware ---

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow your frontend to access the backend
  credentials: true, // Allow cookies to be sent (important for sessions/OAuth)
}));

// Body parser for JSON data
app.use(express.json());

// Express Session middleware (Crucial for Passport.js OAuth flow)
// Make sure this is used BEFORE passport.initialize() and passport.session()
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a strong secret from .env
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
      maxAge: 1000 * 60 * 60 * 24 // 1 day in milliseconds
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // This is needed if you rely on Passport's session for the OAuth callback

// --- Routes ---

// Simple welcome route
app.get('/', (req, res) => {
  res.send('SheldonAI Backend API is running...');
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// --- Error Handling (Optional: Add more specific error handling later) ---
// Example basic 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
