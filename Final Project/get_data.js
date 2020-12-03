function UpdateData(wbk_bio,condition,drug) {
  GetData(wbk_bio,condition,drug).then(
    function(dataset){
      var max = dataset.length-1;
      data = {};

      data.nodes = dataset.map(
        function(item){
          return {"id": item.keggid, "name": item.label_s};
        });
      data.links = dataset.map(
        function(item){
          if (item.pathway == dataset[max].pathway) {
            return {"source": dataset[max].keggid, "target":item.keggid};
          }
          else{
            return {"source": dataset[max].keggid, "target": dataset[max].keggid};
          }
        });
      console.log(data);
        DrawNetwork(data);
    },
    function(error){console.log(error);}
  );
}
