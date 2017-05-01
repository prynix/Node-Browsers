const http = require('http'), cluster = require('cluster'), numCPUs = require('os').cpus().length,
    kindOfBrowser = ['chrome'/*, 'safari', 'firefox'*/], kindOfOS = [`windows`, `macOS`, `linux`],
    Browser = require(`./browsers/${kindOfBrowser[getRandomInt(0, kindOfBrowser.length - 1)]}.js`);
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min };
/*
*   RUN:->
*/
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) { cluster.fork(); }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection. In this case it is an HTTP server:    
    http.createServer((request, response) => { }).listen(3000, () => { console.info('===-window & document factory work-==='); })
        .on(`request`, (request, response) => {
            let browser = { window, document } = new Browser().browser;
            response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
            response.write(JSON.stringify(browser));
            response.end();
        });
    console.log(`Worker ${process.pid} started`);
}
