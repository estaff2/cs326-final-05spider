

const onClick = function() {
    console.log(this.id);
    let location = window.location.pathname;
    let path = location.substring(0, location.lastIndexOf("/"));
    let directoryName = path.substring(path.lastIndexOf("/")+1);
    console.log(directoryName)
    let href_string = "";
    if( directoryName !== 'docs'){
        href_string = "docs/";
    }
    href_string = href_string + this.id + ".html";
    document.getElementById(this.id).href = href_string;   
}
  document.getElementById('landing_page').onclick = onClick;
  document.getElementById('user_workout_record_page').onclick = onClick;
  document.getElementById('user_workout_history').onclick = onClick;
  document.getElementById('user_rec_input').onclick = onClick;
  document.getElementById('edit_profile').onclick = onClick;