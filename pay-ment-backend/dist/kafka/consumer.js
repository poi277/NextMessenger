"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPaymentConsumer = startPaymentConsumer;
const redis_1 = require("../util/redis");
const kafka_1 = require("./kafka");
const payment_kafak_1 = require("../src/payment/payment-kafak");
const consumer = kafka_1.kafka.consumer({
    groupId: 'payment-consumer-group',
    sessionTimeout: 30000,
    heartbeatInterval: 3000,
    retry: {
        retries: 5,
    },
});
async function startPaymentConsumer() {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: 'payment-topic',
            fromBeginning: false,
        });
        console.log('Payment Consumer started');
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (!message.value)
                    return;
                const payload = JSON.parse(message.value.toString());
                const eventKey = `payment:event:${payload.eventType}:${payload.orderId}`;
                const isFirst = await redis_1.redisClient.set(eventKey, '1', {
                    NX: true,
                    EX: 60 * 60 * 24,
                });
                if (!isFirst) {
                    console.log('중복 이벤트 감지:', payload.orderId);
                    return;
                }
                try {
                    await (0, payment_kafak_1.handlePaymentEvent)(payload);
                }
                catch (e) {
                    await redis_1.redisClient.del(eventKey);
                    throw e;
                }
            },
        });
    }
    catch (error) {
        console.error('Consumer 시작 실패:', error);
        setTimeout(() => {
            console.log('Consumer 재연결 시도...');
            startPaymentConsumer();
        }, 5000);
    }
}
//# sourceMappingURL=consumer.js.map