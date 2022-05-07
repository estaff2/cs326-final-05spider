"use strict"
let data;

document.getElementById("delete").addEventListener('click', async function () {
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;


//const createButton = document.getElementById("createUser").value;
  if( password === '' || username === ''){
    alert("wrong username or password");}
  
    let loc = window.location.href 
    let url =''
    if(loc.substring(7,12) == 'local'){
        url = 'http://localhost:3000/delete';
    }
    else{
        url = 'https://gym-recs.herokuapp.com/delete';
    }
    
    let response = await fetch(url,
        {
            method: 'POST',
        });
    if(response.ok){
        data = await response.json();
    }
    else{
        alert("wrong username or password")
    }
});
 