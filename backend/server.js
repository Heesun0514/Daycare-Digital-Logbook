// server.js create an Express sever :  https://runjs.app/blog/how-to-start-a-node-server

// Get the express library that helps to mkae a web server
const express =require("express");
const db=require('./database'); // connnected to database.js

//Use express to create a server. Name it app.
const app = express();


//Set the door number to 3000.
const port=3000;


//When someone visits the main page, run this small function
app.get('/', (req, res) => {

    //"Send back the message: Hello World!"
    res.send("Hello World!");
});

// create : check-in
app.post('/api/attendance/checkin',(req,res)=>
{
   const {child_name,arrival_time,date}=req.body;

   // temporary check if received 

   res.json({
    message:'Checkin API workds',
    received: {child_name,arrival_time,date}
   });
});

// Start the server
app.listen(port,()=>{
    console.log("Server is running"); // Show in terminal
    console.log(` Express server runing at http://localhost:${port}`); // Show address 
});


