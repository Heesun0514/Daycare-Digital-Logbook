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

// 1.create (post) Adds new data : check-in
app.post('/api/attendance/checkin',(req,res)=>
{
    // receice data from client 
   const {child_name,arrival_time,date}=req.body;

   // 1.1 check if all data exists (validation)
   if ( !child_name || ! arrival_time || ! date){

    //"Bad Request" error (400)
    return res.status(400).json({
        error:'child_name,arrival_time,date are required'
        
    });

   }

   // 1.2 Save to database 
                //The ? symbols are placeholders that keep the database safe from hackers (SQL injection).
   const sql=`INSERT INTO attendance(child_name,arrival_time,date)VALUES(?,?,?);`
   
   //Run the SQL query with the actual values
        //db.run "writing" or "modifying (INSERT,UPDATE,DELETE)
   db.run(sql,[child_name,arrival_time,date],function(err){ //Callback Function,asynchronous

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






// 2.Update (put) Modifies exiting data : check-out
app.put('/api/attendance/checkout/:id',(req,res)=> 
{
    
    const {id}=req.params; // UPDATED: Get ID from URL //req.params = WHO/WHICH (identifier)
    const {departure_time }=req.body; //req.body = WHAT (data/value)

   // 1.input validation
   if ( !departure_time ){

    //"Bad Request" error (400)
    return res.status(400).json({
        error:'departure_time is required(format:HH:MM)' // HH (Hours),MM (Minutes)
        
    });

   }

   // 2. check if record exists (select query) 
   // Before updating, first check if there is an attendance record with the given ID. 
   // The ? is a placeholder for the id value 

    const checksql=`SELECT*FROM attendance WHERE id=?`;

//db.get returns a single Object

// err (The Error Object)
// Callback Function,asynchronous
// It allows us to handle technical failures instead of letting the whole server crash.


//row (The Result Object):
    // This gives us access to the actual data so we can check if the person has already checked out
    // db.get "reading" data (SELECT),

    db.get(checksql,[id],(err,row)=>{ 

  
 //3. database error occurs, send 500 server error.
     if(err){
        return res.status(500).json({error:err.message});
    }

 
//4. Record not found (404)
    // if no record exists with this id, row will be underfined/null
    // return 404 Not Found error 

     if(!row){
        return res.status(404).json({error:`Attendance record with id ${id} not found`});
    }


// 5. prevent dupulicate check-out 
    // if the record already has a departure_time(already checked out)
    // Return 400 Bad request error to prevent double check-out

    if(row.departure_time){
      return res.status(400).json({error:`Already checked out at ${row.departure_time} `});
    }

//6. update query     
        const updatesql=`UPDATE attendance SET departure_time=? WHERE id=?;`
   
   //Run the SQL query with the actual values
   db.run(updatesql,[departure_time,id],function(err){

//7.  database error occurs, send 500 server error.
    if(err){
        return res.status(500).json({error:err.message})
    }

//8. fetch the updated record 
    // after successful update, query the database again to get 
    // the complte updated record ( including arrival_time)

    db.get(`SELECT*FROM attendance WHERE id=?`,[id],(err,updatedRow)=>{

//9 error after update 
 if(err){
    return res.status(500).json({error:err.message});
 }        


// 10. successful, send back 200 (update) with the new data and success message.
   res.status(200).json({
    success:true,
    message:'✅ Check-out successful',
    record:updatedRow
   });
            });
        });
    });
});







// Start the server
app.listen(port,()=>{
    console.log("Server is running"); // Show in terminal
    console.log(` Express server runing at http://localhost:${port}`); // Show address 
});
