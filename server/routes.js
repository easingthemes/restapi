module.exports = function(server) {
  server.use('/api/items', require('./api/item'));
    // All other routes should redirect to the index.html
  server.route('/*')
    .get(function(req, res) {
      res.sendfile('app/index.html');
    });
};