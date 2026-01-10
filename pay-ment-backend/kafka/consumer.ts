import { redisClient } from 'util/redis';
import { kafka } from './kafka';
import { handlePaymentEvent } from 'src/payment/payment-kafak';
import { PaymentEvent } from './payment-event.type';

const consumer = kafka.consumer({
  groupId: 'payment-consumer-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  retry: {
    retries: 5,
  },
});

export async function startPaymentConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ 
      topic: 'payment-topic',
      fromBeginning: false,
    });
    console.log('Payment Consumer started');
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        const payload: PaymentEvent = JSON.parse(message.value.toString());

        const eventKey = `payment:event:${payload.eventType}:${payload.orderId}`;

        const isFirst = await redisClient.set(eventKey, '1', {
          NX: true,
          EX: 60 * 60 * 24,
        });

        if (!isFirst) {
          console.log('중복 이벤트 감지:', payload.orderId);
          return;
        }
      try {
        await handlePaymentEvent(payload);
      } catch (e) {
        await redisClient.del(eventKey);
        throw e;
      }
    },
  });

  } catch (error) {
    console.error('Consumer 시작 실패:', error);
    setTimeout(() => {
      console.log('Consumer 재연결 시도...');
      startPaymentConsumer();
    }, 5000);
  }
}