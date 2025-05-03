import { Router, RequestHandler } from 'express';
import * as messageController from '../controllers/messageController';
import  { verifyToken }  from '../middleware/verifyToken';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

router.get('/new', messageController.getEmails as unknown as RequestHandler);
router.get('/all', messageController.getAllMessages as unknown as RequestHandler);
router.delete('/:id', messageController.deleteMessage as unknown as RequestHandler);
router.post('/respond', messageController.respondToMessage as unknown as RequestHandler);

export default router;
