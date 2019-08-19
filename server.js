const express = require('express');
const server = express();
const logger = require('morgan');
const actionRouter = require('./routes/action-routes.js');
const projectRouter = require('./routes/project-routes.js');

server.use(express.json());
server.use(logger('dev'));
server.use('/api/action', actionRouter);
server.use('/api/project', projectRouter);

server.get('/', (req, res) => {
  res.send('<h1>Its WORKING!!!!</h1>')
})

module.exports = server;
