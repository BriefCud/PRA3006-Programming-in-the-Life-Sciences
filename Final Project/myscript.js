const wbk_bio = new WBK({
    instance: 'http://bio2rdf.org',
    sparqlEndpoint: 'http://bio2rdf.org/sparql'
});


query_bio = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> SELECT ?pathway ?drug WHERE { <http://bio2rdf.org/kegg:C07163> kegg_vocabulary:pathway ?pathway. ?drug kegg_vocabulary:pathway ?pathway } LIMIT 10";
            
query_wiki = "SELECT ?drug ?drugLabel ?keggid WHERE{ ?drug wdt:P2175 wd:Q81938  . ?drug wdt:P665 ?keggid . SERVICE wikibase:label {bd:serviceParam wikibase:language '[AUTO_LANGUAGE]' . }} LIMIT 10";

//fetch(wdk.sparqlQuery(query_wiki)
//         ).then( response => response.json()
//               ).then( wdk.simplify.sparqlResults
//                     ).then(function (response) {
//        document.getElementById('output').innerHTML=JSON.stringify(response, undefined, 2);
//    });
//         
//fetch(wbk_bio.sparqlQuery(query_bio)
//     ).then(response => response.json()
//           ).then(wdk.simplify.sparqlResults
//                 ).then(function(response) {
//    document.getElementById('output').innerHTML = JSON.stringify(response, undefined,2);
//});

//function GetQueryData(query,wdk) {
//    var responseJ;
//    fetch(wdk.sparqlQuery(query)
//         ).then( response => response.json()
//               ).then( wdk.simplify.sparqlResults
//                     ).then(function (response) {
//        responseJ = JSON.stringify(response, undefined, 2);
//    }); 
//    return responseJ;
//}



//documnt.getElementById("data").innerHTML = JSON.stringify(data_bio,undefined,2);