let table = document.getElementById("tbody");
let tag_bar = document.getElementById("tag_bar");

window.onload = load();

//upon page load, update leaderboard/tag display using default vals.
//default vals: gender->all, time->all, exercise->squat, club->all, major->all, year->all
function load() {
    updatePage("All", "All", "Any", "All", "All", "All");
}

const search = document.getElementById("search");
//upon click search gathers user input for tags, updates leaderboard/tag display
search.addEventListener("click", () => {
    gatherTags();
})

async function gatherTags() {
    let gender = document.getElementsByName("sex");
    for (var radio of gender) {
        if (radio.checked) {
            gender = radio.value;
        }
    }
    let time = document.getElementsByName("time");
    for (var radio of time) {
        if (radio.checked) {
            time = radio.value;
        }
    }

    let exercise = document.getElementById("exercise");
    exercise = exercise.options[exercise.selectedIndex].text;

    let club = document.getElementById("club");
    club = club.options[club.selectedIndex].text;

    let major = document.getElementById("major");
    major = major.options[major.selectedIndex].text;

    let year = document.getElementById("year");
    year = year.options[year.selectedIndex].text;

    await updatePage(gender, time, exercise, club, major, year);
}

//resets the leaderboard
async function resetTable() {
    tbody.innerHTML = "";
}

//updates page by calling updates on leaderboard, tag display
async function updatePage(gender, time, exercise, club, major, year) {
    updateTable(gender, time, exercise, club, major, year);
    updateTags(exercise, club, major, year);
}

//makes the http request to server to get ranking data based on supplied tags and updates the table accordingly
async function updateTable(gender, time, exercise, club, major, year) {
    console.log(gender, year, major, club, exercise, time)
    const tags = [gender, year, major, club, exercise, time];
    const rankings = await callServer(tags);
    console.log("RANKINGS IN LANDINGPAGE.JS: " + rankings)
    console.log(rankings)
    resetTable();

    for (let i = 0; i < rankings.length; i++) {
        const curr = rankings[i];
        let row = document.createElement("tr");
        const rank = document.createElement("td");
        rank.innerHTML = i + 1;
        const name = document.createElement("td");
        name.innerHTML = curr["username"];
        const date = document.createElement("td");
        date.innerHTML = curr["date"];
        const reps = document.createElement("td");
        reps.innerHTML = curr["reps"];
        const exercise = document.createElement("td");
        exercise.innerHTML = curr["exercise"];
        const weight = document.createElement("td");
        weight.innerHTML = curr["weight"];
        row.appendChild(rank);
        row.appendChild(name);
        row.appendChild(date);
        row.appendChild(exercise);
        row.appendChild(reps);
        row.appendChild(weight);
        table.appendChild(row);
    }
}

//updates the list of tags above the leaderboard
function updateTags(exercise, club, major, year) {
    resetTags();
    const ex = createTag(exercise);
    const cl = createTag(club);
    const mj = createTag(major);
    const yr = createTag(year);

    tag_bar.appendChild(ex);
    if (year !== "All")
        tag_bar.appendChild(yr);
    if (club !== "All")
        tag_bar.appendChild(cl);
    if (major !== "All")
        tag_bar.appendChild(mj);
}

//creates a tag element for display
function createTag(tag) {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.classList.add("fade");
    div.classList.add("show");

    const text = document.createElement("STRONG");
    text.classList.add("tag-text");
    text.innerHTML = tag;

    const close = document.createElement("button");
    close.innerText = "X";
    close.type="button";
    close.classList.add("close");

    close.addEventListener('click', async event => {
        const tag = text.innerText;

        const children = Array.prototype.slice.call(tag_bar.childNodes);

        //remove tag from bar when closed
        for (let i = 0; i < children.length; i++) {
            const text = children[i].outerText.slice(0,-1);
            if (text == tag) {
                tag_bar.removeChild(children[i]);
                break;
            }
        }

        //reset tag which was closed to "All"
        let gender = document.getElementsByName("sex");
        for (var radio of gender) {
            if (radio.checked) {
                gender = radio.value;
            }
        }
        let time = document.getElementsByName("time");
        for (var radio of time) {
            if (radio.checked) {
                time = radio.value;
            }
        }
        let exercise = document.getElementById("exercise");
        let exercise_txt = exercise.options[exercise.selectedIndex].text;

        let club = document.getElementById("club");
        let club_txt = club.options[club.selectedIndex].text;

        let major = document.getElementById("major");
        let major_txt = major.options[major.selectedIndex].text;

        let year = document.getElementById("year");
        let year_txt = year.options[year.selectedIndex].text;

        if (tag === exercise_txt) {
            exercise.selectedIndex = 0;
            exercise_txt = exercise.options[exercise.selectedIndex].text;
        }
        if (tag === club_txt) {
            club.selectedIndex = 0;
            club_txt = club.options[club.selectedIndex].text;
        }
        if (tag === major_txt) {
            major.selectedIndex = 0;
            major_txt = major.options[major.selectedIndex].text;
        }
        if (tag === year_txt) {
            year.selectedIndex = 0;
            year_txt = year.options[year.selectedIndex].text;
        }

        //gather other tags/update page
        await updateTable(gender, time, exercise_txt, club_txt, major_txt, year_txt);
    })
    
    div.appendChild(text);
    div.appendChild(close);
    return div;
}

//resets the tag bar
async function resetTags() {
    tag_bar.innerHTML = "";
}

//makes the http request to server to get ranking data based on supplied tags
async function callServer(tags) {
    let loc = window.location.href
    let url = ''
    if (loc.substring(7, 12) == 'local') {
        url = 'http://localhost:3000/leaderboard?tags=' + tags.join(',');
    }
    else {
        url = 'https://gym-recs.herokuapp.com/leaderboard?tags=' + tags.join(',');
    }
    let response = await fetch(url,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'GET',
        });
    if (response.ok) {
        data = await response.json();
        return data;
    }
    else {
        alert(response.status)
    }
}