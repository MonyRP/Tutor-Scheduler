
// const mysql = require('mysql');
// const faker = require('faker');

// var firstName = document.getElementById('first-name').value;
// var lastName = document.getElementById('last-name').value;
// var email = document.getElementById("email").value;
// var startTime = document.getElementById('start-time').value;
// var endTime = document.getElementById('end-time').value;
// var description = document.getElementById('description').value;




// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'rooting',
//     database: 'tutoring_sessions'
// })

 var query = 'SELECT * from scheduled_sessions';


// for (let i = 1; i < 500; i++) {
//      student = {
//         id: i,
//         first_name: faker.name.firstName(),
//         last_name: faker.name.lastName(),
//         email: faker.internet.email(),
//         start_time: faker.date.past(),
//         end_time: faker.date.past()
//     }; 
//     connection.query('INSERT INTO scheduled_sessions SET ?', student, function(error, results, fields){
//         if(error)throw error;
//         console.log(results);
//     });
// }

// connection.end();