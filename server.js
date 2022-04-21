import * as http from 'http';
import * as url from 'url';
import { readFile, writeFile, access } from 'fs/promises';


// added authentification ---do we need this?

const express = require("express");
const { MongoClient } = require("mongodb");
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const minicrypt = require('./docs/MiniCrypt');

const MongoDBStore = require('connect-mongodb-session')(expressSession);

// end of added mongoClient
const JSONfile = 'users.json';
let users = {};
const headerFields = { 'Content-Type': 'text/html',
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

//$('#myLink').attr({"href" : '/myLink?array=' + myArray.join(',')}); is how to pass the tags in, so make one string with , and then split into array here
async function getExercises(response, exercies_tags){
    const data = await readFile('exercises.json');
    const tags = exercies_tags.split(',');
    let matching = [];
    let exercises = JSON.parse(data);
    exercises = exercises['exercises'];
    let i;
    for(i = 0; i < exercises.length; i++){
        let exercise = exercises[i];
        let parts = exercise.parts;
        if(findCommonElements(tags,parts)){
            matching.push(exercise);
        }
    }
    response.writeHead(200, headerFields);
    response.write(JSON.stringify(matching));
    response.end();
    
}

//load in user JSONfile, appends new workout to field "workout" containing array of workouts
async function recordWorkout(response, name, workout){
  const data = await readFile('users.json')
  const users = JSON.parse(data);
  for(let i = 0; i < users.length; i++) {
    const user = user[i];
    if(user["name"].equals(name)) {
      user["workouts"].push(workout);
    }
  }
  response.writeHead(200, headerFields);
  response.write(JSON.stringify(workout));
  response.end();
}

//loads in user JSONfile, filters out users/exercises according to tags, sort remainder by descending order of weight, return top 25 entries.
async function getLeaderboard(response, tags){
  const data = await readFile('users.json');
  const workouts = sortByExcercise(filterTags(JSON.parse(data), tags), tags["exercise"]);
  let leaderboard = [];
  for(i = 0; i < 25; i++){
    leaderboard.push(workouts.get(i));
  }
  response.writeHead(200, headerFields);
  response.write(JSON.stringify(leaderboard));
  response.end();
}

//returns array of valid workouts (filters out users/workouts which don't match tags)
function filterTags(users, tags) {
  //filter out users
  let valid_users=[];
  for(let i = 0; i < users.length; i++) {
    const user = users[i];
    if(tags["gender"] !== null)
      if(!user["gender"].equals(tags["gender"]))
        continue;
    if(tags["club"] !== null)
      if(!user["club"].equals(tags["club"]))
        continue;
    if(tags["major"] !== null)
      if(!user["major"].equals(tags["major"]))
        continue;
    if(tags["year"] !== null)
      if(!user["year"].equals(tags["year"]))
        continue;
    valid_users.push(user);
  }

  //filter out exercises
  let valid_exercises=[];
  for(let i = 0; i < valid_users.length; i++) {
    const user = users[i];
    const user_workouts = user["workouts"];
    for(let j = 0; j < user_workouts.length; j++) {
      const workout = user_workouts[j];
      if(tags["time"].equals("week"))
        if(!pastWeek(workout))
          continue;
      for(let k = 0; k < workout.length; k++) {
        const entry = workout[k];
        if(!tags["exercise"].equals(entry["exercise"]))
          continue
        else
          valid_exercises.push(entry);
      }
    }
  }
  return valid_exercises;
}

//sorts array of workouts in descending order of weight according to specified excercise
function sortByExcercise(leaderboard, exercise) {
  return leaderboard.sort((a, b) => parseFloat(b.exercise) - parseFloat(a.exercise));
}

//Add calls to your method in this function
 async function basicServer(request, response) {
    const parsedURL = url.parse(request.url, true);
    const options = parsedURL.query;
    const pathname = parsedURL.pathname;
    const method = request.method;
    if (method === 'GET'){
        if(pathname.startsWith('/exercises')){
            getExercises(response, options.tags);
        }
        if(pathname.startsWith('/leaderboard')) {
          getLeaderboard(response, body.tags);
        }
    }
    else if( method === 'POST'){
        if(pathname.startsWith('/record')) {
          recordWorkout(response, options.username, body.workout);
        }
    }
    else{
        response.writeHead(404, headerFields);
        response.write(JSON.stringify({ error: 'Invalid Request' }));
        response.end();
    }
  }
  

http.createServer(basicServer).listen(3000, () => {
  console.log('Server started on port 3000');
});