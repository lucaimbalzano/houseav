-- Insert data into Role table
INSERT INTO Role (name, description)
VALUES
    ('admin', 'Administrator role'),
    ('user', 'Regular user role'),
    ('pendingUser', 'Pending user role');

-- Insert data into Permission table
INSERT INTO Permission (name, description)
VALUES
    ('read', 'Permission to read data'),
    ('write', 'Permission to write data'),
    ('updateProfile', 'Permission to update profile'),
    ('updateAll', 'Permission to update all data');

-- Insert data into RolePermission table
INSERT INTO RolePermission (fk_role_id, fk_permission_id)
VALUES
    (1, 1), -- admin role has read permission
    (1, 2), -- admin role has write permission
    (1, 3), -- admin role has updateProfile permission
    (1, 4), -- admin role has updateAll permission
    (2, 1), -- user role has read permission
    (2, 3), -- user role has updateProfile permission
    (3, 1); -- pendingUser role has read permission
