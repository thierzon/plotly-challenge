// Use d3.json() to fetch data from JSON file
d3.json("samples.json").then(function(data) {
  var samples = Object.values(data.samples);
  var names = Object.values(data.names);
  var metadata = Object.values(data.metadata);
  
  // select and populate dropdown menu
  var dropdown = d3.select("#selDataset");
  names.forEach((item) => {
    var row = dropdown.append("option")
    .attr("value", item);
    row.text(item);
  });
  
  // select and populate demographics table
  var demodata = d3.select("#sample-metadata");

  demodata.html("")
  
  var inputElement = d3.select("#selDataset");
  var tableBody = demodata.append("tbody");
  var inputValue = inputElement.property("value");

  var filteredData = metadata.filter(item => item.id == inputValue);
  var filteredSamples = samples.filter(item => item.id == inputValue);

  filteredData.forEach((item) => {
    row = tableBody.append("tr");
    Object.entries(item).forEach(value => {
        cell = row.append("tr");
        cell.text("");
        cell.text(`${value[0]}: ${value[1]}`);
    })
  });

  var slicedSampleValues = filteredSamples[0].sample_values.slice(0,10).reverse();
  var slicedOTUs = filteredSamples[0].otu_ids.slice(0,10).reverse().map(data => `OTU ` + data);
  var slicedLabels = filteredSamples[0].otu_labels.slice(0,10).reverse();

  var trace1 = {
    x: slicedSampleValues,
    y: slicedOTUs,
    text: slicedLabels,
    type: "bar",
    orientation: "h"
  };
  var bardata = [trace1];

  var barlayout = {
      title: "Top 10 OTUs in Sample",
      xaxis: {title: "Prevalence in Sample"},
      yaxis: {title: "OTU ID Number"}  
  };
  Plotly.newPlot("bar", bardata, barlayout);


  dropdown.on("change", dropdownchange);

});

