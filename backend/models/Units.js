var mongoose = require('mongoose');

var UnitsSchema = new mongoose.Schema({
  id: String,
  unitCode: String,
  makeAndModel: String,
  bodyType: String,
  chasisCode: String,
  status: String,
  expenses: {
    amount: String,
    desc: String,
    encodedBy: String,
    dateEncoded: { type: Date, default: Date.now }
  },
  imageFile: {
    _id: String,
    imageUrl: String,
    uploaded: { type: Date, default: Date.now },
    unitCode: String
  }
}, { collection: 'units' });

module.exports = mongoose.model('Units', UnitsSchema);