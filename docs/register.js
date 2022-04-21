
window.addEventListener("load", async function() {
    if(window.localStorage.getItem("logged-in") === true){
      window.location.replace('./landing_page.html');
      return;
    }

document.getElementById("createUser").addEventListener('submit', async function () {

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const schoolYear = document.getElementById("schoolYear").value;
      const major = document.getElementById("major").value;
      const sex = document.getElementById("gender").value;
      if(email === '' || password === '' || username === ''|| password === '' || 
      schoolYear ==='' || major ==='' || sex === ''){
        return;

      }else if(!email.match('[A-Za-z0-9_|$|#|+|]+@[a-zA-Z]*[.]*[a-zA-Z]+.(edu|com|net)')) {
        return;
      }
    
      const response = await fetch(`./user.JSOn`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({username, email, password, schoolYear, major})
        });
      if(response.ok){
          window.location.replace('/landing_page.html');
        }
        else if(response.status === 403) {
          alert("This email already exists.");
        }
        else {
          console.error("can't register.");
      }
    
  });  
});