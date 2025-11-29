const User = require("./../models/userModel");

// @route GET /api/admin/users
// @desc Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ 
            success: true,
            users 
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route POST /api/admin/users
// @desc Create New User (Admin Only)
exports.addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log('📥 Creating user:', { name, email, role });

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide name, email, and password" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User with this email already exists" 
            });
        }

        // Create new user (password will be hashed by pre-save hook in model)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: role || "customer",
        });

        console.log('✅ User created:', user._id);

        res.status(201).json({ 
            success: true,
            message: "User created successfully!", 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error('❌ Create user error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "User with this email already exists" 
            });
        }
        
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// @route PUT /api/admin/users/:id
// @desc Update User Role (Admin Only)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, name, email } = req.body;

        console.log('📥 Updating user:', id, { role, name, email });

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        console.log('✅ User updated:', user._id);

        res.status(200).json({ 
            success: true,
            message: "User updated successfully", 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error('❌ Update user error:', error);
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// @route DELETE /api/admin/users/:id
// @desc Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('📥 Deleting user:', id);

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        await User.findByIdAndDelete(id);

        console.log('✅ User deleted:', id);

        res.status(200).json({ 
            success: true,
            message: "User deleted successfully",
            userId: id 
        });
    } catch (error) {
        console.error('❌ Delete user error:', error);
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};