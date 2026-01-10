const kafka = require('./kafka');

const producer = kafka.producer();
let connected = false;

async function getProducer() {
  if (!connected) {
    await producer.connect();
    connected = true;
    console.log('Kafka Producer connected');
  }
  return producer;
}

module.exports = { getProducer };
