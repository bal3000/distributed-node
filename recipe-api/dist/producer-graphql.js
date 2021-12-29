"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fastify_1 = __importDefault(require("fastify"));
const fastify_gql_1 = __importDefault(require("fastify-gql"));
const server = (0, fastify_1.default)({ logger: true });
const schema = (0, fs_1.readFileSync)(__dirname + '/../shared/graphql-schema.gql').toString();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const resolvers = {
    Query: {
        pid: () => process.pid,
        recipe: async (_obj, { id }) => {
            if (id != 42)
                throw new Error(`recipe ${id} not found`);
            return {
                id,
                name: 'Chicken Tikka Masala',
                steps: 'Throw it in a pot...',
            };
        },
    },
    Recipe: {
        ingredients: async (obj) => {
            return obj.id != 42
                ? []
                : [
                    { id: 1, name: 'Chicken', quantity: '1 lb' },
                    { id: 2, name: 'Sauce', quantity: '2 cups' },
                ];
        },
    },
};
server
    .register(fastify_gql_1.default, { schema, resolvers, graphiql: true })
    .listen(PORT, HOST, () => {
    console.log(`Producer running at http://${HOST}:${PORT}/graphql`);
});
