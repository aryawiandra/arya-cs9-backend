const bcrypt = require('bcrypt');
const userRepository = require("../repositories/user.repositories");
const baseResponse = require("../utils/baseResponse.util");

// Register user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return baseResponse(res, false, 400, "All fields are required", null);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const user = await userRepository.registerUser({ name, email, password: hashedPassword });
        baseResponse(res, true, 201, "User registered successfully", user);
    } catch (error) {
        console.error("Error in registerUser:", error);
        baseResponse(res, false, 500, "Failed to register user", null);
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userRepository.getUserByEmail(email);

        if (!user) {
            return baseResponse(res, false, 401, "Invalid email or password", null);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return baseResponse(res, false, 401, "Invalid email or password", null);
        }

        baseResponse(res, true, 200, "Login successful", { id: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("Error in loginUser:", error);
        baseResponse(res, false, 500, "Server error", null);
    }
};

exports.getUserByEmail = async (req, res) => {
    if (!req.params.email) {
        return baseResponse(res, false, 400, "Email is required");
    }

    try {
        const user = await userRepository.getUserByEmail(req.params.email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        return baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        return baseResponse(res, false, 500, "Error getting user", error);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.params.id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User retrieved successfully", user);
    } catch (error) {
        console.error("Error in getUserById:", error);
        baseResponse(res, false, 500, "Server error", null);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id, name, email, password, balance } = req.body;
        console.log("🛠️ Updating user with email:", email);  // Debugging log

        let updatedUser;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash password
            updatedUser = await userRepository.updateUser({ id, name, email, password: hashedPassword, balance });
        } else {
            updatedUser = await userRepository.updateUser({ id, name, email, balance });
        }

        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User updated successfully", updatedUser);
    } catch (error) {
        console.error("Error in updateUser:", error);
        baseResponse(res, false, 500, "Server error", null);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("🛠️ Deleting user with ID:", userId); // Debugging log

        const deletedUser = await userRepository.deleteUser(userId);

        if (!deletedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User deleted successfully", deletedUser);
    } catch (error) {
        console.error("Error in deleteUser:", error);
        baseResponse(res, false, 500, "Server error", null);
    }
};

// Top-up saldo
exports.topUp = async (req, res) => {
    const { id, amount } = req.query;

    if (!id || !amount || isNaN(amount)) {
        return baseResponse(res, false, 400, "Invalid ID or amount", null);
    }

    try {
        const updatedUser = await userRepository.topUpUser(id, amount);

        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "Top up successful", updatedUser);
    } catch (error) {
        console.error("Error in topUp:", error);
        baseResponse(res, false, 500, "Server error", null);
    }
};
