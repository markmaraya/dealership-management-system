var mongoose = require('mongoose');

var ExpensesSchema = new mongoose.Schema({
    amount: String,
    description: String,
    encodedBy: String,
    dateEncoded: { type: Date, default: Date.now },
    unitCode: String
});

module.exports = mongoose.model('Expenses', ExpensesSchema);