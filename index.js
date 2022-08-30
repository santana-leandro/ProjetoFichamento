
import http from 'http';
import app from './api/src/app.js';

const server = http.createServer(app);

server.listen(5000);