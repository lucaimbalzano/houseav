import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({message:'Api from controller world'})  ;
};

export const updateUser = async (req, res, next) => {
    if(res.user.id !== req.params.id) return (next(errorHandler(401, "You cannot update others account!")));
    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true}) //set the data with new information (without it take the previous data)

        const {password, ...rest} = updatedUser._doc
        res.status(200).json(rest);
    }catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if(res.user.id !== req.params.id) return (next(errorHandler(401, "You cannot delete others account!")));
    try{
        res.status(200).json({"message": "User deleted with success"})
        res.clearCookie('access_token');
        const deleteUser = await User.findByIdAndDelete(res.user.id);
    } catch(error){
        next(error);
    }
}