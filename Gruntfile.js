
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
                files: ['<%= config.dev %>/static/js/**/*.js'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= config.dev %>/static/scss/**/*.scss'],
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
            wiredep: {
                files: ['bower_components/'],
                tasks: ['wiredep'],
                options: {
                    livereload: true
                }
            },
            assemble: {
                    files: ['<%= config.dev %>/data/*.{json,yml}',
                            '<%= config.dev %>/templates/layouts/*.hbs',
                            '<%= config.dev %>/templates/pages/*.hbs',
                            '<%= config.dev %>/templates/partials/*.hbs'
                    ],
                tasks: ['assemble:dev'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                  livereload: '<%= connect.options.livereload %>'
                },
                files: [
                  // '<%= config.dev %>/static/*.html',
                  '<%= config.dev %>/static/scss/**/*.scss'
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
                    open: true,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.dev + '/static')
                        ];
                    }
                }
            }
        },

        assemble: {
            dev: {
                options: {
                    flatten: true,
                    assets: '<%= config.dev %>/static',
                    layout: '<%= config.dev %>/templates/layouts/default.hbs',
                    data: '<%= config.dev %>/data/*.{json,yml}',
                    partials: '<%= config.dev %>/templates/partials/*.hbs'
                },
                files: {
                    '<%= config.dev %>/static' : ['<%= config.dev %>/templates/pages/*.hbs']
                }
            },
            dist: {
                options: {
                    flatten: true,
                    assets: '<%= config.dev %>/static',
                    layout: '<%= config.dev %>/templates/layouts/default.hbs',
                    data: '<%= config.dev %>/data/*.{json,yml}',
                    partials: '<%= config.dev %>/templates/partials/*.hbs'
                },
                files: {
                    '<%= config.dist %>' : ['<%= config.dev %>/templates/pages/*.hbs']
                }
            }
        },


        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                expand: true,
                cwd: '<%= config.dev %>/static/scss/',
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
                cwd: '<%= config.dev %>/static/scss/',
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
                    '<%= config.dist %>/build/main.css': ['.tmp/styles/main.css']
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
                    dest: '<%= config.dev %>/static/styles/'
                }]
            }
        },

        wiredep: {
            app: {
                src: ['<%= config.dev %>/templates/layouts/default.hbs'],
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
                    cwd: '<%= config.dev %>/static/img',
                    src: '**/*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/img'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: ['**/*'],
                    cwd: '<%= config.dev %>/static/img',
                    dest: '<%= config.dist %>/static/img'
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
            'assemble:dev',
            'connect:livereload',
            'watch'
            
        ]);
    });

    grunt.registerTask('build', [
        'clean',
        'assemble:dist',
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
