const express = require('express');
const router = express.Router();
const swagger = require('../../startup/swagger');

router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swagger.spec);
});

module.exports = router;
