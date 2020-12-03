function DrawNetwork(dataset) {
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1280 - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;//define size of the svg, 1280*720 seems to be the best to give us enough space to display everything and fit on an average 1080p display

  var svg = d3.select("#network")//create the svg to attach the network graph to
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var link = svg.append("g")//define what the links will be and append them to the svg
    .append("class","links")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
      .attr("stroke-width",20);
      //.attr("fill","#000000");

  var node = svg.append("g")//define what the nodes will be and append them to the svg
    .attr("class","nodes")
    .selectAll("g")
    .data(data.nodes)
    .enter().append("g");
      
  var circle = node.append("circle")//append a circle to the node to make it visible
    .attr("r",5)
    .attr("fill", "#03fce8")
    .call(d3.drag()//enables drag functionality, clicking on a circle and dragging it will move it, can make it easier to see if you want to look at a specific node
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
    
      
  var lables = node.append("text")//append labels(drug names) to the nodes
    .text(function(d){return d.name;})
    .attr('x',6)
    .attr('y',3);
    
    node.append("title").text(function(d){return d.name});
    
    
  var simulation = d3.forceSimulation(data.nodes)//does the force simulation of the graph
    .force("link", d3.forceLink().id(function(d) { return d.id; }).links(data.links).distance(500))//define the link distance as a constant, makes it easier to see links
    .force("charge", d3.forceManyBody().strength(-5))
    .force("center", d3.forceCenter(width / 2, height / 2));
    
    simulation.nodes(data.nodes)//tells the nodes to simulate their force at each tick of the ticked function
    .on("tick",ticked);
    simulation.force("link")//same but for links
    .links(data.links);

function ticked() {
  //ticked function to update position of each node after force simulation
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
  //Functions to simulate drag force and keep track of the cursor
function dragstarted(d)

{
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}  
}
