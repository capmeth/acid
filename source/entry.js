import service from "./service/index.js"


/**
    Provides a programmatic way to execute the docsite service.

    Depending on `options`, the service will build the docsite and start an
    HTTP server or watch files or both.    

    @param { string | object } options
      Configuration options.
    @return { object }
      Application service interface.
*/
let acid = options => service(options)

acid.logger = service.logger;

export default acid;
