
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble');

    var config = {
        dev: 'dev',
        dist: 'dist'
    };

    grunt.initConfig({

        config: config,

        watch: {
            js: {
                files: ['<%= config.dev %>/js/**/*.js'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= config.dev %>/scss/**/*.scss'],
                tasks: ['sass:dev'],
                options: {
                    livereload: true
                }
           },
            autoprefixer: {
                files: ['.tmp/styles/*.css'],
                tasks: ['autoprefixer:dev'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                  livereload: '<%= connect.options.livereload %>'
                },
                files: [
                  '<%= config.dev %>/**/*.html',
                  '<%= config.dev %>/scss/**/*.scss'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                //to access with a mobile device, url should be http://Some.IP.Address:9000
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.dev)
                        ];
                    }
                }
            }
        },

        assemble: {
            pages: {
                options: {
                    flatten: true,
                    assets: '<%= config.dev %>/src',
                    layout: '<%= config.dev %>/src/templates/layouts/default.hbs',
                    data: '<%= config.dev %>/src/data/*.{json,yml}',
                    partials: '<%= config.dev %>/src/templates/partials/*.hbs'
                },
                files: {
                    '<%= config.dev %>' : ['<%= config.dev %>/src/templates/pages/*.hbs']
                }
            }
        },


        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                expand: true,
                cwd: '<%= config.dev %>/scss/',
                src: ['*.scss'],
                dest: '.tmp/styles/',
                ext: '.css'
            },
            dev: {
                options: {
                    style: 'expanded',
                    debugInfo: true,
                    lineNumbers: true
                },
                expand: true,
                cwd: '<%= config.dev %>/scss/',
                src: ['*.scss'],
                dest: '.tmp/styles/',
                ext: '.css'
            }
        },

        autoprefixer: {
            dist: {
                options: {
                    browsers: ['last 3 versions']
                },
                files: {
                    '<%= config.dist %>/style.css': ['.tmp/styles/style.css']
                }
            },
            dev: {
                options: {
                    browsers: ['last 3 versions'],
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '*.css',
                    dest: '<%= config.dev %>/styles/'
                }]
            }
        },

        wiredep: {
            app: {
                src: ['<%= config.dev %>/src/templates/layouts/default.hbs'],
                exclude: ['bower_components/modernizr/modernizr.js'],
                ignorePath: /^(\/|\.+(?!\/[^\.]))+\.+/
            }
        },

        useminPrepare: {
        options: {
        dest: '<%= config.dist %>'
            },
            html: 'index.html'
        },

        // concat: {
        //     dist: {
        //         src: [
        //             '<%= config.dev %>/scripts/*.js'
        //         ],
        //         dest: '.tmp/scripts/main.js',
        //     }
        // },

        // uglify: {
        //     dist: {
        //         src: '.tmp/scripts/main.js',
        //         dest: '<%= config.dist %>/scripts/main.min.js'
        //     }
        // },

        clean: {
            src: ['.tmp/']
        },

        responsive_images: {
            dist: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 240,
                        quality: 80,
                    },{
                        width: 320,
                    },{
                        width: 640,
                    },{
                        width: 1024,
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>/images',
                    src: '**/*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: ['**/*'],
                    cwd: '<%= config.dev %>/images',
                    dest: '<%= config.dist %>/images'
                }]
            }
        }
    });

    grunt.registerTask('dev', function (target) {
        grunt.task.run([
            'clean',
            'wiredep',
            'sass:dev',
            'autoprefixer:dev',
            'assemble',
            'connect:livereload',
            'watch'
            
        ]);
    });

    grunt.registerTask('build', [
        'clean',
        'responsive_images',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'sass:dist'
    ]);

    grunt.registerTask('default', [

    ]);
};
