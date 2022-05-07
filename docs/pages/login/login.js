//import { user } from "pg/lib/defaults";

//let loggedIn = [];

//const logged = (window.localStorage.getItem("logged-in") !== null && window.localStorage.getItem("logged-in") !== "false");
let data;
async function logIn (username, password){
    //const data = { username: username, password:password };
    let loc = window.location.href
    let url = ''
    if (loc.substring(7, 12) == 'local') {
        url = 'http://localhost:3000/login';
    }
    else {
        url = 'https://gym-recs.herokuapp.com/login';
    }
    let response = await fetch(url,
        {
            method: 'POST',
            //body: JSON.stringify(data)
            
        });
    if (!response.ok) {
        //console.error(response.error);
        alert("Incorrect email or password.");
    }
    else {
        data = await response.json();
        console.log('user successfully logged in', username);
        window.localStorage.setItem("loggedIn-user", username);
        //window.localStorage.setItem("username",username);
    }
}

document.getElementById("log").addEventListener('click', async function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if(password === '' || username === ''){
        alert("Empty email or password.");}
    logIn(username, password);
        //loggedIn.push({username:username});
       // window.localStorage.setItem("logged-in", true);
});










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
