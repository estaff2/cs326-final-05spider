
const ls = window.localStorage;  

 
let workhistory = [];
let selectedFilter = ''
//gets the selected filter
const filteroptions = ['none', 'legs', 'chest', 'arms', 'back'];
const filt = document.getElementById("filter");
function getFilter() {  
        let selectedfilt = filteroptions[filt.value]; 
            if (selectedfilt === undefined){
                selectedfilt = filteroptions[0]; 
            }
            selectedFilter = selectedfilt;
        console.log(selectedFilter); 
        return selectedFilter; 
} 
filt.addEventListener("change", getFilter);
filt.addEventListener("change", getTags); 

//turns filter into group of parts being worked

const legs = ["quads, hamstrings, glutes, groin, calves"]; 
const chest = ["chest"]; 
const arms  = ["biceps, triceps, delts"]; 
const back = ["lats, traps"]; 
let parts; 
function getTags() { 
    if (getFilter() === "legs"){
        parts = legs; 
    } else if (getFilter() === "chest"){
        parts = chest; 
    } else if (getFilter() === "arms"){
        parts = arms; 
    } else if (getFilter() === "back"){
        parts = back; 
    }
    console.log(parts); 
    return parts; 
}

//server call 
async function callServer(){
    let url = "https://gym-recs.herokuapp.com/user/history?tags=" + parts.join(','); 
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


let myusersworkouts = []; 

workhistory.forEach(user => {
    if (user.username === loggeduser){
        myusersworkouts.push(user.workout_his); 
    }
})

async function renderhist(element){
    let lower = myusersworkouts.length; 
    if (lower > 3){
        lower = 3; 
    }
    for (let i = 0; i < lower; i++){
        let date = myusersworkouts[i].date; 
        let exname = myusersworkouts[i].exercisename; 
        let sets = myusersworkouts[i].sets;
        let reps = myusersworkouts[i].reps; 
        let weight = myusersworkouts[i].weight;
        //creates date header 
        let w1date = document.createElement("h2"); 
        w1date.classList.add("col-md-7"); 
        w1date.classList.add("d-flex flex-row"); 
        w1date.classList.add("p1"); 
        w1date.innerHTML = date; 
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
