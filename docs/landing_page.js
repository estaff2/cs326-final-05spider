load();
console.log("poop");

//upon page load, update leaderboard/tag display using default vals.
//default vals: gender->all, time->all, exercise->squat, club->all, major->all, year->all
function load() {
    updatePage(null, null, "squat", null, null, null);
}

const search = document.getElementById("search").value;
//upon click search gathers user input for tags, updates leaderboard/tag display
search.addEventListener("click", () => {
    const gender = document.getElementById("gender").value;
    const time = document.getElementById("time").value;
    const exercise = document.getElementById("exercise").value;
    const club = document.getElementById("club").value;
    const major = document.getElementById("major").value;
    const year = document.getElementById("year").value;
    updatePage(gender, time, exercise, club, major, year);
})

//resets the leaderboard
function reset() {
    table.innerHTML="";
}

//updates page by calling updates on leaderboard, tag display
async function updatePage(gender, time, exercise, club, major, year) {
    updateTable(gender, time, exercise, club, major, year);
    updateTags(gender, time, exercise, club, major, year);
}

let table = document.getElementById("leaderboard");

//makes the http request to server to get ranking data based on supplied tags
async function updateTable(gender, time, exercise, club, major, year) {
    tags = {gender:gender, time:time, exercise:exercise, club:club, major:major, year:year};

    const response = await fetch('/leaderboard', {
        method: 'GET',
        body: JSON.stringify(tags)
    });
    const rankings = response.json;

    resetTable();

    for(let i = 0; i < rankings.size(); i++) {
        const curr=rankings[i];
        let row = document.createElement("tr");
        const rank = document.createElement("td").innerHTML = i+1;
        const name = document.createElement("td").innerHTML = curr["name"];
        const date = document.createElement("td").innerHTML = curr["date"];
        const year = document.createElement("td").innerHTML = curr["year"];
        const exercise = document.createElement("td").innerHTML = curr["exercise"];
        const weight = document.createElement("td").innerHTML = curr["weight"];
        row.appendChild(rank);
        row.appendChild(name);
        row.appendChild(date);
        row.appendChild(year);
        row.appendChild(exercise);
        row.appendChild(weight);
        table.appendChild(row);
    }
}

const tag_bar=document.getElementById("tag_bar");
//updates the list of tags above the leaderboard
function updateTags(time, exercise, club, major, year) {
    resetTags();
    const time = createTag(time);
    const exercise = createTag(exercise);
    const club = createTag(club);
    const major = createTag(major);
    const year = createTag(year);
    tag_bar.appendChild(time);
    tag_bar.appendChild(exercise);
    tag_bar.appendChild(year);
    if(club !== null)
        tag_bar.appendChild(club);
    if(major !== null)
        tag_bar.appendChild(major);
}

//creates a tag element for display
function createTag(tag) {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.classList.add("alert-warning");
    div.classList.add("alert-dismissible");
    div.classList.add("fade");
    div.classList.add("show");

    const text = document.createElement("STRONG");
    text.value = tag;

    const close = document.createElement("button");
    close.classList.add("btn-close");

    div.appendChild(text);
    div.appendChild(close);
}

//resets the tag bar
function resetTags() {
    tag_bar.innerHTML="";
}

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