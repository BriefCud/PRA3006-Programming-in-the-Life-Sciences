var wbk_bio = new WBK({
    instance: 'http://bio2rdf.org',
    sparqlEndpoint: 'http://bio2rdf.org/sparql'
});

function GetQueryData(wbk_bio) {
    var responseJ1;
    var responseJ2;
    var responseJ3;
    var query_wiki = "SELECT ?drug ?drugLabel ?keggid WHERE{ ?drug wdt:P2175 wd:Q81938  . ?drug wdt:P665 ?keggid . SERVICE wikibase:label {bd:serviceParam wikibase:language '[AUTO_LANGUAGE]' . }} LIMIT 100";
    
    var query_drug = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> SELECT ?pathway ?drug ?keggid WHERE { VALUES ?keggid {<http://bio2rdf.org/kegg:D07286>} ?keggid kegg_vocabulary:pathway ?pathway }";
        
    fetch(wbk_bio.sparqlQuery(query_drug)
         ).then( response => response.json()
               ).then( wdk.simplify.sparqlResults
                     ).then(function (response) {
        responseJ3 = JSON.stringify(response, undefined, 2);
        document.getElementById("output3").innerHTML = responseJ3;
        var response_drug = response;
        var pathways_drug = "";
     
        pathways_drug = response_drug[0].pathway;
            //code
        
        //console.log(pathways);
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
    
            var query_bio = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> SELECT ?pathway ?keggid WHERE { VALUES ?keggid {"+keggValues+"} ?keggid kegg_vocabulary:pathway ?pathway }";
    
            fetch(wbk_bio.sparqlQuery(query_bio)
             ).then( response => response.json()
                   ).then( wdk.simplify.sparqlResults
                         ).then(function (response) {
            responseJ2 = JSON.stringify(response, undefined, 2);
            document.getElementById("output2").innerHTML = responseJ2;
            var response_bio = response;
            var pathways_bio= [];
            for (i =0 ; i<response_bio.length;i++) {
                pathways_bio[i]= response_bio[i].pathway;
                //code
            }
            var interact = [];
            var nointeract =[];
            for (i=0;i<pathways_bio.length;i++) {
                
                if (pathways_bio[i] == pathways_drug) {
                    interact.push(response_bio[i].keggid);
                    //code
                }
                else{
                    nointeract.push(response_bio[i].keggid);
                }
                
                //code
            }
                //code
            console.log(nointeract);
       
            });
        }); 
});
}
