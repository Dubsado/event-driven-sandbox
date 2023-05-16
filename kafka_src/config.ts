import dotenv from "dotenv";
import { Kafka } from "kafkajs";
dotenv.config({ path: __dirname + "/../.env.local" });

function exit(msg = "") {
  console.error("missing environment variable " + msg);
  process.exit(1);
  return msg;
}

export const KAFKA_BROKERS = [(process.env.KAFKA_BROKER_0 as string) || exit("kafka broker")];
export const KAFKA_CLIENT_ID = "contract-migration-consumer";
export const KAFKA_TOPIC = "contract_migration";
export const KAFKA_USERNAME = process.env.KAFKA_USERNAME || exit("kafka username");
export const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD || exit("kafka password");

export const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  sasl: {
    mechanism: "scram-sha-256",
    username: KAFKA_USERNAME,
    password: KAFKA_PASSWORD,
  },
  ssl: true,
});
