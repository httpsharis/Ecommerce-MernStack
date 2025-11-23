const User = require("./../models/userModel")
const catchAsync = require('../middleware/catchAsyncError');

// @route GET /api/admin/user
// @desc Get All Users (Admin Only)
// @access Private
exports.getAllUsers = catchAsync(async (req, res) => {
    try {
        const user = await User.find({});
        res.json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
});

// @route GET /api/admin/user
// @desc Create New User (Admin Only)
// @access Private
exports.addUser = catchAsync(async (req, res) => {

    const { name, email, password, role } = req.body

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exist" })
        }

        user = new User({
            name, email, password, role: role || "customer",
        })

        await user.save();
        res.status(201).json({ message: "User created Successfully!", user })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
});

// @route PUT /api/admin/user/:id
// Update User Role -- (Admin)
// @access Privet
exports.updateUserRole = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }

        const updatedUser = await user.save();
        res.status(201).json({ message: "User updated successfully", user: updatedUser })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
});

// @route Delete /api/admin/user/:id
// Delete User Role -- (Admin)
// @access Private
exports.deleteUser = catchAsync(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            await user.deleteOne()
            res.json({ message: "User deleted successfully" })
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})