function UpdateData(wbk_bio,condition,drug) {
  //this function updates the data that is passed to the network graph to be drawn
  GetData(wbk_bio,condition,drug).then(
    function(dataset){
      var max = dataset.length-1;//since illicit drug will always be at the end of the json array, this is it's index
      data = {};//declare empty data variable to assign nodes and links to

     //this will map from the dataset passed to the function onto the nodes, the nodes should be the pathway and name of each drug in the dataset
      data.nodes = dataset.map(
        function(item){
          return {"id": item.keggid, "name": item.label_s};
        });
      //maps from the dataset to the links
      data.links = dataset.map(
        function(item){
          if (item.pathway == dataset[max].pathway) {//if any item shares a pathway with the illicit drug at the last index
            return {"source": dataset[max].keggid, "target":item.keggid};//the source for the link should be the illicit drug at the end, and the target should be the keggid of the drug that shares a pathway 
          }
          else{//this is leftover code, previously we would pass all the data instead of just the interacting, so if there was no shared pathway this would just draw a link from the illicit drug to itself
            return {"source": dataset[max].keggid, "target": dataset[max].keggid};
          }
        });
      //console.log(dataset);//testing purposes
        DrawNetwork(data);//call the drawNetwork function to draw the network with the sorted data
    },
    function(error){console.log(error);}
  );
}
