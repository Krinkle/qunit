/**
 * usage: qunit-browser [--browser <name|file>] <file|url> [<file|url>...]
 *
 * --browser  dotless = comma-separated names
 *            "./" file = JS or JSON file that returns an array
 *            Default: firefox (all are headless, open the file yourself for non-headless)
 *            Options:
 *            - firefox
 *            - chrome (chrome+chromium+edge)
 *            - chromium (chromium+chrome+edge)
 *            - edge (edge+chrome+chromium)
 *            - safari
 *            - browserstack/firefox_45
 *            - browserstack/firefox_previous
 *            - browserstack/firefox_current,
 *            - ["browserstack", {
 *                 "browser": "opera",
 *                 "browser_version": "36.0",
 *                 "device": null,
 *                 "os": "OS X",
 *                 "os_version": "Sierra"
 *              ]
 *            - saucelabs
 *            - puppeteer
 *            - puppeteer_coverage { outputDir: instanbul }
 *            // TODO: integration test with nyc as example with console+html output
 *
 * --file  file served from file:///, expanded for you, or URL
 *
 * --concurrency=Infinity Always on? Responsibility of OS for sytem browsers
 *  to manage resources and figure it out, most cases will have 1 file and 1-3 browsers.
 *  likely reasons to want to limit it:
 *   - test file served from an app that cannot handle ANY concurrency.
 *     solution: run this one at a time in a loop consequtively with similar params.
 *  - using a cloud browser like browserstack or saucelabs and wanting to test N
 *    browsers but may only launch <N browsers concurrently. Ideally, the service
 *    will queue but in practice may fail/throttle hard?
 *    solution: browserstack just queues, no problem.
 *    saucelabs? TBD.
 */

/* API */

const http = require('http');
import TapReporter;

// TODO: import tap-parser, bundledDependencies?

class ControlServer {
  constructor (testFileUrl, reporter) {
    // Start fetching the test file in the background
    /** @type {Promise<string>} */
    this.#cachedTestFile = this.#fetchTestFile(testFileUrl);
    this.#browsers = new Map();
    this.#nextBrowserId = 1;
    this.#proxyBase = null;
    this.#reporter = reporter;

    http.on('listening', (port) => {
      this.#proxyBase = 'http://localhost:' + port;
    });
    http.on('request', '/:browserId', async (resp) => {
      const browserId = req.url.path.split('/').last();
      resp.header(200);
      resp.write(this.#getTestFile(testFileUrl, browserId));
      resp.end();
      // TODO: Report that browser launched and connected
    });
    http.on('request', '/tap/:browserId', async (req) => {
      const browserId = req.url.path.split('/').last();
      // TODO: Feed to TAP reporter.
      // TODO: Verbose mode?
      //   Default: TAP where each browser is 1 virtual test in case of success.
      //   Verbose: TAP forwarded, test names prepended with [browsername].
      //   Failures are shown either way, with prepended names.
      // TODO: On "runEnd", report runtime
      //   Default: No-op, as overall TAP line as single test (above) can contain runtime
      //   Verbose: Output comment indicatinh browser done, and test runtime.
      // TODO: On "runEnd" call browser.stop();
    });
    http.on('request', '/stop/:browserId', async (req) => {
      const browserId = req.url.path.split('/').last();
      this.#browsers[browserId]?.stop();
      this.#browsers[browserId] = null;
    });

    // Start setting up the server in the background
    http.startServer('randomPort');
  }

  async #fetchTestFile (url) {
    // TODO: Does this support both file and HTTP?
    const resp = await fetch(url);
    return await resp.text();
  }

  async #getTestFile (testFileUrl, browserId) {
    const html = await this.#cachedTestFile;
    const reportUrl
    // TODO: Inject <base> element, unless there is one already
    // in which case either inject nothing or ensure it doesn't have
    // precedence. If injecting nothing, make sure there really is
    // nothing between <html> and the first base tag that might need one.
    html.replace('<base>', testFileUrl);
    html.replace('<script> reporters.tap', this.#proxyBase + '/tap/' + browserId);
    html.replace('<script> QUnit.on("done")', this.#proxyBase + '/stop/' + browserId);
    return html;
  }

  addBrowser (startBrowser) {
    const browserId = this.#nextBrowserId++;
    const browserStartUrl = this.#proxyBase + '/' + browserId;
    const browser = startBrowser(browserStartUrl, (err) => {
      // TODO: Report failure to TAP
      this.#browsers.delete(browserId);
    });
    this.#browsers.set(browserId, browser);
  }
}

function getBrowser(name) {
  // TODO: Define executable paths to check
  const _chromium = [];
  const _chrome = [];
  const _edge = [];
  const systemLaunchers = {
    firefox: [],
    safari: [],
    chromium: [],
    chrome: [],
    edge: []
  };
  // Use: fs.existsSync
  // On par with accessSync() and statSync()
  // beats fs/promises.access(cb), Promise.all(). The starting of the promises alone is
  // the same duration as the full existsSync loop, not even counting the await
  // and complexity.

  // TODO: Launch arguments, --headless.
  // --no-sandbox CHROMIUM_FLAGS
  // Refer to karma launchers.
  // Refer to airtap.
  // Refer to puppeteer.
  // Refer to playwright (Firefox, Safari).

  // TODO: child_process exec?
  // on('error'), on('exit'), kill/exit/quit.

  // TODO: Deal with one-time shared setup across broewsers of the same provider.
  // to setup browserstack tunnel once, and then tear it down at some point.
  // Refer to karma browser launcher. Maybe just a process-level flag to track
  // the "nonce"/semaphore that it is done for the setup, lazily. Easy enough?
  // What about shutdown? Do we start it in a way that doesnt' hold up the Node
  // process and then hope to tie into process.on('exit') to quckly clean it up,
  // risk zombie process. Or an official cleanup(), but then how to we ensure
  // it is only called once. function identity in an ES6 Set(), that qunit-browser
  // only calls once all browsers are stopped?
  // browser launcher module:
  // - default async startBrowser(url) -> { stop() }
  //    // ^ can be called multiple times for differnet files at the same time
  //    // ^
  // - async cleanupOnce -> void

  return async function startBrowser(url, onFail) {
    // TODO: Exec browser in the background
    // TODO: On non-zero exit, call onFail with string|Error (stderr or Error)
    // If your error is fatal but didn't kill procss, it is responsibilit of
    // browser object to clean itself up and close any processes etc
    return {
      stop: function() {
        // TODO: Kill exec
      }
    };
  };
}

function runBrowsers(files, browsers = 'firefox', reporter = null) {
  if (typeof files === 'string') {
    files = [files];
  }
  if (typeof browsers === 'string') {
    browsers = [browsers];
  }
  const reporter = reporter || new TapReporter();

  const expect = 'verbose' ? NaN : (files.length * browsers.length);
  // TODO: Implement optional plan() method
  reporter.plan(expect);

  const servers = [];
  for (const file of files) {
    servers.push(new ControlServer(file, reporter));
  }

  for (const browserName of browsers) {
    const startBrowser = getBrowser(browserName);
    for (const server of servers) {
      server.addBrowser(startBrowser);
    }
  }
}

/* CLI */

const urls = process.argv.remaining.map(file => file.startsWith('http')
  ? file
  : new URL('file', file, process.cwd()).toString()
);
const browsers = !process.args.browser.includes('.')
  ? process.args.browser.split(',')
  : require(process.args.browser);

runBrowsers(
  urls,
  browsers
);
