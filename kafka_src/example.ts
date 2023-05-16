// src/kafka-main.ts
import { KafkaProducer } from "./producer";
// import { KafkaConsumer } from "./consumer";

const brokers = ["composed-ghost-12404-us1-kafka.upstash.io:9092"];
const topic = "test-topic";

const producer = new KafkaProducer(brokers, topic);
// const consumer = new KafkaConsumer(brokers, topic, "my-group");

(async () => {
  await consumer.connect();
  await consumer.subscribeAndConsume();

  await producer.connect();

  for (let i = 0; i < 10; i++) {
    await producer.produceMessage(`Message ${i}`);
  }

  // Disconnect the producer and consumer after 10 seconds
  setTimeout(async () => {
    await producer.disconnect();
    await consumer.disconnect();
  }, 10000);
})();
