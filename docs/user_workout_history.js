
const ls = window.localStorage; 
await getallWorkouthistory(); 

let workhistory = []; 
const loggeduser = ls.getItem("users").value; 

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