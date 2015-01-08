module.exports = function(app) {

  // Insert routes below
  app.use('/api/posts', require('./api/post'));

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile('app/index.html');
    });
};