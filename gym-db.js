import 'dotenv/config';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

export class GymDatabase {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    // Create a new Pool. The Pool manages a set of connections to the database.
    // It will keep track of unused connections, and reuse them when new queries
    // are needed. The constructor requires a database URL to make the
    // connection. You can find the URL of your database by looking in Heroku
    // or you can run the following command in your terminal:
    //
    //  heroku pg:credentials:url -a APP_NAME
    //
    // Replace APP_NAME with the name of your app in Heroku.

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
    //It's important to note that part(for exercises) should just be a single tag. This means that an exercise with 2 body part tags 
    // should have 2 seperate entries in the table.   
    //not sure how we want to handle workout_his
    // seperate table for workout history? 
    //images in exercises table? 
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
        gender varchar(30),
        major varchar(30),
        gender varchar(30),
        club varchar(30)
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
  }

  // Close the pool.
  async close() {
    this.client.release();
    await this.pool.end();
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
  async createPerson(username, email, password, schoolYear, major, gender) {
    /*const newUser={
      username: username,
      email: email,
      password: password,
      schoolYear:schoolYear,
      major:major,
      gender:gender
    };
    */
    const queryText = 'INSERT INTO users (username, email, password, schoolYear, major, gender) VALUES ($1, $2, $3, $4, $5, $6)';
    const res = await this.client.query(queryText, [username, email, password, schoolYear, major, gender]);
    return res.rows;
    //console.log("db");
  };

  async getWorkoutHist(username) {
    const queryText = `SELECT * FROM workouthistory where username = '${username}'`
    console.log(queryText);
    const res = await this.client.query(queryText);
    return res.rows
  }

  //grab leaderboard given tags
  async getLeaderboard(gender, schoolYear, major, club, exercise, date) {

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

    console.log("USER QUERY (DATABASE): " + usersQuery)
    const res1 = await this.client.query(usersQuery);
    const found = res1.rows;
    console.log("FOUND USERS: " + res1.rows);

    let users = [];
    for (let i = 0; i < found.length; i++) {
      users.push(found[i].username);
    }

    const d = date[1] + "-" + date[2];

    let workoutQuery =
      'SELECT *' +
      ' FROM workouthistory' +
      ` WHERE username && '{${users}}'` +
      ` AND exercise = '${exercise}'`;
    
    console.log(workoutQuery)

    if (d !== "All")
      workoutQuery += ` AND DATE LIKE '%.d'`;

    workoutQuery += ' ORDER BY weight DESC';

    console.log("WORKOUT QUERY (DATABASE): " + workoutQuery)

    const res2 = await this.client.query(workoutQuery);
    return res2.rows;
  }

  //post workout to database
  async recordWorkout(workouts) {
    for (let i = 0; i < workouts.length; i++) {
      const ex = workouts[i];
      const queryText =
        'INSERT INTO workoutHistory (username, exercise, sets, reps, weight, notes, date) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      await this.client.query(queryText, [ex.username, ex.exercise, ex.sets, ex.reps, ex.weight, ex.notes, ex.date]);
    }
  }
}