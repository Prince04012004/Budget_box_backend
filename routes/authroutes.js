import express from 'express'
import { signup, login } from '../controllers/authcontroller.js'
import authmiddlewares from "../middlewares/authmiddleware.js"

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


export default router;
