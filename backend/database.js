
//https://www.youtube.com/watch?v=Cv0LdP_B5aI

//https://nodejs.org/api/sqlite.html

/*
"I used SQLite because it’s a serverless database.
 It’s perfect for this prototype because it ensures data integrity 
 (like keeping child records organized) while staying lightweight.
  It makes the app easier to deploy and test as a proof-of-concept."
*/


// Import sqlite3 with verbose mode for detailed logs
const sqlite3=require('sqlite3').verbose()

// Import path module to handle file paths
const path = require('path');

// Create or connect to database file in current folder
const db=new sqlite3.Database(path.join(__dirname,'daycare.db'),(err)=>{
    if(err){
        console.error('❌ Database connection error:',err.message)
    }else 
    {
        console.log("✅ Connected to daycare.db");
    }

});

// Execute SQL commands in sequence
db.serialize(()=>{
    // Create table if it doesn't exist

    db.run(`
      CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_name TEXT NOT NULL,
      arrival_time TEXT,
      departure_time TEXT,
      date TEXT NOT NULL
    )
      `,(err)=>{
        if(err){
            console.error('❌ Table creation error:', err.message);
        }else {
            console.log('✅ Attendance table ready');
        }
    });
});


// Create parent_child table to link parents with their children 
db.run(`
    CREATE TABLE IF NOT EXISTS parent_child(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_email TEXT NOT NULL,
    child_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_email,child_name)
    )
    `,(err)=>{
        if(err){
            console.error('❌ Parent-child table creation error:', err.message);
        } else {
            console.log('✅ Parent-child relationship table ready');
        }
    })

    // insert sample data for testing 






module.exports= db;