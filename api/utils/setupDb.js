import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";


//Role and Permissions
// role admin --> permission read, write, updateProfile, updateAll
// role user --> permission read, updateProfile
// role pendingUser --> permission readProfile


async function createRolesAndPermissions() {
    try {
      const readPermission = await Permission.create({
        name: 'read',
        description: 'Permission to read data',
      });
  
      const writePermission = await Permission.create({
        name: 'write',
        description: 'Permission to write data',
      });
  
      const updateProfilePermission = await Permission.create({
        name: 'updateProfile',
        description: 'Permission to update profile',
      });
  
      const updateAllPermission = await Permission.create({
        name: 'updateAll',
        description: 'Permission to update all data',
      });
  
      const adminRole = await Role.create({
        name: 'admin',
        description: 'Administrator role',
        permissions: [readPermission._id, writePermission._id, updateProfilePermission._id, updateAllPermission._id],
      });
  
      const userRole = await Role.create({
        name: 'user',
        description: 'Regular user role',
        permissions: [readPermission._id, updateProfilePermission._id],
      });
  
      const pendingUserRole = await Role.create({
        name: 'pendingUser',
        description: 'Pending user role',
        permissions: [readPermission._id],
      });
  
      console.log('Roles and permissions created successfully!');
    } catch (error) {
      console.error('Error creating roles and permissions:', error);
    }
  }
  
  export default createRolesAndPermissions;