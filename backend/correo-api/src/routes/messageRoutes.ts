import { Router, RequestHandler } from 'express';
import * as messageController from '../controllers/messageController';

const router = Router();

router.get('/new', messageController.getEmails as RequestHandler);
router.get('/all', messageController.getAllMessages as RequestHandler);
router.delete('/:id', messageController.deleteMessage as RequestHandler);
router.post('/respond', messageController.respondToMessage as RequestHandler);

export default router;
