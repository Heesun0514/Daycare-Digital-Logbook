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
        return;
    }

    try { 
        //3. send the "Package " (JSON) to the server 
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

// ============== 2.CHECK-OUT (UPDATE) ====================

async function checkout(){

     //1. grab the values from the input boxes 
    const id =document.getElementById('checkoutId').value; // ✅ fixed: 'checkoutId'
    const departure_time =document.getElementById('departureTime').value;
    

    //2. simple check : if any box is empty, stop and tell the user 
    if (!id || !departure_time){
        alert('Please enter Record ID and Departure Time')
        return;
    }

    try { 
        //3. send the "Package " (JSON) to the server 
          // ✅ fixed: URL includes ID parameter
        const response = await fetch (`http://localhost:3000/api/attendance/checkout/${id}`,{
        method:'PUT', // update the data
        headers:{'Content-type':'application/json'}, // JSOM format 
        body:JSON.stringify({departure_time}) //converts the javascript object into a JSON string
    });

     //4. open the response from the server
     const result =await response.json(); // converts the server's response back into a JS object 
     

         // ✅ fixed: success status is 200, not 201
     if (response.status===200){
        // sucess ! show a green checkmark and the name 
        document.getElementById('checkoutResult').innerHTML=`✅ Check-out sucessful! record ID:${id} at ${departure_time}`;
        loadTodayAttendance(); // Update the list 

        } else { // the server said no (e.g.,missing data )
            document.getElementById('checkoutResult').innerHTML=`❌ Error:${result.error} `;
        }
     } catch(error){ // the internet failed or the server is turned off 
        document.getElementById('checkoutResult').innerHTML=` ❌ Connection error: ${error.message}`;

}
}

// ============== 3.Today's Attendance ( READ ) ====================

async function loadTodayAttendance(){

     //1. get today's date in YYYY-MM-DD format
      // Original String: 2026-05-14 T 12:57:53.123Z
      // After .split('T'): ["2026-05-14", "12:57:53.123Z"]
      // After [0]: "2026-05-14"
    const today=new Date().toISOString().split('T')[0];
    

    //2. convert to DD-MM-YYYY for backend
      // Original	"2026-05-14"
      // Split	["2026", "05", "14"]
      // Assign	year="2026", month="05", day="14"
      // Re-format	"14-05-2026"
    
    const[year,month,day]=today.split('-');
    const todayFormatted=`${day}-${month}-${year}`

 

    try { 
        //3. send the "Package " (JSON) to the server 
        
        const response = await fetch (`http://localhost:3000/api/attendance/report?from=${todayFormatted}&to=${todayFormatted}`,{
        
            // no need method,headers, or body because this function is fetching(READING)data,not sending or updating
    });

     //4. open the response from the server
     const result =await response.json(); // converts the server's response back into a JS object 
     

         
     if (response.status===200){
        // sucess ! 
        // Extracts the attendance list from the result. 
        // If no records exist, it defaults to an empty array.

        const record=result.record || [];

         //5. show message if no records 
        if (records.length===0){
            document.getElementById('todayAttendance').innerHTML='<p> 📭 No attendenace records for today.</p>'
            return;
        }

        //6. Build HTML table 
         //Initializes a string to hold HTML table code and adds the header row.
       let html = '<table border="1" cellpadding="5" style="border-collapse: collapse;">';
            html += '<tr style="background-color: #f2f2f2;">';
            html += '<th>ID</th><th>Name</th><th>Arrival</th><th>Departure</th><th>Status</th>';
            html += '</tr>';
            

         // 7. Add each child to table    
        records.forEach(record=>{
            const status =record.departure_time ? '✅ Departed' : '🟢 Present';
            html += `<tr>
            <td>${record.id}</td>
            <td>${record.child_name}</td>
            <td>${record.arrival_time}</td>
            <td>${record.departure_time}</td>
              <td>${status}</td>
            </tr>`;
    
        });

        html +='</table>'
        document.getElementById('todayAttendance').innerHTML=html;
       
    }
     } catch(error){  
        document.getElementById('todayAttendance').innerHTML=` ❌ Error loading attendance: ${error.message}`;

}
}



// ============== 4.Edit Attendance Time( UPDATE ) ====================

async function editAttendanceTime(){

     //1. grab the values from the input boxes 
    const id =document.getElementById('editId').value; 
    const arrival_time =document.getElementById('editArrival').value;
    const departure_time=document.getElementById('editDeparture').value;
    const date=document.getElementById('editDate').value;
    

    //2. simple check : at least one field to update 

    if (!id){
        alert('Please enter Record ID');
    }
    if (!child_name && ! arrival_time && !date){
        alert('Please enter at least one field to update (arrival,departure,or date')
        return;
    }

    // 3. Build dynamic update object( only include fields that are provided )
    const updateData={}; // create empty object {key:value}
    if (arrival_time)updateData.arrival_time=arrival_time;
    if(departure_time)updateData.departure_time=departure_time;
    if(date)updateData.date=date;


    if(Object.keys(updateData).length===0){ // key:value ['arrival_time', 'date']
        alert('Please enter at least one field to update');
        return;
    }

    try { 
        //4. send the "Package " (JSON) to the server 
          
        const response = await fetch (`http://localhost:3000/api/attendance/${id}`,{
        method:'PUT', // update the data
        headers:{'Content-type':'application/json'}, // JSOM format 
        body:JSON.stringify({updateData}) //converts the javascript object into a JSON string
    });

     //5. open the response from the server
     const result =await response.json(); // converts the server's response back into a JS object 
     

        
     if (response.status===200){
        // sucess ! show a green checkmark and the name 
        document.getElementById('editResult').innerHTML=`✅ Updated sucessful! record ID:${id}`;
        loadTodayAttendance(); // Update the list 

        } else { // the server said no (e.g.,missing data )
            document.getElementById('editResult').innerHTML=`❌ Error:${result.error} `;
        }
     } catch(error){ // the internet failed or the server is turned off 
        document.getElementById('editResult').innerHTML=` ❌ Connection error: ${error.message}`;

}
}