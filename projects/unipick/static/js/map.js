// global state list
var stateList = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", 
                 "Colorado", "Connecticut", "Delaware", "District of Columbia",
                 "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
                 "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
                 "Maine", "Montana", "Nebraska", "Nevada", "New Hampshire",
                 "New Jersey", "New Mexico", "New York", "North Carolina",
                 "North Dakota", "Ohio", "Oklahoma", "Oregon", "Maryland",
                 "Massachusetts", "Michigan", "Minnesota", "Mississippi",
                 "Missouri", "Pennsylvania", "Rhode Island", 
                 "South Carolina", "South Dakota", "Tennessee", "Texas",
                 "Utah", "Vermont", "Virginia", "Washington",
                 "West Virginia", "Wisconsin", "Wyoming"]
submitForm()  // Submit form to immediately generate viz upon webpage load

/*
 * ============================================================================
 * ================== Begin Form Event Handling Functions =====================
 * ============================================================================
 */

function submitForm(centerPerson=0){
  // Fetch data from the server and render visualization
  fetch('https://raw.githubusercontent.com/Ophir-Gal/My-Website/gh-pages/' +
  'projects/unipick/data/IPEDS_data_extended.json').then(function(response) { 
    response.json()
    .then(jsonData => {
      let filters = getFilters();
      renderMapViz(schoolData=jsonData.ipeds_data, geoData=jsonData.geo_data,
                   filters=filters)
    })
    .catch(e => console.log(e))
  })
}

function compareSchools(){
  let selectedSchools = getSelectedSchools()
  // Ensure user selected at least 2 schools
  if (selectedSchools.length < 2){
    alert("You must select at least 2 schools for comparison!")
  } else {
    // Send list of selected schools to parent page
    window.top.postMessage(selectedSchools, '*')
  }
}

function _trimButton(listItemString){
  let indexOfCaret = listItemString.indexOf('<')
  return listItemString.slice(0, indexOfCaret)
}

function getSelectedStates(){
  let selectedStates = []
  for (let listItem of document.getElementsByClassName('selected-state')){
    selectedStates.push(_trimButton(listItem.innerHTML))
  }
  return selectedStates
}

function getSelectedSchools(){
  let selectedSchools = []
  for (let listItem of document.getElementsByClassName('selected-school')){
    selectedSchools.push(_trimButton(listItem.innerHTML))
  }
  return selectedSchools
}

function starSliderChange(value){
  let span = document.getElementById('ratingStars')
  span.innerHTML = ""
  let star_count = 0
  if (value > 0){
    let i = 0.5
    for (i=0; i<Math.floor(value); i++){
      let full_star = document.createElement("span")
      full_star.setAttribute('class', 'fa fa-star my-star-icon')
      span.appendChild(full_star)
      star_count++
    }
    if (value > Math.floor(value)){
      let half_star = document.createElement("span")
      half_star.setAttribute('class', 'fa fa-star-half-full my-star-icon')
      span.appendChild(half_star)
      star_count++
    }
  }
  while (star_count < 5){
      let empty_star = document.createElement("span")
      empty_star.setAttribute('class', 'fa fa-star-o my-star-icon')
      span.appendChild(empty_star)
      star_count++
  }
}

function displayNum(idGet, idChange) {
  let value = document.getElementById(idGet).value
  document.getElementById(idChange).innerHTML = value
}

// =================== code for handling state selection ====================
function selectState(){
  let valueEntered = document.getElementById('stateInput').value
  let selectedStates = document.getElementById('selectedStates')
  if (stateList.includes(valueEntered)
      && (!selectedStates.innerHTML.includes(valueEntered))) {
    selectedStates.innerHTML = 
      `<li class="selected-state" id="selected-${valueEntered}">` + 
      valueEntered +
      `<span>&nbsp;&nbsp;</span><button type="button" class="remove-button"
      onclick="deselectListItem('${valueEntered}')">` +
      '&#215;</button>' + '</li>' + selectedStates.innerHTML
  }
  // Clear state selection input
  document.getElementById('stateInput').value = "";
}

// =================== code for handling school selection ====================
function selectSchool(school){
  let selectedSchools = document.getElementById('selectedSchools')
  if (!selectedSchools.innerHTML.includes(school.Name)) {
    selectedSchools.innerHTML = 
      `<li class="selected-school" id="selected-${school.Name}">` + 
      school.Name +
      `<span>&nbsp;&nbsp;</span><button type="button" class="remove-button"
      onclick="deselectListItem('${school.Name}')">` +
      '&#215;</button>' + '</li>' + selectedSchools.innerHTML
  }
}

function deselectListItem(itemName){
  var listItem = document.getElementById(`selected-${itemName}`);
  listItem.parentNode.removeChild(listItem);
  submitForm()
}

/*
 * ============================================================================
 * ================== End Form Event Handling Functions =======================
 * ============================================================================
 */

/*
 * ============================================================================
 * ======================= Begin Utility Functions ============================
 * ============================================================================
 */

function getFilters(){
  let filters = {}
  filters.selectedStates = getSelectedStates()
  filters.minPercentAdmin = document.getElementById('minPercentAdmit').value
  filters.maxPercentAdmin = document.getElementById('maxPercentAdmit').value
  filters.maxPriceInState = document.getElementById('maxPriceInState').value
  filters.maxPriceOutState = document.getElementById('maxPriceOutState').value
  filters.minSatReading = document.getElementById('minSatReading').value
  filters.minSatMath = document.getElementById('minSatMath').value
  filters.masterDegree = document.querySelector('#masterDegree').checked
  filters.doctorDegree = document.querySelector('#doctorDegree').checked
  return filters
}

function doFiltering(d, filters) {
  return (filters.selectedStates.length === 0 ?
    true : filters.selectedStates.includes(d['State abbreviation']))
    &&
    d['Percent admitted - total'] >= filters.minPercentAdmin
    &&    
    d['Percent admitted - total'] <= filters.maxPercentAdmin
    &&    
    d['Total price for in-state students living on campus 2013-14']
    <= filters.maxPriceInState
    &&    
    d['Total price for out-of-state students living on campus 2013-14']
    <= filters.maxPriceOutState
    &&
    d['SAT Critical Reading 75th percentile score'] >= filters.minSatReading
    &&
    (filters.masterDegree ? d['Offers Master\'s degree'] === "Yes" : true)
    &&
    (filters.doctorDegree ? 
      d['Offers Doctor\'s degree - research/scholarship'] === "Yes" ||
      d['Offers Doctor\'s degree - professional practice'] === "Yes" ||
      d['Offers Doctor\'s degree - other'] === "Yes"
      : true)
    &&
    d['SAT Math 75th percentile score'] >= filters.minSatMath
    &&
    d['SAT Math 75th percentile score'] >= filters.minSatMath
}

/**
 * ============================================================================
 * ========================= End Utility Functions ============================
 * ============================================================================
 */

/**============================================================================
 * ============================= Main Function ================================
 * ============================================================================
 */
function renderMapViz(schoolData, geoData, filters) {
  // Color values
  let default_state_color = "rgb(213,222,217)"
  let selected_school_color = "rgb(102,51,153)"
  let selected_state_color = "rgb(185, 191, 255)"

  // Remove pre-existing content in #viz
  document.getElementById("viz").innerHTML = "";

  // Define width and height for SVG/visualization
  var width = window.innerWidth/1.1 * 0.75
  var height = window.innerHeight/1.15
  
  // Select svg from DOM
  var svg = d3.select('#viz')
  
  // Set width and height of SVG
  svg.attr('width', width).attr('height', height)

  // D3 Projection
  var projection = d3.geoAlbersUsa()
            .translate([width*(0.54), height/2])    // translate to center of screen
            .scale([1000]);          // scale things down so see entire US
          
  // Define path generator
  var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
          .projection(projection);  // tell path generator to use albersUsa projection

      
  // Define linear scale for output
  var color = d3.scale.linear().range([selected_school_color,
                                       selected_state_color]);

  var legendText = ["Selected States", "Schools"];
          
  // Append Div for tooltip to SVG
  var div = d3.select("body")
          .append("div")   
          .attr("class", "tooltip")               
          .style("opacity", 0);

  // setting the range of the input data
  color.domain([0,1]); // color.domain([0,1,2,3]); 
  
  // loop through the geo-data states to mark them as selected (light blue)
  for (var j = 0; j < geoData.features.length; j++)  {
    var geoState = geoData.features[j].properties.name;
    // Copy the data value into the JSON
    geoData.features[j].properties.visited = 
      filters.selectedStates.includes(geoState) ? 1 : 0;
  }
        
  // Bind the data to the SVG and create one path per GeoJSON feature
  svg.selectAll("path")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", function(d) {
      let value = d.properties.visited;
      return value ? color(value) : default_state_color;
    });

      
  // Map the selected schools
  var schoolElements = svg.append("g")
    .attr("class", "nodes")
    .selectAll("use")
    .data(schoolData)
    .enter()
    .append("use")
    .filter(d => doFiltering(d, filters))
    .attr("href", "#school-icon-g")
    .attr("transform", "translate(-10,-10)")
    .attr("x", function(d) {
      return projection([d["Longitude location of institution"],
                         d["Latitude location of institution"]])[0];
    })
    .attr("y", function(d) {
      return projection([d["Longitude location of institution"],
                         d["Latitude location of institution"]])[1];
    })
    .style("fill", "rgb(102,51,153)")	
    .style("opacity", 0.65)	
    .on("click", d => selectSchool(d))
    .on("mousedown", d => {
      schoolElements.style('stroke', s => s.Name == d.Name ? 'white' : 'none');
      schoolElements.style('stroke-width', s => s.Name == d.Name ? '50' : '0');
    })
    .on("mouseup", d => {
      schoolElements.style('stroke', 'none');
      schoolElements.style('stroke-width', '0');
    })      
    // Modification of custom tooltip code provided by Malcolm Maclean, 
    // "D3 Tips and Tricks" 
    // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
    .on("mouseover", function(d) {      
        div.transition()        
            .duration(100)      
            .style("opacity", .9);      
        div.text(d.Name)
            .style("left", (d3.event.pageX + 10) + "px")     
            .style("top", (d3.event.pageY - 28) + "px"); 
        schoolElements.style('opacity', s => s.Name == d.Name ? 1 : 0.65);
        schoolElements.style('fill', s => s.Name == d.Name ? 'black' : 'rgb(102,51,153)');
        schoolElements.style('z-index', s => s.Name == d.Name ? 20 : 1);
    })   
    // fade out tooltip on mouse out               
    .on("mouseout", function(d) {       
        div.transition()        
          .duration(100)      
          .style("opacity", 0);   
        schoolElements.style('fill', 'rgb(102,51,153)');
    })
          
  // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
  var legend = d3.select("body").append("svg")
              .attr("class", "legend")
            .attr("width", 140)
            .attr("height", 200)
            .attr("transform", `translate(${width - 580}, ${height - 600})`)
            .selectAll("g")
            .data(color.domain().slice().reverse())
            .enter()
            .append("g")
            .attr("transform", (d, i) => "translate(0," + i * 20 + ")");
  
  legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", color);

  legend.append("text")
      .data(legendText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });
  
  // Add zoom and pan functionality
  svg.call(d3.behavior.zoom()
     .translate(projection.translate())
     .scale(projection.scale())
     .on("zoom", redraw));
  
  function redraw() {
    if (d3.event) {
      projection
          .translate(d3.event.translate)
          .scale(d3.event.scale);
    }
    svg.selectAll("path").attr("d", path);
    var t = projection.translate();
    schoolElements
    .attr("x", function(d) {
      return projection([d["Longitude location of institution"],
                         d["Latitude location of institution"]])[0];
    })
    .attr("y", function(d) {
      return projection([d["Longitude location of institution"],
                         d["Latitude location of institution"]])[1];
    })
  }
}