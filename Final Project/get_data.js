/**
 *Updates data based on selected condition and drug from dropdown on HTML, calls DrawNetwork with dataset specified
 *input wbk_bio - use wbk_bio as input every time, tells function to use bio2rdf sql endpoint
 *input condition - takes selected condition from html dropdown and uses it to do the queries
 *input drug - takes selected illicit drug from html dropdown and uses it to do the queries
 *return void - this function returns void, its purpose is to draw the networkgraph with data we specify
 */


function UpdateData(wbk_bio,condition,drug) {
  //this function updates the data that is passed to the network graph to be drawn
  GetData(wbk_bio,condition,drug).then(
    function(dataset){
      set = dataset.data;
      noInteract = dataset.noI;
      var max = set.length-1;//since illicit drug will always be at the end of the json array, this is it's index
      data = {};//declare empty data variable to assign nodes and links to

     //this will map from the dataset passed to the function onto the nodes, the nodes should be the pathway and name of each drug in the dataset
      data.nodes = set.map(
        function(item){
          return {"id": item.keggid, "name": item.label_s};
        });
      //maps from the dataset to the links
      data.links = set.map(
        function(item){
          if (item.pathway == set[max].pathway) {//if any item shares a pathway with the illicit drug at the last index
            return {"source": set[max].keggid, "target":item.keggid};//the source for the link should be the illicit drug at the end, and the target should be the keggid of the drug that shares a pathway
          }
          else{//this is leftover code, previously we would pass all the data instead of just the interacting, so if there was no shared pathway this would just draw a link from the illicit drug to itself
            return {"source": set[max].keggid, "target": set[max].keggid};
          }
        });
      //console.log(dataset);//testing purposes
        DrawNetwork(data);//call the drawNetwork function to draw the network with the sorted data
        console.log(noInteract);
        //This code dynamically generates html and creates a table
        var p = 1; //number of columns in the table
        var html = "<table><tr>";
        for(i=0;i<noInteract.length;i++){
          html += "<td>"+noInteract[i].label_s+"</td>";//add the name of the drug to a element of the table
          var next = i+1;
          if(next%p == 0 && next!=noInteract.length){//if the remainder of next divided by p is 0 then make a new row
            html += "</tr><tr>"
          }
        }
        html += "</tr></table>"
        document.getElementById("table").innerHTML = html;// Attach HTML to table

    },
    function(error){console.log(error);}
  );
}
