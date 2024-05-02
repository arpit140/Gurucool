

const amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    const queue = 'Gurucool';
    
    channel.assertQueue(queue, {
      durable: true
    });
    console.log(`Worker process is waiting for messages in ${queue}`);

    channel.consume(queue, (msg) => {
      const content = msg.content.toString();
      console.log(`Worker process received message: ${content}`);
      
      setTimeout(() => {
        console.log(`Worker process processed message: ${content}`);
        channel.ack(msg); 
      }, 1000);
    }, {
      noAck: false
    });
  });
});
