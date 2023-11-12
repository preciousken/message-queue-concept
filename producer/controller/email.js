
const amqp = require('amqplib');

const sendEmail = async (req,res,next) =>{
try {

    let body = req.body;
    // getting the message data
    if(!body.queueId){
        return res.status(400).json({
            status:false,
            message:"please input your queue Id",
        })
    }
    if(!body.data){
        return res.status(400).json({
            status:false,
            message:"please input your message data",
        })
    }


    // Connect to RabbitMQ
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // declare a queue
  await channel.assertQueue(body.queueId);
  // Send message to the queue
  channel.sendToQueue(body.queueId, Buffer.from(JSON.stringify(body.data)));

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