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
        emailaddress varchar(30),
        password varchar(30),
        schoolYear varchar(30),
        major varchar(30),
        club varchar(30),
        workout_his varchar(30)
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
  async postExercise(name, diff, parts){
    const queryText =
    'INSERT INTO exercises (name, diffuculty, parts) VALUES ($1, $2, $3)';
    const res = await this.client.query(queryText, [name, diff, parts]);
    return res.rows;
  }


  //tags is an array of words, this will return all exercises that have a part listed in the supplied tags
  async getExercises(tags){

    const queryText = 
     'SELECT * ' +
     'FROM exercises ' +
     `WHERE parts && '{${tags}}'`; // the '{}' syntax is only neccessary for array insertion
    const res = await this.client.query(queryText);
    return res.rows
  }


  async getWorkoutHist(username) {
    `SELECT * FROM workouthistory where username = ${username}`
    const res = await this.client.query(queryText); 
    return res.rows
  }

}