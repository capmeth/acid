import path from 'node:path'


/*
    Configuration options for node test runner.
*/
export default
{
    // decides location of compiled files, not whether or not to do so
    cache: true,
    // max number of tests to run in parallel
    concurrency: 1,
    // specify environment variables for tests
    environmentVariables: {},
    // extensions of files under test
    extensions: [ 'js' ],
    // stop running tests after first fail
    failFast: false,
    // fails tests that have no assertions
    failWithoutAssertions: false,
    // test files
    files: [ path.join('test', 'unit', '**', '*.test.js') ],
    // nodejs arguments to worker threads
    nodeArguments: void 0,
    // modules to load before testing begins
    require: [ path.join('test', 'setup.js') ],
    // run tests within same file in parallel?
    serial: false,
    // directory to store snapshot files
    snapshotDir: void 0,
    // function to sort test files with
    // sortTestFiles: void 0,
    // files under testing
    sources: path.join('source', '**', '*'),
    // run the tap reporter?
    tap: false,
    // max time for a test to run before assertion is made
    timeout: '3s',
    // ???
    utilizeParallelBuilds: true,
    // run tests with verbose output? (non-verbose not supported)
    verbose: true,
    // watch mode options
    watchMode: {},
    // use worker threads instead of child processes to run tests?
    workerThreads: true
}
