module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'lib/**/*.js', type: 'module', watched: true, included: true, served: true },
      { pattern: 'tests/**/*.js', type: 'module', watched: true, included: true, served: true }
    ],
    // files: [
    //   'lib/**/*.js',
    //   'tests/**/*.js'
    // ],
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-babel-preprocessor'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'lib/**/*.js': ['babel'],
      'tests/**/*.js': ['babel']
    },
    coverageReporter: {
      dir: 'coverage',
      includeAllSources: true,
      reporters: [
        { type: 'html', subdir: 'report-html' },
        // { type: 'lcov', subdir: 'report-lcov' },
        // { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
      ]
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
