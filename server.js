
import { readFile, writeFile, access } from 'fs/promises';
import express from 'express'; 
import logger from 'morgan';
import { GymDatabase } from './gym-db.js'; 
import path from 'path';
//import passport from "passport";

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
async function filterUserworkoutHist(workoutarray, workouttags){
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
    //passport.use(strategy);
    //this.app.use(passport.initialize());
    //this.app.use(passport.session());
  
  }

  async initRoutes(){
    const self = this;

    this.app.get('/', function(req, res){
      res.sendFile('landing_page.html', {root:'docs/pages/landing_page'})
    })

    async function checkLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
        // Ifauthenticated, run the next route.
        next();
      } else {
        res.redirect(401);
      }
    }

    this.app.get('/exercises', async (request, response) => {
      const options = request.query;
      let tags = options.tags.split(',');
      const exercise_list = await self.db.getExercises(tags);
      response.status(200).send(JSON.stringify(exercise_list));
    });
    
    this.app.get('/leaderboard', async (request, response) => {
      try {
        const options = request.query;
        let tags = options.tags.split(',');
        console.log("Server tags :" + tags)
        const leaderboard = await self.db.getLeaderboard(tags[0],tags[1],tags[2],tags[3],tags[4],tags[5]); 
        response.status(200).send(JSON.stringify(leaderboard));
      }
      catch(err) {
        response.status(500).send(err);
      }
    });

    this.app.post('/record', async (request, response) => {
      console.log("Inside the server file for record")
      try {
        const options = request.body;
        await self.db.recordWorkout(options.workouts, options.notes); 
        response.status(200).send(JSON.stringify({status: "workout sucessfully recorded"}));
      }
      catch(err) {
        response.status(500).send(err);
      }
    });

    this.app.get('/user/history', async (request, response) => { 
      let user = request.query;
      user = user.username; 
      const history = await self.db.getWorkoutHist(user);
      response.status(200).send(JSON.stringify(history)); 
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

    //this.app.post('/login', passport.authenticate('local', { successRedirect: '/pages/landing_page', failureRedirect: '/login' }));


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

const server = new GymServer(process.env.DATABASE_URL);
server.start();