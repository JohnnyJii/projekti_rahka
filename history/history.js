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

  let chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Graafi"
    },
    axisX:{
      title: "Date",
      gridThickness: 2
    },
    axisY: {
      title: "Meters"
    },
    data: [{
      type: "line",
      dataPoints: [
        { x: new Date(2000,0), y: 1500 },
        { x: new Date(2000,1), y: 1800 },
        { x: new Date(2000,2), y: 2100 },
        { x: new Date(2000,3), y: 1900 },
        { x: new Date(2000,4), y: 2500 },
        { x: new Date(2000,5), y: 2300 },
        { x: new Date(2000,6), y: 2620 },
        { x: new Date(2000,7), y: 2600 },
        { x: new Date(2000,8), y: 3000 },
        { x: new Date(2000,9), y: 2800 },
        { x: new Date(2000,10), y: 3100 },
        { x: new Date(2000,11), y: 3800 }
      ]
    }]
  });
  chart.render();

};



