
const express = require('express');
const app = express();
const amqp = require('amqplib');

const mysql = require('mysql2');

var connection , channel;


const db = require('./models');

const Job = db.models.Job;



app.use(express.json());


(async () => {
    await db.sequelize.sync();
    // await db.sequelize.drop();



})();








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

connect().then(() => {

  channel.consume("rabbit" , async(data) => {
    const data11 = JSON.parse(data.content);
    const ui =await  Job.create({
              Job: data11.job,
              priority: data11.priority,
              timestamps: data11.timestamp,
              dep: data11.dep,
          })

          ui.save({fields: ['Job' , 'priority' , 'timestamps' , 'dep']});



    channel.ack(data);
  })




})


function findIndexofJob(val , requiredOutput)
{
  for(var i = 0; i < requiredOutput.length; i++)
  {
    if(requiredOutput[i].job == val)
    {
      return i;
    }

  }


}
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

function checkForDependency(requiredOutput)
{
  for(var i = 0; i < requiredOutput.length; i++)
  {
    if(requiredOutput[i].dep != "nil")
    {
      array_move(requiredOutput , i , findIndexofJob(requiredOutput[i].dep , requiredOutput))
      break;
    }

  }
console.log(requiredOutput);
  return requiredOutput
}



app.get("/jobs" , async(req , res) => {
  const jobs = await Job.findAll({raw : true});



  const requiredOutput = jobs.map((jo) => {
    return {
      job: jo.Job,
      priority:jo.priority,
      timestamps: jo.timestamps,
      dep: jo.dep,

    }
  })


  requiredOutput.sort(function (a, b) {
      if (a.priority < b.priority)
      {
          return -1;
      }
      else if (a.priority > b.priority)
      {
          return 1;
      }

  });

  const ui = checkForDependency(requiredOutput);


  return res.send(ui);

})


app.listen(3000, () => {
   console.log('Listening on port 3000!!!!!!!!');
 });
