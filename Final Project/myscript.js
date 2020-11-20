var wbk_bio = new WBK({
    instance: 'http://bio2rdf.org',
    sparqlEndpoint: 'http://bio2rdf.org/sparql'
});

function GetQueryData(wbk_bio) {
    var responseJ1;
    var responseJ2;
    var query_wiki = "SELECT ?drug ?drugLabel ?keggid WHERE{ ?drug wdt:P2175 wd:Q81938  . ?drug wdt:P665 ?keggid . SERVICE wikibase:label {bd:serviceParam wikibase:language '[AUTO_LANGUAGE]' . }} LIMIT 10";

    fetch(wdk.sparqlQuery(query_wiki)
         ).then( response => response.json()
               ).then( wdk.simplify.sparqlResults
                     ).then(function (response) {
        responseJ1 = JSON.stringify(response, undefined, 2);
        document.getElementById("output1").innerHTML = responseJ1;

        var keggId = response;
        var keggValues = "";
        for (i=0;i<keggId.length;i++) {
            keggValues += "<http://bio2rdf.org/kegg:"+keggId[i].keggid+"> ";
        }
//      console.log(keggValues);

        var query_bio = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> SELECT ?pathway ?drug ?keggid WHERE { VALUES ?keggid {"+keggValues+"} ?keggid kegg_vocabulary:pathway ?pathway . ?drug kegg_vocabulary:pathway ?pathway }"

            fetch(wbk_bio.sparqlQuery(query_bio)
             ).then( response => response.json()
                   ).then( wdk.simplify.sparqlResults
                         ).then(function (response) {
            responseJ2 = JSON.stringify(response, undefined, 2);
            document.getElementById("output2").innerHTML = responseJ2;
            });
    }); 
}
