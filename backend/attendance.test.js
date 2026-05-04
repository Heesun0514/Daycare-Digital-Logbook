const request=require('supertest');
const express =require("express");
const db=require('./database'); // connnected to database.js

//Use express to create a server. Name it app.
const app = express();

// create a test app 
app.use(express.json()) 



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
how to test using Chatgpt
curl -X PUT http://localhost:3000/api/attendance/checkout/2 \
  -H "Content-Type: application/json" \
  -d '{"departure_time":"17:00"}'
{"success":true,"message":"✅ Check-out successful","record":{"id":2,"child_name":"Tommy","arrival_time":"09:00","departure_time":"17:00","date":"2026-04-19"}}%                    


user@MacBookAir backend % curl -X PUT http://localhost:3000/api/attendance/checkout/2 \
  -H "Content-Type: application/json" \
  -d '{"departure_time":"17:00"}'
{"error":"Already checked out at 17:00 "}%                  

*/ 


//3.Update (put) : Edit Attendance Time

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

how to test using Chatgpt
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
    updateFields.push('departure_time=?');
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


//3.10 successful, send back 200 (update) with the new data and success message.
   res.status(200).json({
    success:true,
    message:'✅ Attendance record updated successfully',
    record:updatedRow
   });
            });
        });
    });
});

/*

how to test using Chatgpt
user@MacBookAir backend % curl -X PUT http://localhost:3000/api/attendance/2 \
  -H "Content-Type: application/json" \
  -d '{"arrival_time":"08:30"}'
{"success":true,"message":"✅ Attendance record updated successfully","record":{"id":2,"child_name":"Tommy","arrival_time":"08:30","departure_time":"17:00","date":"2026-04-19"}}%     

*/



//4. Read (get): generate report 

app.get('/api/attendance/report',(req,res)=>{

// 4.1 Get query parameters from URL
    // req.query.filtering, sorting, or searching data.
const {from,to} = req.query;

// 4.2 Input validation - check if both exsit 
if (!from || ! to) {
    return res.status(400).json({
        error:'Both "from" and "to" dates are requried'
    });
}

//4.3 Date format Validation (DD-MM-YYYY)
    //Uses a Regular Expression (Regex) to ensure the dates follow the DD-MM-YYYY format.

    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(from) || !dateRegex.test(to)) {
        return res.status(400).json({
            error: 'Invalid date format. Use DD-MM-YYYY. Example: 24-04-2026'
        });
    }
    


// 4.4 SQL query 

const sql=`
        SELECT * FROM attendance 
        where   date BETWEEN ? AND ?
        ORDER BY date ASC, child_name ASC 
    `

db.all(sql,[from,to],(err,rows)=>{ 

  
 //4.4.1 database error occurs, send 500 server error.
     if(err){
        return res.status(500).json({error:err.message});
    }

 
//4.4.2 check if any records found 
     if(rows.length===0){
        return res.status(200).json({ 
            message: `No attendance record found from ${from} to ${to}`,
       
    });
    }


 res.status(200).json({
    success:true,
    message:`✅ Report generated for ${from} to ${to}`,
    record:rows

});
});
});
    

// ========== TESTS START HERE ==========

// clean datatbase before each test 
beforeEach((done) => {
    db.run('DELETE FROM attendance', () => {
        done();
    });
});


// close database after all tests 

afterAll((done)=>{
    db.close(()=>{
        done();
    });
});

// ------------------------------------------------------------
// 1. CHECK-IN (CREATE) Tests
// ------------------------------------------------------------

describe('✅ CHECK-IN (CREATE) Tests',()=>{
    test('T-01: Success - Valid check-in with all data',async()=>{
        const response = await request(app)
        .post('/api/attendance/checkin')
        .send({
            child_name:"Tommy",
            arrival_time:'09:00',
            date:'2026-05-04'
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.child_name).toBe('Tommy');
        expect(response.body.message).toContain('✅ Check-in successful');

    });

    test('T-02: Fail - Missing child_name',async()=>{
        const response = await request(app)
        .post('/api/attendance/checkin')
        .send({
            arrival_time:'09:00',
            date:'2026-05-04'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('required');

})

  test('T-03: Fail - Missing arrival_time',async()=>{
        const response = await request(app)
        .post('/api/attendance/checkin')
        .send({
            child_name:"Tommy",
            date:'2026-05-04'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('required');

})

  test('T-04: Fail - Missing date',async()=>{
        const response = await request(app)
        .post('/api/attendance/checkin')
        .send({
            arrival_time:'09:00',
            child_name:"Tommy",

        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('required');

});
});



// ------------------------------------------------------------
// 2. CHECK-OUT (UPDATE) Tests
// ------------------------------------------------------------


describe('✅ CHECK-OUT (UPDATE) Tests', () => {
    
    // Helper function to create a test check-in
    async function createCheckin(name = 'Tommy', time = '09:00', date = '2026-05-04') {
        return await request(app)
            .post('/api/attendance/checkin')
            .send({ child_name: name, arrival_time: time, date });
    }

    test('TC-05: Success - Valid check-out', async () => {
        // 1. Create check-in first
        const checkinRes = await createCheckin();
        const id = checkinRes.body.id;
        
        // 2. Execute check-out
        const response = await request(app)
            .put(`/api/attendance/checkout/${id}`)
            .send({ departure_time: '17:00' });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.record.departure_time).toBe('17:00');
    });

    test('TC-06: Fail - Non-existent ID', async () => {
        const response = await request(app)
            .put('/api/attendance/checkout/99999')
            .send({ departure_time: '17:00' });
        
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toContain('not found');
    });

    test('TC-07: Fail - Missing departure_time', async () => {
        const checkinRes = await createCheckin();
        const id = checkinRes.body.id;
        
        const response = await request(app)
            .put(`/api/attendance/checkout/${id}`)
            .send({});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('departure_time is required');
    });

    test('TC-08: Fail - Prevent duplicate check-out', async () => {
        // 1. Create check-in
        const checkinRes = await createCheckin();
        const id = checkinRes.body.id;
        
        // 2. First check-out
        await request(app)
            .put(`/api/attendance/checkout/${id}`)
            .send({ departure_time: '17:00' });
        
        // 3. Second check-out attempt (should fail)
        const response = await request(app)
            .put(`/api/attendance/checkout/${id}`)
            .send({ departure_time: '18:00' });
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('Already checked out');
    });
});

// ------------------------------------------------------------
// 3. EDIT ATTENDANCE (Dynamic Field Update) Tests
// ------------------------------------------------------------

describe('✅ EDIT ATTENDANCE (Dynamic Field Update) Tests', () => {
    
    // Helper function to create a test check-in
    async function createCheckin(name = 'Tommy', time = '09:00', date = '2026-05-04') {
        return await request(app)
            .post('/api/attendance/checkin')
            .send({ child_name: name, arrival_time: time, date });
    }

    test('TC-09a: Update arrival_time when NO departure_time', async () => {
        // 1. Create check-in first
        const checkinRes = await createCheckin(); // department_time=NULL
        const id = checkinRes.body.id;
        
        // 2. Execute check-out
        const response = await request(app)
            .put(`/api/attendance/${id}`)
            .send({ arrival_time: '08:30' });
        
        expect(response.body.record.arrival_time).toBe('08:30');
        expect(response.body.record.departure_time).toBeNull();
    });

     test('TC-09b: Update arrival_time when department_time ALREADY EXISTS', async () => {
        // 1. Create check-in first
        const checkinRes = await createCheckin(); // department_time=NULL
        const id = checkinRes.body.id;
        
        // 2. Execute check-out
        await request(app)
            .put(`/api/attendance/checkout/${id}`)
            .send({ departure_time: '17:00' });
        
        // 3.  Update arrival_time 
        const response = await request(app)
            .put(`/api/attendance/${id}`)
            .send({ arrival_time: '08:30' });
        

        expect(response.body.record.arrival_time).toBe('08:30');
        expect(response.body.record.departure_time).toBe('17:00');
    });

 test('TC-10: Update only departure_time', async () => {
        // 1. Create check-in first
        const checkinRes = await createCheckin(); 
        const id = checkinRes.body.id;
        
        
        // 2.  Update departure_time
        const response = await request(app)
            .put(`/api/attendance/${id}`)
            .send({ departure_time: '16:30' });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.record.departure_time).toBe('16:30');

        // arrival_time should remain 08:30
        expect(response.body.record.arrival_time).toBe('09:00');
    });


test('TC-11: Update only date', async () => {
      
        const checkinRes = await createCheckin(); 
        const id = checkinRes.body.id;
        
        
       
        const response = await request(app)
            .put(`/api/attendance/${id}`)
            .send({ date:'2026-05-05' });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.record.date).toBe('2026-05-05');
    
    });

test('TC-12: Update all fields at once', async () => {
      
        const checkinRes = await createCheckin(); 
        const id = checkinRes.body.id;
        
        
       
        const response = await request(app)
            .put(`/api/attendance/${id}`)
            .send({ arrival_time: '08:00',
                departure_time: '16:00',
                date: '2026-05-06'});
        
        expect(response.statusCode).toBe(200);
        expect(response.body.record.arrival_time).toBe('08:00');
        expect(response.body.record.departure_time).toBe('16:00');
        expect(response.body.record.date).toBe('2026-05-06');
    
    });


    test('TC-13: Fail - No fields to update', async () => {
      
        const checkinRes = await createCheckin(); 
        const id = checkinRes.body.id;
        
        
       
        const response = await request(app)
            .put(`/api/attendance/${id}`)
            .send({});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('At least one field');
    
    });


    test('TC-14: Fail - update non-exsitent ID', async () => {
      
        const checkinRes = await createCheckin(); 
        const id = checkinRes.body.id;
        
        
       
        const response = await request(app)
            .put(`/api/attendance/999999`)
            .send({arrival_time:'08:00'});
        
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toContain('not found');
    
    });

// ------------------------------------------------------------
// 4. READ (REPORT) Tests
// ------------------------------------------------------------

describe( 'READ (REPORT) Test ',()=>{
    test('TC-15 :✅ Should return records within date range',async()=>{
        //create test data

        await request(app)
        .post('/api/attendance/checkin')
        .send({child_name: 'Milla', arrival_time: '09:00', date: '04-05-2026'})

        await request(app)
        .post('/api/attendance/checkin')
        .send({child_name: 'Milla', arrival_time: '09:00', date: '05-05-2026'})



        //Request a report for May 4th only (single day range)
        const response= await request(app)

         // chaged DD-MM-YYYY
        .get('/api/attendance/report?from=04-05-2026&to=04-05-2026') 

        expect(response.statusCode).toBe(200);

        //Verify only 1 record is returned (May 4th record, not May 5th)
        expect(response.body.record.length).toBe(1);
    });


    test('TC-16 :✅ Should return records within date range',async()=>{
        //create test data

        await request(app)
        .post('/api/attendance/checkin')
        .send({child_name: 'Milla', arrival_time: '09:00', date: '04-05-2026'})

        await request(app)
        .post('/api/attendance/checkin')
        .send({child_name: 'Milla', arrival_time: '09:00', date: '05-05-2026'})



        //Request a report for May 4th only (single day range)
        const response= await request(app)

         // chaged DD-MM-YYYY
        .get('/api/attendance/report?from=04-05-2026&to=04-05-2026') 

        expect(response.statusCode).toBe(200);

        //Verify only 1 record is returned (May 4th record, not May 5th)
        expect(response.body.record.length).toBe(1);
    });








});
   


});