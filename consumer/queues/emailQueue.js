const amqp = require('amqplib');

const queueEmail =  async (queueId,data) =>{
    const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = queueId;

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

module.exports = {queueEmail}