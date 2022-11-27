const express = require('express');
const app = express();
const amqp = require('amqplib');
app.use(express.json());

var connection , channel;




async function connect()
{
  try {
    const amqS = "amqp://localhost:5672",
    connection = await amqp.connect(amqS);
    channel = await connection.createChannel();
    await channel.assertQueue("rabbit");
    console.log("Hi");





  } catch (e) {

    console.log(e);

  }

}

connect();



app.post('/send' , async(req , res) => {

  console.log(req.body);
  const job = {
   job : req.body.job,
   priority: req.body.priority,
   timestamp : new Date(new Date().getTime() + 4*60*60*1000).toLocaleTimeString(),
   dep: req.body.dep,
  }


try {

  await channel.sendToQueue("rabbit", Buffer.from(JSON.stringify(job)));

 return res.send("done");

} catch (e) {
  console.log(e);

}


})











app.listen(5000, () => {
   console.log('Listening on port 3000!!!!!!!!');
 });
