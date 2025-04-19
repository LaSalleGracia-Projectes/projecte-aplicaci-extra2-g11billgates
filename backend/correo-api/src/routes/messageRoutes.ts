import express from 'express';
import { getEmails, getAllMessages  } from '../controllers/messageController';

const router = express.Router();

router.get('/new', getEmails);
router.get('/all', getAllMessages); 

export default router;
