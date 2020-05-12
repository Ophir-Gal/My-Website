var mapViz = document.getElementById('mapViz');
var barViz = document.getElementById('barViz');
barViz.setAttribute('style', 'display: none');

// respond to message from map viz
window.onmessage = function(event) { 
    // get bar chart child page 
    let barChartIframe = document.getElementById('barViz');
    // send selected schools message to bar chart page
    barChartIframe.contentWindow.postMessage(event.data, '*');
    switchViz();
}

function switchViz(){
    if(barViz.style.display === 'none'){
        barViz.setAttribute('style', 'display: unset');
        mapViz.setAttribute('style', 'display: none');
    } else {
        mapViz.setAttribute('style', 'display: unset');
        barViz.setAttribute('style', 'display: none');   
    }
}