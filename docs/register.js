
window.addEventListener("load", async function() {
    if(window.localStorage.getItem("logged-in") === true){
      window.location.replace('./landing_page.html');
      return;
    }

    document.getElementById("createUser").addEventListener('click', async function () {

      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const schoolYear = document.getElementById("schoolYear");
      const major = document.getElementById("major");
      const sex = document.getElementById("sex");
      if(email === '' || password === '' || username === ''|| password === '' || 
      schoolYear ==='' || major ==='' || sex === ''){
        return;

      }else if(!email.match('[A-Za-z0-9_|$|#|+|]+@[a-zA-Z]*[.]*[a-zA-Z]+.(edu|com|net)')) {
        return;
      }
    
      else{
      const response = await fetch(`./user.JSON`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({username, email, password, schoolYear, major})
        });
      

      
      if(response.ok){
          window.location.replace('./landing_page.html');
        }
        else if(response.status === 403) {
          alert("This email already exists.");
        }
        else {
          console.error("can't register.");
      }
    }
  });  
});

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