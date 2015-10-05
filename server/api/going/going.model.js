'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GoingSchema = new Schema({
  _id: String,
  businessId: String,
  attending: Number
});

module.exports = mongoose.model('Going', GoingSchema);