
//let loggedIn = [];

//const logged = (window.localStorage.getItem("logged-in") !== null && window.localStorage.getItem("logged-in") !== "false");

// let data;
// async function logIn (username, password){
//     //const data = { username: username, password:password };
//     let loc = window.location.href
//     let url = ''
//     if (loc.substring(7, 12) == 'local') {
//         url = 'http://localhost:3000/login';
//     }
//     else {
//         url = 'https://gym-recs.herokuapp.com/login';
//     }
//     let response = await fetch(url,
//         {
//             method: 'POST',
//             //body: JSON.stringify(data)
            
//         });
//     if (!response.ok) {
//         //console.error(response.error);
//         alert("Incorrect email or password.");
//     }
//     else {
//         data = await response.json();
//         console.log('user successfully logged in', username);
//         window.localStorage.setItem("loggedIn", true);
//         window.localStorage.setItem("me",username);
//     }
// }




let users; 
async function serverRequest(){ 
    let loc = window.location.href 
    let url =''
    if(loc.substring(7,12) == 'local'){
        url = 'http://localhost:3000/users'
    }
    else{
        url = 'https://gym-recs.herokuapp.com/users'
    }
    //tags.join(',') is a way to handle putting an array into one parameter of the query 
    let response = await fetch(url,
        {
            method: 'GET',
        });
    if(response.ok){
        data = await response.json();
        users = data;
        console.log(users);  

    }
    else{
        alert(response.status)
    }         
}

document.getElementById("log").addEventListener('click', async function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    await serverRequest(); 
    users.forEach(userentry => {
        let match1 = false; 
        let match2 = false; 
        if (userentry['username'] === username){
            match1 = true; 
        }
        if (userentry['password'] === password){
            match2 = true; 
        }
        if (match1 && match2){
            window.localStorage.setItem("user",username);
            console.log("successfully logged in");
            window.location.href = "../landing_page/landing_page.html"; 
        }
        
    });
});
        //loggedIn.push({username:username});
       // window.localStorage.setItem("logged-in", true);






/*
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../models/user");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'email'},(email,password,done)=> {
                //match user
                User.findOne({email : email})
                .then((user)=>{
                 if(!user) {
                     return done(null,false,{message : 'that email is not registered'});
                 }
                 //match pass
                 bcrypt.compare(password,user.password,(err,isMatch)=>{
                     if(err) throw err;

                     if(isMatch) {
                         return done(null,user);
                     } else {
                         return done(null,false,{message : 'pass incorrect'});
                     }
                 })
                })
                .catch((err)=> {console.log(err)})
        })
        
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      }); 
}; 


*/
