const express = require('express');
const Router = express.Router();
const modules = require('./modules');

Router.use('/cyphertree', modules);

module.exports = Router;