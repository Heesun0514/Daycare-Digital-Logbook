const db=require('./database');
// Add test data with auto-generated parent emails 

db.serialize(()=>{
    const today = new Date().toISOString().split('T')[0];

    const testData=[
        { child_name: 'Emma Johnson', arrival_time: '09:00', departure_time: '17:00', date: today },
        { child_name: 'Liam Smith', arrival_time: '09:15', departure_time: null, date: today },
        { child_name: 'Olivia Brown', arrival_time: '09:30', departure_time: null, date: today },
        { child_name: 'Noah Davis', arrival_time: '10:00', departure_time: '16:30', date: today }

    ];

    
})