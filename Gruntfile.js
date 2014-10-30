module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-csso');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-bless');
	grunt.loadNpmTasks('grunt-este-watch');

	var path = require('path');

	var root = './htdocs';
	var src = './src';
	var asset = root + '/assets';
	var assetDev = src + '/assets';
	var images = asset + '/img';
	var imagesDev = assetDev + '/img';
	var imagesDummy = asset + '/img_dummy';
	var imagesDummyDev = assetDev + '/img_dummy';
	var styles = asset + '/css';
	var stylesDev = assetDev + '/css';
	var scripts = asset + '/js';
	var scriptsDev = assetDev + '/js';
	var api = root + '/api/v1';
	var apiDev = src + '/api/v1';
	var pageSpecificMap = grunt.file.readJSON(scriptsDev + '/pageSpecific/pageSpecificMap.json');


	grunt.initConfig({

		clean: {
			src: [root + '**/*']
		},

		sass: {
			default: {
				options: {
					sourcemap: 'none',
					style: 'expanded'
				},
				files: [
					{ expand: true, cwd: stylesDev, src: '**/*.scss', dest: styles, ext: '.css' }
				]
			}
		},

		csso: {
			default: {
				restructure: true,
				files: [
					{ expand: true, cwd: styles, src: '**/*.css', dest: styles }
				]
			}
		},

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
			autoprefixer: {
				files: [
					{ expand: true, cwd: styles, src: '**/*.css', dest: styles }
				]
			}
		},

		bless: {
			bless: {
				options: {
					compress: false,
					cacheBuster: false
				},
				files: [
					{ expand: true, cwd: styles, src: '**/*.css', dest: styles }
				]
			}
		},

		copy: {
			static: {
				files: [
					{
						expand: true,
						cwd: src,
						src: [
							'**/*',
							'!assets/{css,js}/**/*'
						],
						dest: root,
						dot: true
					}
				]
			},
			css: {
				files: [
					{ expand: true, cwd: stylesDev, src: '**/*.css', dest: styles }
				]
			},
			js: {
				files: [
					{ expand: true, cwd: scriptsDev, src: '**', dest: scripts }
				]
			}
		},

		esteWatch: {
			options: {
				dirs: [
					src + '/**'
				],
				livereload: {
					enabled: false
				}
			},
			// SCSS はコンパイルし直しが必要
			scss: function () {
				return 'cssDevel';
			},
			// いずれにも引っかからなければ
			'*': function (filepath) {
				// コピーするファイルをここで指定する
				var fileMatcher = /\.(s?html?|jpe?g|png|gif|ico|cur|js|json|php|htaccess)$/i;
				if (fileMatcher.test(filepath)) {
					filepath = '/' + path.relative(src, filepath);
					grunt.file.copy(src + filepath, root + filepath);
				}
			}
		},

		requirejs: {
			js: {
				options: {
					appDir: scriptsDev,
					baseUrl: './',
					mainConfigFile: scriptsDev + '/main.js',
					optimize: 'uglify2',
					generateSourceMaps: false,
					dir: scripts,
					modules: (function () {
						var modules = [{ name: 'main' }];
						for (var key in pageSpecificMap) {
							if (pageSpecificMap.hasOwnProperty(key)) {
								modules.push({
									name: 'pageSpecific/' + key,
									exclude: ['main']
								});
							}
						}
						return modules;
					})(),
					preserveLicenseComments: true
				}
			}
		},

		concat: {
			requirejs: {
				src: [scripts + '/lib/require.js', scripts + '/main.js'],
				dest: scripts + '/lib/require.js'
			}
		}

	});

	grunt.registerTask('cssDevel', ['sass', 'autoprefixer', 'bless', 'copy:css']);
	grunt.registerTask('cssDeploy', ['sass', 'autoprefixer', 'csso', 'bless', 'copy:css']);
	grunt.registerTask('jsDevel', ['copy:js']);
	grunt.registerTask('jsDeploy', ['requirejs', 'concat:requirejs']);

	grunt.registerTask('default', ['clean', 'cssDevel', 'jsDevel', 'copy:static', 'esteWatch']);
	grunt.registerTask('deploy' , ['clean', 'cssDeploy', 'jsDeploy', 'copy:static']);

};
