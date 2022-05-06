
import { readFile, writeFile, access } from 'fs/promises';
import express from 'express'; 
import logger from 'morgan';
import { GymDatabase } from './gym-db.js'; 
import path from 'path';


const JSONfile = 'users.json';
let users = {};
const headerFields = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*'
};

function findCommonElements(arr1, arr2) {
  return arr1.some(item => arr2.includes(item))
}





//gets user workout history based on filter selected
async function getWorkoutHist(response, workouttags){
  //window.localStorage.getItem("user").value;
  if (workouttags == undefined){
    workouttags = "quads,hamstrings,glutes,groin,calves,chest,biceps,triceps,delts,lats,traps";
    console.log("working"); 
  } 
  let currentuser = "spider"
  let filterselected = workouttags.split(','); 
  const data = await readFile('docs/JSON Files/users.json')
  let exercises = await readFile('docs/JSON Files/exercises.json');
  exercises = JSON.parse(exercises);
  exercises = exercises['exercises']; 
  //finds exercises that match the filter
  let matching = []; 
  let i;
  for (i = 0; i < exercises.length; i++) {
    let exercise = exercises[i];
    let parts = exercise.parts;
    console.log(exercise); 
    console.log(filterselected); 
    if (findCommonElements(filterselected, parts)) {
      matching.push(exercise);
    }
  } 
  console.log(matching);  
  //gets exercise names
  let validworkouts = []; 
  matching.forEach(exerc => {
    validworkouts.push(exerc["name"]); 
  })   
  //makes sure it is only history of the current user
  let alldata = JSON.parse(data);
  let userhist = []; 
  if (alldata["username"] === (currentuser)){
    userhist = alldata["workout_his"];
    
  //filters user history to only include workouts that match their filter 
  } 
  let final = []; 
  userhist.forEach(workout => {
    validworkouts.forEach(exerciseName => {
      if (workout["exerciseName"].toLowerCase() == exerciseName.toLowerCase()){
        final.push(workout); 
      }
    })
  })
  response.writeHead(200, headerFields); 
  response.write(JSON.stringify(final)); 
  response.end(); 
}


// myArray.join(',')}); is how to pass the tags in, so make one string with , and then split into array here
async function getExercises(response, exercies_tags) {
  const data = await readFile('docs/JSON Files/exercises.json');
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
async function recordWorkout(response, username, workout) {
  const data = await readFile('docs/JSON Files/users.json');
  const users = JSON.parse(data);
  for (let i = 0; i < users.length; i++) {
    const user = user[i];
    if (user["username"].equals(username)) {
      user["workouts"].push(workout);
    }
  }
  //todo add user workout to the users.JSON file
  response.writeHead(200, headerFields);
  console.log(workout); 
  response.write(JSON.stringify(workout));
  response.end();
}

//loads in user JSONfile, filters out users/exercises according to tags, sort remainder by descending order of weight, return top 25 entries.
async function getLeaderboard(response, tags) {
  tags = tags.split(',');
  const users = await readFile('docs/JSON Files/users.json');
  const workouts = sortByExcercise(filterTags(JSON.parse(users), tags), tags[2]);
  let leaderboard = [];
  for (let i = 0; i < 25; i++) {
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
/*
async function createUser (response, request){
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
*/

class GymServer{
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static('docs')); //not sure if this and docs/pages are strictly neccessary
    this.app.use(express.static('docs/pages')); 
    this.app.use(express.static('docs/pages/landing_page')); 
    this.app.use(express.static('docs/pages/edit_profile')); 
    this.app.use(express.static('docs/pages/login')); 
    this.app.use(express.static('docs/pages/record_workout')); 
    this.app.use(express.static('docs/pages/register')); 
    this.app.use(express.static('docs/pages/user_rec_input')); 
    this.app.use(express.static('docs/pages/workout_history')); 
    this.app.use(express.static('docs/pages/workout_recs')); 
    this.app.use(logger('dev'));
    this.app.use(express.json());
  }

  async initRoutes(){
    const self = this;

    this.app.get('/', function(req, res){

      res.sendFile('landing_page.html', {root:'docs/pages/landing_page'})
    })

    
    this.app.get('/exercises', async (request, response) => {
      const options = request.query;
      let tags = options.tags.split(',');
      const exercise_list = await self.db.getExercises(tags);
      response.status(200).send(JSON.stringify(exercise_list));
    });
    
    this.app.get('/leaderboard', async (request, response) => {
      const options = request.query;
      console.log(options.tags); 
      getLeaderboard(response, options.tags); 
    });

    this.app.get('/user/history', async (request, response) => {
      const options = request.query; 
      getWorkoutHist(response, options.tags); 
    });

    this.app.post('/record', async (request, response) => {
      console.log(request.query.name, request.query.workout); 
      recordWorkout(response, request.query.name, request.query.workout); 
    });

    this.app.post('/addExercise', async (request, response) => {
      const options = request.query;
      let parts = options.parts.split(',')
      const exercise = await self.db.postExercise(options.name, options.diffuculty, parts)
      response.status(200).send(JSON.stringify(exercise))
    });
    
    this.app.post('/register', async (req, res) => {
      console.log("ada");
      //const options = request.query
      const username = req.body["username"];
      const email = req.body["email"];
      const password = req.body["password"];
      const schoolYear = req.body["schoolYear"];
      const major = req.body["major"];
      const gender = req.body["gender"];
      //const options = req.query;
      //let tags = options.tags.split(",");
      console.log("person.tags");
      console.log(username);
      const person = await self.db.createPerson(username, email, password, schoolYear, major, gender);
      //options.username, options.email, options.password, options.schoolYear, options.major, options.gender
        //const { username, email, password, schoolYear, major, gender } = req.query;
        res.status(200).send(JSON.stringify(person));
        //const check = await 
        console.log("bda");
        
        
        
        //const person = await self.db.createPerson(username, email, password, schoolYear, major, gender);
        });
    this.app.get('/user/all', async (req, res) => {
      try {
        const people = await self.db.readAllPeople();
        res.send(JSON.stringify(people));
      } catch (err) {
        res.status(501).send(err);
      }
    });

    this.app.all('*', async (request, response) => {
      response.status(404).send(`Not found: ${response.path}`); 
    });

    
  }
  
  async initDb() {
    this.db = new GymDatabase(this.dburl);
    await this.db.connect();
  }


  async start() {
    await this.initRoutes();
    await this.initDb();
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Gym server started on ${port}`);
    });
  }
}


const server = new GymServer(process.env.DATABASE_URL)
server.start()

/*
const email = req.query.email;
      const password = req.query.password;
      const schoolYear = req.query.schoolYear;
      const major = req.query.major;
      const gender = req.query.gender;
*/