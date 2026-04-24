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

   // 2.1 input validation
   if ( !departure_time ){

    //"Bad Request" error (400)
    return res.status(400).json({
        error:'departure_time is required(format:HH:MM)' // HH (Hours),MM (Minutes)
        
    });

   }

   // 2.2 check if record exists (select query) 
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

  
 //2.3 database error occurs, send 500 server error.
     if(err){
        return res.status(500).json({error:err.message});
    }

 
//2.4. Record not found (404)
    // if no record exists with this id, row will be underfined/null
    // return 404 Not Found error 

     if(!row){
        return res.status(404).json({error:`Attendance record with id ${id} not found`});
    }


// 2.5 prevent dupulicate check-out 
    // if the record already has a departure_time(already checked out)
    // Return 400 Bad request error to prevent double check-out

    if(row.departure_time){
      return res.status(400).json({error:`Already checked out at ${row.departure_time} `});
    }


//2.6 update query     
        const updatesql=`UPDATE attendance SET departure_time=? WHERE id=?;`
   
   //Run the SQL query with the actual values
   db.run(updatesql,[departure_time,id],function(err){

//2.7 database error occurs, send 500 server error.
    if(err){
        return res.status(500).json({error:err.message})
    }

//2.8 fetch the updated record 
    // after successful update, query the database again to get 
    // the complte updated record ( including arrival_time)

    db.get(`SELECT*FROM attendance WHERE id=?`,[id],(err,updatedRow)=>{

//2.9 error after update 
 if(err){
    return res.status(500).json({error:err.message});
 }        


//2.10 successful, send back 200 (update) with the new data and success message.
   res.status(200).json({
    success:true,
    message:'✅ Check-out successful',
    record:updatedRow
   });
            });
        });
    });
});


/*

curl -X PUT http://localhost:3000/api/attendance/checkout/2 \
  -H "Content-Type: application/json" \
  -d '{"departure_time":"17:00"}'
{"success":true,"message":"✅ Check-out successful","record":{"id":2,"child_name":"Tommy","arrival_time":"09:00","departure_time":"17:00","date":"2026-04-19"}}%                    


user@MacBookAir backend % curl -X PUT http://localhost:3000/api/attendance/checkout/2 \
  -H "Content-Type: application/json" \
  -d '{"departure_time":"17:00"}'
{"error":"Already checked out at 17:00 "}%                  

*/ 


//3.Edit Attendance Time

app.put('/api/attendance/:id',(req,res)=>
{
    // receice data from client 
   const {id}=req.params;
   const {arrival_time,departure_time,date}=req.body;

   // 3.1 check if at least one data exists (validation)
   if ( !arrival_time && ! departure_time && ! date){

    //"Bad Request" error (400)
    return res.status(400).json({
        error:'At least one field (arrival_time,departure_time, or date) is required for update'
        
    });

   }
   // 3.2 check if record exists (select query) 
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

  
 //3.3 database error occurs, send 500 server error.
     if(err){
        return res.status(500).json({error:err.message});
    }

 
//3.4. Record not found (404)
    // if no record exists with this id, row will be underfined/null
    // return 404 Not Found error 

     if(!row){
        return res.status(404).json({error:`Attendance record with id ${id} not found`});
    }

/* 

//3.5 update query     
        const updatesql=`UPDATE attendance SET arrival_time,departure_time,date=? WHERE id=?;`
   
   //Run the SQL query with the actual values
   db.run(updatesql,[arrival_time,departure_time,date],function(err){

# Edit ONLY arrival time (change to 08:30)
curl -X PUT http://localhost:3000/api/attendance/2 \
  -H "Content-Type: application/json" \
  -d '{"arrival_time":"08:30"}'

result

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot PUT /api/attendance/2</pre>
</body>
</html>
user@MacBookAir backend %


why this doesn't work 

Forces ALL fields to update-->Data Loss Occurs
Values: [arrival_time="08:30", departure_time=undefined, date=undefined]
*/

//3.5 Dynamic UPDATE   

 // 3.5.1 create empty array - storage for field names to update 
 let updateFields =[];

 // 3.5.2 create empty array - storage for actual values 

 let updateValues=[];

 // 3.5.3 Check if arrival_time was provided 
 if ( arrival_time !== undefined){
       //Add " column_name=?"" format 
    updateFields.push('arrival_time=?');
    //Add actual value to values array 
    updateValues.push(arrival_time);
 }
        

 // 3.5.4 Check if depature_time was provided 
 if ( departure_time !== undefined){
       //Add " column_name=?"" format 
    updateFields.push('depature_time=?');
    //Add actual value to values array 
    updateValues.push(departure_time);
 }
        


// 3.5.5 Check if date was provided 
 if ( date !== undefined){
       //Add " column_name=?"" format 
    updateFields.push('date=?');

        //Add actual value to values array 
    updateValues.push(date);

 }

//3.5.6 Add ID for WHERE clause to values array 

    updateValues.push(id);


//3.5.7 Dynamically build SQL statement

const updatesql=`UPDATE attendance SET ${updateFields.join(',')} WHERE id=?;`

//3.5.8 Run the SQL query with the actual values
   db.run(updatesql,updateValues,function(err){

//3.6 database error occurs, send 500 server error.
    if(err){
        return res.status(500).json({error:err.message})
    }

//3.7 fetch the updated record 
    // after successful update, query the database again to get 
    // the complte updated record ( including arrival_time)

    db.get(`SELECT*FROM attendance WHERE id=?`,[id],(err,updatedRow)=>{

//3.8 error after update 
 if(err){
    return res.status(500).json({error:err.message});
 }        


//2.10 successful, send back 200 (update) with the new data and success message.
   res.status(200).json({
    success:true,
    message:'✅ Attendance record updated successfully',
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
