## If you want to try it
```
git clone https://github.com/easingthemes/restapi.git
cd restapi
npm install
grunt serve
```
## If you want to learn
Follow this readme and build your app from scratch.

## Tools list
nodejs, mongodb, grunt

## Scafold project directories and files
```
server/
	server.js
	routes.js
	api/

client/
	index.html
	js/
		app.js
	lib/
		jquery.js
```

Include app.js and jquery.js in index.html. Write down some text on the page.
```
client/
  index.html
```
`<h1>Hello API</h1>`

## Install extensions
####1. Create `project.json` file

`npm init`

####1. Create `Gruntfile.js` file

Gruntfile.js

####2. Install node modules

`npm install express mongoose body-parser --save`

####3. Install Dev modules for Grunt tasks

`npm install grunt-contrib-watch grunt-express-server grunt-open --save-dev` 


## SERVER: express server configuration

####1. Configure server
file: `server/server.js`
Include modules and define basic variables
```
var express = require("express"),
    server = express(),
    hostname = 'localhost',
    port = 3000;
```

Now use them:

```
server.use(express.static(__dirname + '/../app'));
server.listen(port, hostname);
console.log("Server listening: http://" + hostname + ":" + port);
```

####2. Create GRUNT tasks for express server

```
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-open');

  grunt.initConfig({
    watch: {
      express: {
        files:  [ '**/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false
        }
      }
    },
    express: {
      options: {
        port: 3000
      },
      dev: {
        options: {
          script: 'server/server.js',
          debug: true
        }
      }
    },
    open: {
      dev: {
        path: 'http://localhost:<%= express.options.port%>'
      }
    }

  });

  grunt.registerTask('serve', [ 'express:dev', 'open:dev', 'watch' ])

};
```

####3. Test express server
`grunt serve`

Browser should open configured location and you should see `hello api` page.
There should also be log in the terminal:
`Server: Express listening: http://localhost:3000`

## DATABASE: MongoDB configuration

####1. Configure mongoose for MongoDB

```
server/
  server.js
```
Stop server first `CTRL + C`
Include new modules

```
var express = require("express"),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	...
```
We need `mongoose` for `mongodb` manipulation and `body-parser` for sending and receiving JSON data.

So let's use them:

```
app.use(express.static(__dirname + '/../app'));
app.use(bodyParser.json());
...
```
Mongoose connect
```
mongoose.connect('mongodb://localhost/simple', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});
```
####2. Start `mongod` process
`mongod`
On Windows just doubleclick `mongod.exe`
####3. Test DB connection
Start server again
`grunt serve`
There should be new log
`Database: MongoDB connection successful`

## API Routes
####1. Create folder for your API
```
server/
	api/
		item/
```
####2. MODEL: Create DataBase Schema
```
item/
  item.model.js
```
Schema types: http://mongoosejs.com/docs/schematypes.html
```
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
  title: String,
  date: Date
});

module.exports = mongoose.model('Item', ItemSchema);
```
####3. CONTROLLER: Create functions for DATABASE manipulation - CRUD: Create Read Update Delete
```
item/
  item.controller.js
```
```
// Import model
var Item = require('./item.model');
// READ: Get list of Items
exports.index = function(req, res) {
  Item.find(function (err, items) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(items);
  });
};
```
####4. ROUTES: Define API router
```
item/
  index.js
```
```
// Import extensions
var express = require('express'),
  controller = require('./item.controller');
// Define router
var router = express.Router();
// Define routes
router.get('/', controller.index);

// Export module
module.exports = router;
```
####5. ROUTES: Create server routes
```
server/
  routes.js
```
```
module.exports = function(server) {
  server.use('/api/items', require('./api/item'));
  // All other routes should redirect to the index.html
  server.route('/*')
    .get(function(req, res) {
      res.sendfile('app/index.html');
  });
};
```
####6. Test API routes
`http://localhost:3000/api/items`
You should se empty array, since DB is empty.
`[]`

## CRUD - Create Read Update Delete
 
 1. CONTROLLER: Create functions for DB manipulation - CRUD
 2. ROUTER: Create API router

#### CONTROLLER: Create functions for DB manipulation - CRUD

We need `body-parser` mongoose module to pars JSON. Add it to `server.js`
```
server/
  server.js
```
```
var express = require("express"),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
    server = express(),
    hostname = 'localhost',
    port = 3000; 

server.use(express.static(__dirname + '/../client'));
server.use(bodyParser.json());
...
```
```
item/
  item.controller.js
```
```
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
//Creates a new item in the DB.
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
    if(!item) { return res.send(404); }
    var updated = _.merge(item, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, item);
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
      return res.sendStatus(204);
    });
  });
};
```
#### ROUTER: Create API router
```
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);
```

## CLIENT: use created CRUD functions from frontend
####1. For some methods we need `lodash` module
`npm install lodash --save`
Add it to 
```
item/
  item.controller.js
```
```
var Item = require('./item.model');
var _ = require('lodash');
```
####2. Create DOM
```
client/
  index.html
```
```
<h1>hello api</h1>
<ul></ul>
<input type="text" placeholder="Input Item Title">
<button>Create item</button>
<ol></ol>
```
####3. Create javaScript functions
```
client/
  js/
    app.js
```
```
app = {
  init: function(){

    app.showPosts();

    $(document).on('click', 'button', function(event) {
      event.preventDefault();
      var itemTitle = $('input').val();
      var jsonItem = JSON.stringify({title: itemTitle});
      app.createPost(jsonItem);
    });
    $(document).on('click', 'a', function(event) {
      event.preventDefault();
      app.deletePost($(this).parent().attr('id'));
    });
    $('ul').on('click', 'li', function(event) {
      app.showPost($(this).attr('id'));
    });
    $(document).on('click', 'span', function(event) {
      var newTitle = $(this).siblings('p').text();
      var jsonItem = JSON.stringify({title: newTitle});
      app.updatePost($(this).parent().data('id'), jsonItem);
    });
  },
  showPosts: function(){
    //READ: get all items from API uri
    $.get('/api/items', function(data) {
      $.each(data, function(index, val) {
        $('<li id="'+val._id+'"><p>'+val.title+'</p> <a href="">delete</a></li>').appendTo('ul');
      });
    });
  },
  showPost: function(itemId){
    //GET: get single item from API uri
    $.get('/api/items/'+itemId, function(data) {
      $('<li data-id="'+data._id+'"  contenteditable="true"><p>'+data.title+'</p> <span>edit</span></li>').appendTo('ol');
    }); 
  },
  createPost: function(data){
    //CREATE: create new item
    $.ajax({
      url: '/api/items',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: data
    })
    .done(function(data) {
      $('<li id="'+data._id+'"><p>'+data.title+'<p> <a href="">delete</a></li>').appendTo('ul');
    });
  },
  updatePost: function(itemId, newData){
    //UPDATE: update item
    $.ajax({
      url: '/api/items/'+itemId,
      type: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      data: newData
    })
    .done(function(data) {
      console.log(data._id+' - '+data.title);
      $('#'+data._id+' p').text(data.title);
    });
  },
  deletePost: function(itemId){
    //DELETE: delete item
    $.ajax({
      url: '/api/items/'+itemId,
      type: 'DELETE'
    });
    var itemElement = document.getElementById(itemId);
    itemElement.parentNode.removeChild(itemElement);
  }
}
jQuery(document).ready(function($) {
  app.init();
});
```
#### DONE: 
*Starring*: nodejs with express, mongodb with mongoose

*Also Starring**: Grunt

*Thanks to*: body-parser, lodash, grunt-contrib-watch, grunt-express-server and grunt-open
