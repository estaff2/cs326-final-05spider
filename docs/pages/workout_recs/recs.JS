
"use strict"
let tags = ['biceps','triceps']; //this be assigned the value from getTags()
let data;



function getTags(){
    let stored = JSON.parse(window.localStorage.getItem('tags')); //name will change
    if(stored === null || stored === undefined){
        tags = [];
    }
    else{
        tags = stored;
    }
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
    let loc = window.location.href 
    let url =''
    if(loc.substring(7,12) == 'local'){
        url = 'http://localhost:3000/exercises?tags=' + tags.join(',');
    }
    else{
        url = 'https://gym-recs.herokuapp.com/exercises?tags=' + tags.join(',');
    }
    //tags.join(',') is a way to handle putting an array into one parameter of the query 
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
        let path = '../images/exercises/' + exercise.name + '.png'
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


async function main(){
    await serverRequest();
    renderTags(document.getElementById('tags'))
    renderRecs(document.getElementById('recs'));
}

main()
