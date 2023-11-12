
const amqp = require('amqplib');

const sendEmail = async (req,res,next) =>{
try {

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

    return res.status(200).json({
        status:true,
        message:"Email sent successfully"
    })
} catch (error) {
    console.log(error)
   return res.json({
        status:false,
        message:"Something completely went wrong"
    })
}
}

module.exports = {
    sendEmail
}