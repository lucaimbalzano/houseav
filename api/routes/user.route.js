import express from 'express';
import { test, updateUser } from '../controller/user.controller.js';
import { verifyUserToken } from '../utils/verifyUser.js';

const userRouter = express.Router();

userRouter.get('/test', test);
userRouter.post('/update/:id', verifyUserToken, updateUser);

export default userRouter;