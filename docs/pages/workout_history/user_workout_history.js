
const ls = window.localStorage;  

 
let workhistory = []; 
//const loggeduser = ls.getItem("users").value; 
let selectedFilter = ''
//gets selected filter
const filteroptions = ['none', 'legs', 'chest', 'arms', 'back'];
const filt = document.getElementById("filter");
function getFilter() {  
        let selectedfilt = filteroptions[filt.value]; 
            if (selectedfilt === undefined){
                selectedfilt = filteroptions[0]; 
            }
            selectedFilter = selectedfilt; 
        return selectedFilter; 
} 
filt.addEventListener("change", getFilter); 


async function callServer(){
    let url = "https://gym-recs.herokuapp.com/user/history?filter=" + selectedFilter; 
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

async function getallWorkouthistory() {
    const response = await fetch ('/user.json', {
        method: 'GET',
    }); 

    if(response.ok){
        const json = await response.json();
        workhistory.push(json); 
    } else {
        console.error("Can't fetch user workout history"); 
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
