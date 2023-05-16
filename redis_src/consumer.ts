import Redis from "ioredis";
import dotenv from "dotenv";
import { STREAM_NAME } from "./config";

dotenv.config({ path: ".env.local" });

const redis = new Redis(process.env.REDIS_URL as string);

/**
 *   this was some github example as to how to debug which
 *    redis commands were actually being fired off.
 *
const { sendCommand } = Redis.prototype;
Redis.prototype.sendCommand = function (command) {
  console.log(command.name);
  sendCommand.apply(this, arguments);
};
 *    it did not work, btw
 */

const GROUP_NAME = "contract_migrations";
const CONSUMER_NAME = "get_body_puppeteer";

async function doStuff() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 400 * Math.random());
  });
}

const consume = async () => {
  try {
    await redis.xgroup("CREATE", STREAM_NAME, GROUP_NAME, "$", "MKSTREAM");
  } catch (err: any) {
    if (!err.message.includes("BUSYGROUP")) {
      console.error("Error creating consumer group:", err);
    }
  }

  while (true) {
    try {
      const data = (await redis.xreadgroup(
        "GROUP",
        GROUP_NAME,
        CONSUMER_NAME,
        "BLOCK",
        0,
        "STREAMS",
        STREAM_NAME,
        ">"
      )) as any;

      if (data) {
        const [_, items] = data[0];
        for (const [id, [, message]] of items) {
          try {
            await doStuff();
            console.log(`Consumed data: ${message} | ID: ${id} | Consumer: ${CONSUMER_NAME}`);
          } catch (err: any) {
            console.log(
              `Failed to consume data: ${message} | ID: ${id} | Consumer: ${CONSUMER_NAME}`
            );
          }
          await redis.xack(STREAM_NAME, GROUP_NAME, id);
        }
      }
    } catch (err: any) {
      console.error("Error reading from stream:", err);
    }
  }
};

consume();
