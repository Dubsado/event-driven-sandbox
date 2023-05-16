import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { STREAM_NAME } from "./config";

dotenv.config({ path: ".env.local" });

const redis = new Redis(process.env.REDIS_URL as string);

const produce = async () => {
  const data = {
    id: uuidv4(),
    timestamp: Date.now(),
  };

  try {
    const id = await redis.xadd(STREAM_NAME, "*", "data", JSON.stringify(data));
    console.log(`Produced data: ${JSON.stringify(data)} | ID: ${id}`);
  } catch (err: any) {
    console.error("Error producing data:", err);
  }
};

setInterval(produce, 1000); // Produce data every 1 second
