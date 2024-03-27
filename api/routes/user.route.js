import express from 'express';
import { deleteUser, test, updateUser, getUserListings, getUser, getUsers } from '../controller/user.controller.js';
import { verifyUserToken } from '../utils/verifyUser.js';

const userRouter = express.Router();

userRouter.get('/test', test);
userRouter.post('/update/:id', verifyUserToken, updateUser);
userRouter.delete('/delete/:id', verifyUserToken, deleteUser);
userRouter.get('/listings/:id', verifyUserToken, getUserListings);
userRouter.get('/:id', verifyUserToken, getUser);
userRouter.get('/get/all', getUsers); //TODO token admin

export default userRouter;