import Permission from "../models/permission.model.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "./error.js";



async function checkRoleGetPermissions(email){
    const user = await User.findOne({'email': email});
    if(!user) errorHandler(404, 'User not found!')
    const roleUser = await Role.findById(user.roles[0])
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
    const roleUser = await Role.findById(user.roles[0])
    if(!roleUser) errorHandler(404, 'Role user not found!');
    return roleUser.name;
}


export {checkRoleGetPermissions, getRoleNameByEmail};