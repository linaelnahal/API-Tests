import "@babel/polyfill";
import app from '../app';
import debug from 'debug';
import http from 'http';

debug('mock-auth-user:server');

const port = normalizePort(process.env.PORT || process.argv[2] || '3000');

app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  if (process.env.NODE_ENV === 'test') {
    return 3001;
  }
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      throw new Error(`${bind} requires elevated privileges`); // Changed from process.exit to throw
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      throw new Error(`${bind} is already in use`); // Changed from process.exit to throw
    default:
      throw error; // Keep this as is
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

export { server, normalizePort, onError };
