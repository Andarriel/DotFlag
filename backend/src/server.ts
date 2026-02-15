import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { hasRole } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

app.use('/api/auth', authRoutes);
app.get('/api/admin-dashboard', hasRole('Admin'), (req, res) => {
    res.json({ message: `Welcome to the admin area, ${req.session.role}!` });
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});