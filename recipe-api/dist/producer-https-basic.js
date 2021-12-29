"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)({
    https: {
        key: fs_1.default.readFileSync(`${__dirname}/tls/basic-private-key.key`),
        cert: fs_1.default.readFileSync(`${__dirname}/../shared/tls/basic-certificate.cert`),
    },
});
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
console.log(`worker pid=${process.pid}`);
server.get('/recipes/:id', async (req, reply) => {
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
