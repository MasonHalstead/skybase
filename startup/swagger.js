const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Skydax',
      version: '2.1.1',
      description: 'Skydax API documentation.',
    },
    host: 'api.skydax.com',
    basePath: '/v1',
    tags: [
      {
        name: 'API Endpoints',
        description: `Production is currently connected to all production environments. Be careful when sending orders through because it is real time and will fulfill orders etc. We recommend to first setup an account through the UI and then update your user settings with a password. This will allow you to use the API for authentication and retrieve a valid JSON Web Token. \n 
        Test API: https://skydax-test.herokuapp.com/v1 \n
        Test: https://skydax-react-dev.firebaseapp.com \n
        Production API: https://api.skydax.com/v1 \n 
        Production: https://skydax.com/v1 \n 
        `,
        'x-traitTag': true,
      },
      {
        name: 'JSON Web Tokens',
        description: `JSON Web Tokens will last 7 days before expiring. Refresh the token regularly by hitting the v1/auth/token route with a valid JWT token in the header. The response will return a new token with a 7 day expiration.`,
        'x-traitTag': true,
      },
      {
        name: 'Bitmex Web Socket',
        description: `Connect directly to the Bitmex Web Socket. Web sockets are a little different and will need to be hooked up with a WS library. \n
        const socket = socketIOClient('https://api.skydax.com', { path: '/bitmex' }); \n
        socket.on('XBTUSD:price', data => { data }); \n
        socket.on('XBTUSD:instrument', data => { data }); \n
        socket.on('XBTUSD:candle', data => { data }); \n
        socket.on('XBTUSD:book', data => { data }); \n
        socket.on('ETHUSD:price', data => { data }); \n
        socket.on('ETHUSD:instrument', data => { data }); \n
        socket.on('ETHUSD:candle', data => { data }); \n
        socket.on('ETHUSD:book', data => { data }); \n
        `,
        'x-traitTag': true,
      },
    ],
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        name: 'x-auth-token',
      },
    },
  },
  apis: ['./routes/v1/*.js', './routes/v1/**/*.js'],
};
const spec = swaggerJSDoc(options);

module.exports = { spec };
