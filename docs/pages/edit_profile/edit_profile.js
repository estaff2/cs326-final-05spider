"use strict"
let data;

document.getElementById("update").addEventListener('click', async function () {
const username = document.getElementById("username").value;
const passwordO = document.getElementById("passwordO").value;
const passwordN = document.getElementById("passwordN").value;

//const createButton = document.getElementById("createUser").value;
  if( passwordO === '' || username === ''|| passwordN === ''){
        return;}
  
    let loc = window.location.href 
    let url =''
    if(loc.substring(7,12) == 'local'){
        url = 'http://localhost:3000/edit_profile';
    }
    else{
        url = 'https://gym-recs.herokuapp.com/edit_profile';
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
 