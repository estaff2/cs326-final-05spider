
window.addEventListener("click", async function() {

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
    if(email === '' || password === '' || username === ''|| password === '' || schoolYear ===''
    || major ===''){
      return;

    }else if(!email.match('[A-Za-z0-9_|$|#|+|]+@[a-zA-Z]*[.]*[a-zA-Z]+.(edu|com|net)')) {
      return;
    }

    const response = await fetch(`./user/new`, {
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
    });
      
});