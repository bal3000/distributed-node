import fs from 'fs';
import https from 'https';
import Fastify, { FastifyInstance } from 'fastify';
import fetch, { RequestInit } from 'node-fetch';

const server: FastifyInstance = Fastify({});

const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT || '3000', 10);
const TARGET = process.env.TARGET || 'localhost:4000';

const options: RequestInit = {
  agent: new https.Agent({
    ca: fs.readFileSync(`${__dirname}/../shared/tls/basic-certificate.cert`),
  }),
};

server.get('/', async () => {
  const req = await fetch(`https://${TARGET}/recipes/42`, options);
  const producer_data = await req.json();
  return {
    consumer_pid: process.pid,
    producer_data,
  };
});

server.listen(PORT, HOST, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
