import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({message:'Api route is working correctly.'})  ;
};

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return (next(errorHandler(401, "You cannot update others account!")));
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

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
          const listings = await Listing.find({ userRef: req.params.id });
          res.status(200).json(listings);
        } catch (error) {
          next(error);
        }
      } else {
        return next(errorHandler(401, 'You can only view your own listings!'));
      }
}


export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return next(errorHandler(404, 'User not found!'));
        const {password:pass, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}


export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        if(!users) return next(errorHandler(404, 'Not users found!'));
        // const {password: pass, ...rest} = users._doc;
        const allUsersFormatted = users.map(({ _doc }) => {
            const { password, ...rest } = _doc;
            return rest;
          });
        res.status(200).json(allUsersFormatted);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}