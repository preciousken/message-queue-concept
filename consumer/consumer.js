const express = require("express")
const app = express();
const cors = require("cors")
const amqp = require('amqplib');
// const { queueEmail } = require("./queues/emailQueue");
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
  try {
    const connection = await amqp.connect(process.env.LOCAL_MESSAGE_QUEUE_URL);
  const channel = await connection.createChannel();
  const queue = 'sendemail';

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  // message queue starts waiting here for incoming messages

  channel.consume(queue, (msg) => {

    const data = msg.content.toString();
    const {message,receiverEmail} = JSON.parse(data)
    console.log(message)

    /**
     * @param 
     * insert your function here to send {message} to {receiverEmail}
     */
    
    channel.ack(msg);

  });
  } catch (error) {
    console.log('.....',error)
  }
}
emailConsumer()


