"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)({});
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
console.log(`worker pid=${process.pid}`);
server.get('/:limit', async (req, res) => {
    return String(fibonacci(Number(req.params.limit)));
});
server.listen(PORT, HOST, () => {
    console.log(`Producer running at http://${HOST}:${PORT}`);
});
function fibonacci(limit) {
    let prev = 1n, next = 0n, swap;
    while (limit) {
        swap = prev;
        prev = prev + next;
        next = swap;
        limit--;
    }
    return next;
}
