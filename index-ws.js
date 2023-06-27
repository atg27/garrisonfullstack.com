//set up express server for websocket
const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);

server.listen(PORT, function () { console.log('Listening on ' + PORT); });

// Websocket server attatched to express server
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

// listeners when connections happen to websocket server
// given connection function when it connects to new server
wss.on('connection', function connection(ws) {

  // data from websocket ie clients/size
  const numClients = wss.clients.size;

  // lets us know in our log
  console.log('clients connected: ', numClients);

  //broadcasts to current visitors
  wss.broadcast(`Current visitors: ${numClients}`);

  //handle different websocket states
  if (ws.readyState === ws.OPEN) {
    ws.send('welcome!');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${wss.clients.size}`);
    console.log('A client has disconnected');
  });

  ws.on('error', function error() {
    //
  });
});

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
  console.log('Broadcasting: ', data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
// End Websocket