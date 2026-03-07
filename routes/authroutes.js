import express from 'express'
import { signup, login, sendotp } from '../controllers/authcontroller.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/sendotp',sendotp);



export default router;
