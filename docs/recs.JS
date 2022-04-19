//import bootstrap from 'bootstrap'
"use strict"
let tags = ['biceps','triceps']; //this should be localstorage, for sake of testing just string
let data = '';
serverRequest();


function renderTags(){


}

async function serverRequest(){
    let url = 'http://localhost:3000/exercises?tags=' + tags.join(',');
    let response = await fetch(url,
        {
            method: 'GET',
        });
    if(response.ok){
        data = await response.json();
    }
    else{
        alert(response.status)
    }

      
}

function renderRecs(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
