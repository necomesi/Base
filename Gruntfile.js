module.exports = function (grunt) {

	// load all grunt tasks matching the `grunt-*` pattern
	grunt.file.expand({cwd: 'node_modules'}, 'grunt-*').forEach(grunt.loadNpmTasks);

	var path = require('path');

	//var gidMap = grunt.file.readJSON(grunt.template.process('<%= dir.gid %>/gid.json', {data: {dir: dir}}));


	grunt.initConfig({
		path: {
			root  : './htdocs',
			assets: '<%= path.root %>/assets',
			css   : '<%= path.assets %>/css',
			cssDev: '<%= path.assets %>/css_dev',
			js    : '<%= path.assets %>/js',
			jsDev : '<%= path.assets %>/js_dev',
			gid   : '<%= path.jsDev %>/gid',
			api   : '<%= path.root %>/api/v1'
		},

		//gidMap: grunt.file.readJSON(grunt.template.process('<%= path.gid %>/gid.json', {data: {dir: dir}})),

		clean: {
			clean: {
				src: [
					//dir.css + '/**/*'
					'<%= path.css %>/**/*',
					'<%= path.js %>/**/*'
				]
			}
		},

		copy: {
			options: {
				timestamp: true
			},
			js: {
				files: [{
					expand: true,
					cwd: '<%= path.jsDev %>',
					src: [
						'**/*.js',
						'**/*.json'
					],
					dest: '<%= path.js %>'
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
					'<%= path.cssDev %>/**/*.scss'
				],
				tasks: ['cssDev']
			},
			js: {
				files: [
					'<%= path.jsDev %>/**/*.js',
          '<%= path.jsDev %>/**/*.json'
				],
				tasks: ['jsDev']
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
					cwd   : '<%= path.cssDev %>',
					src   : '**/*.scss',
					dest  : '<%= path.css %>',
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
					cwd   : '<%= path.cssDev %>',
					src   : '**/*.scss',
					dest  : '<%= path.css %>',
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
					cwd   : '<%= path.css %>',
					src   : '**/*.css',
					dest  : '<%= path.css %>'
				}]
			}
		},

		requirejs: {
			options: {
				generateSourceMaps: false,
				preserveLicenseComments: true
			},
			requirejs: {
				options: {
					appDir: '<%= path.jsDev %>',
					mainConfigFile: '<%= path.jsDev %>/common.js',
					baseUrl: './',
					optimize: 'uglify2',
					dir: '<%= path.js %>',
					modules: (function() {
						var modules = [{name: 'common'}];
						var baseDir = 'htdocs/assets/js_dev/gid/';
						var fnames = grunt.file.expand({cwd: baseDir}, '*.js');
						fnames.forEach(function(fname) {
							modules.push({
								name: 'gid/' + fname.replace(/\.js$/, ''),
								exclude: ['common']
							});
						});
						return modules;
					})()
				}
			}
		}

	});

	grunt.registerTask('cssDev', ['sass:sass_dev', 'autoprefixer']);
	grunt.registerTask('cssDeploy', ['sass:sass_deploy', 'autoprefixer']);
	grunt.registerTask('jsDev', ['copy:js']);
	grunt.registerTask('jsDeploy', ['copy:js', 'requirejs']);

	grunt.registerTask('default', ['clean', 'cssDev', 'jsDev', 'watch']);
	grunt.registerTask('deploy' , ['clean', 'cssDeploy', 'jsDeploy']);

};
