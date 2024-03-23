import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyUserToken = (req,res, next) => {
    const token = req.cookies.access_token;
    if(!token) next(errorHandler(401, 'Unauthorized access'));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) next(errorHandler(403, 'Forbidden access'));
        req.user = user; //after checked send the user data to the next func
        next();
    });
}