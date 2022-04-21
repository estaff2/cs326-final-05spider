const find = document.getElementById('find');



find.addEventListener('submit', function change () {
    const e = document.getElementById("select");
    const chosedW = e.value;
    const response = await fetch(`./user`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({chosedWorkout})
      });
    if(response.ok){
        window.location.replace('/user_workout_record_page.html');
      }
      else if(response.status === 403) {
        alert("not exists.");
      }
      else {
        console.error("can't find.");
    }
  
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