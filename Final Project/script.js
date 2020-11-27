var wbk_bio = new WBK({
    instance: 'http://bio2rdf.org',
    sparqlEndpoint: 'http://bio2rdf.org/sparql'
});


async function GetData(wbk_bio,condition,drug) {
/*
 * Desciption of GetData() function *


*/
  //Declaring Variables
  var pathways_bio= [];
  var interact = [];
  var noInteract =[];
  var data = {};
  var drugData = await DrugQuery(wbk_bio,drug);
  var conditionData = await ConditionQuery(wdk,condition);
  var pathwayData = await PathwaysQuery(wbk_bio,conditionData);

  for (i=0;i<pathwayData.length;i++) {

    if (pathwayData[i].pathway == drugData[0].pathway) {
        interact.push(pathwayData[i].label_s);
    }
    else{
        noInteract.push(pathwayData[i].label_s);
    }
  }
  data = {i:interact, n:noInteract};
  return data;
}

async function FetchQuery(wk,query) {
  url = wk.sparqlQuery(query);
  let response = await fetch(url);
  var json = await response.json();
  json = wdk.simplify.sparqlResults(json);
  return json;
}

async function DrugQuery(wbk_bio,drug) {
  var query = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> PREFIX dcterms: <http://purl.org/dc/terms/>SELECT ?pathway ?keggid ?label_s ?label_p WHERE { VALUES ?keggid {<http://bio2rdf.org/kegg:"+drug+">} ?keggid kegg_vocabulary:pathway ?pathway . ?pathway dcterms:title ?label1 . ?keggid dcterms:title ?label .BIND (str(?label) as ?label_s) .BIND (str(?label1) as ?label_p)}";

  try {
    var response = await FetchQuery(wbk_bio,query);
    return response;
  } catch(error) {
    alert(error);
  }
}

async function ConditionQuery(wbk_bio,condition) {
  var query = "SELECT ?drug ?drugLabel ?keggid WHERE{ ?drug wdt:P2175 wd:"+condition+"  . ?drug wdt:P665 ?keggid . SERVICE wikibase:label {bd:serviceParam wikibase:language '[AUTO_LANGUAGE]' . }} LIMIT 100";

  try{
    var response = await FetchQuery(wdk,query);
    var keggUrls = "";
    for (i=0;i<response.length;i++) {
        keggUrls += "<http://bio2rdf.org/kegg:"+response[i].keggid+"> ";
    }
    return keggUrls;
  } catch(error) {
    alert(error);
  }
}

async function PathwaysQuery(wbk_bio,keggUrls) {
  var query = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> PREFIX dcterms: <http://purl.org/dc/terms/>SELECT ?pathway ?keggid ?label_s ?label_p WHERE { VALUES ?keggid {"+keggUrls+"} ?keggid kegg_vocabulary:pathway ?pathway . ?pathway dcterms:title ?label1 . ?keggid dcterms:title ?label  .BIND (str(?label) as ?label_s) . BIND (str(?label1) as ?label_p)}";

  try {
    var response = await FetchQuery(wbk_bio,query);
    return response;
  } catch(error) {
    alert(error);
  }
}
