import express from 'express';
import { getAuthUrl, googleCallback, getCurrentUser, mockLogin, getCandidates } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/google', getAuthUrl);
router.get('/google/callback', googleCallback);
router.get('/mock', mockLogin);
router.get('/me', protect, getCurrentUser);
router.get('/candidates', protect, getCandidates);

export default router;
