'use strict';

var _ = require('lodash');
var Going = require('./going.model');

// Get list of goings
exports.index = function(req, res) {
  Going.find(function (err, goings) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(goings);
  });
};

// Get a single going
exports.show = function(req, res) {
  Going.findById(req.params.id, function (err, going) {
    if(err) { return handleError(res, err); }
    if(!going) { return res.status(404).send('Not Found'); }
    return res.json(going);
  });
};

// Creates a new going in the DB.
exports.create = function(req, res) {
  Going.create(req.body, function(err, going) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(going);
  });
};

// Updates an existing going in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Going.findById(req.params.id, function (err, going) {
    if (err) { return handleError(res, err); }
    if(!going) { return res.status(404).send('Not Found'); }
    var updated = _.merge(going, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(going);
    });
  });
};

// Deletes a going from the DB.
exports.destroy = function(req, res) {
  Going.findById(req.params.id, function (err, going) {
    if(err) { return handleError(res, err); }
    if(!going) { return res.status(404).send('Not Found'); }
    going.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}