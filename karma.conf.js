const path = require('path')

module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    files: [
      {pattern: 'lib/**/*.js', type: 'module', watched: true, included: true, served: true},
      {pattern: 'tests/**/*.js', type: 'module', watched: true, included: true, served: true}
    ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-babel-preprocessor'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'lib/**/*.js': ['coverage'],
      // 'tests/**/*.js': ['babel']
    },
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  })
}
