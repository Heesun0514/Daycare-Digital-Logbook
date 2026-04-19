// server.js create an Express sever :  https://runjs.app/blog/how-to-start-a-node-server

// Impiort the express library that helps to mkae a web server
import express from "express";

//Use express to create a server. Name it app.
const app = express();


//Set the door number to 3000.
const port=3000;


//When someone visits the main page, run this small function
app.get('/', (req, res) => {

    //"Send back the message: Hello World!"
    res.send("Hello World!");
});


// Start the server
app.listen(port,()=>{
    console.log("Server is running"); // Show in terminal
    console.log(` Express server runing at http://localhost:${3000}`); // Show address 
});