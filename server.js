import * as http from 'http';
import * as url from 'url';
import { readFile, writeFile, access } from 'fs/promises';
import path from 'path';
import { appendFile } from 'fs';


// added authentification ---do we need this?

const JSONfile = 'users.json';
let users = {};
const headerFields = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*'
};

async function reload(filename) {
  try {
    const data = await readFile(filename, 'utf-8')
    users = JSON.parse(data)
  } catch (err) {
    users = {};
  }
}

async function saveCounters() {
  try {
    const data = JSON.stringify(users);
    await writeFile(JSONfile, data, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
  }
}

function findCommonElements(arr1, arr2) {
  return arr1.some(item => arr2.includes(item))
}


// myArray.join(',')}); is how to pass the tags in, so make one string with , and then split into array here
async function getExercises(response, exercies_tags) {
  const data = await readFile('exercises.json');
  const tags = exercies_tags.split(',');
  let matching = [];
  let exercises = JSON.parse(data);
  exercises = exercises['exercises'];
  let i;
  for (i = 0; i < exercises.length; i++) {
    let exercise = exercises[i];
    let parts = exercise.parts;
    if (findCommonElements(tags, parts)) {
      matching.push(exercise);
    }
  }
  response.writeHead(200, headerFields);
  response.write(JSON.stringify(matching));
  response.end();

}

//load in user JSONfile, appends new workout to field "workout" containing array of workouts
async function recordWorkout(response, name, workout) {
  const data = await readFile('users.json')
  const users = JSON.parse(data);
  for (let i = 0; i < users.length; i++) {
    const user = user[i];
    if (user["name"].equals(name)) {
      user["workouts"].push(workout);
    }
  }
  response.writeHead(200, headerFields);
  response.write(JSON.stringify(workout));
  response.end();
}

//loads in user JSONfile, filters out users/exercises according to tags, sort remainder by descending order of weight, return top 25 entries.
async function getLeaderboard(response, tags) {
  tags = tags.split(',');
  const users = await readFile('users.json');
  const workouts = sortByExcercise(filterTags(JSON.parse(users), tags), tags[2]);
  let leaderboard = [];
  for (i = 0; i < 25; i++) {
    leaderboard.push(workouts[i]);
  }
  response.writeHead(200, headerFields);
  response.write(JSON.stringify(leaderboard));
  response.end();
}

//returns array of valid workouts (filters out users/workouts which don't match tags)
function filterTags(users, tags) {
  //filter out users
  let valid_users = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (!user["sex"].equals(tags[0]))
      continue;
    if (tags[3] !== null)
      if (!user["club"].equals(tags[3]))
        continue;
    if (tags[4] !== null)
      if (!user["major"].equals(tags[4]))
        continue;
    if (tags[5] !== null)
      if (!user["schoolYear"].equals(tags[5]))
        continue;
    valid_users.push(user);
  }

  //filter out exercises
  let valid_exercises = [];
  for (let i = 0; i < valid_users.length; i++) {
    const user = users[i];
    const user_workouts = user["workout_his"];
    for (let j = 0; j < user_workouts.length; j++) {
      const workout = user_workouts[j];
      if (tags[1].equals("week"))
        if (!pastWeek(workout))
          continue;
      for (let k = 0; k < workout.length; k++) {
        const entry = workout[k];
        if (!tags[2].equals(entry["exercise"]))
          continue;
        else
          valid_exercises.push(entry);
      }
    }
  }
  return valid_exercises;
}

//returns true if the supplied workout took place within the last week
function pastWeek(date) {
  const today = new Date();
  const today_date = today.getDate();
  const today_day = today.getDay();

  // get first date of week
  const first = new Date(today.setDate(today_date - today_day));

  // get last date of week
  const last = new Date(first);
  last.setDate(last.getDate() + 6);

  // if date is equal or within the first and last dates of the week
  return date >= first && date <= last;
}

//sorts array of workouts in descending order of weight according to specified excercise
function sortByExcercise(leaderboard, exercise) {
  return leaderboard.sort((a, b) => parseFloat(b.exercise) - parseFloat(a.exercise));
}

// create user function

function createUser (response, request){
  const data = await readFile('users.json')
  const username =request.body["username"];
  const email =req.body["email"];
  const password = request.body["encryPassword"];
  const schoolYear = request.body["schoolYear"];
  const major = request.body["major"];
  const gender = request.body["gender"];
  const workout_his = request.body["workout_his"];
 const checkDuplicate = await data.countDocuments(
   {email : email},
   {limit : 1}
 ) ;
 if (checkDuplicate >0){
   response.sendStatus(403);
 }
  return;
}

//Add calls to your method in this function
async function basicServer(request, response) {
  const parsedURL = url.parse(request.url, true);
  const options = parsedURL.query;
  const pathname = parsedURL.pathname;
  const method = request.method;
  if (method === 'GET') {
    if (pathname.startsWith('/exercises')) {
      getExercises(response, options.tags);
    }
    if (pathname.startsWith('/leaderboard')) {
      getLeaderboard(response, options.tags);
    }
    if(pathname.startsWith('/user/history')) {
      
    }
  }
  else if (method === 'POST') {
    if (pathname.startsWith('/record')) {
      recordWorkout(response, body);
    }
  }
  else {
    response.writeHead(404, headerFields);
    response.write(JSON.stringify({ error: 'Invalid Request' }));
    response.end();
  }
}

http.createServer(basicServer).listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});



