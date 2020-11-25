var wbk_bio = new WBK({
    instance: 'http://bio2rdf.org',
    sparqlEndpoint: 'http://bio2rdf.org/sparql'
});

function GetQueryData(wbk_bio,condition,drug) {

  var query_drug = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> PREFIX dcterms: <http://purl.org/dc/terms/>SELECT ?pathway ?keggid ?label_s WHERE { VALUES ?keggid {<http://bio2rdf.org/kegg:"+drug+">} ?keggid kegg_vocabulary:pathway ?pathway . ?keggid dcterms:title ?label .BIND (str(?label) as ?label_s)}";

  fetch(wbk_bio.sparqlQuery(query_drug)
    ).then( response => response.json()
      ).then( wdk.simplify.sparqlResults
        ).then(function (response) {
          var pathways_drug = response[0].pathway;

          var query_wiki = "SELECT ?drug ?drugLabel ?keggid WHERE{ ?drug wdt:P2175 wd:"+condition+"  . ?drug wdt:P665 ?keggid . SERVICE wikibase:label {bd:serviceParam wikibase:language '[AUTO_LANGUAGE]' . }} LIMIT 100";

          fetch(wdk.sparqlQuery(query_wiki)
            ).then( response => response.json()
              ).then( wdk.simplify.sparqlResults
                ).then(function (response) {
                  var keggValues = "";
                  for (i=0;i<response.length;i++) {
                      keggValues += "<http://bio2rdf.org/kegg:"+response[i].keggid+"> ";
                  }

                  var query_bio = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> PREFIX dcterms: <http://purl.org/dc/terms/>SELECT ?pathway ?keggid ?label_s WHERE { VALUES ?keggid {"+keggValues+"} ?keggid kegg_vocabulary:pathway ?pathway . ?keggid dcterms:title ?label .BIND (str(?label) as ?label_s)}";

                  fetch(wbk_bio.sparqlQuery(query_bio)
                    ).then( response => response.json()
                      ).then( wdk.simplify.sparqlResults
                        ).then(function (response) {
                          var pathways_bio= [];
                          for (i =0 ; i<response.length;i++) {
                              pathways_bio[i]= response[i].pathway;
                          }

                          var interact = [];
                          var nointeract =[];
                          for (i=0;i<pathways_bio.length;i++) {

                            if (pathways_bio[i] == pathways_drug) {
                                interact.push(response[i].label_s);
                            }
                            else{
                                nointeract.push(response[i].label_s);
                            }
                          }
                          console.log(interact);
                          console.log(nointeract);
      });
    });
  });
}
