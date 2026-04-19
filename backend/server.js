// server.js create an Express sever :  https://runjs.app/blog/how-to-start-a-node-server

// Get the express library that helps to mkae a web server
const express =require("express");
const db=require('./database'); // connnected to database.js

//Use express to create a server. Name it app.
const app = express();


//Set the door number to 3000.
const port=3000;


app.use(express.json());
//When someone visits the main page, run this small function
app.get('/', (req, res) => {

    //"Send back the message: Hello World!"
    res.send("Hello World!");
});

// create : check-in
app.post('/api/attendance/checkin',(req,res)=>
{
    // receice data from client 
   const {child_name,arrival_time,date}=req.body;

   // check if all data exists (validation)
   if ( !child_name || ! arrival_time || ! date){
    return res.status(400).json({
        error:'child_name,arrival_time,date are required'
        
    });

   }

   res.json({
    message:'Validation passed!',
    received: {child_name,arrival_time,data}
   });
});

// Start the server
app.listen(port,()=>{
    console.log("Server is running"); // Show in terminal
    console.log(` Express server runing at http://localhost:${port}`); // Show address 
});


