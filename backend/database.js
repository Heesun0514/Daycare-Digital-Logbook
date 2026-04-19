
//https://www.youtube.com/watch?v=Cv0LdP_B5aI

/*
"I used SQLite because it’s a serverless database.
 It’s perfect for this prototype because it ensures data integrity 
 (like keeping child records organized) while staying lightweight.
  It makes the app easier to deploy and test as a proof-of-concept."
*/

const sqlite3=require('sqlite3').verbose()
const dbName='myDatabse.db'

let db=new sqlite3.Database(dbName,(err)=>{
    if(err){
        console.error(err.message)
    }
    {
        console.log("Connected to the Database")
        db.run('Create table if not exists itmes.'
            (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_name TEXT NOT NULL,
      arrival_time TEXT,
      departure_time TEXT,
      date TEXT NOT NULL
    )
        );
    }
});
module.exports= db