// publish.js

const amqp = require('amqplib/callback_api');

// RabbitMQ connection URL
const url = 'amqp://localhost';

// Message to publish
const message = 'Hello RabbitMQ!';

// Connect to RabbitMQ server
amqp.connect(url, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  // Create channel
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    const queue = 'Gurucool';
    // Declare queue
    channel.assertQueue(queue, {
      durable: true
    });
    // Publish message to queue
    channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true
    });
    console.log(`Message '${message}' sent to queue '${queue}'`);
  });
});
