const crypto = require('crypto');
const db = require("../database/pg.database");

exports.createTransaction = async ({ item_id, quantity, user_id }) => {
    const total = quantity * 100000; // Contoh perhitungan total harga
    const newTransaction = {
        id: crypto.randomUUID(),
        item_id,
        quantity,
        user_id,
        total,
        status: "pending",
        created_at: new Date().toISOString(),
    };

    const queryText = `
        INSERT INTO transactions (id, item_id, quantity, user_id, total, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const queryParams = [
        newTransaction.id,
        newTransaction.item_id,
        newTransaction.quantity,
        newTransaction.user_id,
        newTransaction.total,
        newTransaction.status,
        newTransaction.created_at,
    ];

    try {
        const result = await db.query(queryText, queryParams);
        return result.rows[0];
    } catch (error) {
        console.error("Error in createTransaction:", error);
        throw error;
    }
};

exports.payTransaction = async (id) => {
    const queryText = `
        UPDATE transactions
        SET status = 'paid'
        WHERE id = $1 AND status = 'pending'
        RETURNING *;
    `;
    const queryParams = [id];

    try {
        const result = await db.query(queryText, queryParams);
        return result.rows[0];
    } catch (error) {
        console.error("Error in payTransaction:", error);
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    const queryText = `
        DELETE FROM transactions
        WHERE id = $1
        RETURNING *;
    `;
    const queryParams = [id];

    try {
        const result = await db.query(queryText, queryParams);
        return result.rows[0];
    } catch (error) {
        console.error("Error in deleteTransaction:", error);
        throw error;
    }
};

exports.getAllTransactions = async () => {
    const queryText = `SELECT * FROM transactions ORDER BY created_at DESC;`;

    try {
        const result = await db.query(queryText);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllTransactions:", error);
        throw error;
    }
};


