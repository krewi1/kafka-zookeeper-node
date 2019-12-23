const express = require("express");
const { Kafka } = require("kafkajs");
const bodyParser = require("body-parser");
const config = require("./config/config");
const zookeeper = require("./zookeeper/zookeeper");
const app = express();
const port = 3000;

const topic1 = "test-topic";
const topic2 = "test";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: config.kafka.split(",")
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });

const promises = [
  producer.connect(),
  consumer.connect(),
  zookeeper.getClient()
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
  await Promise.all(promises);
  await zookeeper.init();
  await zookeeper.watch();

  app.post("/topic1", async (req, res) => {
    const { message } = req.body;
    await producer.send({
      topic: topic1,
      messages: [
        {
          value: message
        }
      ]
    });
    res.send("Zprava odeslana");
  });

  app.post("/topic2", async (req, res) => {
    const { message } = req.body;
    await producer.send({
      topic: topic2,
      messages: [
        {
          value: message
        }
      ]
    });
    res.send("Zprava odeslana");
  });

  app.post("/zookeeper", async (req, res) => {
    const { data, node } = req.body;
    try {
      await zookeeper.write(`/test/${node}`, data);
    } catch (e) {
      res.status(403).send(e.message);
      return;
    }
    res.send("save to zookeeper");
  });

  await consumer.subscribe({ topic: topic1, fromBeginning: true });
  await consumer.subscribe({ topic: topic2, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString()
      });
    }
  });
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();
