// API BAse URL

const API_BASE='http://localhost:3000/api/attendance';


// ============== 1.CHECK-IN (CREATE) ====================

async function checkin(){

     //1. grab the values from the input boxes 
    const child_name=document.getElementById('childName').value;
    const arrival_time=document.getElementById('arrivalTime').value;
    const date=document.getElementById('checkinDate').value;

    //2. simple check : if any box is empty, stop and tell the user 
    if (!child_name || ! arrival_time || !date){
        alert('Please fill all fields')
        return
    }

    try { 
        //3. send teh "Package " (JSON) to the server 
        const response = await fetch ('http://localhost:3000/api/attendance/checkin',{
        method:'POST', // create new data
        headers:{'Content-type':'application/json'}, // JSOM format 
        body:JSON.stringify({child_name,arrival_time,date}) //converts the javascript object into a JSON string
    });

     //4. open the response from the server
     const result =await response.json(); // converts the server's response back into a JS object 
     
     if (response.status===201){
        // sucess ! show a green checkmark and the name 
        document.getElementById('checkinResult').innerHTML=`✅ Check-in sucessful! Id:${result.id},Name:${result.child_name}`;
        loadTodayAttendance(); // Update the list 

        } else { // the server said no (e.g.,missing data )
            document.getElementById('checkinResult').innerHTML=`❌ Error:${result.error} `;
        }
     } catch(error){ // the internet failed or the server is turned off 
        document.getElementById('checkinResult').innerHTML=` ❌ Connection error: ${error.message}`;

}


}