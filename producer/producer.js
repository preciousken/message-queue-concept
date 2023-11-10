const amqp = require('amqplib');

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

produceMessage();
