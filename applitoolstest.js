const { Eyes, Target } = require('@applitools/eyes-webdriverio');
const { remote } = require('webdriverio');
const assert = require('assert');

describe('Visual Regression Test', () => {
  let eyes;
  let browser;

  before(async () => {
    eyes = new Eyes();

    eyes.setApiKey('FpwFRcpqCzyjvRJ9fGhDcqAhL47iwVUTQPZLKvtozwM110');
  });

  beforeEach(async () => {
    browser = await remote({
      capabilities: {
        browserName: 'chrome', 
      },

    });
  });

  it('should match the baseline', async () => {
    try {
      await eyes.open(browser, 'Your App Name', 'Test Name');

      await browser.url('http://64.23.152.198:3000');

      await eyes.check('Full Page', Target.window());

      // End the test
      await eyes.close();
    } finally {
      // Close the browser
      await browser.deleteSession();
    }
  });

  after(async () => {
    // Abort the test if there were visual differences
    await eyes.abortIfNotClosed();
  });
});