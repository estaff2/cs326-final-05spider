"use strict"
let data;

const usernameT = document.getElementById("username");
const emailT = document.getElementById("email");
const passwordT = document.getElementById("password");
const schoolYearT = document.getElementById("schoolYear");
const majorT = document.getElementById("major");
const genderT = document.getElementById("gender");
const createButton = document.getElementById("createUser");

//const location = window.location.hostname;

async function serverRequest(){
  let loc = window.location.href 
  let url =''
  if(loc.substring(7,12) == 'local'){
      url = 'http://localhost:3000/register';
  }
  else{
      url = 'https://gym-recs.herokuapp.com/register';
  }
  //tags.join(',') is a way to handle putting an array into one parameter of the query 
  let response = await fetch(url,
      {
          method: 'POST',
      });
  if(response.ok){
      data = await response.json();
  }
  else{
      alert(response.status)
  }

    
}



document.getElementById("createUser").addEventListener('click', async function () {
const username = document.getElementById("username").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const schoolYear = document.getElementById("schoolYear").value;
const major = document.getElementById("major").value;
const gender = document.getElementById("gender").value;
//const createButton = document.getElementById("createUser").value;
  if(email === '' || password === '' || username === ''|| password === '' || 
      schoolYear ==='' || major ==='' || gender === ''){
        return;}
  
console.log("js");
//await serverRequest();
const data = {username:username, email:email, password:password, schoolYear:schoolYear, major:major, gender:gender};
const response = await fetch(`http://localhost:3000/register`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  
  body: JSON.stringify(data)
}); 



});
  //if(response.ok){
   // window.location.replace('./landing_page.html');
  

        
        
        //await serverRequest();
       // createPerson(username, email, password, schoolYear, major, gender); 




/*






async function createPerson(username) {
  let userExists = await find ('users', `username='${username}'`);
  if(!(userExists.length > 0)){
    await insert ('users', [{Column : 'username', Data : `'${username}'`}, ])
    console.log("created");
  }
};

let connected = false;

if (process.env.DATABASE_URL) {
    console.log("Connecting to DB...");
    client.connect();

    var sql = fs.readFileSync('./gym-db.js').toString();
    client.query(sql);
    connected = true;
}


async function queryClient(query){
  if(connected){
      try{
          let res = await client.query(query);
          return {success: true, data: res};
      }
      catch(e){
          console.log(e);
      }
    }
  return {success: false};
}

async function insert(database, dataEntry){
  let columns = '';
  let values = '';
  let i = 0;
  for(const dataPoint of dataEntry){
      columns += i !== dataEntry.length - 1? `${dataPoint.Column}, ` : `${dataPoint.Column}`;
      values += i !== dataEntry.length - 1? `${dataPoint.Data}, ` : `${dataPoint.Data}`;
      i++;
  }
  let query = `INSERT INTO ${database} (${columns}) VALUES (${values});`;
  console.log(query);
  let res = await queryClient(query);
  if(res.success){
      return true;
  }
  return false; //TODO: Make this return success value of query
}


async function readAllUser() {
  const response = await fetch(`/user/all`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

async function allPeople() {
  const allPeople = await readAllPeople();
  all.innerHTML = JSON.stringify(allPeople);
}


 
 
 
  , email, password, schoolYear, major, gender
 const response = await fetch(
    `http://localhost:3000/register?username=${username}&email=${email}&password=${password}&schoolYear=${schoolYear}&major=${major}&gender=${gender}`,
    {
      method: 'POST',
    }
  );
  const data = await response.json();
  return data;

}


createButton.addEventListener("click", async(e) =>{
  const res = await fetch("/register",{
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(form),
  });

})


    createPerson(username, email, password, schoolYear, major, gender);
 




  output.innerHTML = JSON.stringify(username, email, password, schoolYear, major, gender);
  await allPeople();
});
window.addEventListener("load", async function() {
    if(window.localStorage.getItem("logged-in") === true){
      window.location.replace('./landing_page.html');
      return;
    }

document.getElementById("createUser").addEventListener('submit', async function () {

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const schoolYear = document.getElementById("schoolYear").value;
      const major = document.getElementById("major").value;
      const sex = document.getElementById("gender").value;
      if(email === '' || password === '' || username === ''|| password === '' || 
      schoolYear ==='' || major ==='' || sex === ''){
        return;

      }else if(!email.match('[A-Za-z0-9_|$|#|+|]+@[a-zA-Z]*[.]*[a-zA-Z]+.(edu|com|net)')) {
        return;
      }
    
      const response = await fetch(`./user/add`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({username, email, password, schoolYear, major})
        });
      if(response.ok){
          window.location.replace('/landing_page.html');
        }
        else if(response.status === 403) {
          alert("This email already exists.");
        }
        else {
          console.error("can't register.");
      }
    

*/
