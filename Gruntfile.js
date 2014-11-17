module.exports = function (grunt) {

	// load all grunt tasks matching the `grunt-*` pattern
	require('load-grunt-tasks')(grunt);

	var path = require('path');

	var dir = {
		root  : './htdocs',
		assets: '<%= dir.root %>/assets',
		css   : '<%= dir.assets %>/css',
		cssDev: '<%= dir.assets %>/cssDev',
		js    : '<%= dir.assets %>/js',
		jsDev : '<%= dir.assets %>/jsDev',
		gid   : '<%= dir.assets %>/gid',
		api   : '<%= dir.root %>/api/v1'
	};
	var gidMap = grunt.file.readJSON('<%= dir.gid %>/gid-map.json');


	grunt.initConfig({

		clean: {
			src: [
				'<%= dir.css %>/**/*',
				'<%= dir.js %>/**/*'
			]
		},

		watch: {
			options: {
				interrupt: true,
				debounceDelay: 250
			}
		},

		sass: {
			sass_devel: {
				options: {
					sourcemap: 'none',
					style    : 'expanded'
				},
				files: [{
					expand: true,
					cwd   : '<%= dir.cssDev %>',
					src   : '**/*.scss',
					dest  : '<%= dir.css %>',
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
					cwd   : '<%= dir.cssDev %>',
					src   : '**/*.scss',
					dest  : '<%= dir.css %>',
					ext   : '.css'
				}]
			}
		},

		autoprefixer: {
			autoprefixer: {
				options: {
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
					cwd   : '<%= dir.css %>',
					src   : '**/*.css',
					dest  : '<%= dir.css %>'
				}]
			}
		}

	});

	grunt.registerTask('cssDevel', ['sass:sass_devel', 'autoprefixer']);
	grunt.registerTask('cssDeploy', ['sass:sass_deploy', 'autoprefixer']);
	grunt.registerTask('jsDevel', []);
	grunt.registerTask('jsDeploy', []);

	grunt.registerTask('default', ['clean', 'cssDevel', 'jsDevel', 'watch']);
	grunt.registerTask('deploy' , ['clean', 'cssDeploy', 'jsDeploy']);

};
