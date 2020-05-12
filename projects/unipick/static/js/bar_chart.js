var margin = {top: 50, right: 50, bottom: 50, left: 100};
var ordered;

var dataloaded = 0;
// this code manages the click event on the page
// you should not have to modify this code

// Respond to Ophir's visualization
// Respond to message from parent page
window.onmessage = function(event) {
  // get selected schools list from parent
  let input_Array = event.data;
  getData(input_Array);  // Start visualization
}

function getData(input_Array) {
  // TODO: replace with proper code to fetch data from the server
  // and transform into JSON format

  var attribute_types = [];
  //clear the canvas
  d3.selectAll("svg > *").remove();

  d3.json("http://localhost:8080/").then(function(data){
    renderVisualization(data.ipeds_data, input_Array);
  });

  //Original code for the table
  return new Promise((resolve,reject) => {
    var rand = () => Math.random() * 100;
    var data = [];
    for(var i = 0; i < 10; i++) {
      data.push({a:rand(),b:rand()});
      d3.json("http://localhost:8080/").then(function(data) {
        //console.log(data[0]);
      });
    }
    resolve(data);
  });
}

function renderVisualization(jsonTuples, input_Array) {
  var margin = {top: 50, right: 50, bottom: 50, left: 100};
  var width = window.innerWidth - margin.left - margin.right;
  var height = 750 - margin.top - margin.bottom + 15;

  // console.log("vis tups");
  // console.log(jsonTuples);

  //A news tuples set of just the data related to the selected states
  var parsed_elemets_tuples = [];

  for(var x = 0; x < jsonTuples.length; x++){
    // console.log("School value = ");
    // console.log(jsonTuples[x]);

    if(input_Array.includes(jsonTuples[x].Name)){
      // console.log("element");
      // console.log(jsonTuples[x]);
      parsed_elemets_tuples.push(jsonTuples[x]);

    }
  }
  // console.log("parsed_elemets_tuples");
  //
  // console.log(parsed_elemets_tuples);
  enrollment_bar_chart(parsed_elemets_tuples, width, height);
  dataloaded = 1;

  college_expense_bar_chart(parsed_elemets_tuples, width, height);

}

// returns true if the data value is numeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//chart 1
function enrollment_bar_chart(parsed_elemets_tuples, width, height){

  var i = 0;
  //track the states that should be added to the table
  var array = [];
  //track the selected states
  var states_selected = [];

  //obtain all the attributes of the data (Population, age, etc.)
  var data_attributes = Object.keys(parsed_elemets_tuples[0])
    .filter(function(d){
      i++;
      return (
            (d != "ID number")
            & (d != "Name")
            & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "year")
            & (d != "ZIP code")
            & (d != "Highest degree offered")
            & (d != "County name")
            & (d != "Longitude location of institution")
            & (d != "Latitude location of institution")
            & (d != "Religious affiliation")
            & (d != "Offers Less than one year certificate")
            & (d != "Offers One but less than two years certificate")
            & (d != "Offers Associate's degree")
            & (d != "Offers Two but less than 4 years certificate")
            & (d != "Offers Bachelor's degree")
            & (d != "Offers Postbaccalaureate certificate")
            & (d != "Offers Master's degree")
            & (d != "Offers Post-master's certificate")
            & (d != "Offers Doctor's degree - research/scholarship")
            & (d != "Offers Doctor's degree - professional practice")
            & (d != "Offers Doctor's degree - other")
            & (d != "Offers Other degree")
            & (d != "Applicants total")
            & (d != "Admissions total")
            & (d != "Enrolled total")
            & (d != "Percent of freshmen submitting SAT scores")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "SAT Critical Reading 25th percentile score")
            & (d != "SAT Critical Reading 75th percentile score")
            & (d != "SAT Math 25th percentile score")
            & (d != "SAT Math 75th percentile score")
            & (d != "SAT Writing 25th percentile score")
            & (d != "SAT Writing 75th percentile score")
            & (d != "ACT Composite 25th percentile score")
            & (d != "ACT Composite 75th percentile score")
            // & (d != "Estimated enrollment, total")
            // & (d != "Estimated enrollment, full time")
            // & (d != "Estimated enrollment, part time")
            //& (d != "Estimated undergraduate enrollment, total")
            // & (d != "Estimated undergraduate enrollment, full time")
            // & (d != "Estimated undergraduate enrollment, part time")
            // & (d != "Estimated freshman undergraduate enrollment, total")
            // & (d != "Estimated freshman enrollment, full time")
            // & (d != "Estimated freshman enrollment, part time")
            & (d != "Estimated graduate enrollment, total")
            & (d != "Estimated graduate enrollment, full time")
            & (d != "Estimated graduate enrollment, part time")
            & (d != "Associate's degrees awarded")
            & (d != "Bachelor's degrees awarded")
            & (d != "Master's degrees awarded")
            & (d != "Doctor's degrese - research/scholarship awarded")
            & (d != "Doctor's degrees - professional practice awarded")
            & (d != "Doctor's degrees - other awarded")
            & (d != "Certificates of less than 1-year awarded")
            & (d != "Certificates of 1 but less than 2-years awarded")
            & (d != "Certificates of 2 but less than 4-years awarded")
            & (d != "Postbaccalaureate certificates awarded")
            & (d != "Post-master's certificates awarded")
            & (d != "Number of students receiving an Associate's degree")
            & (d != "Number of students receiving a Bachelor's degree")
            & (d != "Number of students receiving a Master's degree")
            & (d != "Number of students receiving a Doctor's degree")
            & (d != "Number of students receiving a certificate of less than 1-year")
            & (d != "Number of students receiving a certificate of 1 but less than 4-years")
            & (d != "Number of students receiving a Postbaccalaureate or Post-master's certificate")
            & (d != "Percent admitted - total")
            & (d != "Admissions yield - total")
            & (d != "Tuition and fees, 2010-11")
            & (d != "Tuition and fees, 2011-12")
            & (d != "Tuition and fees, 2012-13")
            & (d != "Tuition and fees, 2013-14")
            & (d != "Total price for in-state students living on campus 2013-14")
            & (d != "Total price for out-of-state students living on campus 2013-14")
            & (d != "State abbreviation")
            & (d != "FIPS state code")
            & (d != "Geographic region")
            & (d != "Sector of institution")
            & (d != "Level of institution")
            & (d != "Control of institution")
            & (d != "Historically Black College or University")
            & (d != "Tribal college")
            & (d != "Degree of urbanization (Urban-centric locale)")
            & (d != "Carnegie Classification 2010: Basic")
            & (d != "Total  enrollment")
            & (d != "Full-time enrollment")
            & (d != "Part-time enrollment")
            & (d != "Undergraduate enrollment")
            & (d != "Graduate enrollment")
            & (d != "Full-time undergraduate enrollment")
            & (d != "Part-time undergraduate enrollment")
            & (d != "Percent of total enrollment that are American Indian or Alaska Native")
            & (d != "Percent of total enrollment that are Asian")
            & (d != "Percent of total enrollment that are Black or African American")
            & (d != "Percent of total enrollment that are Hispanic/Latino")
            & (d != "Percent of total enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of total enrollment that are White")
            & (d != "Percent of total enrollment that are two or more races")
            & (d != "Percent of total enrollment that are Race/ethnicity unknown")
            & (d != "Percent of total enrollment that are Nonresident Alien")
            & (d != "Percent of total enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of total enrollment that are women")
            & (d != "Data")
            & (d != "20 of 100 columns")
            & (d != "Views")
            & (d != "ID number")
            & (d != "Percent of undergraduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of undergraduate enrollment that are Asian")
            & (d != "Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Black or African American")
            & (d != "Percent of undergraduate enrollment that are Hispanic/Latino")
            & (d != "Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Nonresident Alien")
            & (d != "Percent of undergraduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of undergraduate enrollment that are White")
            & (d != "Percent of undergraduate enrollment that are two or more races")
            & (d != "Percent of undergraduate enrollment that are women")
            & (d != "Percent of graduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of graduate enrollment that are Asian")
            & (d != "Percent of graduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of graduate enrollment that are Black or African American")
            & (d != "Percent of graduate enrollment that are Hispanic/Latino")
            & (d != "Percent of graduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of graduate enrollment that are Nonresident Alien")
            & (d != "Percent of graduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of graduate enrollment that are White")
            & (d != "Percent of graduate enrollment that are two or more races")
            & (d != "Percent of graduate enrollment that are women")
            & (d != "Graduation rate - Bachelor degree within 4 years, total")
            & (d != "Graduation rate - Bachelor degree within 5 years, total")
            & (d != "Graduation rate - Bachelor degree within 6 years, total")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "Percent of freshmen receiving Pell grants")
            & (d != "Percent of freshmen receiving any financial aid")
            & (d != "Percent of first-time undergraduates - foreign countries")
            & (d != "Percent of first-time undergraduates - in-state")
            & (d != "Percent of first-time undergraduates - out-of-state")
            & (d != "Percent of first-time undergraduates - residence unknown")
            & (d != "Percent of freshmen receiving federal student loans")
            & (d != "Percent of freshmen receiving federal, state, local or institutional grant aid")
            & (d != "Percent of freshmen receiving institutional grant aid")
            & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving other loan aid")
            & (d != "Percent of freshmen receiving state/local grant aid")
            & (d != "Percent of freshmen receiving student loan aid")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "Percent of freshmen submitting SAT scores")
          ); //remove the attributes we are not observing
    });


  d3.select("#chartOne")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //make a chart selection to select which data to show in the bar graph
  var selection = data_attributes[0];

  //y-axis description
  var description = "temp";
  switch (selection) {
    default:
      description = selection ;

  }


  //add y axis
    d3.select("#chartOne").append("text")
      .attr("class", "y axis")
      .attr("text-anchor", "end")
      .attr("y", 20)
      .attr("transform", "translate(1000000,-100)")
      .attr("transform", "rotate(-90)")
      .text(description);

      //put the state names in ascending order
      parsed_elemets_tuples.sort(function(a, b) {
        return d3.ascending(a.Name, b.Name)
      })

    var xBand = d3.scaleBand()
        .domain(parsed_elemets_tuples.map(d => d.Name)) //gets the first value of the parsed_elemets_tuples
        .range([100, width])
        .paddingInner(0.1);

    var hScale = d3.scaleLinear()
        .domain([0, d3.max(parsed_elemets_tuples, function(d){
          return +d[selection];
        })])
        .range([600, 0]);

//for the toop tip Implementing in order to get started I referenced this resource: http://bl.ocks.org/biovisualize/1016860
        var tooltip = d3.select("#hovOne")
        	.append("div")
        	.style("position", "absolute")
        	.style("y-index", "10")
        	.style("visibility", "hidden")
          .style("background", "black")
          .style("color", "white")
        	.text("temp");

        d3.select("#chartOne").selectAll("rect")
          .data(d3.values(parsed_elemets_tuples))
          .enter()
          .append("rect")
          .attr("width", xBand.bandwidth())
          .attr("height", d => 600 - hScale(d[selection]))
          .attr("x", d => xBand(d.Name) + "px")
          .attr("y", d => 50 + hScale(d[selection]) + "px")
          .attr("fill", "purple")
          .on("mouseover", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'grey');
              tooltip.text(d.Name + ", " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "visible");
            }
            })
          .on("mousemove", function(d){

            tooltip.text(d.Name + ", " + selection + " = " + d[selection] );
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

          .on("mouseout", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'purple');
              tooltip.text(d.Name + ", " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "hidden");
            }
            })

          // .on('click', function(d) {
          //   //if the bar is unselected
          //   if(!states_selected.includes(d.Name)){
          //     d3.select(this)
          //       .attr('fill', 'yellow');
          //       states_selected.push(d.Name);
          //       array.push(d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //       return tooltip.style("visibility", "visible");
          //   }else{
          //     d3.select(this)
          //       .attr('fill', 'purple');
          //       //remove the state from the Summary chart
          //       array = array.filter(e => e !== d.Name);
          //       states_selected = states_selected.filter(e => e !== d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //   }
          // });


      //in order to rotate the axis labels to make the graph more readable --> used this source: https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      d3.select("#chartOne").append("g")
          .attr("transform", "translate(0,650)")
          .call(d3.axisBottom(xBand))
          .selectAll("text")
          .style("text-anchor", "start")
          .style("font", "14px times")
          .attr("dx", "-.8em")
          .attr("dy", "1em")
          .attr("transform", "rotate(15)");
      d3.select("#chartOne").append("g")
          .attr("transform", "translate(100,50)")
          .call(d3.axisLeft(hScale));


  var selector;
  if (document.querySelector("#drop").innerHTML === "") {
    selector = d3.select("#drop")
      .append("select")
    	.attr("id","dropdown")
    	.on("change", function(d){
        selection = document.getElementById("dropdown");

        update_bar_chart(parsed_elemets_tuples, selection.value, width, height);

         });

         selector.selectAll("option")
           .data(data_attributes)
           .enter().append("option")
           .attr("value", function(d){
             return d;
           })
           .text(function(d){
             return d;
           })

  }



      var button1_ascending = document.getElementById("but1_Chart1")
        .addEventListener("click", function(event) {
          update_order(parsed_elemets_tuples, "ascending", selection);
        });

        var button2_decending = document.getElementById("but2_Chart1")
          .addEventListener("click", function(event) {
            update_order(parsed_elemets_tuples, "descending", selection);
          });

          var button1_byCollege= document.getElementById("but3_Chart1")
            .addEventListener("click", function(event) {
              update_order(parsed_elemets_tuples, "byCollege", selection);
            });


}

//chart 2
function college_expense_bar_chart(parsed_elemets_tuples, width, height){

  var i = 0;
  //track the states that should be added to the table
  var array = [];
  //track the selected states
  var states_selected = [];

  console.log(parsed_elemets_tuples[0]);
  //obtain all the attributes of the data (Population, age, etc.)
  var data_attributes = Object.keys(parsed_elemets_tuples[0])
    .filter(function(d){
      i++;
      return (
            (d != "ID number")
            & (d != "Name")
                        & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "year")
            & (d != "ZIP code")
            & (d != "Highest degree offered")
            & (d != "County name")
            & (d != "Longitude location of institution")
            & (d != "Latitude location of institution")
            & (d != "Religious affiliation")
            & (d != "Offers Less than one year certificate")
            & (d != "Offers One but less than two years certificate")
            & (d != "Offers Associate's degree")
            & (d != "Offers Two but less than 4 years certificate")
            & (d != "Offers Bachelor's degree")
            & (d != "Offers Postbaccalaureate certificate")
            & (d != "Offers Master's degree")
            & (d != "Offers Post-master's certificate")
            & (d != "Offers Doctor's degree - research/scholarship")
            & (d != "Offers Doctor's degree - professional practice")
            & (d != "Offers Doctor's degree - other")
            & (d != "Offers Other degree")
            & (d != "Applicants total")
            & (d != "Admissions total")
            & (d != "Enrolled total")
            & (d != "Percent of first-time undergraduates - foreign countries")
            & (d != "Percent of first-time undergraduates - in-state")
            & (d != "Percent of first-time undergraduates - out-of-state")
            & (d != "Percent of first-time undergraduates - residence unknown")
            & (d != "Percent of freshmen submitting SAT scores")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "SAT Critical Reading 25th percentile score")
            & (d != "SAT Critical Reading 75th percentile score")
            & (d != "SAT Math 25th percentile score")
            & (d != "SAT Math 75th percentile score")
            & (d != "SAT Writing 25th percentile score")
            & (d != "SAT Writing 75th percentile score")
            & (d != "ACT Composite 25th percentile score")
            & (d != "ACT Composite 75th percentile score")
            & (d != "Estimated enrollment, total")
            & (d != "Estimated enrollment, full time")
            & (d != "Estimated enrollment, part time")
            & (d != "Estimated undergraduate enrollment, total")
            & (d != "Estimated undergraduate enrollment, full time")
            & (d != "Estimated undergraduate enrollment, part time")
            & (d != "Estimated freshman undergraduate enrollment, total")
            & (d != "Estimated freshman enrollment, full time")
            & (d != "Estimated freshman enrollment, part time")
            & (d != "Estimated graduate enrollment, total")
            & (d != "Estimated graduate enrollment, full time")
            & (d != "Estimated graduate enrollment, part time")
            & (d != "Associate's degrees awarded")
            & (d != "Bachelor's degrees awarded")
            & (d != "Master's degrees awarded")
            & (d != "Doctor's degrese - research/scholarship awarded")
            & (d != "Doctor's degrees - professional practice awarded")
            & (d != "Doctor's degrees - other awarded")
            & (d != "Certificates of less than 1-year awarded")
            & (d != "Certificates of 1 but less than 2-years awarded")
            & (d != "Certificates of 2 but less than 4-years awarded")
            & (d != "Postbaccalaureate certificates awarded")
            & (d != "Post-master's certificates awarded")
            & (d != "Number of students receiving an Associate's degree")
            & (d != "Number of students receiving a Bachelor's degree")
            & (d != "Number of students receiving a Master's degree")
            & (d != "Number of students receiving a Doctor's degree")
            & (d != "Number of students receiving a certificate of less than 1-year")
            & (d != "Number of students receiving a certificate of 1 but less than 4-years")
            & (d != "Number of students receiving a Postbaccalaureate or Post-master's certificate")
            & (d != "Percent admitted - total")
            & (d != "Admissions yield - total")
            & (d != "Tuition and fees, 2010-11")
            & (d != "Tuition and fees, 2011-12")
            & (d != "Tuition and fees, 2012-13")
            // & (d != "Tuition and fees, 2013-14")
            // & (d != "Total price for in-state students living on campus 2013-14")
            // & (d != "Total price for out-of-state students living on campus 2013-14")
            & (d != "State abbreviation")
            & (d != "FIPS state code")
            & (d != "Geographic region")
            & (d != "Sector of institution")
            & (d != "Level of institution")
            & (d != "Control of institution")
            & (d != "Historically Black College or University")
            & (d != "Tribal college")
            & (d != "Degree of urbanization (Urban-centric locale)")
            & (d != "Carnegie Classification 2010: Basic")
            & (d != "Total  enrollment")
            & (d != "Full-time enrollment")
            & (d != "Part-time enrollment")
            & (d != "Undergraduate enrollment")
            & (d != "Graduate enrollment")
            & (d != "Full-time undergraduate enrollment")
            & (d != "Part-time undergraduate enrollment")
            & (d != "Percent of total enrollment that are American Indian or Alaska Native")
            & (d != "Percent of total enrollment that are Asian")
            & (d != "Percent of total enrollment that are Black or African American")
            & (d != "Percent of total enrollment that are Hispanic/Latino")
            & (d != "Percent of total enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of total enrollment that are White")
            & (d != "Percent of total enrollment that are two or more races")
            & (d != "Percent of total enrollment that are Race/ethnicity unknown")
            & (d != "Percent of total enrollment that are Nonresident Alien")
            & (d != "Percent of total enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of total enrollment that are women")
            & (d != "Data")
            & (d != "20 of 100 columns")
            & (d != "Views")
            & (d != "ID number")
            & (d != "Percent of undergraduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of undergraduate enrollment that are Asian")
            & (d != "Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Black or African American")
            & (d != "Percent of undergraduate enrollment that are Hispanic/Latino")
            & (d != "Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Nonresident Alien")
            & (d != "Percent of undergraduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of undergraduate enrollment that are White")
            & (d != "Percent of undergraduate enrollment that are two or more races")
            & (d != "Percent of undergraduate enrollment that are women")
            & (d != "Percent of graduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of graduate enrollment that are Asian")
            & (d != "Percent of graduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of graduate enrollment that are Black or African American")
            & (d != "Percent of graduate enrollment that are Hispanic/Latino")
            & (d != "Percent of graduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of graduate enrollment that are Nonresident Alien")
            & (d != "Percent of graduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of graduate enrollment that are White")
            & (d != "Percent of graduate enrollment that are two or more races")
            & (d != "Percent of graduate enrollment that are women")
            & (d != "Graduation rate - Bachelor degree within 4 years, total")
            & (d != "Graduation rate - Bachelor degree within 5 years, total")
            & (d != "Graduation rate - Bachelor degree within 6 years, total")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "Percent of freshmen receiving Pell grants")
            & (d != "Percent of freshmen receiving any financial aid")
            & (d != "Percent of freshmen receiving federal student loans")
            & (d != "Percent of freshmen receiving federal, state, local or institutional grant aid")
            & (d != "Percent of freshmen receiving institutional grant aid")
            & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving other loan aid")
            & (d != "Percent of freshmen receiving state/local grant aid")
            & (d != "Percent of freshmen receiving student loan aid")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "Percent of freshmen submitting SAT scores")
          ); //remove the attributes we are not observing
    });


  d3.select("#chartTwo")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //make a chart selection to select which data to show in the bar graph
  var selection = data_attributes[0];

  //y-axis description
  var description = "temp";
  switch (selection) {
    default:
      description = selection ;

  }


  //add y axis
    d3.select("#chartTwo").append("text")
      .attr("class", "y axis")
      .attr("text-anchor", "end")
      .attr("y", 20)
      .attr("transform", "translate(1000000,-100)")
      .attr("transform", "rotate(-90)")
      .text(description);

      //put the state names in ascending order
      parsed_elemets_tuples.sort(function(a, b) {
        return d3.ascending(a.Name, b.Name)
      })

    var xBand = d3.scaleBand()
        .domain(parsed_elemets_tuples.map(d => d.Name)) //gets the first value of the parsed_elemets_tuples
        .range([100, width])
        .paddingInner(0.1);

    var hScale = d3.scaleLinear()
        .domain([0, d3.max(parsed_elemets_tuples, function(d){
          return +d[selection];
        })])
        .range([600, 0]);

//for the toop tip Implementing in order to get started I referenced this resource: http://bl.ocks.org/biovisualize/1016860
        var tooltip = d3.select("#hovTwo")
        	.append("div")
        	.style("position", "absolute")
        	.style("y-index", "10")
        	.style("visibility", "hidden")
          .style("background", "black")
          .style("color", "white")
        	.text("temp");

        d3.select("#chartTwo").selectAll("rect")
          .data(d3.values(parsed_elemets_tuples))
          .enter()
          .append("rect")
          .attr("width", xBand.bandwidth())
          .attr("height", d => 600 - hScale(d[selection]))
          .attr("x", d => xBand(d.Name) + "px")
          .attr("y", d => 50 + hScale(d[selection]) + "px")
          .attr("fill", "purple")
          .on("mouseover", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'grey');
              tooltip.text(d.Name + ", " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "visible");
            }
            })
          .on("mousemove", function(d){

            tooltip.text(d.Name + ", " + selection + " = " + d[selection] );
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

          .on("mouseout", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'purple');
              tooltip.text(d.Name + ", " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "hidden");
            }
            })

          // .on('click', function(d) {
          //   //if the bar is unselected
          //   if(!states_selected.includes(d.Name)){
          //     d3.select(this)
          //       .attr('fill', 'yellow');
          //       states_selected.push(d.Name);
          //       array.push(d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //       return tooltip.style("visibility", "visible");
          //   }else{
          //     d3.select(this)
          //       .attr('fill', 'purple');
          //       //remove the state from the Summary chart
          //       array = array.filter(e => e !== d.Name);
          //       states_selected = states_selected.filter(e => e !== d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //   }
          // });


      //in order to rotate the axis labels to make the graph more readable --> used this source: https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      d3.select("#chartTwo").append("g")
          .attr("transform", "translate(0,650)")
          .call(d3.axisBottom(xBand))
          .selectAll("text")
          .style("text-anchor", "start")
          .style("font", "14px times")
          .attr("dx", "-.8em")
          .attr("dy", "1em")
          .attr("transform", "rotate(15)");
      d3.select("#chartTwo").append("g")
          .attr("transform", "translate(100,50)")
          .call(d3.axisLeft(hScale));

  if (document.querySelector("#drop2").innerHTML === "") {
	var selector = d3.select("#drop2")
    	.append("select")
    	.attr("id","dropdown2")
    	.on("change", function(d){
        selection = document.getElementById("dropdown2");

        update_bar_chart_expense(parsed_elemets_tuples, selection.value, width, height);

         });

    selector.selectAll("option")
      .data(data_attributes)
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return d;
      })
    }

      var button1_ascending = document.getElementById("but")
        .addEventListener("click", function(event) {
          update_order_two(parsed_elemets_tuples, "ascending", selection);
        });

        var button2_decending = document.getElementById("but2")
          .addEventListener("click", function(event) {
            update_order_two(parsed_elemets_tuples, "descending", selection);
          });

          var button1_byCollege= document.getElementById("but3")
            .addEventListener("click", function(event) {
              update_order_two(parsed_elemets_tuples, "byCollege", selection);
            });


}

//update order for chart 1
function update_order(parsed_elemets_tuples, order, selection){

switch (order) {
  case "ascending":
      //put the state names in ascending order
      parsed_elemets_tuples.sort(function(a, b) {
        return d3.ascending(a[selection], b[selection])
      })

      var xBand = d3.scaleBand()
        .domain(parsed_elemets_tuples.map(d => d[selection])) //gets the first value of the parsed_elemets_tuples
        .range([100, width])
        .paddingInner(0.1);

    break;
    case "descending":
        //put the state names in ascending order
        parsed_elemets_tuples.sort(function(a, b) {
          return d3.descending(a[selection], b[selection])
        })

        var xBand = d3.scaleBand()
          .domain(parsed_elemets_tuples.map(d => d[selection])) //gets the first value of the parsed_elemets_tuples
          .range([100, width])
          .paddingInner(0.1);

      break;
      case "byCollege":
          //put the state names in ascending order
          parsed_elemets_tuples.sort(function(a, b) {
            return d3.ascending(a.Name, b.Name)
          })

          var xBand = d3.scaleBand()
            .domain(parsed_elemets_tuples.map(d => d.Name)) //gets the first value of the parsed_elemets_tuples
            .range([100, width])
            .paddingInner(0.1);

        break;
  default:

}



  //y-axis description
  var description = "temp";
  switch (selection) {

    default:
      description = selection ;

  }


  //clear the canvas
  d3.select("#chartOne").selectAll("*").remove();
//  console.log("updated*******************S");

//  console.log(selection);

  var i = 0;
  //track the states that should be added to the table
  var array = [];
  //track the selected states
  var states_selected = [];

  //obtain all the attributes of the data (Population, age, etc.)
  var data_attributes = Object.keys(parsed_elemets_tuples[0])
    .filter(function(d){
      i++;
      // console.log(i);
      // console.log("d = ");
      // console.log(d);
      return  (
            (d != "ID number")
            & (d != "Name")
            & (d != "year")
                        & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "ZIP code")
            & (d != "Highest degree offered")
            & (d != "County name")
            & (d != "Longitude location of institution")
            & (d != "Latitude location of institution")
            & (d != "Religious affiliation")
            & (d != "Offers Less than one year certificate")
            & (d != "Offers One but less than two years certificate")
            & (d != "Offers Associate's degree")
            & (d != "Offers Two but less than 4 years certificate")
            & (d != "Offers Bachelor's degree")
            & (d != "Offers Postbaccalaureate certificate")
            & (d != "Offers Master's degree")
            & (d != "Offers Post-master's certificate")
            & (d != "Offers Doctor's degree - research/scholarship")
            & (d != "Offers Doctor's degree - professional practice")
            & (d != "Offers Doctor's degree - other")
            & (d != "Offers Other degree")
            & (d != "Applicants total")
            & (d != "Admissions total")
            & (d != "Enrolled total")
            & (d != "Percent of freshmen submitting SAT scores")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "SAT Critical Reading 25th percentile score")
            & (d != "SAT Critical Reading 75th percentile score")
            & (d != "SAT Math 25th percentile score")
            & (d != "SAT Math 75th percentile score")
            & (d != "SAT Writing 25th percentile score")
            & (d != "SAT Writing 75th percentile score")
            & (d != "ACT Composite 25th percentile score")
            & (d != "ACT Composite 75th percentile score")
            // & (d != "Estimated enrollment, total")
            // & (d != "Estimated enrollment, full time")
            // & (d != "Estimated enrollment, part time")
            //& (d != "Estimated undergraduate enrollment, total")
            // & (d != "Estimated undergraduate enrollment, full time")
            // & (d != "Estimated undergraduate enrollment, part time")
            // & (d != "Estimated freshman undergraduate enrollment, total")
            // & (d != "Estimated freshman enrollment, full time")
            // & (d != "Estimated freshman enrollment, part time")
            & (d != "Estimated graduate enrollment, total")
            & (d != "Estimated graduate enrollment, full time")
            & (d != "Estimated graduate enrollment, part time")
            & (d != "Associate's degrees awarded")
            & (d != "Bachelor's degrees awarded")
            & (d != "Master's degrees awarded")
            & (d != "Doctor's degrese - research/scholarship awarded")
            & (d != "Doctor's degrees - professional practice awarded")
            & (d != "Doctor's degrees - other awarded")
            & (d != "Certificates of less than 1-year awarded")
            & (d != "Certificates of 1 but less than 2-years awarded")
            & (d != "Certificates of 2 but less than 4-years awarded")
            & (d != "Postbaccalaureate certificates awarded")
            & (d != "Post-master's certificates awarded")
            & (d != "Number of students receiving an Associate's degree")
            & (d != "Number of students receiving a Bachelor's degree")
            & (d != "Number of students receiving a Master's degree")
            & (d != "Number of students receiving a Doctor's degree")
            & (d != "Number of students receiving a certificate of less than 1-year")
            & (d != "Number of students receiving a certificate of 1 but less than 4-years")
            & (d != "Number of students receiving a Postbaccalaureate or Post-master's certificate")
            & (d != "Percent admitted - total")
            & (d != "Admissions yield - total")
            & (d != "Tuition and fees, 2010-11")
            & (d != "Tuition and fees, 2011-12")
            & (d != "Tuition and fees, 2012-13")
            & (d != "Tuition and fees, 2013-14")
            & (d != "Total price for in-state students living on campus 2013-14")
            & (d != "Total price for out-of-state students living on campus 2013-14")
            & (d != "State abbreviation")
            & (d != "FIPS state code")
            & (d != "Geographic region")
            & (d != "Sector of institution")
            & (d != "Level of institution")
            & (d != "Control of institution")
            & (d != "Historically Black College or University")
            & (d != "Tribal college")
            & (d != "Degree of urbanization (Urban-centric locale)")
            & (d != "Carnegie Classification 2010: Basic")
            & (d != "Total  enrollment")
            & (d != "Full-time enrollment")
            & (d != "Part-time enrollment")
            & (d != "Undergraduate enrollment")
            & (d != "Graduate enrollment")
            & (d != "Full-time undergraduate enrollment")
            & (d != "Part-time undergraduate enrollment")
            & (d != "Percent of total enrollment that are American Indian or Alaska Native")
            & (d != "Percent of total enrollment that are Asian")
            & (d != "Percent of total enrollment that are Black or African American")
            & (d != "Percent of total enrollment that are Hispanic/Latino")
            & (d != "Percent of total enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of total enrollment that are White")
            & (d != "Percent of total enrollment that are two or more races")
            & (d != "Percent of total enrollment that are Race/ethnicity unknown")
            & (d != "Percent of total enrollment that are Nonresident Alien")
            & (d != "Percent of total enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of total enrollment that are women")
            & (d != "Data")
            & (d != "20 of 100 columns")
            & (d != "Views")
            & (d != "ID number")
            & (d != "Percent of undergraduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of undergraduate enrollment that are Asian")
            & (d != "Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Black or African American")
            & (d != "Percent of undergraduate enrollment that are Hispanic/Latino")
            & (d != "Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Nonresident Alien")
            & (d != "Percent of undergraduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of undergraduate enrollment that are White")
            & (d != "Percent of undergraduate enrollment that are two or more races")
            & (d != "Percent of undergraduate enrollment that are women")
            & (d != "Percent of graduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of graduate enrollment that are Asian")
            & (d != "Percent of graduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of graduate enrollment that are Black or African American")
            & (d != "Percent of graduate enrollment that are Hispanic/Latino")
            & (d != "Percent of graduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of graduate enrollment that are Nonresident Alien")
            & (d != "Percent of graduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of graduate enrollment that are White")
            & (d != "Percent of graduate enrollment that are two or more races")
            & (d != "Percent of graduate enrollment that are women")
            & (d != "Graduation rate - Bachelor degree within 4 years, total")
            & (d != "Graduation rate - Bachelor degree within 5 years, total")
            & (d != "Graduation rate - Bachelor degree within 6 years, total")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "Percent of freshmen receiving Pell grants")
            & (d != "Percent of freshmen receiving any financial aid")
            & (d != "Percent of freshmen receiving federal student loans")
            & (d != "Percent of freshmen receiving federal, state, local or institutional grant aid")
            & (d != "Percent of freshmen receiving institutional grant aid")
            & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving other loan aid")
            & (d != "Percent of freshmen receiving state/local grant aid")
            & (d != "Percent of freshmen receiving student loan aid")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "Percent of freshmen submitting SAT scores")
          );  //remove the attributes we are not observing
    });

  d3.select("#chartOne")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //make a chart selection to select which data to show in the bar graph
  // var selection = data_attributes[0];

    var xBand = d3.scaleBand()
        .domain(d3.values(parsed_elemets_tuples).map(d => d.Name)) //gets the first value of the parsed_elemets_tuples
        .range([100, width])
        .paddingInner(0.1);

    var hScale = d3.scaleLinear()
        .domain([0, d3.max(parsed_elemets_tuples, function(d){
          return +d[selection];
        })])
        .range([600, 0]);

        var tooltip = d3.select("#hovOne")
          .append("div")
          .style("position", "absolute")
          .style("y-index", "10")
          .style("visibility", "hidden")
          .style("background", "black")
          .style("color", "white")
          .text("a simple tooltip");

        d3.select("#chartOne").selectAll("rect")
          .data(d3.values(parsed_elemets_tuples))
          .enter()
          .append("rect")
          .attr("width", xBand.bandwidth())
          .attr("height", d => 600 - hScale(d[selection]))
          .attr("x", d => xBand(d.Name) + "px")
          .attr("y", d => 50 + hScale(d[selection]) + "px")
          .attr('fill', 'purple')
          .on("mouseover", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'grey');
              tooltip.text(d.Name + " " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "visible");
            }
            })
          .on("mousemove", function(d){

            tooltip.text(d.Name + " " + selection + " = " + d[selection] );
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

          .on("mouseout", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'purple');
              tooltip.text(d.Name + " " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "hidden");
            }
            })

          // .on('click', function(d) {
          //   //if the bar is unselected
          //   if(!states_selected.includes(d.Name)){
          //     d3.select(this)
          //       .attr('fill', 'yellow');
          //       states_selected.push(d.Name);
          //       array.push(d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //       return tooltip.style("visibility", "visible");
          //   }else{
          //     d3.select(this)
          //       .attr('fill', 'purple');
          //       //remove the state from the Summary chart
          //       array = array.filter(e => e !== d.Name);
          //       states_selected = states_selected.filter(e => e !== d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //   }
          // });

      //in order to rotate the axis labels to make the graph more readable --> used this source: https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      d3.select("#chartOne").append("g")
          .attr("transform", "translate(0,650)")
          .call(d3.axisBottom(xBand))
          .selectAll("text")
          .style("text-anchor", "start")
          .style("font", "14px times")
          .attr("dx", "-.8em")
          .attr("dy", "1em")
          .attr("transform", "rotate(15)");
      d3.select("#chartOne").append("g")
          .attr("transform", "translate(100,50)")
          .call(d3.axisLeft(hScale));

          //add y axis
            d3.select("#chartOne").append("text")
              .attr("class", "y axis")
              .attr("text-anchor", "end")
              .attr("y", 20)
              .attr("transform", "translate(0,-100)")
              .attr("transform", "rotate(-90)")
              .text(description);


}

//update order for chart 2
function update_order_two(parsed_elemets_tuples, order, selection){

switch (order) {
  case "ascending":
      //put the state names in ascending order
      parsed_elemets_tuples.sort(function(a, b) {
        return d3.ascending(a[selection], b[selection])
      })

      var xBand = d3.scaleBand()
        .domain(parsed_elemets_tuples.map(d => d[selection])) //gets the first value of the parsed_elemets_tuples
        .range([100, width])
        .paddingInner(0.1);

    break;
    case "descending":
        //put the state names in ascending order
        parsed_elemets_tuples.sort(function(a, b) {
          return d3.descending(a[selection], b[selection])
        })

        var xBand = d3.scaleBand()
          .domain(parsed_elemets_tuples.map(d => d[selection])) //gets the first value of the parsed_elemets_tuples
          .range([100, width])
          .paddingInner(0.1);

      break;
      case "byCollege":
          //put the state names in ascending order
          parsed_elemets_tuples.sort(function(a, b) {
            return d3.ascending(a.Name, b.Name)
          })

          var xBand = d3.scaleBand()
            .domain(parsed_elemets_tuples.map(d => d.Name)) //gets the first value of the parsed_elemets_tuples
            .range([100, width])
            .paddingInner(0.1);

        break;
  default:

}



  //y-axis description
  var description = "temp";
  switch (selection) {

    default:
      description = selection ;

  }


  //clear the canvas
  d3.select("#chartTwo").selectAll("*").remove();
//  console.log("updated*******************S");

//  console.log(selection);

  var i = 0;
  //track the states that should be added to the table
  var array = [];
  //track the selected states
  var states_selected = [];

  //obtain all the attributes of the data (Population, age, etc.)
  var data_attributes = Object.keys(parsed_elemets_tuples[0])
    .filter(function(d){
      i++;
      // console.log(i);
      // console.log("d = ");
      // console.log(d);
      return (  (d != "ID number")
        & (d != "Name")
        & (d != "year")
        & (d != "ZIP code")
        & (d != "Highest degree offered")
        & (d != "County name")
        & (d != "Longitude location of institution")
        & (d != "Latitude location of institution")
        & (d != "Religious affiliation")
        & (d != "Offers Less than one year certificate")
        & (d != "Offers One but less than two years certificate")
        & (d != "Offers Associate's degree")
        & (d != "Offers Two but less than 4 years certificate")
        & (d != "Offers Bachelor's degree")
        & (d != "Offers Postbaccalaureate certificate")
        & (d != "Offers Master's degree")
        & (d != "Offers Post-master's certificate")
        & (d != "Offers Doctor's degree - research/scholarship")
        & (d != "Offers Doctor's degree - professional practice")
        & (d != "Offers Doctor's degree - other")
        & (d != "Offers Other degree")
        & (d != "Applicants total")
        & (d != "Admissions total")
        & (d != "Enrolled total")
        & (d != "Percent of freshmen submitting SAT scores")
        & (d != "Percent of freshmen submitting ACT scores")
        & (d != "SAT Critical Reading 25th percentile score")
        & (d != "SAT Critical Reading 75th percentile score")
        & (d != "SAT Math 25th percentile score")
        & (d != "SAT Math 75th percentile score")
        & (d != "SAT Writing 25th percentile score")
        & (d != "SAT Writing 75th percentile score")
        & (d != "ACT Composite 25th percentile score")
        & (d != "ACT Composite 75th percentile score")
        & (d != "Estimated enrollment, total")
        & (d != "Estimated enrollment, full time")
        & (d != "Estimated enrollment, part time")
        & (d != "Estimated undergraduate enrollment, total")
        & (d != "Estimated undergraduate enrollment, full time")
        & (d != "Estimated undergraduate enrollment, part time")
        & (d != "Estimated freshman undergraduate enrollment, total")
        & (d != "Estimated freshman enrollment, full time")
        & (d != "Estimated freshman enrollment, part time")
        & (d != "Estimated graduate enrollment, total")
        & (d != "Estimated graduate enrollment, full time")
        & (d != "Estimated graduate enrollment, part time")
        & (d != "Associate's degrees awarded")
        & (d != "Bachelor's degrees awarded")
        & (d != "Master's degrees awarded")
        & (d != "Doctor's degrese - research/scholarship awarded")
        & (d != "Doctor's degrees - professional practice awarded")
        & (d != "Doctor's degrees - other awarded")
        & (d != "Certificates of less than 1-year awarded")
        & (d != "Certificates of 1 but less than 2-years awarded")
        & (d != "Certificates of 2 but less than 4-years awarded")
        & (d != "Postbaccalaureate certificates awarded")
        & (d != "Post-master's certificates awarded")
        & (d != "Number of students receiving an Associate's degree")
        & (d != "Number of students receiving a Bachelor's degree")
        & (d != "Number of students receiving a Master's degree")
        & (d != "Number of students receiving a Doctor's degree")
        & (d != "Number of students receiving a certificate of less than 1-year")
        & (d != "Number of students receiving a certificate of 1 but less than 4-years")
        & (d != "Number of students receiving a Postbaccalaureate or Post-master's certificate")
        & (d != "Percent admitted - total")
        & (d != "Admissions yield - total")
        & (d != "Tuition and fees, 2010-11")
        & (d != "Tuition and fees, 2011-12")
        & (d != "Tuition and fees, 2012-13")
        // & (d != "Tuition and fees, 2013-14")
        // & (d != "Total price for in-state students living on campus 2013-14")
        // & (d != "Total price for out-of-state students living on campus 2013-14")
        & (d != "State abbreviation")
        & (d != "FIPS state code")
        & (d != "Geographic region")
        & (d != "Sector of institution")
        & (d != "Level of institution")
        & (d != "Control of institution")
        & (d != "Historically Black College or University")
        & (d != "Tribal college")
        & (d != "Degree of urbanization (Urban-centric locale)")
        & (d != "Carnegie Classification 2010: Basic")
        & (d != "Total  enrollment")
        & (d != "Full-time enrollment")
        & (d != "Part-time enrollment")
        & (d != "Undergraduate enrollment")
        & (d != "Graduate enrollment")
        & (d != "Full-time undergraduate enrollment")
        & (d != "Part-time undergraduate enrollment")
        & (d != "Percent of total enrollment that are American Indian or Alaska Native")
        & (d != "Percent of total enrollment that are Asian")
        & (d != "Percent of total enrollment that are Black or African American")
        & (d != "Percent of total enrollment that are Hispanic/Latino")
        & (d != "Percent of total enrollment that are Native Hawaiian or Other Pacific Islander")
        & (d != "Percent of total enrollment that are White")
        & (d != "Percent of total enrollment that are two or more races")
        & (d != "Percent of total enrollment that are Race/ethnicity unknown")
        & (d != "Percent of total enrollment that are Nonresident Alien")
        & (d != "Percent of total enrollment that are Asian/Native Hawaiian/Pacific Islander")
        & (d != "Percent of total enrollment that are women")
        & (d != "Data")
        & (d != "20 of 100 columns")
        & (d != "Views")
        & (d != "ID number")
        & (d != "Percent of undergraduate enrollment that are American Indian or Alaska Native")
        & (d != "Percent of undergraduate enrollment that are Asian")
        & (d != "Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
        & (d != "Percent of undergraduate enrollment that are Black or African American")
        & (d != "Percent of undergraduate enrollment that are Hispanic/Latino")
        & (d != "Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander")
        & (d != "Percent of undergraduate enrollment that are Nonresident Alien")
        & (d != "Percent of undergraduate enrollment that are Race/ethnicity unknown")
        & (d != "Percent of undergraduate enrollment that are White")
        & (d != "Percent of undergraduate enrollment that are two or more races")
        & (d != "Percent of undergraduate enrollment that are women")
        & (d != "Percent of graduate enrollment that are American Indian or Alaska Native")
        & (d != "Percent of graduate enrollment that are Asian")
        & (d != "Percent of graduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
        & (d != "Percent of graduate enrollment that are Black or African American")
        & (d != "Percent of graduate enrollment that are Hispanic/Latino")
        & (d != "Percent of graduate enrollment that are Native Hawaiian or Other Pacific Islander")
        & (d != "Percent of graduate enrollment that are Nonresident Alien")
        & (d != "Percent of graduate enrollment that are Race/ethnicity unknown")
        & (d != "Percent of graduate enrollment that are White")
        & (d != "Percent of graduate enrollment that are two or more races")
        & (d != "Percent of graduate enrollment that are women")
        & (d != "Graduation rate - Bachelor degree within 4 years, total")
        & (d != "Graduation rate - Bachelor degree within 5 years, total")
        & (d != "Graduation rate - Bachelor degree within 6 years, total")
        & (d != "Percent of freshmen receiving federal grant aid")
        & (d != "Percent of freshmen receiving Pell grants")
        & (d != "Percent of freshmen receiving any financial aid")
        & (d != "Percent of freshmen receiving federal student loans")
        & (d != "Percent of freshmen receiving federal, state, local or institutional grant aid")
        & (d != "Percent of freshmen receiving institutional grant aid")
        & (d != "Percent of freshmen receiving other federal grant aid")
        & (d != "Percent of freshmen receiving other loan aid")
        & (d != "Percent of freshmen receiving state/local grant aid")
        & (d != "Percent of freshmen receiving student loan aid")
        & (d != "Percent of freshmen submitting ACT scores")
        & (d != "Percent of freshmen submitting SAT scores")); //remove the attributes we are not observing
    });


  d3.select("#chartTwo")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //make a chart selection to select which data to show in the bar graph
  // var selection = data_attributes[0];

    var xBand = d3.scaleBand()
        .domain(d3.values(parsed_elemets_tuples).map(d => d.Name)) //gets the first value of the parsed_elemets_tuples
        .range([100, width])
        .paddingInner(0.1);

    var hScale = d3.scaleLinear()
        .domain([0, d3.max(parsed_elemets_tuples, function(d){
          return +d[selection];
        })])
        .range([600, 0]);

        var tooltip = d3.select("#hovTwo")
          .append("div")
          .style("position", "absolute")
          .style("y-index", "10")
          .style("visibility", "hidden")
          .style("background", "black")
          .style("color", "white")
          .text("a simple tooltip");

        d3.select("#chartTwo").selectAll("rect")
          .data(d3.values(parsed_elemets_tuples))
          .enter()
          .append("rect")
          .attr("width", xBand.bandwidth())
          .attr("height", d => 600 - hScale(d[selection]))
          .attr("x", d => xBand(d.Name) + "px")
          .attr("y", d => 50 + hScale(d[selection]) + "px")
          .attr('fill', 'purple')
          .on("mouseover", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'grey');
              tooltip.text(d.Name + " " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "visible");
            }
            })
          .on("mousemove", function(d){

            tooltip.text(d.Name + " " + selection + " = " + d[selection] );
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

          .on("mouseout", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'purple');
              tooltip.text(d.Name + " " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "hidden");
            }
            })

          // .on('click', function(d) {
          //   //if the bar is unselected
          //   if(!states_selected.includes(d.Name)){
          //     d3.select(this)
          //       .attr('fill', 'yellow');
          //       states_selected.push(d.Name);
          //       array.push(d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //       return tooltip.style("visibility", "visible");
          //   }else{
          //     d3.select(this)
          //       .attr('fill', 'purple');
          //       //remove the state from the Summary chart
          //       array = array.filter(e => e !== d.Name);
          //       states_selected = states_selected.filter(e => e !== d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //   }
          // });

      //in order to rotate the axis labels to make the graph more readable --> used this source: https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      d3.select("#chartTwo").append("g")
          .attr("transform", "translate(0,650)")
          .call(d3.axisBottom(xBand))
          .selectAll("text")
          .style("text-anchor", "start")
          .style("font", "14px times")
          .attr("dx", "-.8em")
          .attr("dy", "1em")
          .attr("transform", "rotate(15)");
      d3.select("#chartTwo").append("g")
          .attr("transform", "translate(100,50)")
          .call(d3.axisLeft(hScale));

          //add y axis
            d3.select("#chartTwo").append("text")
              .attr("class", "y axis")
              .attr("text-anchor", "end")
              .attr("y", 20)
              .attr("transform", "translate(0,-100)")
              .attr("transform", "rotate(-90)")
              .text(description);


}

//update bar chart 1
function update_bar_chart(parsed_elemets_tuples, selection, width, height){

  //y-axis description
  var description = "temp";
  switch (selection) {
    default:
      description = selection ;

  }


  //clear the canvas
  //d3.selectAll("svg > *").remove();
  d3.select("#chartOne").selectAll("*").remove();

  // console.log("updated*******************S");
  //
  // console.log(selection);

  var i = 0;
  //track the states that should be added to the table
  var array = [];
  //track the selected states
  var states_selected = [];

  //obtain all the attributes of the data (Population, age, etc.)
  var data_attributes = Object.keys(parsed_elemets_tuples[0])
    .filter(function(d){
      i++;
      // console.log(i);
      // console.log("d = ");
      // console.log(d);
      return (
            (d != "ID number")
            & (d != "Name")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "year")
            & (d != "Percent of first-time undergraduates - foreign countries")
            & (d != "Percent of first-time undergraduates - in-state")
            & (d != "Percent of first-time undergraduates - out-of-state")
            & (d != "Percent of first-time undergraduates - residence unknown")
            & (d != "ZIP code")
            & (d != "Highest degree offered")
            & (d != "County name")
            & (d != "Longitude location of institution")
            & (d != "Latitude location of institution")
            & (d != "Religious affiliation")
            & (d != "Offers Less than one year certificate")
            & (d != "Offers One but less than two years certificate")
            & (d != "Offers Associate's degree")
            & (d != "Offers Two but less than 4 years certificate")
            & (d != "Offers Bachelor's degree")
            & (d != "Offers Postbaccalaureate certificate")
            & (d != "Offers Master's degree")
            & (d != "Offers Post-master's certificate")
            & (d != "Offers Doctor's degree - research/scholarship")
            & (d != "Offers Doctor's degree - professional practice")
            & (d != "Offers Doctor's degree - other")
            & (d != "Offers Other degree")
            & (d != "Applicants total")
            & (d != "Admissions total")
            & (d != "Enrolled total")
            & (d != "Percent of freshmen submitting SAT scores")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "SAT Critical Reading 25th percentile score")
            & (d != "SAT Critical Reading 75th percentile score")
            & (d != "SAT Math 25th percentile score")
            & (d != "SAT Math 75th percentile score")
            & (d != "SAT Writing 25th percentile score")
            & (d != "SAT Writing 75th percentile score")
            & (d != "ACT Composite 25th percentile score")
            & (d != "ACT Composite 75th percentile score")
            // & (d != "Estimated enrollment, total")
            // & (d != "Estimated enrollment, full time")
            // & (d != "Estimated enrollment, part time")
            //& (d != "Estimated undergraduate enrollment, total")
            // & (d != "Estimated undergraduate enrollment, full time")
            // & (d != "Estimated undergraduate enrollment, part time")
            // & (d != "Estimated freshman undergraduate enrollment, total")
            // & (d != "Estimated freshman enrollment, full time")
            // & (d != "Estimated freshman enrollment, part time")
            & (d != "Estimated graduate enrollment, total")
            & (d != "Estimated graduate enrollment, full time")
            & (d != "Estimated graduate enrollment, part time")
            & (d != "Associate's degrees awarded")
            & (d != "Bachelor's degrees awarded")
            & (d != "Master's degrees awarded")
            & (d != "Doctor's degrese - research/scholarship awarded")
            & (d != "Doctor's degrees - professional practice awarded")
            & (d != "Doctor's degrees - other awarded")
            & (d != "Certificates of less than 1-year awarded")
            & (d != "Certificates of 1 but less than 2-years awarded")
            & (d != "Certificates of 2 but less than 4-years awarded")
            & (d != "Postbaccalaureate certificates awarded")
            & (d != "Post-master's certificates awarded")
            & (d != "Number of students receiving an Associate's degree")
            & (d != "Number of students receiving a Bachelor's degree")
            & (d != "Number of students receiving a Master's degree")
            & (d != "Number of students receiving a Doctor's degree")
            & (d != "Number of students receiving a certificate of less than 1-year")
            & (d != "Number of students receiving a certificate of 1 but less than 4-years")
            & (d != "Number of students receiving a Postbaccalaureate or Post-master's certificate")
            & (d != "Percent admitted - total")
            & (d != "Admissions yield - total")
            & (d != "Tuition and fees, 2010-11")
            & (d != "Tuition and fees, 2011-12")
            & (d != "Tuition and fees, 2012-13")
            & (d != "Tuition and fees, 2013-14")
            & (d != "Total price for in-state students living on campus 2013-14")
            & (d != "Total price for out-of-state students living on campus 2013-14")
            & (d != "State abbreviation")
            & (d != "FIPS state code")
            & (d != "Geographic region")
            & (d != "Sector of institution")
            & (d != "Level of institution")
            & (d != "Control of institution")
            & (d != "Historically Black College or University")
            & (d != "Tribal college")
            & (d != "Degree of urbanization (Urban-centric locale)")
            & (d != "Carnegie Classification 2010: Basic")
            & (d != "Total  enrollment")
            & (d != "Full-time enrollment")
            & (d != "Part-time enrollment")
            & (d != "Undergraduate enrollment")
            & (d != "Graduate enrollment")
            & (d != "Full-time undergraduate enrollment")
            & (d != "Part-time undergraduate enrollment")
            & (d != "Percent of total enrollment that are American Indian or Alaska Native")
            & (d != "Percent of total enrollment that are Asian")
            & (d != "Percent of total enrollment that are Black or African American")
            & (d != "Percent of total enrollment that are Hispanic/Latino")
            & (d != "Percent of total enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of total enrollment that are White")
            & (d != "Percent of total enrollment that are two or more races")
            & (d != "Percent of total enrollment that are Race/ethnicity unknown")
            & (d != "Percent of total enrollment that are Nonresident Alien")
            & (d != "Percent of total enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of total enrollment that are women")
            & (d != "Data")
            & (d != "20 of 100 columns")
            & (d != "Views")
            & (d != "ID number")
            & (d != "Percent of undergraduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of undergraduate enrollment that are Asian")
            & (d != "Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Black or African American")
            & (d != "Percent of undergraduate enrollment that are Hispanic/Latino")
            & (d != "Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Nonresident Alien")
            & (d != "Percent of undergraduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of undergraduate enrollment that are White")
            & (d != "Percent of undergraduate enrollment that are two or more races")
            & (d != "Percent of undergraduate enrollment that are women")
            & (d != "Percent of graduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of graduate enrollment that are Asian")
            & (d != "Percent of graduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of graduate enrollment that are Black or African American")
            & (d != "Percent of graduate enrollment that are Hispanic/Latino")
            & (d != "Percent of graduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of graduate enrollment that are Nonresident Alien")
            & (d != "Percent of graduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of graduate enrollment that are White")
            & (d != "Percent of graduate enrollment that are two or more races")
            & (d != "Percent of graduate enrollment that are women")
            & (d != "Graduation rate - Bachelor degree within 4 years, total")
            & (d != "Graduation rate - Bachelor degree within 5 years, total")
            & (d != "Graduation rate - Bachelor degree within 6 years, total")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "Percent of freshmen receiving Pell grants")
            & (d != "Percent of freshmen receiving any financial aid")
            & (d != "Percent of freshmen receiving federal student loans")
            & (d != "Percent of freshmen receiving federal, state, local or institutional grant aid")
            & (d != "Percent of freshmen receiving institutional grant aid")
            & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving other loan aid")
            & (d != "Percent of freshmen receiving state/local grant aid")
            & (d != "Percent of freshmen receiving student loan aid")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "Percent of freshmen submitting SAT scores")
          );//remove the attributes we are not observing
    });


  d3.select("#chartOne")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //make a chart selection to select which data to show in the bar graph
  // var selection = data_attributes[0];

    var xBand = d3.scaleBand()
        .domain(d3.values(parsed_elemets_tuples).map(d => d.Name)) //gets the first value of the parsed_elemets_tuples
        .range([100, width])
        .paddingInner(0.1);

    var hScale = d3.scaleLinear()
        .domain([0, d3.max(parsed_elemets_tuples, function(d){
          return +d[selection];
        })])
        .range([600, 0]);

        var tooltip = d3.select("#hovOne")
          .append("div")
          .style("position", "absolute")
          .style("y-index", "10")
          .style("visibility", "hidden")
          .style("background", "black")
          .style("color", "white")
          .text("a simple tooltip");

        d3.select("#chartOne").selectAll("rect")
          .data(d3.values(parsed_elemets_tuples))
          .enter()
          .append("rect")
          .attr("width", xBand.bandwidth())
          .attr("height", d => 600 - hScale(d[selection]))
          .attr("x", d => xBand(d.Name) + "px")
          .attr("y", d => 50 + hScale(d[selection]) + "px")
          .attr('fill', 'purple')
          .on("mouseover", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'grey');
              tooltip.text(d.Name + " " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "visible");
            }
            })
          .on("mousemove", function(d){

            tooltip.text(d.Name + " " + selection + " = " + d[selection] );
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

          .on("mouseout", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'purple');
              tooltip.text(d.Name + " " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "hidden");
            }
            })

          // .on('click', function(d) {
          //   //if the bar is unselected
          //   if(!states_selected.includes(d.Name)){
          //     d3.select(this)
          //       .attr('fill', 'yellow');
          //       states_selected.push(d.Name);
          //       array.push(d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //       return tooltip.style("visibility", "visible");
          //   }else{
          //     d3.select(this)
          //       .attr('fill', 'purple');
          //       //remove the state from the Summary chart
          //       array = array.filter(e => e !== d.Name);
          //       states_selected = states_selected.filter(e => e !== d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //   }
          // });

      //in order to rotate the axis labels to make the graph more readable --> used this source: https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      d3.select("#chartOne").append("g")
          .attr("transform", "translate(0,650)")
          .call(d3.axisBottom(xBand))
          .selectAll("text")
          .style("text-anchor", "start")
          .style("font", "14px times")
          .attr("dx", "-.8em")
          .attr("dy", "1em")
          .attr("transform", "rotate(15)");
      d3.select("#chartOne").append("g")
          .attr("transform", "translate(100,50)")
          .call(d3.axisLeft(hScale));

          //add y axis
            d3.select("#chartOne").append("text")
              .attr("class", "y axis")
              .attr("text-anchor", "end")
              .attr("y", 20)
              .attr("transform", "translate(0,-100)")
              .attr("transform", "rotate(-90)")
              .text(description);


              var button1_ascending = document.getElementById("but1_Chart1")
                .addEventListener("click", function(event) {
                  update_order(parsed_elemets_tuples, "ascending", selection);
                });

                var button2_decending = document.getElementById("but2_Chart1")
                  .addEventListener("click", function(event) {
                    update_order(parsed_elemets_tuples, "descending", selection);
                  });

                  var button1_byCollege= document.getElementById("but3_Chart1")
                    .addEventListener("click", function(event) {
                      update_order(parsed_elemets_tuples, "byCollege", selection);
                    });
}

//update bar chart 2
function update_bar_chart_expense(parsed_elemets_tuples, selection, width, height){

  //y-axis description
  var description = "temp";
  switch (selection) {
    default:
      description = selection ;

  }


  //clear the canvas
  //d3.selectAll("svg > *").remove();
  d3.select("#chartTwo").selectAll("*").remove();

  // console.log("updated*******************S");
  //
  // console.log(selection);

  var i = 0;
  //track the states that should be added to the table
  var array = [];
  //track the selected states
  var states_selected = [];

  //obtain all the attributes of the data (Population, age, etc.)
  var data_attributes = Object.keys(parsed_elemets_tuples[0])
    .filter(function(d){
      i++;
      // console.log(i);
      // console.log("d = ");
      // console.log(d);
      return (
            (d != "ID number")
            & (d != "Name")
            & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "year")
            & (d != "ZIP code")
            & (d != "Percent of first-time undergraduates - foreign countries")
            & (d != "Percent of first-time undergraduates - in-state")
            & (d != "Percent of first-time undergraduates - out-of-state")
            & (d != "Percent of first-time undergraduates - residence unknown")
            & (d != "Highest degree offered")
            & (d != "County name")
            & (d != "Longitude location of institution")
            & (d != "Latitude location of institution")
            & (d != "Religious affiliation")
            & (d != "Offers Less than one year certificate")
            & (d != "Offers One but less than two years certificate")
            & (d != "Offers Associate's degree")
            & (d != "Offers Two but less than 4 years certificate")
            & (d != "Offers Bachelor's degree")
            & (d != "Offers Postbaccalaureate certificate")
            & (d != "Offers Master's degree")
            & (d != "Offers Post-master's certificate")
            & (d != "Offers Doctor's degree - research/scholarship")
            & (d != "Offers Doctor's degree - professional practice")
            & (d != "Offers Doctor's degree - other")
            & (d != "Offers Other degree")
            & (d != "Applicants total")
            & (d != "Admissions total")
            & (d != "Enrolled total")
            & (d != "Percent of freshmen submitting SAT scores")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "SAT Critical Reading 25th percentile score")
            & (d != "SAT Critical Reading 75th percentile score")
            & (d != "SAT Math 25th percentile score")
            & (d != "SAT Math 75th percentile score")
            & (d != "SAT Writing 25th percentile score")
            & (d != "SAT Writing 75th percentile score")
            & (d != "ACT Composite 25th percentile score")
            & (d != "ACT Composite 75th percentile score")
            & (d != "Estimated enrollment, total")
            & (d != "Estimated enrollment, full time")
            & (d != "Estimated enrollment, part time")
            & (d != "Estimated undergraduate enrollment, total")
            & (d != "Estimated undergraduate enrollment, full time")
            & (d != "Estimated undergraduate enrollment, part time")
            & (d != "Estimated freshman undergraduate enrollment, total")
            & (d != "Estimated freshman enrollment, full time")
            & (d != "Estimated freshman enrollment, part time")
            & (d != "Estimated graduate enrollment, total")
            & (d != "Estimated graduate enrollment, full time")
            & (d != "Estimated graduate enrollment, part time")
            & (d != "Associate's degrees awarded")
            & (d != "Bachelor's degrees awarded")
            & (d != "Master's degrees awarded")
            & (d != "Doctor's degrese - research/scholarship awarded")
            & (d != "Doctor's degrees - professional practice awarded")
            & (d != "Doctor's degrees - other awarded")
            & (d != "Certificates of less than 1-year awarded")
            & (d != "Certificates of 1 but less than 2-years awarded")
            & (d != "Certificates of 2 but less than 4-years awarded")
            & (d != "Postbaccalaureate certificates awarded")
            & (d != "Post-master's certificates awarded")
            & (d != "Number of students receiving an Associate's degree")
            & (d != "Number of students receiving a Bachelor's degree")
            & (d != "Number of students receiving a Master's degree")
            & (d != "Number of students receiving a Doctor's degree")
            & (d != "Number of students receiving a certificate of less than 1-year")
            & (d != "Number of students receiving a certificate of 1 but less than 4-years")
            & (d != "Number of students receiving a Postbaccalaureate or Post-master's certificate")
            & (d != "Percent admitted - total")
            & (d != "Admissions yield - total")
            & (d != "Tuition and fees, 2010-11")
            & (d != "Tuition and fees, 2011-12")
            & (d != "Tuition and fees, 2012-13")
            // & (d != "Tuition and fees, 2013-14")
            // & (d != "Total price for in-state students living on campus 2013-14")
            // & (d != "Total price for out-of-state students living on campus 2013-14")
            & (d != "State abbreviation")
            & (d != "FIPS state code")
            & (d != "Geographic region")
            & (d != "Sector of institution")
            & (d != "Level of institution")
            & (d != "Control of institution")
            & (d != "Historically Black College or University")
            & (d != "Tribal college")
            & (d != "Degree of urbanization (Urban-centric locale)")
            & (d != "Carnegie Classification 2010: Basic")
            & (d != "Total  enrollment")
            & (d != "Full-time enrollment")
            & (d != "Part-time enrollment")
            & (d != "Undergraduate enrollment")
            & (d != "Graduate enrollment")
            & (d != "Full-time undergraduate enrollment")
            & (d != "Part-time undergraduate enrollment")
            & (d != "Percent of total enrollment that are American Indian or Alaska Native")
            & (d != "Percent of total enrollment that are Asian")
            & (d != "Percent of total enrollment that are Black or African American")
            & (d != "Percent of total enrollment that are Hispanic/Latino")
            & (d != "Percent of total enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of total enrollment that are White")
            & (d != "Percent of total enrollment that are two or more races")
            & (d != "Percent of total enrollment that are Race/ethnicity unknown")
            & (d != "Percent of total enrollment that are Nonresident Alien")
            & (d != "Percent of total enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of total enrollment that are women")
            & (d != "Data")
            & (d != "20 of 100 columns")
            & (d != "Views")
            & (d != "ID number")
            & (d != "Percent of undergraduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of undergraduate enrollment that are Asian")
            & (d != "Percent of undergraduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Black or African American")
            & (d != "Percent of undergraduate enrollment that are Hispanic/Latino")
            & (d != "Percent of undergraduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of undergraduate enrollment that are Nonresident Alien")
            & (d != "Percent of undergraduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of undergraduate enrollment that are White")
            & (d != "Percent of undergraduate enrollment that are two or more races")
            & (d != "Percent of undergraduate enrollment that are women")
            & (d != "Percent of graduate enrollment that are American Indian or Alaska Native")
            & (d != "Percent of graduate enrollment that are Asian")
            & (d != "Percent of graduate enrollment that are Asian/Native Hawaiian/Pacific Islander")
            & (d != "Percent of graduate enrollment that are Black or African American")
            & (d != "Percent of graduate enrollment that are Hispanic/Latino")
            & (d != "Percent of graduate enrollment that are Native Hawaiian or Other Pacific Islander")
            & (d != "Percent of graduate enrollment that are Nonresident Alien")
            & (d != "Percent of graduate enrollment that are Race/ethnicity unknown")
            & (d != "Percent of graduate enrollment that are White")
            & (d != "Percent of graduate enrollment that are two or more races")
            & (d != "Percent of graduate enrollment that are women")
            & (d != "Graduation rate - Bachelor degree within 4 years, total")
            & (d != "Graduation rate - Bachelor degree within 5 years, total")
            & (d != "Graduation rate - Bachelor degree within 6 years, total")
            & (d != "Percent of freshmen receiving federal grant aid")
            & (d != "Percent of freshmen receiving Pell grants")
            & (d != "Percent of freshmen receiving any financial aid")
            & (d != "Percent of freshmen receiving federal student loans")
            & (d != "Percent of freshmen receiving federal, state, local or institutional grant aid")
            & (d != "Percent of freshmen receiving institutional grant aid")
            & (d != "Percent of freshmen receiving other federal grant aid")
            & (d != "Percent of freshmen receiving other loan aid")
            & (d != "Percent of freshmen receiving state/local grant aid")
            & (d != "Percent of freshmen receiving student loan aid")
            & (d != "Percent of freshmen submitting ACT scores")
            & (d != "Percent of freshmen submitting SAT scores")
          ); //remove the attributes we are not observing
    });


  d3.select("#chartTwo")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //make a chart selection to select which data to show in the bar graph
  // var selection = data_attributes[0];

    var xBand = d3.scaleBand()
        .domain(d3.values(parsed_elemets_tuples).map(d => d.Name)) //gets the first value of the parsed_elemets_tuples
        .range([100, width])
        .paddingInner(0.1);

    var hScale = d3.scaleLinear()
        .domain([0, d3.max(parsed_elemets_tuples, function(d){
          return +d[selection];
        })])
        .range([600, 0]);

        var tooltip = d3.select("#hovTwo")
          .append("div")
          .style("position", "absolute")
          .style("y-index", "10")
          .style("visibility", "hidden")
          .style("background", "black")
          .style("color", "white")
          .text("a simple tooltip");

        d3.select("#chartTwo").selectAll("rect")
          .data(d3.values(parsed_elemets_tuples))
          .enter()
          .append("rect")
          .attr("width", xBand.bandwidth())
          .attr("height", d => 600 - hScale(d[selection]))
          .attr("x", d => xBand(d.Name) + "px")
          .attr("y", d => 50 + hScale(d[selection]) + "px")
          .attr('fill', 'purple')
          .on("mouseover", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'grey');
              tooltip.text(d.Name + " " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "visible");
            }
            })
          .on("mousemove", function(d){

            tooltip.text(d.Name + " " + selection + " = " + d[selection] );
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

          .on("mouseout", function(d){
            if(!states_selected.includes(d.Name)){
              d3.select(this)
                .attr('fill', 'purple');
              tooltip.text(d.Name + " " + selection + " = " + d[selection] );
              return tooltip.style("visibility", "hidden");
            }
            })

          // .on('click', function(d) {
          //   //if the bar is unselected
          //   if(!states_selected.includes(d.Name)){
          //     d3.select(this)
          //       .attr('fill', 'yellow');
          //       states_selected.push(d.Name);
          //       array.push(d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //       return tooltip.style("visibility", "visible");
          //   }else{
          //     d3.select(this)
          //       .attr('fill', 'purple');
          //       //remove the state from the Summary chart
          //       array = array.filter(e => e !== d.Name);
          //       states_selected = states_selected.filter(e => e !== d.Name);
          //       create_table(parsed_elemets_tuples, selection, array);
          //   }
          // });

      //in order to rotate the axis labels to make the graph more readable --> used this source: https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      d3.select("#chartTwo").append("g")
          .attr("transform", "translate(0,650)")
          .call(d3.axisBottom(xBand))
          .selectAll("text")
          .style("text-anchor", "start")
          .style("font", "14px times")
          .attr("dx", "-.8em")
          .attr("dy", "1em")
          .attr("transform", "rotate(15)");
      d3.select("#chartTwo").append("g")
          .attr("transform", "translate(100,50)")
          .call(d3.axisLeft(hScale));

          //add y axis
            d3.select("#chartTwo").append("text")
              .attr("class", "y axis")
              .attr("text-anchor", "end")
              .attr("y", 20)
              .attr("transform", "translate(0,-100)")
              .attr("transform", "rotate(-90)")
              .text(description);


              var button1_ascending = document.getElementById("but")
                .addEventListener("click", function(event) {
                  update_order_two(parsed_elemets_tuples, "ascending", selection);
                });

                var button2_decending = document.getElementById("but2")
                  .addEventListener("click", function(event) {
                    update_order_two(parsed_elemets_tuples, "descending", selection);
                  });

                  var button1_byCollege= document.getElementById("but3")
                    .addEventListener("click", function(event) {
                      update_order_two(parsed_elemets_tuples, "byCollege", selection);
                    });



}
