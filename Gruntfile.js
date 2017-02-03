/*
 * Citrus's Gruntfile
 * http://citren.us
 * Copyright 2014-2016 Matias Lopez
 * Licensed under MIT (https://github.com/imatlopez/citrus/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict'

  // Force use of Unix newlines
  grunt.util.linefeed = '\n'

  var autoprefixerSettings = require('./grunt/autoprefixer-settings.js')
  var autoprefixer = require('autoprefixer')(autoprefixerSettings)

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*\n' +
      ' * Citrus v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
      ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' * Licensed under <%= pkg.license %> (<%= pkg.repository.url %>/blob/master/LICENSE)\n' +
      ' */\n',

    clean: {
      build: ['**/*.map', 'css/<%= pkg.name %>.*', 'css/*.min.css', 'js/<%= pkg.name %>*.js']
    },

    // JS build configuration
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: ['dev/js/*.js', 'dev/jsx/*.jsx']
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      grunt: {
        src: ['Gruntfile.js', 'grunt/*.js']
      },
      build: {
        src: ['dev/js/*.js']
      }
    },

    concat: {
      options: {
        stripBanners: false
      },
      build: {
        src: 'dev/js/index.js',
        dest: 'js/<%= pkg.name %>.js'
      }
    },

    babel: {
      options: {
        presets: ['es2015', 'react']
      },
      build: {
        files: {
          '<%= concat.build.dest %>': '<%= concat.build.dest %>'
        }
      }
    },

    lineremover: {
      es6Import: {
        files: {
          '<%= concat.build.dest %>': '<%= concat.build.dest %>'
        },
        options: {
          exclusionPattern: /^(import|export)/g
        }
      }
    },

    stamp: {
      js: {
        options: {
          banner: '<%= banner %>\n+function ($) {\n',
          footer: '\n}(jQuery);'
        },
        src: [
          '<%= concat.build.dest %>'
        ]
      },
      css: {
        options: {
          banner: '<%= banner %>\n'
        },
        src: [
          'css/<%= pkg.name %>.css'
        ]
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: {
          except: ['this']
        },
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      build: {
        src: '<%= concat.build.dest %>',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    },

    // CSS build configuration

    scsslint: {
      allFiles: [
        'dev/scss/*.scss'
      ],
      options: {
        bundleExec: false,
        colorizeOutput: true,
        config: '.scss-lint.yml',
        reporterOutput: null
      }
    },

    sass: {
      options: {
        includePaths: ['dev/scss'],
        precision: 6,
        sourceComments: false,
        sourceMap: true,
        outputStyle: 'expanded'
      },
      build: {
        files: {
          'css/<%= pkg.name %>.css': 'dev/scss/<%= pkg.name %>.scss'
        }
      }
    },

    postcss: {
      build: {
        options: {
          map: true,
          processors: [autoprefixer]
        },
        src: 'css/*.css'
      }
    },

    cssmin: {
      options: {
        sourceMap: true,
        advanced: false
      },
      build: {
        files: [
          {
            expand: true,
            cwd: 'css',
            src: ['*.css', '!*.min.css'],
            dest: 'css',
            ext: '.min.css'
          }
        ]
      }
    },

    csscomb: {
      options: {
        config: '.csscomb.json'
      },
      build: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/'
      }
    },

    watch: {
      js: {
        files: '<%= jscs.build.src %>',
        tasks: ['build-js']
      },
      sass: {
        files: 'dev/scss/*.scss',
        tasks: ['build-css']
      }
    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    }

  })

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies',
    pattern: 'grunt-*'
  })
  require('time-grunt')(grunt)
  // Test buildribution task.
  grunt.registerTask('test-js', ['jscs:grunt', 'jscs:build', 'eslint'])
  grunt.registerTask('test-scss', ['scsslint'])
  grunt.registerTask('test', ['test-js', 'test-scss'])

  // JS buildribution task.
  grunt.registerTask('build-js', ['concat:build', 'lineremover', 'babel', 'stamp:js', 'uglify'])

  // CSS buildribution task.
  grunt.registerTask('build-css', ['sass', 'postcss', 'csscomb', 'stamp:css', 'cssmin'])

  // Full buildribution task.
  grunt.registerTask('build', ['clean', 'build-css', 'build-js'])

  // Default task.
  grunt.registerTask('default', ['test', 'build'])
}
