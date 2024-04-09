import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import Permission from "../models/permission.model.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import QueueRegistration from "../models/queueRegister.js";

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

export const getUserRoles = async (req, res, next) => {
    try {
        const roleId = new mongoose.Types.ObjectId(req.body.role);
        const roleUser = await Role.findById(roleId)
        const permissionNames = [];
        for (const permission of roleUser.permissions) {
            const permissionDb = await Permission.findById(permission)
            permissionNames.push(permissionDb.name);
        }
        return res.status(200).json(permissionNames);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
}


async function checkRoleGetPermissions(email){
    const user = await User.findOne({'email': email});
    if(!user) errorHandler(404, 'User not found!')
    const roleUser = await Role.findById(user.role)
    const permissionNames = [];
    for (const permission of roleUser.permissions) {
        const permissionDb = await Permission.findById(permission)
        permissionNames.push(permissionDb.name);
    }
    return permissionNames;
}

async function getRoleNameByEmail(email){
    const user = await User.findOne({'email': email});
    if(!user) errorHandler(404, 'User not found!')
    const roleUser = await Role.findById(user.role)
    if(!roleUser) errorHandler(404, 'Role user not found!');
    return roleUser.name;
}

export const getQueueRegister = async (req, res, next) => {
    try {
        const queueRegistrations = await QueueRegistration.find({});
        const users = await User.find({
          _id: { $in: queueRegistrations.map(item => item.user) }
        }).select('-password');   
        return res.status(200).json(users);
      } catch (error) {
        errorHandler(500, 'Error occured while retriving user data: '+error)
        throw error;
      }
}


export {checkRoleGetPermissions, getRoleNameByEmail};