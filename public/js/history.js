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
      text: "Graph"
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
        { x: new Date(), y: }
    }]
  });
  chart.render();

};



