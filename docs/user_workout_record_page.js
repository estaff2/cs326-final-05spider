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
    saveWorkout(name);
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
async function saveWorkout(username, name, date) {
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
