module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			production: {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
					sequences: true,
					properties: true,
					dead_code: true,
					conditionals: true,
					comparisons: true,
					loops: true,
					unused: true,
					join_vars: true,
					compress: {
						drop_console: true
					},
					global_defs: {
						DEBUG: false
					}
				},
				files: [
					{ src: 'scripts/bootstrap/*.js', dest: 'public/js/bootstrap.min.js' },
					{ src: [ '**/*.js', '!bootstrap/**/*.js'], dest: 'public/js', expand: true, cwd: 'scripts', flatten: true,
								ext: '.min.js', extDot: 'last' }
				]
			},
			development: {
				options: {
					banner: '/*! Code for <%= pkg.name %>\nGenerated on <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
					compress: false,
					beautify: true,
					sequences: true,
					properties: true,
					dead_code: true,
					conditionals: true,
					comparisons: true,
					loops: true,
					unused: true,
					join_vars: true,
					preserveComments: 'all',
					mangle: false,
					global_defs: {
						DEBUG: true
					}
				},	
				files: [
					{ src: [ '**/*.es5', '!bootstrap/**/*.js'], dest: 'public/js', expand: true, cwd: 'scripts', flatten: true,
								ext: '.min.js', extDot: 'last' },
					{ src: 'scripts/bootstrap/*.js', dest: 'public/js/bootstrap.min.js' }
				]
			}
		},
		less: {
			production: {
				options: {
					compress: true,
					cleancss: true,
					strictMath: true,
					strictUnits: true,
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
					'public/css/site.css': 'less/site.less',
					'public/css/bootstrap.css': 'less/bootstrap/bootstrap.less'
				}
			},
			development: {
				options: {
					strictMath: true,
					strictUnits: true,
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
					'public/css/site.css': 'less/site.less',
					'public/css/bootstrap.css': 'less/bootstrap/bootstrap.less'
				}
			}
		},
		jade: {
			production: {
				options: {
					compileDebug: false
				},
				files: [
					{ dest: 'Views/Templates/Compiled/', src: 'Views/Templates/*.jade' }
				]
			},
			development: {
				options: {
					pretty: true
				},
				files: [
					{ dest: 'Views/Templates/Compiled/', src: 'Views/Templates/*.jade' }
				]
			}
		},
		jshint: {
			options: {
				curly: true,
				unused: true,
				esnext: true
			},
			files: {
				src: [ 'scripts/**/*.js', '!scripts/bootstrap/**/*.js' ]
			}
		},
		watch: {
			files: [
				'GruntFile.js',
				'scripts/**/*.js',
				'less/**/*.js'
			],
			tasks: ['jshint', 'uglify:development', 'less:development']
		},
		traceur: {
			options: {
				blockBinding: true,
				experimental: true,
				verbose: true
			},
			files: [
				{ expand: true, cwd: 'scripts', src: ['**/*.js', '!bootstrap/**/*.js'], dest: 'public/js', ext: '.es5', extDot: 'last' }
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-traceur');

	grunt.registerTask('default', ['jshint', 'uglify:development', 'less:development', 'jade:development']);
	grunt.registerTask('minify', ['uglify:production', 'less:production']);
	grunt.registerTask('release', ['jshint', 'uglify:production', 'less:production', 'jade:production'])
};