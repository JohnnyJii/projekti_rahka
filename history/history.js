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

 window.onload = function () {

  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Graafi"
    },
    axisY:{
      includeZero: false
    },
    data: [{
      type: "line",
      dataPoints: [
        { y: 1600 },
        { y: 1800 },
        { y: 1900 },
        { y: 1900 },
        { y: 1800 },
        { y: 1900 },
        { y: 2200 },
        { y: 2000 },
        { y: 2200 },
        { y: 2600 }
      ]
    }]
  });
  chart.render();

};



