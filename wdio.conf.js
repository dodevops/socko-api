var fs = require('fs');
var defaultCapabilities = {
  name: 'socko-api',
  build: JSON.parse(fs.readFileSync('package.json')).version,
  screenrecorder: false,
  public: true,
  groups: "socko-api"
}
exports.config = {

  /**
   * specify test files
   */
  specs: [
    './test/test.browser.min.js'
  ],

  /**
   * capabilities
   */
  capabilities: [
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'firefox',
        platform: 'WIN10',
        version: 'latest'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'firefox',
        platform: 'WIN10',
        version: 'latest-1'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'firefox',
        platform: 'WIN10',
        version: 'latest-2'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'googlechrome',
        platform: 'WIN10',
        version: 'latest'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'googlechrome',
        platform: 'WIN10',
        version: 'latest-1'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'googlechrome',
        platform: 'WIN10',
        version: 'latest-2'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'MicrosoftEdge',
        platform: 'WIN10',
        version: 'latest'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'MicrosoftEdge',
        platform: 'WIN10',
        version: 'latest-1'
      }),
    Object.assign(
      {}, defaultCapabilities, {
        browserName: 'safari',
        platform: 'HIGH-SIERRA',
        version: '11'
      })
  ],

  /**
   * test configurations
   */
  logLevel: 'silent',
  coloredLogs: true,
  screenshotPath: 'screenshots',
  waitforTimeout: 10000,
  framework: 'mocha',
  services: ['testingbot'],
  user: 'd87072aa349553678b4951d26e743159',
  key: process.env['TESTINGBOT_SECRET'],

  reporters: ['dot'],
  reporterOptions: {
    outputDir: './'
  },

  mochaOpts: {
    ui: 'bdd'
  }
}
