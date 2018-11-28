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
'use strict';

const lomake = document.querySelector('#lomake');
const lista = document.querySelector('#result');

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
    lista.innerHTML = '';
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
      lista.appendChild(li);
    });

  });
};

lomake.addEventListener('submit', lahetaLomake);

let input = document.getElementById( 'file-upload' );
let infoArea = document.getElementById( 'file-upload-filename' );

input.addEventListener( 'change', showFileName );

function showFileName( event ) {

  // the change event gives us the input it occurred in
  let input = event.srcElement;

  // the input has an array of files in the `files` property, each one has a name that you can use. We're just using the name here.
  let fileName = input.files[0].name;

  // use fileName however fits your app best, i.e. add it into a div
  infoArea.textContent = 'File name: ' + fileName;
}
