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
    let match1; 
    let match2;
    let count = 0;  
    while (count < users.length){ 
        match1 = false; 
        match2 = false; 
        console.log(users[count]['username']); 
        console.log(username); 
        if (users[count]['username'] === username){
            match1 = true; 
        }
        console.log(users[count]['password']); 
        console.log(password); 
        if (users[count]['password'] === password){
            match2 = true; 
        }
        if (match1 && match2){
            window.localStorage.removeItem("user");
            console.log("successfully logged in");
            window.location.href = "../landing_page/landing_page.html"; 
            break;
        }
        count++; 
    }
    count++; 
    console.log(count); 
    console.log(users.length); 
    if (count > users.length) {
        alert("Username or Password is incorrect");
    }
});