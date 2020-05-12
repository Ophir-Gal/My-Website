function renderTable(jsonTuples) {
  console.log("got here");
  var table = document.getElementById("data-tab");
  // clear current table
  removeChildren(table);

  //append to table
  if(jsonTuples && jsonTuples.length > 0) {
    createHeader(d3.select(table),jsonTuples);
    jsonTuples.map(tuple => createRow(d3.select(table),tuple));
  }
}

function createHeader(tableElement,jsonTuples) {
  var headerRow = tableElement.append("tr");
  headerRow.selectAll("th")
    .data(Object.keys(jsonTuples[0]))
    .enter()
    .append("th")
    .text(d => d);
}

function removeChildren(el) {
  while(el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function createRow(table,tuple) {
  var row = table.append("tr").classed("data-row",true);
  for(attribute in tuple) {
    row.append("td").text(tuple[attribute]);
  }
}
