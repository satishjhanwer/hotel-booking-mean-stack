module.exports = function (grunt) {
	// Plugin loading
	require("load-grunt-tasks")(grunt);

	//Initializing the configuration object
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		// Task configuration
		bower: {
			install: {
				options: {
					targetDir: "./src/lib",
					layout: "byComponent",
					install: true,
					verbose: false,
					cleanTargetDir: false,
					cleanBowerDir: false,
					bowerOptions: {},
				},
			},
		},

		bower_concat: {
			all: {
				dest: "./public/js/<%= pkg.name %>-lib.js",
				exclude: ["fontawesome"],
				bowerOptions: {
					relative: false,
				},
				dependencies: {
					bootstrap: "jquery",
					"bootstrap3-datetimepicker": ["jquery", "moment"],
				},
			},
		},

		clean: ["./public/"],

		concurrent: {
			dev: {
				options: {
					logConcurrentOutput: true,
				},
				tasks: ["watch", "env:dev", "nodemon:dev"],
			},
			prod: {
				options: {
					logConcurrentOutput: true,
				},
				tasks: ["watch", "env:prod", "nodemon:prod"],
			},
		},

		concat: {
			options: {
				separator: ";",
				stripBanners: true,
				banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " + '<%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			all: {
				src: ["./src/common/**/*.js", "./src/core/**/*.js"],
				dest: "./public/js/<%= pkg.name %>.js",
			},
		},

		concat_css: {
			all: {
				src: [
					"./src/lib/bootstrap/dist/css/bootstrap.css",
					"./src/lib/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.css",
					"./src/lib/fontawesome/css/font-awesome.css",
					"./src/css/style.css",
				],
				dest: "./public/css/<%= pkg.name %>.css",
			},
		},

		copy: {
			all: {
				expand: true,
				cwd: "./src/lib/fontawesome/fonts/",
				src: "**",
				dest: "./public/fonts/",
				flatten: true,
				filter: "isFile",
			},
			favicon: {
				expand: true,
				cwd: "./src/images/",
				src: "*.ico",
				dest: "./public/",
				flatten: true,
				filter: "isFile",
			},
		},

		cssmin: {
			options: {
				keepSpecialComments: 0,
				report: "gzip",
				banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " + '<%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			css: {
				src: "<%= concat_css.all.dest %>",
				dest: "<%= concat_css.all.dest %>",
			},
		},

		env: {
			dev: {
				NODE_ENV: "development",
				PORT: 3000,
			},
			test: {
				NODE_ENV: "test",
			},
			prod: {
				NODE_ENV: "production",
				PORT: 8443,
			},
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
				},
				files: [
					{
						expand: true,
						cwd: "./src/templates/",
						src: ["**/*.html"],
						dest: "./public/templates/",
					},
				],
			},
		},

		imagemin: {
			all: {
				options: {
					optipng: true,
					gifsicle: true,
					jpegtran: true,
					svgo: true,
					optimizationLevel: 7,
				},
				files: [
					{
						expand: true,
						cwd: "./src/images/",
						src: ["**/*.{png,jpg,gif}"],
						dest: "./public/img/",
					},
				],
			},
		},

		jshint: {
			files: ["gruntfile.js", "./src/core/**/*.js"],

			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				globals: {
					require: true,
					__dirname: false,
					console: false,
					module: true,
					exports: true,
					angular: true,
					node: true,
					jQuery: true,
					window: true,
				},
			},
		},

		nodemon: {
			dev: {
				script: "./bin/www",
			},
		},

		uglify: {
			options: {
				mangle: false,
			},
			frontend: {
				files: {
					"<%= bower_concat.all.dest %>": "<%= bower_concat.all.dest %>",
				},
			},
			backend: {
				files: {
					"<%= concat.all.dest %>": "<%= concat.all.dest %>",
				},
			},
		},

		watch: {
			frontend_css: {
				files: "<%= concat_css.all.dest %>",
				tasks: ["concat_css", "cssmin"],
				options: {
					livereload: true,
				},
			},
			frontend_img: {
				files: "./src/images/",
				tasks: ["imagemin"],
				options: {
					livereload: true,
				},
			},
			frontend_js: {
				files: "<%= concat.all.src %>",
				tasks: ["concat", "jshint", "uglify:backend"],
				options: {
					livereload: true,
				},
			},
			frontend_html: {
				files: "./src/templates/**/*.html",
				tasks: ["htmlmin"],
				options: {
					livereload: true,
				},
			},
		},
	});

	// Default task will run in production
	grunt.registerTask("default", ["concurrent:prod"]);

	// Development task
	grunt.registerTask("dev", ["bower:install", "cleaner", "jshint", "concurrent:dev"]);

	// clean concat and minimization task
	grunt.registerTask("cleaner", [
		"clean",
		"bower_concat",
		"concat",
		"concat_css",
		"copy",
		"cssmin",
		"htmlmin",
		"imagemin",
	]);
};
