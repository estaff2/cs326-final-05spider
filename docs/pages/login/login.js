const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../models/user");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'email'},(email,password,done)=> {
                //match user
                User.findOne({email : email})
                .then((user)=>{
                 if(!user) {
                     return done(null,false,{message : 'that email is not registered'});
                 }
                 //match pass
                 bcrypt.compare(password,user.password,(err,isMatch)=>{
                     if(err) throw err;

                     if(isMatch) {
                         return done(null,user);
                     } else {
                         return done(null,false,{message : 'pass incorrect'});
                     }
                 })
                })
                .catch((err)=> {console.log(err)})
        })
        
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      }); 
}; 


//nav bar stuff

const onClick = function() {
    let location = window.location.pathname;
    let path = location.substring(0, location.lastIndexOf("/"));
    let directoryName = path.substring(path.lastIndexOf("/")+1);
    let href_string = "";
    if( directoryName !== 'docs'){
        href_string = "docs/";
    }
    href_string = href_string + this.id + ".html";
    window.location.href = href_string;
}
  document.getElementById("landing_page").addEventListener('click', onClick);
  document.getElementById("user_workout_record_page").addEventListener('click', onClick);
  document.getElementById("user_workout_history").addEventListener('click', onClick);
  document.getElementById("user_rec_input").addEventListener('click', onClick);
  document.getElementById("edit_profile").addEventListener('click', onClick) 


