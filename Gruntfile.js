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
      lib: {
        src: ['server/**/*.js', 'client/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
      grunttasks: {
        src: ['tasks/**/*.js']
      }
    },
    mochacli: {
      options: {
        reporter: 'nyan',
        bail: true
      },
      all: ['test/*.js']
    },
    concat: {
      target1: {
        files: {
          'build/prod.js': [
            'src/**/*.js',
            '!src/app.js',
            'src/app.js'
          ]
        }
      }
    },
    uglify: {
      allfiles: {
        files: [
          {
            expand: true,
            cwd: 'client/',
            src: '**/*.js',
            dest: 'build/',
            ext: '.min.js'
          }
        ]
      },
      minify: {
        src: 'build/prod.js',
        dest: 'build/prod.min.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'mochacli']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochacli']
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['jshint', 'mochacli']);
  
  grunt.registerTask('minify', ['concat', 'uglify']);
};