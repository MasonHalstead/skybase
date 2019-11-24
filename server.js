require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io_bitmex = require('socket.io')(server, { path: '/bitmex' });
const { PRIVATE_KEY, SKYDAX_ENV } = process.env;

require('./startup/config')(PRIVATE_KEY);
require('./startup/favicon')(app);
require('./startup/errors')(app);
require('./startup/routes')(app);
require('./startup/sockets')(io_bitmex);
require('./models/index')();
require('./jobs/index')();

if (SKYDAX_ENV === 'production') {
  require('./startup/prod')(app);
}
const port = process.env.PORT || 8080;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}...`);
});
