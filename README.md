## Directory naming

> `/dist` - for minified and optimized production-ready code
>
> `/build` - transpiled and bundled code, not optimized hence not production-ready

Using bundler in development process `/build` is used to run code while working with source files. Bundler watches changes in source files and rebuilds them when changes happen, which cause rerun of the process (e.g. server) running on a `/build` dir.

That way a developer can work on source files and run the process which needs builded (bundled, transpiled) code at the same time. That build have to be runnable as fast as it possible when changes was made in source files and does not need to be optimized.

`/dist` folder is an optimized production-ready version of `/build`. It is built when product is ready to be deployed.
