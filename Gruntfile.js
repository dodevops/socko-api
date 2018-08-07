module.exports = function (grunt) {

  var package = require('./package.json');

  grunt.initConfig({
    tslint: {
      options: {
        configuration: 'tslint.json'
      },
      files: {
        src: [
          'index.ts',
          'lib/**/*.ts',
          'test/**/*.ts',
          '!index.d.ts',
          '!lib/**/*.d.ts',
          '!test/**/*.d.ts'
        ]
      }
    },
    clean: {
      coverage: ['test/coverage'],
      doc: ['docs']
    },
    ts: {
      default: {
        tsconfig: true
      }
    },
    copy: {
      test: {
        files: {
          'test/coverage/instrument/': 'test/**/*.js'
        },
        options: {
          expand: true
        }
      }
    },
    instrument: {
      files: ['index.js', 'lib/**/*.js'],
      options: {
        lazy: true,
        basePath: 'test/coverage/instrument/'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false
        },
        src: ['test/coverage/instrument/test/**/*.js']
      }
    },
    storeCoverage: {
      options: {
        dir: 'test/coverage/reports'
      }
    },
    remapIstanbul: {
      build: {
        src: 'test/coverage/reports/coverage.json',
        options: {
          reports: {
            'json': 'test/coverage/reports/coverage-mapped.json'
          }
        }
      }
    },
    makeReport: {
      src: 'test/coverage/reports/coverage-mapped.json',
      options: {
        type: 'lcov',
        dir: 'test/coverage/reports',
        print: 'detail'
      }
    },
    typedoc: {
      default: {
        options: {
          out: 'docs/',
          name: 'socko',
          readme: 'README.md',
          "external-modulemap": '.*/lib/([^/]*)/.*'
        },
        src: ['index.ts']
      }
    },
    browserify: {
      default: {
        options: {
          plugin: [
            [
              'tsify',
              {}
            ]
          ],
          browserifyOptions: {
            standalone: 'sockoapi'
          }
        },
        files: {
          'browser.js': ['index.ts']
        }
      },
      test: {
        options: {
          plugin: [
            [
              'tsify',
              {}
            ]
          ]
        },
        files: {
          'test/test.browser.js': ['test/**/*.ts']
        }
      },
    },
    webdriver: {
      default: {
        configFile: 'wdio.conf.js'
      }
    },
    coveralls: {
      default: {
        src: 'test/coverage/reports/lcov.info'
      }
    },
    exec: {
      uglify: 'node_modules/.bin/uglifyjs --output browser.min.js --compress --mangle -- browser.js',
      uglifyTest: 'node_modules/.bin/uglifyjs --output test/test.browser.min.js --compress --mangle -- test/test.browser.js'
    }
  })

  grunt.loadNpmTasks('grunt-ts')
  grunt.loadNpmTasks('grunt-tslint')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-istanbul')
  grunt.loadNpmTasks('remap-istanbul')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-typedoc')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-coveralls')
  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-webdriver')


  grunt.registerTask(
    'build',
    [
      'tslint',
      'ts'
    ]
  )

  grunt.registerTask(
    'default',
    [
      'build'
    ]
  )
  grunt.registerTask(
    'doc',
    [
      'clean:doc',
      'typedoc'
    ]
  )

  grunt.registerTask(
    'test',
    [
      'build',
      'clean:coverage',
      'copy:test',
      'instrument',
      'mochaTest:test',
      'storeCoverage',
      'remapIstanbul',
      'makeReport'
    ]
  )

  grunt.registerTask(
    'release',
    [
      'test',
      'browsertest',
      'doc',
      'browserify:default',
      'exec:uglify'
    ]
  )

  grunt.registerTask(
    'browsertest',
    [
      'build',
      'browserify:test',
      'exec:uglifyTest',
      'webdriver'
    ]
  )

}