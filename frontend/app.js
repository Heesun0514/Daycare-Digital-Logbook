// API BAse URL

const API_BASE='http://localhost:3000/api/attendance';


// ============== 1.CHECK-IN (CREATE) ====================

async function checkin(){
    const child_name=document.getElementById('childName').value;
    const arrival_time=document.getElementById('arrivalTime').value;
    const date=document.getElementById('checkinDate').value;

    // validation 
    if (!child_name || ! arrival_time || !date){
        alert('Please fill all fields')
        return
    }

    



}