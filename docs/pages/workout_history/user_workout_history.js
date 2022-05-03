
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
        return selectedFilter; 
} 
filt.addEventListener("change", getFilter);
filt.addEventListener("change", getTags); 

//turns filter into group of parts being worked

const legs = ["quads, hamstrings, glutes, groin, calves"]; 
const chest = ["chest"]; 
const arms  = ["biceps, triceps, delts"]; 
const back = ["lats, traps"]; 
const all = ["quads, hamstrings, glutes, groin, calves, chest, biceps, triceps, delts, lats, traps"]
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
    } else {
        parts = []; 
    }
    return parts; 
}

//server call 
let workoutdata;
let numberofWorkouts;  
async function callServer(){ 
    let url = "https://gym-recs.herokuapp.com/user/history?tags=" + parts.join(',');
    if (parts.length === 0){
        url = "https://gym-recs.herokuapp.com/user/history"; 
    }
    let response = await fetch(url,
        {
            method: 'GET',
        });
    if(response.ok){
        data = await response.json();
        workoutdata = data; 
        numberofWorkouts = workoutdata.length; 
        renderhist();  
    }
    else{
        alert(response.status)
    }
}

filt.addEventListener("change", callServer); 
 
function renderhist(){
    //getting all the data that matches the filter selected
    let i = 0;
    let dates = []; 
    let exercisename = []; 
    let sets = []
    let reps = []; 
    let weight = [];  
    while (i < numberofWorkouts){ 
        dates.push(workoutdata[i]["date"]);  
        exercisename.push(workoutdata[i]["exerciseName"]);  
        sets.push(workoutdata[i]["sets"]); 
        reps.push(workoutdata[i]["reps"]); 
        weight.push(workoutdata[i]["weight"]); 
        i++; 
    }
    
    console.log(dates); 
    console.log(exercisename); 
    console.log(sets);
    console.log(reps); 
    console.log(weight);
    document.getElementById("workout1header").innerHTML = dates[0]; 
}


