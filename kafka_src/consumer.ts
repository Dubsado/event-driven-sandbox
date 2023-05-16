import { kafka, KAFKA_TOPIC } from "./config";

init();

async function init() {
  const groupId = `run_puppeter`;
  const consumer = kafka.consumer({ groupId });

  try {
    await consumer.connect();
    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false });

    // Set up event listeners
    consumer.on(consumer.events.HEARTBEAT, (event) => {
      // console.log(`Heartbeat: ${JSON.stringify(event)}`);
    });

    consumer.on(consumer.events.FETCH_START, (event) => {
      // console.log(`Fetch Start: ${JSON.stringify(event)}`);
    });

    consumer.on(consumer.events.GROUP_JOIN, (event) => {
      // console.log(`Group Join: ${JSON.stringify(event)}`);
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        console.log(`Received message: `, JSON.parse(message.value.toString()));
      },
    });
  } catch (err) {
    console.error(err);
    await consumer.disconnect();
    process.exit(1);
  } finally {
  }
}
