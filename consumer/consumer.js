const express = require("express")
const app = express();
const cors = require("cors")
const amqp = require('amqplib');
const { queueEmail } = require("./queues/emailQueue");
require("dotenv").config();

// importing middlewares
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 2003
app.listen(port,()=>{
  console.log('app listening on port '+port+'...')
})


async function emailConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'task_queue';

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  console.log(`Waiting for messages. To exit, press CTRL+C`);

  channel.consume(queue, (msg) => {
    const message = msg.content.toString();
    console.log(`Received message: ${message}`);

    // Simulate task processing
    setTimeout(() => {
      console.log(`Task completed: ${message}`);
      channel.ack(msg);
    }, 1000);
  });
}
emailConsumer()