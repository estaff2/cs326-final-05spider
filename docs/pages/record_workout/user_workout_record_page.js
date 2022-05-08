let workout_list = [];
let date = "";
const tbody = document.getElementById("tbody");

//buttons
const add_ex = document.getElementById("add_ex");
const submit = document.getElementById("submit");

//input
let exercise = document.getElementById("exercise");
let sets = document.getElementById("sets");
let reps = document.getElementById("reps");
let weight = document.getElementById("weight");
let notes = document.getElementById("notes");

window.onload = updateDate();

//updates date on top of page
function updateDate() {
    const d = document.getElementById("date");
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    date = month + "/" + day + "/" + year;
    d.innerHTML = date;
}

//upon click, "+" button appends the new exercise to the table, adds to array of exercises for workout.
add_ex.addEventListener("click", () => {
    const e = exercise.options[exercise.selectedIndex].text;
    const s = sets.value;
    const r = reps.value;
    const w = weight.value;
    
    const username = "Mary.Smith";

    try {
        updateTable(e, s, r, w);
        workout_list.push({ username: username, exercise: e, sets: s, reps: r, weight: w, date: date });
    } catch {
        console.error("invalid exercise input: missing fields");
    }
})

//upon click, submit posts the completed workout to server, resets the page.
submit.addEventListener("click", () => {
    saveWorkout();
    resetTable();
})

//updates the workout table
function updateTable(exercise, sets, reps, weight) {
    let row = document.createElement('tr');
    const e = document.createElement('td');
    e.innerHTML = exercise;
    const s = document.createElement('td');
    s.innerHTML = sets;
    const r = document.createElement('td');
    r.innerHTML = reps;
    const w = document.createElement('td');
    w.innerHTML = weight;
    row.appendChild(e);
    row.appendChild(s);
    row.appendChild(r);
    row.appendChild(w);
    tbody.appendChild(row);
}

//makes http post to server to save the workout for current user
async function saveWorkout() {
    const n = notes.value;
    const data = { workouts: workout_list, notes: n };
    let loc = window.location.href
    let url = ''
    if (loc.substring(7, 12) == 'local') {
        url = 'http://localhost:3000/record';
    }
    else {
        url = 'https://gym-recs.herokuapp.com/record';
    }
    let response = await fetch(url,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify(data)
        });
    if (response.ok) {
        let json = await response.json();
        console.log(json)
    }
    else {
        alert(response.status)
    }
}

//resets the page to blank values.
function resetTable() {
    workout_list = [];
    exercise.selectedIndex=0;
    reps.value="";
    sets.value="";
    weight.value="";
    notes.value="";
    tbody.innerHTML = "";
}