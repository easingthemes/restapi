## Tools list
nodejs, mongodb, grunt, bower

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

file: `server/server.js`
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

## API
####1. Create folder for your API
server/
	api/
		item/
