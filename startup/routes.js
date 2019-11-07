const express = require('express');
const cors = require('../middleware/cors');
const router_v1 = require('../routes/v1/index');

module.exports = function(app) {
  app.use(express.json());
  app.use(cors);
  app.use('/v1', router_v1);
};
