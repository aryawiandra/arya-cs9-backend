const db = require("../database/pg.database");
const bcrypt = require("bcrypt");

// Registrasi user baru dengan hashing password
exports.registerUser = async (user) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const res = await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [user.name, user.email, hashedPassword]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Failed to register user", error);
        throw error;
    }
};

// Login user dengan hashing password
exports.loginUser = async (email, password) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = res.rows[0];

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    } catch (error) {
        console.error("Failed to login user", error);
        throw error;
    }
};

// Dapatkan user berdasarkan email
exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

// Dapatkan user berdasarkan ID
exports.getUserById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        return res.rows[0] || null;
    } catch (error) {
        console.error("Failed to get user by ID", error);
        throw error;
    }
};

// Perbarui informasi user
exports.updateUser = async (userData) => {
    try {
        const res = await db.query(
            "UPDATE users SET name = $1, email = $2, balance = $3 WHERE id = $4 RETURNING *",
            [userData.name, userData.email, userData.balance, userData.id]
        );

        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Failed to update user", error);
        throw error;
    }
};

// Hapus user berdasarkan ID
exports.deleteUser = async (id) => {
    try {
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows[0] || null;
    } catch (error) {
        console.error("Failed to delete user", error);
        throw error;
    }
};

// Fungsi Top Up
exports.topUpUser = async (id, amount) => {
    try {
        await db.query("BEGIN");

        // Cek saldo user
        const userRes = await db.query("SELECT balance FROM users WHERE id = $1", [id]);
        if (userRes.rows.length === 0) {
            await db.query("ROLLBACK");
            return { success: false, message: "User tidak ditemukan" };
        }

        const newBalance = parseFloat(userRes.rows[0].balance) + parseFloat(amount);

        await db.query("UPDATE users SET balance = $1 WHERE id = $2", [newBalance, id]);

        await db.query("COMMIT");
        return { success: true, newBalance };
    } catch (error) {
        await db.query("ROLLBACK");
        console.error("Failed to top-up", error);
        throw error;
    }
};
