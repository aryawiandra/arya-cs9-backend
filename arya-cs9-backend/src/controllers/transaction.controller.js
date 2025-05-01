const transactionRepository = require("../repositories/transaction.repositories");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body;

    if (!item_id || !quantity || !user_id) {
        return baseResponse(res, false, 400, "All fields are required", null);
    }

    if (quantity <= 0) {
        return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
    }

    try {
        const transaction = await transactionRepository.createTransaction({ item_id, quantity, user_id });
        baseResponse(res, true, 201, "Transaction created", transaction);
    } catch (error) {
        console.error("Error in createTransaction:", error);
        baseResponse(res, false, 500, "Failed to create transaction", error.message);
    }
};

exports.payTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await transactionRepository.payTransaction(id);
        if (!transaction) {
            return baseResponse(res, false, 400, "Failed to pay", null);
        }
        baseResponse(res, true, 200, "Payment successful", transaction);
    } catch (error) {
        console.error("Error in payTransaction:", error);
        baseResponse(res, false, 500, "Server error", null);
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await transactionRepository.deleteTransaction(id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        baseResponse(res, true, 200, "Transaction deleted", transaction);
    } catch (error) {
        console.error("Error in deleteTransaction:", error);
        baseResponse(res, false, 500, "Server error", null);
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        baseResponse(res, true, 200, "List of transactions", transactions);
    } catch (error) {
        console.error("Error in getAllTransactions:", error);
        baseResponse(res, false, 500, "Server error", null);
    }
};
