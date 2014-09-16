module.exports = function(grunt) {

    // Plugin loading
    require('load-grunt-tasks')(grunt);

        //Initializing the configuration object
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Task configuration
        bower: {
            install: {
                options: {
                    targetDir: './src/lib',
                    layout: 'byComponent',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },

        bower_concat: {
            all: {
                dest: './public/js/<%= pkg.name %>-lib.js',
                exclude: ['fontawesome'],
                bowerOptions: {
                    relative: false
                }
            }
        },

        clean: ['<%= concat.all.dest %>','<%= concat.css.dest %>', '<%= bower_concat.all.dest %>', '<%= copy.main.dest %>'],

        cssmin: {
            options: {
                report: 'gzip'
            },
            css: {
                src: '<%= concat.css.dest %>',
                dest: '<%= concat.css.dest %>'
            }
        },

        concurrent: {
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['watch', 'nodemon:dev']
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: './src/lib/bootstrap/fonts/',
                src: '**',
                dest: './public/fonts/',
                flatten: true,
                filter: 'isFile',
            },
            fontAwesome: {
                expand: true,
                cwd: './src/lib/fontawesome/fonts/',
                src: '**',
                dest: './public/fonts/',
                flatten: true,
                filter: 'isFile',
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            all: {
                src: ['./src/common/**/*.js', './src/core/**/*.js'],
                dest: './public/js/<%= pkg.name %>.js',
            },
            css: {
                src: [
                    './src/lib/bootstrap/dist/css/bootstrap.css',
                    './src/lib/bootstrap3-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                    './src/lib/fontawesome/css/font-awesome.css',
                    './src/css/style.css'
                ],
                dest: './public/css/<%= pkg.name %>.css',
            }
        },

        env: {
            options : {
                //Shared Options Hash
            },
            dev : {
                NODE_ENV : 'development',
                PORT: 3000
            },
            test : {
                NODE_ENV : 'test'
            },
            prod : {
                NODE_ENV : 'production',
                PORT: 8443
            }
        },

        imagemin: {
            all: {
                options: {
                    optipng: true,
                    gifsicle: true,
                    jpegtran: true,
                    svgo: true,
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: './src/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: './public/img/'
                }]
            }
        },

        jshint: {
            files: ['gruntfile.js', './server/**/*.js', './src/common/**/*.js', './src/core/**/*.js'],

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
                globals: { require: false, __dirname: false, console: false, module: false, exports: false, angular: true, node: true, jQuery: true, window: true }
            }
        },

        nodemon: {
            dev: {
                script: './bin/www'
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            frontend: {
                files: {
                    '<%= bower_concat.all.dest %>': '<%= bower_concat.all.dest %>',
                }
            },
            backend: {
                files: {
                    '<%= concat.all.dest %>': '<%= concat.all.dest %>',
                }
            }
        },

        watch: {
            js_all: {
                files: '<%= concat.all.src %>',
                tasks: ['concat:all','uglify:backend'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    './public/**/*.{css,js}',
                    './src/**/*.js',
                    './public/templates/**/*.html'
                ]
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['build', 'concurrent']);

    // clean, concat and uglify
    grunt.registerTask('ccu', ['clean', 'concat', 'bower_concat', 'cssmin', 'imagemin', 'uglify']);

    // Build task.
    grunt.registerTask('build', ['bower:install', 'jshint', 'ccu', 'env:dev']);

    //Productions task
    grunt.registerTask('prod-build', ['jshint', 'env:prod', 'concurrent']);
};
