import { Request, Response } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getAuthUrl = (req: Request, res: Response) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    const userInfo = await oauth2.userinfo.get();
    const { id, email, name, picture } = userInfo.data;

    let user = await User.findOne({ googleId: id });

    if (!user) {
      // First user to register becomes Teacher, rest become Candidates for testing
      const count = await User.countDocuments();
      user = new User({
        googleId: id,
        email,
        name,
        profileImage: picture,
        role: count === 0 ? 'Teacher' : 'Candidate',
        tokens: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate: tokens.expiry_date
        }
      });
    } else {
      user.lastLogin = new Date();
      user.tokens = {
        accessToken: tokens.access_token || user.tokens?.accessToken || '',
        refreshToken: tokens.refresh_token || user.tokens?.refreshToken || '',
        expiryDate: tokens.expiry_date || user.tokens?.expiryDate || 0
      };
    }

    await user.save();

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${jwtToken}`);
  } catch (error) {
    console.error('Error in google callback', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select('-tokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const mockLogin = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ email: 'mock_teacher@example.com' });
    
    if (!user) {
      user = new User({
        googleId: 'mock-google-id-123',
        email: 'mock_teacher@example.com',
        name: 'Mock Teacher',
        role: 'Teacher',
        tokens: {
          accessToken: 'mock-access',
          refreshToken: 'mock-refresh',
          expiryDate: Date.now() + 3600000
        }
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${jwtToken}`);
  } catch (error) {
    res.status(500).json({ message: 'Mock Login Failed' });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await User.find({ role: 'Candidate' }).select('-tokens');
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
