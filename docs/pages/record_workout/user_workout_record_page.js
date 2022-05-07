let workout_list = [];
let date = [];
const add_ex = document.getElementById("add_ex");
const submit = document.getElementById("submit");
const tbody = document.getElementById("tbody");
window.onload = updateDate();

//updates date on top of page
function updateDate() {
    const d = document.getElementById("date");
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    date.push(day);
    date.push(month);
    date.push(year);
    d.innerHTML = month + "/" + day + "/" + year;
}

//upon click, "+" button appends the new exercise to the table, adds to array of exercises for workout.
add_ex.addEventListener("click", () => {
    let exercise = document.getElementById("exercise");
    exercise = exercise.options[exercise.selectedIndex].text;
    const sets = document.getElementById("sets").value;
    const reps = document.getElementById("reps").value;
    const weight = document.getElementById("weight").value;
    const notes = document.getElementById("notes").value;
    const username = "jlaidler";
    console.log("clicked")

    try {
        updateTable(exercise, sets, reps, weight);
        workout_list.push({ username: username, exercise: exercise, sets: sets, reps: reps, weight: weight, notes: notes, date: date });
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
    console.log("WORKOUT LiST")
    console.log(workout_list)
    const data = { workouts: workout_list };
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
            method: 'POST',
            body: JSON.stringify(data)
        });
    if (response.ok) {
        data = await response.json();
    }
    else {
        alert(response.status)
    }
}

//resets the page to blank values.
function resetTable() {
    tbody.innerHTML = "";
}