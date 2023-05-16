import { v4 as uuidv4 } from "uuid";
import { KAFKA_TOPIC } from "./config";
import { kafka } from "./config";

init();

async function init() {
  const producer = kafka.producer();
  await producer.connect();

  setInterval(async () => {
    const data = {
      id: uuidv4(),
      timestamp: Date.now(),
    };
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(data) }],
    });
    console.log(`sent data: `, data);
  }, Math.random() * 60 * 1000);
}
