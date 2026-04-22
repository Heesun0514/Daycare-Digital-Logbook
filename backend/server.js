// server.js create an Express sever :  https://runjs.app/blog/how-to-start-a-node-server

// Get the express library that helps to make a web server
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

   // 1. check if all data exists (validation)
   if ( !child_name || ! arrival_time || ! date){

    //"Bad Request" error (400)
    return res.status(400).json({
        error:'child_name,arrival_time,date are required'
        
    });

   }

   // 2. Save to database 
                //The ? symbols are placeholders that keep the database safe from hackers (SQL injection).
   const sql=`INSERT INTO attendance(child_name,arrival_time,date)VALUES(?,?,?);`
   
   //Run the SQL query with the actual values
   db.run(sql,[child_name,arrival_time,date],function(err){

    //If database error occurs, send 500 server error.
    if(err){
        return res.status(500).json({error:err.message})
    }

   //If successful, send back 201 (created) with the new data and success message.
   res.status(201).json({
    id:this.lastID,
    child_name,
    arrival_time,
    date,
    message:'✅ Check-in successful'
   });
});

});


// Start the server
app.listen(port,()=>{
    console.log("Server is running"); // Show in terminal
    console.log(` Express server runing at http://localhost:${port}`); // Show address 
});
