import { Router, RequestHandler } from 'express';
import * as userController from '../controllers/userController';
import  { verifyToken }  from '../middleware/verifyToken';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/', verifyToken, verifyAdmin, userController.getAllUsers as RequestHandler);
router.post('/', verifyToken, verifyAdmin, userController.createUser as RequestHandler);
router.put('/:id', verifyToken, verifyAdmin, userController.updateUser as RequestHandler);
router.delete('/:id', verifyToken,verifyAdmin, userController.deleteUser as RequestHandler);
router.post('/login', userController.loginUser as RequestHandler);


export default router;
