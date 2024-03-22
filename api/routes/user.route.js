import express from 'express';
import { deleteUser, test, updateUser } from '../controller/user.controller.js';
import { verifyUserToken } from '../utils/verifyUser.js';

const userRouter = express.Router();

userRouter.get('/test', test);
userRouter.post('/update/:id', verifyUserToken, updateUser);
userRouter.delete('/delete/:id', verifyUserToken, deleteUser);

export default userRouter;