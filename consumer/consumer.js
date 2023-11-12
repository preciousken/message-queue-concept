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


// message queue for sending of emails
async function emailConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'sendemail';

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  // message queue starts waiting here for incoming messages

  channel.consume(queue, (msg) => {

    const data = msg.content.toString();
    const {message} = JSON.parse(data)

    console.log(message)
    channel.ack(msg);

  });
}
emailConsumer()


