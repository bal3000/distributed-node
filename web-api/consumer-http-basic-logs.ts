import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fetch from 'node-fetch';
import middie from 'middie';

import log from './logstash';

const server: FastifyInstance = Fastify({});

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '3000';
const TARGET = process.env.TARGET || 'localhost:4000';

(async () => {
  await server.register(middie);
  server.use((req: FastifyRequest, res: FastifyReply, next: any) => {
    log('info', 'request-incoming', {
      path: req.url,
      method: req.method,
      ip: req.ip,
      ua: req.headers['user-agent'] || undefined,
    });
    next();
  });

  server.setErrorHandler(async (error, req) => {
    log('error', 'request-failure', {
      stack: error.stack,
      path: req.url,
      method: req.method,
    });
    return new Promise((resolve, reject) => {
      return { error: error.message };
    });
  });

  server.get('/', async () => {
    const url = `http://${TARGET}/recipes/42`;
    log('info', 'request-outgoing', { url, svc: 'recipe-api' });
    const req = await fetch(url);
    const producerData = await req.json();
    return { consumerPID: process.pid, producerData };
  });

  server.get('/error', async () => {
    throw new Error('oh no');
  });

  server.listen(PORT, HOST, () => {
    log('verbose', 'listen', { host: HOST, port: PORT });
  });
})();
