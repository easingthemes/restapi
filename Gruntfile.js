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
