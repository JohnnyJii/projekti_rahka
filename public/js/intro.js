'use strict';
let sliderTrigger = document.getElementsByClassName('slider-trigger')[0];
let slider = document.getElementsByClassName('slider-parent')[0];

sliderTrigger.addEventListener('click', function(el) {

  if (slider.classList.contains('active')) {
    slider.classList.remove('active');
  } else {
    slider.classList.add('active');
  }

});

(function() {
  console.log('mitäs täällä');
  const map = document.querySelector('#map');

  let btn = document.querySelector('#btn');

  btn.onclick = () => {
    console.log('klikattiinko mua?');
    map.classList.toggle('collapsed');
  };
})();

/*
document.querySelector('material-icons').addEventListener('click', function(){
document.querySelector('map.collapsible').classList.toggle('collapsed');
});
*/

document.getElementById('kuvanappi').addEventListener('click', Countdown);
document.getElementById('reset').addEventListener('click', refreshPage);

let aika = null;
let toinenAika = null;
let totalSeconds = 6;
let nappi = document.getElementById('kuvanappi');
let countdown = document.getElementById('countdown');

function Countdown() {
  document.getElementById('kuvanappi').disabled = true;
  nappi.style = 'box-shadow: 0 0 0 20px red; animation: pulse 1s;';
  countdown.style.visibility = 'visible';
  aika = setInterval(laskenta, 1000);

}

function laskenta() {
  totalSeconds--;
  countdown.innerHTML = 'Aika alkaa: ' + totalSeconds;
  if (totalSeconds < 0) {
    clearInterval(aika);
    startTimer();
    countdown.style.visibility = 'hidden';
    nappi.style = 'box-shadow: 0 0 0 20px #1CC518;';
  }
}

let minutesLabel = document.getElementById('minutes');
let secondsLabel = document.getElementById('seconds');
let harjoitusAika = 720;

function startTimer() {
  aika = setInterval(setTime, 1000);
  toinenAika = setInterval('lisaaPiste', 2000);
}

function setTime() {
  console.log('ha', harjoitusAika);
  harjoitusAika--;
  secondsLabel.innerHTML = pad(harjoitusAika % 60);
  minutesLabel.innerHTML = pad(parseInt(harjoitusAika / 60));
  if (harjoitusAika < 0) {
    clearInterval(aika);
    let el = document.querySelector('#timer');
    let newEl = document.createElement('p');
    newEl.setAttribute('id', 'lopputekstidiv');
    newEl.innerHTML = '<label id="lopputeksti">Testi päättyi</label>';
    el.parentNode.replaceChild(newEl, el);
    let nappi = document.getElementById('kuvanappi');
    nappi.style = 'box-shadow: none;';
    let lomake = document.getElementById('lomake');
    lomake.style = 'visibility: visible';
  }

  function pad(val) {
    let valString = val + '';
    if (valString.length < 2) {
      return '0' + valString;
    } else {
      return valString;
    }
  }
}

function lisaaPiste() {
  const koordinaatit = onLocationFound();  // {lat: 60.423, lon: 23.4324234}
  const settings = {
    method: 'POST',
    body: JSON.stringify(current_position),

  };
  fetch('/piste').then(resp => {
    return resp.json();
  }).then(json => {
    console.log(json);
  });

}

function refreshPage() {
  location.reload(true);
}

let input = document.getElementById('file-upload');
let infoArea = document.getElementById('file-upload-filename');

input.addEventListener('change', showFileName);

function showFileName(event) {

  // the change event gives us the input it occurred in
  let input = event.srcElement;

  // the input has an array of files in the `files` property, each one has a name that you can use. We're just using the name here.
  let fileName = input.files[0].name;

  // use fileName however fits your app best, i.e. add it into a div
  infoArea.textContent = 'Tiedosto valittu: ' + fileName;
}

const lomake = document.querySelector('#lomake');
const result = document.querySelector('#result');

const lahetaLomake = (evt) => {
  evt.preventDefault();
  const fd = new FormData(lomake);
  const asetukset = {
    method: 'post',
    body: fd,
  };

  fetch('/upload', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
    const polku = 'files/';
    const thumbs = 'thumbs/';
    result.innerHTML = '';
    json.forEach(item => {
      const li = document.createElement('li');
      if (item.mimetype.includes('image')) {
        const kuva = document.createElement('img');
        kuva.src = polku + item.ufile;
        li.appendChild(kuva);
      } else if (item.mimetype.includes('audio')) {
        const aud = document.createElement('audio');
        aud.setAttribute('controls', 'controls');
        aud.src = polku + item.ufile;
        li.appendChild(aud);
      } else {
        const vid = document.createElement('video');
        vid.src = polku + item.ufile;
        vid.setAttribute('controls', 'controls');
        li.appendChild(vid);
      }
      result.appendChild(li);
    });

  });
};

lomake.addEventListener('submit', lahetaLomake);


