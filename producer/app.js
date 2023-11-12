const express = require("express")
const app = express();
const cors = require("cors")
const amqp = require('amqplib');
require("dotenv").config()

// importing middlewares
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 2002
app.listen(port,()=>{
  console.log('app listening on port '+port+'...')
})


async function produceMessage() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'task_queue';

  await channel.assertQueue(queue, { durable: true });

  const message = 'Hello, RabbitMQ!';
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

  console.log(`Message sent: ${message}`);

  setTimeout(() => {
    connection.close();
  }, 500);
}