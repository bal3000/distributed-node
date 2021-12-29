"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_js_1 = __importDefault(require("@grpc/grpc-js"));
const proto_loader_1 = __importDefault(require("@grpc/proto-loader"));
const pkg_def = proto_loader_1.default.loadSync(`${__dirname}/../shared/grpc-recipe.proto`);
const recipe = grpc_js_1.default.loadPackageDefinition(pkg_def).recipe;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const server = new grpc_js_1.default.Server();
server.addService(recipe.RecipeService.service, {
    getMetaData: (_call, cb) => {
        cb(null, {
            pid: process.pid,
        });
    },
    getRecipe: (call, cb) => {
        if (call.request.id !== 42) {
            return cb(new Error(`unknown recipe ${call.request.id}`));
        }
        cb(null, {
            id: 42,
            name: 'Chicken Tikka Masala',
            steps: 'Throw it in a pot...',
            ingredients: [
                { id: 1, name: 'Chicken', quantity: '1 lb' },
                { id: 2, name: 'Sauce', quantity: '2 cups' },
            ],
        });
    },
});
server.bindAsync(`${HOST}:${PORT}`, grpc_js_1.default.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        throw err;
    }
    server.start();
    console.log(`Producer running at http://${HOST}:${port}/`);
});
