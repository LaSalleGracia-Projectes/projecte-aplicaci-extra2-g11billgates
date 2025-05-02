import { Router, RequestHandler } from 'express';
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';
import  { verifyToken }  from '../middleware/verifyToken';
import { verifyAdmin } from '../middleware/verifyAdmin';
import { warnUser, banUser } from '../controllers/userModerationController';

const router = Router();

router.get('/', verifyToken, verifyAdmin, userController.getAllUsers as RequestHandler);
router.post('/', verifyToken, verifyAdmin, userController.createUser as RequestHandler);
router.put('/:id', verifyToken, verifyAdmin, userController.updateUser as RequestHandler);
router.delete('/:id', verifyToken,verifyAdmin, userController.deleteUser as RequestHandler);
router.post('/login', authController.loginUser as RequestHandler);
router.post('/logout', authController.logout as RequestHandler);
router.post('/users/:userId/warn', verifyAdmin, verifyToken, warnUser as unknown as RequestHandler);
router.post('/users/:userId/ban', verifyAdmin, verifyToken, banUser as unknown as RequestHandler);

export default router;
