import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";


export default async function findByIdChecked(Model,id,next){
    if (!mongoose.isValidObjectId(id)) {
        return next(errorHandler(500,'Internal Server Error: Invalid object ID'));
    }
    const model = await Model.findById(id);
    if (!model) {
        return next(errorHandler(404, 'Item not found!'));
    }    
    return model;
}
