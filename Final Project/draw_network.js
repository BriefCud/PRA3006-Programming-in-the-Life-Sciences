function DrawNetwork(dataset) {
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1280 - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;

  var svg = d3.select("#network")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var link = svg.append("g")
    .append("class","links")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
      .attr("stroke-width",20);
      //.attr("fill","#000000");

  var node = svg.append("g")
    .attr("class","nodes")
    .selectAll("g")
    .data(data.nodes)
    .enter().append("g");
      
  var circle = node.append("circle")
    .attr("r",5)
    .attr("fill", "#03fce8")
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
    
      
  var lables = node.append("text")
    .text(function(d){return d.name;})
    .attr('x',6)
    .attr('y',3);
    
    node.append("title").text(function(d){return d.name});
    
    
  var simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink().id(function(d) { return d.id; }).links(data.links).distance(500))
    .force("charge", d3.forceManyBody().strength(-9))
    .force("center", d3.forceCenter(width / 2, height / 2));
    
    simulation.nodes(data.nodes)
    .on("tick",ticked);
    simulation.force("link")
    .links(data.links);

function ticked() {
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
function dragstarted(d) {
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
