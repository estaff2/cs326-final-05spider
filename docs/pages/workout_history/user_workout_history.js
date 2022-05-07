
const ls = window.localStorage;  

let firsttime = true; 
let workhistory = [];
let selectedFilter = ''
let loggeduser; 
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
//turns filter into group of parts being worked
const legs = ["quads,hamstrings,glutes,groin,calves"]; 
const chest = ["chest,pectorals"]; 
const arms  = ["biceps,triceps,delts,rotator cuff"]; 
const back = ["lats,traps"]; 
const all = ["quads,hamstrings,glutes,groin,calves,chest,biceps,triceps,delts,lats,traps"]
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
        parts = all; 
    }
    return parts; 
}

function setup() {
    getFilter(); 
    getTags();
    user = ls.getItem("me"); 
    loggeduser = user; 
     
}
setup(); 
filt.addEventListener("change", getFilter);
filt.addEventListener("change", getTags);

 

//gets all the users workout history 
let workoutdata;
let numberofWorkouts;  
async function callServer(){
    let loc = window.location.href 
    let url ='' 
    if(loc.substring(7,12) == 'local'){
        url = `http://localhost:3000/user/history?username=${loggeduser}` 
    }
    else{
        url = `https://gym-recs.herokuapp.com/user/history?username=${loggeduser}`
    }
    let response = await fetch(url,
        {
            method: 'GET',
        });
    if(response.ok){
        data = await response.json(); 
        workoutdata = data;
        numberofWorkouts = workoutdata.length;    
    }
    else{
        alert(response.status)
    }
}

//gets all exercises matching the filter
let validexercises; 
async function serverRequest(){ 
    let loc = window.location.href 
    let url =''
    if(loc.substring(7,12) == 'local'){
        url = 'http://localhost:3000/exercises?tags=' + parts.join(',');
    }
    else{
        url = 'https://gym-recs.herokuapp.com/exercises?tags=' + parts.join(',');
    }
    //tags.join(',') is a way to handle putting an array into one parameter of the query 
    let response = await fetch(url,
        {
            method: 'GET',
        });
    if(response.ok){
        data = await response.json();
        validexercises = data; 
    }
    else{
        alert(response.status)
    }
    renderhist();         
}

//matches user history to filter selected for a specific day
function filterworkouts(date){
    let finalworkout = [];  
    workoutdata.forEach(workout => {
        validexercises.forEach(exercise => {
            if (workout['exercise'].toLowerCase() == exercise['name'].toLowerCase() && workout['date'] == date){
                finalworkout.push(workout); 
            }
        })

    })
    return finalworkout;  
}

async function main(){
    await callServer(); 
    await serverRequest();
    renderhist();  
}

main();
filt.addEventListener("change", callServer); 
filt.addEventListener("change", serverRequest); 

function getDates(){
    let dates = [];
    let uniqueDates = []; 
    let j = 0; 
    while (j < numberofWorkouts){
        dates.push(workoutdata[j]['date']); 
        j++; 
    }
    uniqueDates = toUniqueArray(dates);
    return uniqueDates;  
     
}

function getNotes(date){
    let notes = []; 
    let uniqueNotes = []; 
    let j = 0; 
    while (j < numberofWorkouts){
            if (workoutdata[j]['date'] == date){
                notes.push(workoutdata[j]['notes'])
            }
        j++; 
    }
    uniqueNotes = toUniqueArray(notes); 
    return uniqueNotes; 
}

function toUniqueArray(arr){
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i]);
        }
    }
  return newArr;
}

function renderreset(){
    let page = document.getElementById("historysection"); 
    page.innerHTML = ""; 
}
 
async function renderhist(){ 
    renderreset(); 
    uniqueDates = getDates(); 
    let curworkout;
    let j = 0; 
    const headers = ['Exercise Name', 'Sets', 'Reps', 'Weight']; 
    while (j < uniqueDates.length){
        curworkout = filterworkouts(uniqueDates[j]); 
        if (curworkout.length < 1){
            break;
        }
        let notes = getNotes(uniqueDates[j]);
        //creates date header
        let curdate =  curworkout[0]['date']; 
        let start = document.getElementById("historysection");
        let br = document.createElement('br');
        start.appendChild(br); 
        let cent = document.createElement("div"); 
        cent.classList.add('center');
        start.appendChild(cent); 
        let date = document.createElement("date"); 
        date.classList.add('col-md-7'); 
        date.classList.add('d-flex'); 
        date.classList.add('flex-row'); 
        date.classList.add('h2'); 
        cent.appendChild(date); 
        date.innerHTML = curdate; 
        let br2 = document.createElement('br');
        //creates tables 
        start.appendChild(br2); 
        let tcenter = document.createElement("div"); 
        tcenter.classList.add("center"); 
        start.appendChild(tcenter);
        let d = document.createElement("div"); 
        d.classList.add('col-md-7'); 
        tcenter.appendChild(d); 
        let table = document.createElement("table");
        table.setAttribute("id", `table${j}`)
        table.classList.add('table');
        d.appendChild(table); 
        let tablerowheaders = document.createElement('thead');
        table.appendChild(tablerowheaders); 
        let tr = document.createElement("tr"); 
        tablerowheaders.appendChild(tr);
        headers.forEach(head => {
            let th = document.createElement('th'); 
            th.setAttribute('scope', 'col'); 
            th.innerHTML = head
            tr.appendChild(th); 
        })
        
        datesnotes = true;  
        curworkout.forEach(exercise => { 
            let tablebody = document.createElement("tbody");
            let table = document.getElementById(`table${j}`); 
            table.appendChild(tablebody); 
            let tr = document.createElement('tr');
            tablebody.appendChild(tr);
            let th = document.createElement('th'); 
            th.setAttribute('scope', 'col'); 
            th.innerHTML = exercise['exercise']; 
            let td1 = document.createElement('td');
            td1.innerHTML = exercise['sets']; 
            let td2 = document.createElement('td'); 
            td2.innerHTML = exercise['reps'];  
            let td3 = document.createElement('td'); 
            td3.innerHTML = exercise['weight']; 
            tr.appendChild(th); 
            tr.appendChild(td1); 
            tr.appendChild(td2); 
            tr.appendChild(td3); 
        }); 
        notes.forEach(notes => {
            if (notes != []){
                let starting = document.getElementById("historysection")
                let notescenter = document.createElement("div"); 
                notescenter.classList.add("center"); 
                starting.appendChild(notescenter); 
                let header = document.createElement("div"); 
                header.classList.add('col-md-1'); 
                header.classList.add('p2'); 
                header.innerHTML = "Workout Notes:"
                let notestext = document.createElement("div"); 
                notestext.classList.add('col-md-6'); 
                notestext.classList.add('p3');
                notestext.innerHTML = notes; 
                notescenter.appendChild(header); 
                notescenter.appendChild(notestext);   
            } 
        })
        j++; 

     
}
} 