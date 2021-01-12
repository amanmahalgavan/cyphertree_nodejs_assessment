const express = require('express');

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

const app = express();
const bodyParser = require('body-parser');
const config = require('./config/config');
const DB = require('./models/index');
const Routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', Routes);
const server = http.createServer(app);
DB.sequelizeConnection
.authenticate()
.then(() => {
    console.log('Connected to the database successfully.')
    console.log('Initializing Express Server...')
    // app.listen(config.server_port, () => {
    //     console.log(`Express Server listening at http://localhost:${config.server_port}`);
    // });
    // Start a cluster of Node Processes
    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running. Cores available: ${numCPUs}`);
      
        // Fork workers.
        for (let i = 0; i < numCPUs -2; i++) {
          cluster.fork();
        }
      
        cluster.on('exit', (worker, code, signal) => {
          console.log(`worker ${worker.process.pid} died with code ${code} and signal ${signal}.`);
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        server.listen(config.server_port);
        console.log(`Worker ${process.pid} started`);
    }
}).catch(err => {
    console.log(`Failed to Initialize Express Server. ${err}`);
})



