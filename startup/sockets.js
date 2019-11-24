const BitmexClient = require('bitmex-realtime-api');
const client = new BitmexClient({ maxTableLen: 1 });

module.exports = function(io_bitmex) {
  io_bitmex.on('connection', socket => {
    // ------ XBTUSD Bitmex web socket ------ //
    client.addStream('XBTUSD', 'quote', (data, symbol) => {
      const price = data[0] || {};
      socket.emit(`${symbol}:price`, price);
    });
    client.addStream('XBTUSD', 'instrument', (data, symbol) => {
      const instrument = data[0] || {};
      socket.emit(`${symbol}:instrument`, instrument);
    });
    client.addStream('XBTUSD', 'orderBook10', (data, symbol) => {
      const book = data[0] || {};
      socket.emit(`${symbol}:book`, book);
    });
    client.addStream('XBTUSD', 'tradeBin1m', (data, symbol) => {
      const candle = data[0] || {};
      socket.emit(`${symbol}:candle`, candle);
    });
    // ------ ETHUSD Bitmex web socket ------ //
    client.addStream('ETHUSD', 'quote', (data, symbol) => {
      const price = data[0] || {};
      socket.emit(`${symbol}:price`, price);
    });
    client.addStream('ETHUSD', 'instrument', (data, symbol) => {
      const instrument = data[0] || {};
      socket.emit(`${symbol}:instrument`, instrument);
    });
    client.addStream('ETHUSD', 'orderBook10', (data, symbol) => {
      const book = data[0] || {};
      socket.emit(`${symbol}:book`, book);
    });
    client.addStream('ETHUSD', 'tradeBin1m', (data, symbol) => {
      const candle = data[0] || {};
      socket.emit(`${symbol}:candle`, candle);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
