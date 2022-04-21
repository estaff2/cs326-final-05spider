load();
let table = document.getElementById("leaderboard");

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
    addTags(gender, time, exercise, club, major, year);
}

//makes the http request to server to get ranking data based on supplied tags
async function updateTable(gender, time, exercise, club, major, year) {
    tags = {gender: gender, time: time, exercise: exercise, club:club, major:major, year:year};
    const response = await fetch('/leaderboard', {
        method: 'GET',
        body: JSON.stringify(tags)
    });
    const rankings = response.json;

    reset();

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

//updates the list of tags above the leaderboard
function addTags(gender, time, exercise, club, major, year) {

}
