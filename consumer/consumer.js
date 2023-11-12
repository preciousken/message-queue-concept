const express = require("express")
const app = express();
const cors = require("cors")
const amqp = require('amqplib');
require("dotenv").config();

// importing middlewares
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 2003
app.listen(port,()=>{
  console.log('app listening on port '+port+'...')
})

app.post("/consume-queue",async = (req,res)=>{
try {
  let body = req.body;

  
  if(!body.queueId){
    return req.status(500).json({
      status:false,
      message:"input your queueId"
    })
  }
} catch (error) {
  console.log(error)
}
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