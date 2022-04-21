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

    

