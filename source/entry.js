import service from "./service";


/**
    Provides a programmatic way to execute the docsite service.

    Depending on `options`, the service will build the docsite and start an
    HTTP server or watch files or both.

    The returned interface includes the no-arg functions:
    - `start()`: to start docsite service
    - `stop()`: to stop docsite service
    - `running()`: check if service is running

    Both `start` and `stop` are async and resolve to undefined once the request 
    has finished.

    If the service is neither serving nor watching files (per configuration), 
    then `stop` is unnecessary and `running` will always return `false`.
    

    @param { object } options
      Configuration options.
    @return { object }
      Application service interface.
*/
export default options => service(options)
