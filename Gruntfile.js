module.exports = function (grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  grunt.file.expand({cwd: 'node_modules'}, 'grunt-*').forEach(grunt.loadNpmTasks);

  var path = require('path');
  var fs = require('fs');
  var _ = require('lodash');


  grunt.initConfig({
    path: {
      root  : 'htdocs',
      dist  : 'dist',
      assets: 'assets',
      css   : 'css',
      js    : 'js',
      gid   : 'gid',
      inc   : 'inc',
      api   : 'api/v1'
    },

    clean: {
      dist: {
        src: ['<%= path.dist %>']
      }
    },

    copy: {
      options: {
        timestamp: true
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= path.root %>',
          src: [
            '**/*',
            '!<%= assets %>/<%= path.css %>'
          ],
          dest: '<%= path.dist %>'
        }]
      }
    },

    watch: {
      options: {
        interrupt: true,
        debounceDelay: 250
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      scss: {
        files: [
          '<%= path.root %>/<%= path.assets %>/<%= path.css %>/**/*.scss'
        ],
        tasks: ['cssDev']
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        preserveComments: 'some',
        screwIE8: false
      }
    },

    sass: {
      sass_dev: {
        options: {
          sourcemap: 'auto',
          style    : 'expanded'
        },
        files: [{
          expand: true,
          cwd   : '<%= path.root %>/<%= path.assets %>/<%= path.css %>',
          src   : '**/*.scss',
          dest  : '<%= path.root %>/<%= path.assets %>/<%= path.css %>',
          ext   : '.css'
        }]
      },
      sass_deploy: {
        options: {
          sourcemap: 'auto',
          style    : 'compressed'
        },
        files: [{
          expand: true,
          cwd   : '<%= path.dist %>/<%= path.assets %>/<%= path.css %>',
          src   : '**/*.scss',
          dest  : '<%= path.dist %>/<%= path.assets %>/<%= path.css %>',
          ext   : '.css'
        }]
      }
    },

    autoprefixer: {
      autoprefixer: {
        options: {
          map: true,
          browsers: [
            'ie >= 8',
            'ff >= 32',
            'chrome >= 37',
            'safari >= 6',
            'ios >= 7',
            'android >= 4'
          ]
        },
        files: [{
          expand: true,
          cwd   : '<%= path.dist %>/<%= path.assets %>/<%= path.css %>',
          src   : '**/*.css',
          dest  : '<%= path.dist %>/<%= path.assets %>/<%= path.css %>'
        }]
      }
    },

    useminPrepare: {
      options: {
        root: '<%= path.dist %>',
        dest: '<%= path.dist %>',
        flow: {
          steps: {
            js: ['uglifyjs']
          },
          post: {}
        }
      },
      html: '<%= path.dist %>/<%= path.assets %>/<%= path.inc %>/head/*.html'
    },

    usemin: {
      html: '<%= path.dist %>/<%= path.assets %>/<%= path.inc %>/head/*.html'
    }

  });

  grunt.registerTask('cssDev', [
    'sass:sass_dev',
    'autoprefixer'
  ]);
  grunt.registerTask('cssDeploy', [
    'sass:sass_deploy',
    'autoprefixer'
  ]);

  grunt.registerTask('default', [
    'cssDev',
    'watch'
  ]);
  grunt.registerTask('deploy' , [
    'clean',
    'copy:dist',
    'cssDeploy',
    'useminPrepare',
    'uglify:generated',
    'usemin'
  ]);

};
