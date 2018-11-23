'use strict';
let sliderTrigger = document.getElementsByClassName("slider-trigger")[0];
let slider = document.getElementsByClassName('slider-parent')[0];

sliderTrigger.addEventListener( "click" , function(el){

  if(slider.classList.contains("active")){
    slider.classList.remove("active");
  }else{
    slider.classList.add("active");
  }

});

let nappi = document.querySelector('#kuvanappi');

function Timer () {
  let timeleft = 6;
  let downloadTimer = setInterval(function(){
    timeleft--;
    document.getElementById("timer").innerHTML = timeleft;
    if(timeleft <= 0)
      clearInterval(downloadTimer);
  },1000);
}

nappi.addEventListener('click', Timer);

