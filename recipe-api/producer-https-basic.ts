import fs from 'fs';
import Fastify, { FastifyInstance } from 'fastify';

const server: FastifyInstance = Fastify({
  https: {
    key: fs.readFileSync(`${__dirname}/tls/basic-private-key.key`),
    cert: fs.readFileSync(`${__dirname}/../shared/tls/basic-certificate.cert`),
  },
});

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;

console.log(`worker pid=${process.pid}`);

interface RecipeRequest {
  Params: { id: number };
}

server.get<RecipeRequest>('/recipes/:id', async (req, reply) => {
  console.log(`worker request pid=${process.pid}`);
  const { id } = req.params;
  if (id != 42) {
    reply.statusCode = 404;
    return { error: 'not found' };
  }
  return {
    producer_pid: process.pid,
    recipe: {
      id,
      name: 'Chicken Tikka Masala',
      steps: 'Throw it in a pot...',
      ingredients: [
        { id: 1, name: 'Chicken', quantity: '1 lb' },
        { id: 2, name: 'Sauce', quantity: '2 cups' },
      ],
    },
  };
});

server.listen(PORT, HOST, () => {
  console.log(`Producer running at https://${HOST}:${PORT}`);
});
