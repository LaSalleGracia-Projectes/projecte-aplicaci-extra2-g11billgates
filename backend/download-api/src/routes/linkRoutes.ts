import { Router, RequestHandler } from 'express';
import * as linkController from '../controllers/linkController';
import  { verifyToken }  from '../middleware/verifyToken';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();


router.get('/', verifyToken, verifyAdmin, linkController.getAllLinks as unknown as RequestHandler);
router.post('/', linkController.createLink as unknown as RequestHandler);
router.put('/:id',  verifyToken, verifyAdmin, linkController.updateLink as unknown as RequestHandler);
router.delete('/:id',  verifyToken, verifyAdmin, linkController.deleteLink as unknown as RequestHandler);

export default router;