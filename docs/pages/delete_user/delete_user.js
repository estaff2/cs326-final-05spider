let users; 
async function serverRequest(){ 
    let loc = window.location.href 
    let url =''
    if(loc.substring(7,12) == 'local'){
        url = 'http://localhost:3000/logout'
    }
    else{
        url = 'https://gym-recs.herokuapp.com/logout'
    }
    //tags.join(',') is a way to handle putting an array into one parameter of the query 
    let response = await fetch(url,
        {
            method: 'GET',
        });
    if(response.ok){
        data = await response.json();
        users = data;
        console.log(users);  

    }
    else{
        alert(response.status)
    }         
}

document.getElementById("logout").addEventListener('click', async function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    await serverRequest(); 
    users.forEach(userentry => {
        let match1 = false; 
        let match2 = false; 
        if (userentry['username'] === username){
            match1 = true; 
        }
        if (userentry['password'] === password){
            match2 = true; 
        }
        if (match1 && match2){
            window.localStorage.removeItem("user");
            console.log("successfully logged out");
            window.location.href = "../login/login.html"; 
        }
        
    });
});