module.exports = function(config){
  config.set({

    basePath : '../../',

    files : [
      'client/vendor/angular/angular.js',
      'client/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/vendor/angular-ui-router/release/angular-ui-router.js',
      'client/vendor/angular-resource/angular-resource.js',
      'client/vendor/angular-animate/angular-animate.js',
      'client/vendor/angular-mocks/angular-mocks.js',
      'client/vendor/angular-xeditable/dist/js/xeditable.min.js',
      'client/js/**/*.js',
      'test/frontend/unit/**/*.js'
    ],

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};