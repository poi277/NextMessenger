"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducer = getProducer;
const kafka_1 = require("./kafka");
const producer = kafka_1.kafka.producer();
let connected = false;
async function getProducer() {
    if (!connected) {
        await producer.connect();
        connected = true;
        console.log('Kafka Producer connected');
    }
    return producer;
}
//# sourceMappingURL=producer.js.map