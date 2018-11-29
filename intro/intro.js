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

document.getElementById("kuvanappi").addEventListener("click", Countdown);
document.getElementById("reset").addEventListener("click", refreshPage);

function Countdown () {
  let countdown = document.getElementById("countdown");
  countdown.style.visibility = "visible";
  let totalSeconds = 6;
  let aika = setInterval(setTime, 1000);

  function setTime () {
    totalSeconds--;
    countdown.innerHTML = 'Aika alkaa: ' + totalSeconds;
    if (totalSeconds < 0) {
      clearInterval(aika);
      startTimer();
      countdown.style.visibility = "hidden";
    }
  }
}




function startTimer () {

  document.getElementById("kuvanappi").disabled = true;
  let minutesLabel = document.getElementById("minutes");
  let secondsLabel = document.getElementById("seconds");
  let totalSeconds = 720;
  let aika = setInterval(setTime, 1000);

  function setTime() {
    totalSeconds--;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    if (totalSeconds < 0) {
      clearInterval(aika);
      let el = document.querySelector('#timer');
      let newEl = document.createElement('p');
      newEl.setAttribute("id", "lopputekstidiv");
      newEl.innerHTML = '<label id="lopputeksti">Testi päättyi</label>';
      el.parentNode.replaceChild(newEl, el);
    }
  }


  function pad(val) {
    let valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }
}

function refreshPage() {
  location.reload(true);
}


