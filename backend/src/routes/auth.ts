import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';

const router = Router();

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      const [rows]: any[] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // UPDATED: Changed 'user.password_hash' to 'user.password'
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // UPDATED: Changed 'user.id' to 'user.user_id'
      req.session.userId = user.user_id;
  
      return res.status(200).json({
        id: user.user_id, // sent as 'id' to frontend for consistency
        email: user.email,
        username: user.username
      });
  
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully.' });
  });
});

export default router;