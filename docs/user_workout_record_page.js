let workout = [];
const add_ex = document.getElementById("add_ex");
const submit = document.getElementById("submit"); 
let table = document.getElementById('workout_table');

//upon click, "+" button appends the new exercise to the table, adds to array of exercises for workout.
add_ex.addEventListener("click", () => {
    const date = document.getElementById("date").value;
    const exercise = document.getElementById("exercise").value;
    const sets = document.getElementById("sets").value;
    const reps = document.getElementById("reps").value;
    const weight = document.getElementById("weight").value;
    const notes = document.getElementById("notes").value;

    try {
        updateTable(exercise, sets, reps, weight);
        workout.push({exercise:exercise, sets:sets, reps:reps, weight:weight, notes:notes});
    } catch {
        console.error("invalid exercise input; missing fields");
    } 
})

//upon click, submit posts the completed workout to server, resets the page.
submit.addEventListener("click", () => {
    saveWorkout(name, workout);
    reset();
})

//updates the workout table
function updateTable(exercise, sets, reps, weight) {
    let row = document.createElement("tr");
    const e = document.createElement("td").innerHTML = exercise;
    const s = document.createElement("td").innerHTML = sets;
    const r = document.createElement("td").innerHTML = reps;
    const w = document.createElement("td").innerHTML = weight;
    row.appendChild(e);
    row.appendChild(s);
    row.appendChild(r);
    row.appendChild(w);
    table.appendChild(row);
}

//makes http post to server to save the workout for current user
async function saveWorkout(username, name, date,  workout) {
    const data = {username:username, name:name, date:date, workout:workout};
    await fetch('/record', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

//resets the page to blank values.
function reset() {
    table.innerHTML="";
}