
"use strict"
let tags = ['biceps','triceps']; //this be assigned the value from getTags()
let data;
await serverRequest();
renderTags(document.getElementById('tags'))
renderRecs(document.getElementById('recs'));


function getTags(){
    let stored = JSON.parse(window.localStorage.getItem('tags')); //name will change
    if(stored === null || stored === undefined){
        tags = []
    }
    return tags;
}

function renderTags(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    element.innerHTML = 'You selected: ';
    for(let i = 0; i < tags.length; i++){
        let tag = document.createElement('span');
        tag.classList.add('badge');
        tag.classList.add('rounded-pill');
        tag.classList.add('bg-success');
        tag.innerHTML = tags[i].charAt(0).toUpperCase() + tags[i].slice(1);
        element.appendChild(tag);
    }

}

async function serverRequest(){
    let url = 'http://localhost:3000/exercises?tags=' + tags.join(','); //tags.join(',') is a way to handle putting an array into one parameter of the query 
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

async function renderRecs(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    for(let i = 0; i< data.length; i++){ //while i is less than 3? how to add view more functionality? 
        let exercise = data[i]; 
        let row = document.createElement('div');
        row.classList.add('row');

        let image_col = document.createElement('div');
        image_col.classList.add('col-sm-5');
        let image = document.createElement('img');
        image.classList.add('equipment')
        let path = 'images/' + exercise.name + '.png'
        image.src = path
        image_col.appendChild(image);
        row.appendChild(image_col);

        let info_col = document.createElement('div');
        info_col.classList.add('col-sm-5')
        //info_col.classList.add('text-center')
        let header = document.createElement('h6');
        header.innerHTML = exercise.name ;
        info_col.appendChild(header);
        let line_break = document.createElement('div')
        line_break.innerHTML = '<br>'
        info_col.appendChild(line_break);
        let parts = exercise.parts;
        for(let j = 0; j <parts.length; j++){
            let badge = document.createElement('span');
            badge.classList.add('badge');
            badge.classList.add('rounded-pill');
            if(tags.includes(parts[j])){

                badge.classList.add('bg-success');
            }
            else{
                badge.classList.add('bg-secondary');
            }
            badge.innerHTML = parts[j].charAt(0).toUpperCase() + parts[j].slice(1);
            info_col.appendChild(badge)
        }
        let diffuculty = document.createElement('div')
        diffuculty.innerHTML = '<br> Diffuculty:'
        for(let star = 1; star <6; star++){
            let rating = document.createElement('span');
            rating.classList.add('fa')
            rating.classList.add('fa-star');
            if(star <= exercise.diffuculty){
                rating.classList.add('checked');
            }
            diffuculty.appendChild(rating)
        }

        info_col.appendChild(diffuculty);
        row.appendChild(info_col)







        element.appendChild(row);
    }
}


//nav bar stuff

const onClick = function() {
    let location = window.location.pathname;
    let path = location.substring(0, location.lastIndexOf("/"));
    let directoryName = path.substring(path.lastIndexOf("/")+1);
    let href_string = "";
    if( directoryName !== 'docs'){
        href_string = "docs/";
    }
    href_string = href_string + this.id + ".html";
    window.location.href = href_string;
}
  document.getElementById("landing_page").addEventListener('click', onClick);
  document.getElementById("user_workout_record_page").addEventListener('click', onClick);
  document.getElementById("user_workout_history").addEventListener('click', onClick);
  document.getElementById("user_rec_input").addEventListener('click', onClick);
  document.getElementById("edit_profile").addEventListener('click', onClick) 