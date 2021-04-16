// select html elements using d3
var dropdown = d3.select("#selDataset");
var demotable = d3.select("#sample-metadata");
var barchart = d3.select("#bar");
var bubblechart = d3.select("#bubble");
var gaugechart = d3.select("#gauge");

// plot data at page initialization
function init() {

  // read in data from json file using d3
  d3.json("samples.json").then(function(data) {
    var names = Object.values(data.names);
  
    // add test samples to dropdown menu
    names.forEach((item) => {
      var row = dropdown.append("option").attr("value", item);
      row.text(item);
    });
  });
  
  // run plot data function
  plotData();

};

// plot data function to update page
function plotData() {

  // read in data from json file using d3
  d3.json("samples.json").then(function(data) {
    var samples = Object.values(data.samples);
    var names = Object.values(data.names);
    var metadata = Object.values(data.metadata);
    
    // populate demo table
    var tableBody = demotable.append("tbody");
    var inputValue = dropdown.property("value");

    var filteredData = metadata.filter(item => item.id == inputValue);
    var filteredSamples = samples.filter(item => item.id == inputValue);

    filteredData.forEach((item) => {
      row = tableBody.append("tr");
      Object.entries(item).forEach(value => {
          cell = row.append("tr");
          cell.text("");
          cell.text(`${value[0]}: ${value[1]}`);
      });
    });
    
    // slice the sample data to create horizontal bar chart
    var barSampleValues = filteredSamples[0].sample_values.slice(0,10).reverse();
    var barOTUs = filteredSamples[0].otu_ids.slice(0,10).reverse().map(data => `OTU ` + data);
    var barLabels = filteredSamples[0].otu_labels.slice(0,10).reverse();

    // prepare and plot horizontal bar chart
    var trace1 = {
      x: barSampleValues,
      y: barOTUs,
      text: barLabels,
      type: "bar",
      orientation: "h"
    };
    var bardata = [trace1];

    var barlayout = {
        title: "OTUs in Sample",
        xaxis: {title: "Prevalence in Sample"},
        yaxis: {title: "OTU ID Number"}  
    };
    Plotly.newPlot("bar", bardata, barlayout);

    // select sample data to create bubble chart
    var bubbleSampleValues = filteredSamples[0].sample_values;
    var bubbleOTUs = filteredSamples[0].otu_ids;
    var bubbleLabels = filteredSamples[0].otu_labels;

    // prepare and plot bubble chart
    var trace2 = {
      x: bubbleOTUs,
      y: bubbleSampleValues,
      mode: 'markers',
      marker: {
        size: bubbleSampleValues,
        color: bubbleOTUs, 
        text: bubbleLabels
      }
    };
    var bubbledata = [trace2];

    var bubblelayout = {
        xaxis: {title: "OTU ID Number"},
        yaxis: {title: "Prevalence in Sample"}  
    };
    Plotly.newPlot("bubble", bubbledata, bubblelayout);

  });
};

// reset function
function resetData() {

  // reset table and charts
  demotable.html("");
  barchart.html("");
  bubblechart.html("");
  gaugechart.html("");
};

function optionChanged() {

  resetData();
  plotData();

}; 

// when dropdown menu changes run the optionChanged function
d3.selectAll("#selDataset").on("change", optionChanged);

// populate page with data of first test sample
init();