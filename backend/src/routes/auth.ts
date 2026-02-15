import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';

const router = Router();

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    role?: 'Owner' | 'Admin' | 'Moderator' | 'Coach' | 'User' | 'Guest';  
    email?: string; 
    username?: string;
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
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      req.session.userId = user.user_id;
      req.session.role = user.account_type;  
      req.session.email = user.email;
      req.session.username = user.username;
  
      console.log('=== LOGIN SUCCESS ===');
      console.log('Session data stored:', {
        userId: req.session.userId,
        role: req.session.role,
        email: req.session.email,
        username: req.session.username
      });
      console.log('==================');
  
      return res.status(200).json({
        id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.account_type  
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  

  router.get('/session', (req, res) => {
    
    if (req.session.userId) {
      return res.status(200).json({
        user: {
          id: req.session.userId,
          email: req.session.email,
          username: req.session.username,
          role: req.session.role  // This will now have the correct value from account_type
        }
      });
    }
    
    return res.status(401).json({ message: 'No active session' });
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