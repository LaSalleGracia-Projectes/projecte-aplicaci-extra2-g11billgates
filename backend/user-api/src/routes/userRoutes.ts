import { Router, RequestHandler } from 'express';
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';
import  { verifyToken }  from '../middleware/verifyToken';
import { verifyAdmin } from '../middleware/verifyAdmin';
import  * as userModeration from '../controllers/userModerationController';
import { getUserStats } from '../controllers/stats.controller';

const router = Router();

router.get('/', verifyToken, verifyAdmin, userController.getAllUsers as RequestHandler);
router.post('/', verifyToken, verifyAdmin, userController.createUser as RequestHandler);
router.put('/:id', verifyToken, verifyAdmin, userController.updateUser as RequestHandler);
router.delete('/:id', verifyToken,verifyAdmin, userController.deleteUser as RequestHandler);

router.post('/login', authController.loginUser as RequestHandler);
router.post('/logout', verifyToken, verifyAdmin, authController.logout as RequestHandler);

router.post('/:userId/warn', verifyToken, verifyAdmin,userModeration.warnUser as RequestHandler);
router.post('/:userId/ban', verifyToken, verifyAdmin,userModeration.banUser as RequestHandler);
router.post('/remove-warning/:userId', verifyToken, verifyAdmin, userModeration.removeWarning as RequestHandler);
router.post('/unban/:userId', verifyToken, verifyAdmin, userModeration.unbanUser as RequestHandler);


router.get('/stats', verifyToken, verifyAdmin, getUserStats);
export default router;
