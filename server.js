import * as http from 'http';
import * as url from 'url';
import { readFile, writeFile, access } from 'fs/promises';


//I added authentification ---Vic

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

async function recordWorkout(response, name){
  const data = await readFile('users.json')
  users = JSON.parse(data)
}

async function getLeaderboard(response, tags){
  const data = await readFile('exercises.json')
  users = JSON.parse(data)
  for(i = 0; i < users.length; i++){
    if(users){
  }
  }
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
        if(pathname.startsWith('leaderboard')) {
          getLeaderboard(response, options);
        }
    }
    else if( method === 'POST'){
        if(pathname.startsWith('record')) {
          recordWorkout(response, options.name);
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