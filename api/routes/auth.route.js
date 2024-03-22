import express from 'express';
import { signup, signin, google, signout } from '../controller/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get('/signout', signout);
authRouter.post("/google", google);

export default authRouter;