import { Router, RequestHandler } from 'express';
import { getAllLinks, createLink, updateLink, deleteLink } from '../controllers/linkController';
import  { verifyToken }  from '../middleware/verifyToken';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();


router.get('/', verifyToken, verifyAdmin, getAllLinks as unknown as RequestHandler);
router.post('/',  createLink as unknown as RequestHandler);
router.put('/:id',  verifyToken, verifyAdmin, updateLink as unknown as RequestHandler);
router.delete('/:id',  verifyToken, verifyAdmin, deleteLink as unknown as RequestHandler);

export default router;