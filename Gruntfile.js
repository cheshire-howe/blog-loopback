module.exports = function(grunt) {
  
  // Load custom tasks in tasks dir
  // grunt.loadTasks('./tasks');
  
  // Project configuration
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      backend: {
        src: ['server/**/*.js']
      },
      frontend: {
        src: [
          'client/**/*.js',
          '!client/vendor/**/*.js',
          '!client/js/lb-services.js'
        ]
      },
      backendtest: {
        src: ['test/backend/**/*.js']
      },
      frontendtest: {
        src: ['test/frontend/**/*.js']
      },
      grunttasks: {
        src: ['tasks/**/*.js']
      }
    },
    mochacli: {
      options: {
        reporter: 'nyan',
        bail: false
      },
      all: ['test/backend/**/*.js']
    },
    karma: {
      unit: {
        configFile: 'test/frontend/karma.conf.js',
        background: true,
        singleRun: false
      }
    },
    concat: {
      target1: {
        files: {
          'build/prod.js': [
            'client/js/**/*.js',
            '!client/js/app.js',
            'client/js/app.js'
          ]
        }
      }
    },
    uglify: {
      allfiles: {
        files: [
          {
            expand: true,
            cwd: 'client/js/',
            src: '**/*.js',
            dest: 'build/',
            ext: '.min.js'
          }
        ]
      },
      minify: {
        src: 'client/js/build/prod.js',
        dest: 'client/js/build/prod.min.js'
      }
    },
    loopback_sdk_angular: {
      services: {
        options: {
          input: './server/server.js',
          output: './client/js/lb-services.js'
        }
      }
    },
    docular: {
      groups: [
        {
          groupTitle: 'Loopback',
          groupId: 'loopback',
          sections: [
            {
              id: 'lbServices',
              title: 'Loopback Services',
              scripts: ['client/js/lb-services.js']
            }
          ]
        }
      ]
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      backend: {
        files: '<%= jshint.backend.src %>',
        tasks: ['jshint:backend', 'mochacli']
      },
      mocha: {
        files: '<%= jshint.backendtest.src %>',
        tasks: ['jshint:backendtest', 'mochacli']
      },
      frontend: {
        files: '<%= jshint.frontend.src %>',
        tasks: ['jshint:frontend', 'karma:unit:run']
      },
      karma: {
        files: '<%= jshint.frontendtest.src %>',
        tasks: ['jshint:frontendtest', 'karma:unit:run'] 
      },
      client: {
        files: 'client/**/*.*',
        options: {
          livereload: true
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadNpmTasks('grunt-docular');
  grunt.loadNpmTasks('grunt-karma');
  
  grunt.registerTask('default', [
    'jshint',
    'loopback_sdk_angular',
    'docular',
    'mochacli'
  ]);
  
  grunt.registerTask('go', [
    'karma:unit:start',
    'watch'
  ]);
  
  grunt.registerTask('minify', ['concat', 'uglify']);
};