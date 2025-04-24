import { Router, RequestHandler } from 'express';
import { getAllLinks, createLink, updateLink, deleteLink } from '../controllers/linkController';

const router = Router();


router.get('/', getAllLinks as unknown as RequestHandler);
router.post('/', createLink as unknown as RequestHandler);
router.put('/:id', updateLink as unknown as RequestHandler);
router.delete('/:id', deleteLink as unknown as RequestHandler);

export default router;