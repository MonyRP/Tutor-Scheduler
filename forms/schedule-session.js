// $(document).ready(function () {
//   $('#calendar').fullCalendar({
//     header: {
//       center: 'month, agendaWeekFiveDay'
//     },

//     views: {
//       agendaWeekFiveDay: {
//         type: 'agendaWeek',
//         duration: {
//           days: 5
//         },
//         hiddenDays: [0, 6],
//         buttonText: 'Week'
//       }
//     },
//     aspectRatio: 3,


//   });
// });

const mysql = require('mysql');
const faker = require('faker');

var firstName;
var lastName;
var email;
var startTime;
var endTime;
var description;
var submit = document.getElementById('submit');
var query = 'SELECT * from scheduled_sessions';
var student;

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rooting',
  database: 'tutoring_sessions'
})



submit.addEventListener("click", function() {
  firstName = document.getElementById('first-name').value;
  lastName = document.getElementById('last-name').value;
  email = document.getElementById("email").value;
  startTime = document.getElementById('start-time').value;
  endTime = document.getElementById('end-time').value;
  description = document.getElementById('description').value;

  student = {
    id: 215,
    first_name: firstName,
    last_name: lastName,
    email: email,
    start_time: startTime,
    end_time: endTime,
    description: description
  };;

  console.log(student);
});



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

connection.end();