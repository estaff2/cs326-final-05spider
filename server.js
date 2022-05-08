
import { readFile, writeFile, access } from 'fs/promises';
import express from 'express'; 
import logger from 'morgan';
import { GymDatabase } from './gym-db.js'; 


const headerFields = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*'
};



function findCommonElements(arr1, arr2) {
  return arr1.some(item => arr2.includes(item))
}




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
    this.app.use(express.static('docs/pages/logout')); 
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

    this.app.get('/users', async (request, response) => {
      const users = await self.db.users();  
      response.status(200).send(JSON.stringify(users)); 
    })

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
        const leaderboard = await self.db.getLeaderboard(tags[0],tags[1],tags[2],tags[3],tags[4],tags[5]); 
        response.status(200).send(JSON.stringify(leaderboard));
      }
      catch(err) {
        response.status(500).send(err);
      }
    });

    this.app.post('/record', async (request, response) => {
      try {
        const options = request.body;
        await self.db.recordWorkout(options.username, options.workouts, options.notes); 
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
      //console.log("ada");
      //const options = request.query
      const username = req.body["username"];
      const email = req.body["email"];
      const password = req.body["password"];
      const schoolYear = req.body["schoolYear"];
      const major = req.body["major"];
      const gender = req.body["gender"];
      const club = req.body["club"];
      //const options = req.query;
      //let tags = options.tags.split(",");
      //console.log("person.tags");
      console.log(username);
      const person = await self.db.createPerson(username, email, password, schoolYear, major, gender, club);
      //options.username, options.email, options.password, options.schoolYear, options.major, options.gender
        //const { username, email, password, schoolYear, major, gender } = req.query;
        res.status(200).send(JSON.stringify(person));
        //const check = await 
        //console.log("bda");
        //const person = await self.db.createPerson(username, email, password, schoolYear, major, gender);
        });
      this.app.post('/login', async(req,res) =>{
        let inputUN = req.body["username"];
        let inputPS = req.body["password"];
        const user = await self.db.findName(inputUN);
          if (!user) {
            res.status(501).send("wrong name");
          }
          else{
            const userP = await self.db.findPassword(inputUN);
            if(userP === inputPS){
              // success!
              res.status(200).send(JSON.stringify(user)); 
          }
          res.status(501).send("wrong password");
          
          // should create a user object 
          
        }
      });
// edit profile
this.app.post('/edit_profile', async(req,res)=> {
      const username = req.body["username"];
      const passwordO = req.body["passwordO"];
      const passwordN = req.body["passwordN"];
      const person = await self.db.findName(username);
      const oldP = await self.db.findPassword(username);
      if(!person){
        res.status(501).send("user not exist");
      }
      if(oldP === passwordO){
        const undatedP = await self.db.updatePassword(username, passwordN);
        res.status(200).send(JSON.stringify(undatedP));
      }
      res.status(501).send("wrong password");

});


    //this.app.post('/login', passport.authenticate('local', { successRedirect: '/landing_page', failureRedirect: '/login' }));


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