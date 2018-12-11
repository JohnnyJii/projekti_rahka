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
        { x: new Date(), y: 1500 },
        { x: new Date(), y: 1800 },
        { x: new Date(), y: 2100 },
        { x: new Date(), y: 1900 },
        { x: new Date(), y: 2500 },
        { x: new Date(), y: 2300 },
        { x: new Date(), y: 2620 },
        { x: new Date(), y: 2600 },
        { x: new Date(), y: 3000 },
        { x: new Date(), y: 2800 },
        { x: new Date(), y: 3100 },
        { x: new Date(), y: 3800 }
      ]
    }]
  });
  chart.render();

};



