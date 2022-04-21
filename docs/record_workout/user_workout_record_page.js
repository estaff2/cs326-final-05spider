let workout = [];
const add_ex = document.getElementById("add_ex");
const submit = document.getElementById("submit"); 
const tbody = document.getElementById("tbody");
updateDate();

//updates date on top of page
function updateDate() {
    console.log('updateDate')
    const date = document.getElementById("date");
    const today = new Date();
    const month = today.getMonth()+1;
    const day = today.getDate();
    const year = today.getFullYear();
    date.innerHTML = month + "/" + day + "/" + year;
}

//upon click, "+" button appends the new exercise to the table, adds to array of exercises for workout.
add_ex.addEventListener("click", () => {
    console.log("add_ex event listenter")
    const date = document.getElementById("date").value;
    let exercise = document.getElementById("exercise");
    exercise = exercise.options[exercise.selectedIndex].text;
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
    resetTable();
})

//updates the workout table
function updateTable(exercise, sets, reps, weight) {
    console.log("updateTable")
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
async function saveWorkout(username, name, date) {
    const data = {username:username, name:name, date:date, workout:workout};
    await fetch('/record', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

//resets the page to blank values.
function resetTable() {
    tbody.innerHTML="";
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
