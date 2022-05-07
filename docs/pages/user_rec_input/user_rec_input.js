

const find = document.getElementById('find');
const select = document.getElementById('select');
const tags = document.getElementById('tags');
let close_buttons;
let selected_array = [];


select.addEventListener('click', function(event){
  if(event.target.value != "Choose a Exercise" && ! selected_array.includes(event.target.value.toLowerCase()) ){
    selected_array.push(event.target.value.toLowerCase());
    renderTags()
  }
  
})


function renderTags(){
  while (tags.firstChild) {
    if (tags.firstChild.id !== 'find'){
      tags.removeChild(tags.firstChild);
    }
}

  //clear tags first 
  selected_array.forEach(name =>{
    let tag = document.createElement('div');
    tag.setAttribute('id', name.toLowerCase())
    tag.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show' ,'w-25', 'tag');
    tag.innerHTML = name;
    let tag_button = document.createElement('button');
    tag_button.classList.add('btn-close', 'x');
    tag.appendChild(tag_button);
    tags.appendChild(tag);
  })
  add_listeners();
}

function add_listeners(){
  close_buttons = Array.from(document.getElementsByClassName('x'))
  close_buttons.forEach(close => {
    close.addEventListener('click', function(event){
      let index = selected_array.indexOf(event.target.parentElement.id)
      selected_array.splice(index, 1);
      renderTags()
    })
  })
}

find.addEventListener('click', function(){
  window.localStorage.setItem('tags' , JSON.stringify(selected_array))
  window.location.assign('../workout_recs/recs.HTML')
});





