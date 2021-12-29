import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';

const server: FastifyInstance = Fastify({});
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;

console.log(`worker pid=${process.pid}`);

type LimitRequest = FastifyRequest<{ Params: { limit: number } }>;

server.get('/:limit', async (req: LimitRequest, res) => {
  return String(fibonacci(Number(req.params.limit)));
});

server.listen(PORT, HOST, () => {
  console.log(`Producer running at http://${HOST}:${PORT}`);
});

function fibonacci(limit: number) {
  let prev = 1n,
    next = 0n,
    swap;
  while (limit) {
    swap = prev;
    prev = prev + next;
    next = swap;
    limit--;
  }

  return next;
}
