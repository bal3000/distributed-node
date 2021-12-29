"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
console.log(`master pid=${process.pid}`);
cluster_1.default.setupPrimary({
    exec: `$${__dirname}/producer-http-basic.js`,
});
cluster_1.default.fork();
cluster_1.default.fork();
cluster_1.default
    .on('disconnect', (worker) => {
    console.log('disconnect', worker.id);
})
    .on('exit', (worker, code, signal) => {
    console.log('exit', worker.id, code, signal);
    // cluster.fork();
})
    .on('listening', (worker, { address, port }) => {
    console.log('listening', worker.id, `${address}:${port}`);
});
