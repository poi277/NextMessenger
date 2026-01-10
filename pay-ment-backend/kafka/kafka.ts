import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: ['localhost:9092'],
});
