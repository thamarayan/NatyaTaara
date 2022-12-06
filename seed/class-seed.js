var Class = require('../modals/classes');
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://natyataara:NatyaTaara1@cluster0.rrtus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

var classs = [
    
    new Class({
    imagePath : '/images/courses/1.jpg',
    title:'Bharathanatyam',
    ageGroup:'5 - 15 yrs',
    level:'Basics',
    session1:'Every Monday',
    timing1:'5pm to 6pm',
    session2:'Every Tuesday',
    timing2:'5pm to 6pm',
    fees:1200,
    classType:'ONLINE CLASS'
}),

new Class({
    imagePath : '/images/courses/2.jpg',
    title:'Bollywood / Cinematic Freestyle',
    ageGroup:'6 - 15 yrs',
    level:'Basics & Choreography',
    session1:'Every Friday',
    timing1:'6pm to 7pm',
    session2:'Every Saturday',
    timing2:'4.30pm to 5.30pm',
    fees:1200,
    classType:'ONLINE CLASS'
}),

new Class({
    imagePath : '/images/courses/3.jpg',
    title:'Bollywood / Cinematic Freestyle',
    ageGroup:'16 - 40 yrs.',
    level:'Choreography',
    session1:'Every Friday',
    timing1:'7pm to 8pm',
    session2:'Every Saturdays',
    timing2:'6.30pm to 7.30pm',
    fees:1500,
    classType:'ONLINE CLASS'
}),

new Class({
    imagePath : '/images/courses/1.jpg',
    title:'Bharathanatyam - Beginners',
    ageGroup:'5 - 15 yrs.',
    level:'Basics',
    session1:'Every Monday',
    timing1:'5pm to 6pm',
    session2:'Every Tuesday',
    timing2:'5pm to 6pm',
    fees:1200,
    classType:'STUDIO CLASS'
}),

new Class({
    imagePath : '/images/courses/1.jpg',
    title:'Bharathanatyam - Advanced',
    description:'20 Classes per month',
    ageGroup:'15+ yrs.',
    level:'ADVANCED',
    session1:'Monday to Friday',
    timing1:'4pm to 5pm',
    fees:2000,
    classType:'STUDIO CLASS'
}),

new Class({
    imagePath : '/images/courses/2.jpg',
    title:'Bollywood / Cinematic Freestyle',
    ageGroup:'6 - 15 yrs.',
    level:'Choreography - Advanced',
    session1:'Every Wednesday',
    timing1:'7pm to 8pm',
    session2:'Every Saturday',
    timing2:'5.30pm to 6.30pm',
    fees:1500,
    classType:'STUDIO CLASS'
}),

new Class({
    imagePath : '/images/courses/3.jpg',
    title:'Bollywood / Cinematic Freestyle',
    ageGroup:'16 - 40 yrs',
    level:'Choreography - Intermediate',
    session1:'Every Friday',
    timing1:'7pm to 8pm',
    session2:'Every Saturday',
    timing2:'6.30pm to 7.30pm',
    fees:1500,
    classType:'STUDIO CLASS',
    onDemand:1
}),

new Class({
    imagePath : '/images/courses/3.jpg',
    title:'Bollywood / Cinematic Freestyle - Adults',
    ageGroup:'40+ yrs',
    level:'Adults',
    session1:'Every Wednesday',
    timing1:'11am to 12pm',
    session2:'Every Friday',
    timing2:'11am to 12pm',
    fees:1500,
    classType:'STUDIO CLASS'
}),

new Class({
    imagePath : '/images/courses/3.jpg',
    title:'Bollywood / Cinematic Freestyle - Adults',
    ageGroup:'40+ yrs',
    level:'Adults - Evening Batch',
    session1:'Every Thursday',
    timing1:'7pm to 8pm',
    fees:1200,
    classType:'STUDIO CLASS'
}),

];

var done = 0;
for(var i=0; i<classs.length; i++){
    classs[i].save(function(err,result){
        done++;
        if(done === classs.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}