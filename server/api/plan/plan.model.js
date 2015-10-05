'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlanSchema = new Schema({
	_id: String,
  name: String,
  date: Date,
  plans: Array
});

module.exports = mongoose.model('Plan', PlanSchema);