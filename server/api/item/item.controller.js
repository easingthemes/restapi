// Import model
var Item = require('./item.model');
var _ = require('lodash');
// Get list of Items
exports.index = function(req, res) {
  Item.find(function (err, items) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(items);
  });
};
// Get a single item
exports.show = function(req, res) {
  Item.findById(req.params.id, function (err, item) {
    if(err) { return handleError(res, err); }
    if(!item) { return res.sendStatus(404); }
    return res.json(item);
  });
};
// Creates a new item in the DB.
exports.create = function(req, res) {
  Item.create(req.body, function(err, item) {
    if(err) { return handleError(res, err); }
  	return res.status(201).json(item);
  });
};
// Updates an existing item in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Item.findById(req.params.id, function (err, item) {
    if (err) { return handleError(res, err); }
    if(!item) { return res.sendStatus(404); }
    var updated = _.merge(item, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(item);
    });
  });
};
// Deletes a item from the DB.
exports.delete = function(req, res) {
  Item.findById(req.params.id, function (err, item) {
    if(err) { return handleError(res, err); }
    if(!item) { return res.sendStatus(404); }
    item.remove(function(err) {
      if(err) { return handleError(res, err); }
      //return res.sendStatus(204);
    });
  });
};
// Error function
function handleError(res, err) {
  return res.status(500).json(err);
}