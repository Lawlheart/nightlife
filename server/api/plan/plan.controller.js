'use strict';

var _ = require('lodash');
var Plan = require('./plan.model');

// Get list of plans
exports.index = function(req, res) {
  Plan.find(function (err, plans) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(plans);
  });
};

// Get a single plan
exports.show = function(req, res) {
  Plan.findById(req.params.id, function (err, plan) {
    if(err) { return handleError(res, err); }
    if(!plan) { return res.status(404).send('Not Found'); }
    return res.json(plan);
  });
};

// Creates a new plan in the DB.
exports.create = function(req, res) {
  Plan.create(req.body, function(err, plan) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(plan);
  });
};

// Updates an existing plan in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Plan.findById(req.params.id, function (err, plan) {
    if (err) { return handleError(res, err); }
    if(!plan) { return res.status(404).send('Not Found'); }
    var updated = _.merge(plan, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(plan);
    });
  });
};

// Deletes a plan from the DB.
exports.destroy = function(req, res) {
  Plan.findById(req.params.id, function (err, plan) {
    if(err) { return handleError(res, err); }
    if(!plan) { return res.status(404).send('Not Found'); }
    plan.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}