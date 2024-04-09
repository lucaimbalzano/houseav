import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import Role from "../models/role.model.js";
import QueueRegistration from "../models/queueRegister.js";

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,16);
    const userRolePending = await Role.findOne({'name':'pendingUser'});
    const newUser = new User({username, email, password: hashedPassword, role: userRolePending});
    try{
        const userCreated = await newUser.save();
        const queueRegister = new QueueRegistration({user: userCreated._id});
        await queueRegister.save();
        res.status(201).json("User created successfully, in queue to be accepted")
    }catch(error){
        next(errorHandler(550, error.message));
    }
}

export const signin = async (req, res, next) => {
    const {username, email, password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, 'User not found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const { password: pass, ...rest} = validUser._doc; //cover password value
        let expirationTimestamp = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days
        res.cookie('access_token', token, { httpOnly: true, expires: expirationTimestamp }).status(200).json(rest);
        
    }catch(error){
        next(error);
    }
}

export const google = async (req, res, next) => {
  let expirationTimestamp = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        if (req.body.photoUrl!= undefined) {
            user.avatar = req.body.photoUrl;
            await user.save();
        }
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('access_token', token, { httpOnly: true , expires: expirationTimestamp})
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photoUrl,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie('access_token', token, { httpOnly: true , expires: expirationTimestamp})
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    } 
  };


  export const signout = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
  }