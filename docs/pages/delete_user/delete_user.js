let users; 
async function serverRequest(){ 
    let loc = window.location.href 
    let url =''
    if(loc.substring(7,12) == 'local'){
        url = 'http://localhost:3000/users'
    }
    else{
        url = 'https://gym-recs.herokuapp.com/users'
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
    window.localStorage.clear("user"); 
    window.location.href = "../landing_page/landing_page.html";

});