import 'dotenv/config';
import { query } from 'express';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

export class GymDatabase {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {

    this.pool = new Pool({
      connectionString: this.dburl,
      ssl: { rejectUnauthorized: false }, // Required for Heroku connections
    });

    // Create the pool.
    this.client = await this.pool.connect();

    // Init the database.
    await this.init();
  }

  async init() {
    //if you change any values in a table, either name or type of the variable or just deleting or adding values
    //you will need add DROP TABLE nameOfTable; to the top of the query text and run npm start once. Remove the statement after to avoid table being deleted every time
    const queryText = `
      create table if not exists exercises (
        name varchar(30),
        diffuculty integer,
        parts text[] 
      );

      create table if not exists users (
        username varchar(30),
        email varchar(30),
        password varchar(30),
        schoolYear varchar(30),
        major varchar(150),
        gender varchar(30),
        club varchar(150)
      );

      create table if not exists workouthistory (
        username varchar(30),
        exercise varchar(30),
        sets integer,
        reps integer, 
        weight integer,
        notes varchar(150),
        date varchar(30)
      ); 
    `;
    const res = await this.client.query(queryText);
    await this.getAllWorkouts();
  }

  // Close the pool.
  async close() {
    this.client.release();
    await this.pool.end();
  }

  async users(){
    const queryText = `SELECT * FROM users`
    const res = await this.client.query(queryText); 
    return res.rows; 
  }

  async findName(username){
    const queryText = 
    `SELECT username FROM users WHERE  username = '${username}'`;
    const res = await this.client.query(queryText);
    return res.rows;
  }
  async findPassword(username){
    const queryText = 
    `SELECT password FROM users WHERE username = '${username}'`;
    const res = await this.client.query(queryText);
    return res.rows;
  }
  async updatePassword(username, passwordN){
    const queryText =
    `UPDATE users SET password = '${passwordN}' WHERE username = '${username}' `;
    const res = await this.client.query(queryText);
    return res.rows;
  }

  async deleteUser(username){
    const queryText =
    `DROP TABLE users WHERE username = '${username}' `;
    const res = await this.client.query(queryText);
    return res.rows;
  }

  //this is just for us to use to add exercises to the database
  async postExercise(name, diff, parts) {
    const queryText =
      'INSERT INTO exercises (name, diffuculty, parts) VALUES ($1, $2, $3)';
    const res = await this.client.query(queryText, [name, diff, parts]);
    return res.rows;
  }

  //tags is an array of words, this will return all exercises that have a part listed in the supplied tags
  async getExercises(tags) {
    const queryText =
      'SELECT * ' +
      'FROM exercises ' +
      `WHERE parts && '{${tags}}'`; // the '{}' syntax is only neccessary for array insertion
    const res = await this.client.query(queryText);
    return res.rows;
  }

  // create user 
  async createPerson(username, email, password, schoolYear, major, gender, club) {
    console.log(username, email, password, schoolYear, major, gender, club)
    const queryText = 'INSERT INTO users (username, email, password, schoolYear, major, gender, club) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const res = await this.client.query(queryText, [username, email, password, schoolYear, major, gender, club]);
    return res.rows;
  };

  // gets all workouthistory for logged in user
  async getWorkoutHist(username) {
    const queryText = `SELECT * FROM workouthistory where username = '${username}'`
    const res = await this.client.query(queryText); 
    return res.rows
  }


  //grab leaderboard given tags
  async getLeaderboard(gender, schoolYear, major, club, exercise, time) {
    if(gender == "Men")
      gender = "Male";
    if(gender == "Women")
      gender = "Female";

    let usersQuery =
      'SELECT * ' +
      'FROM users';

    let conditionsMet = 0;

    if (gender !== "All") {
      if (conditionsMet == 0) {
        usersQuery += " WHERE "
      }
      else {
        usersQuery += " AND "
      }
      usersQuery += `gender = '${gender}'`;
      conditionsMet++;
    }
    if (schoolYear !== "All") {
      if (conditionsMet == 0) {
        usersQuery += " WHERE "
      }
      else {
        usersQuery += " AND "
      }
      usersQuery += `schoolYear = '${schoolYear}'`;
      conditionsMet++;
    }
    if (major !== "All") {
      if (conditionsMet == 0) {
        usersQuery += " WHERE "
      }
      else {
        usersQuery += " AND "
      }
      usersQuery += `major = '${major}'`;
      conditionsMet++;
    }
    if (club !== "All") {
      if (conditionsMet == 0) {
        usersQuery += " WHERE "
      }
      else {
        usersQuery += " AND "
      }
      usersQuery += `club = '${club}'`;
      conditionsMet++;
    }
    const res1 = await this.client.query(usersQuery);
    const found = res1.rows;

    let users = [];
    for (let i = 0; i < found.length; i++) {
      users.push(found[i].username);
    }

    let workoutQuery =
      'SELECT *' +
      ' FROM workouthistory' +
       ` WHERE username = ANY('{${users}}'::text[])`;
       
    if(exercise !== "Any")
      workoutQuery += ` AND exercise = '${exercise}'`;
    if (time !== "All") {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      workoutQuery += ` AND DATE LIKE '${month}%${year}'`;
    }

    workoutQuery += ' ORDER BY weight DESC';


    const res2 = await this.client.query(workoutQuery);
    return res2.rows;
  }

  //post workout to database
  async recordWorkout(username, workouts, notes) {
    for (let i = 0; i < workouts.length; i++) {
      const ex = workouts[i];
      const queryText =
        'INSERT INTO workoutHistory (username, exercise, sets, reps, weight, notes, date) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      await this.client.query(queryText, [username, ex.exercise, ex.sets, ex.reps, ex.weight, notes, ex.date]);
    }
  }

  async getAllWorkouts() {
    let queryr =
      'SELECT * ' +
      'FROM workoutHistory';
    const res2 = await this.client.query(queryr);
  }

  async getAllUsers() {
    let queryr =
      'SELECT * ' +
      'FROM users';
    const res2 = await this.client.query(queryr);
  }

  async clearWorkouts() {
    let queryr = 'DELETE FROM workoutHistory';
    const res2 = await this.client.query(queryr);
  }
}