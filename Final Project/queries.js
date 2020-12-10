var wbk_bio = new WBK({ //declare sparql endpoint, we dont need to declare for wikidata queries since that is the default sparql endpoint
    instance: 'http://bio2rdf.org',
    sparqlEndpoint: 'http://bio2rdf.org/sparql'
});
/**
 *Helper function to return an array of unique elements in array sorted by their key
 *input arr - array to remove duplicate entries from
 *input key - key to check for duplicates
 */
function getUniqueListBy(arr, key) { 
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

/**
 *This function does all the SparQL queries with the specified condition and drug from html dropdown
 *input wbk_bio - keep this as wbk_bio, ensures we use bio2rdf sparql endpoint for queries
 *input condition - condition selected in HTMl dropdown
 *input drug - drug selected in HTML dropdown
 *return data - returns interacting medication with the illicit drug in a json format so we can handle it
 *with the updateData function in order to visualize it
 */
async function GetData(wbk_bio,condition,drug) {
/*
 * GetData function awaits for response from query functions and compares pathways, pushing medication with the same pathways as the illicit drug into arrays of interacting and non-interacting drugs
 * then pushes interact drugs into the data array which will be returned, finally it pushes the returns from the query of illicit drug in patient onto the end of the data array, allowing us to know that
 * the last n indexes in the data array correspond to the illicit drug we queried*


*/
  //Declaring Variables
  var pathways_bio= [];
  var interact = [];
  var noInteract =[];
  var data = [];
  var drugData = await DrugQuery(wbk_bio,drug);
  var conditionData = await ConditionQuery(wdk,condition);
  var pathwayData = await PathwaysQuery(wbk_bio,conditionData);

  for (i=0;i<pathwayData.length;i++) {
    for (j = 0;j<drugData.length;j++) {
      if (pathwayData[i].pathway == drugData[j].pathway) {//check if response from bio2rdf pathway for medication matches the pathway from the initial bio2rdf illicit drug query
      interact.push(pathwayData[i]);//if yes push it to an interact array
    }else{
      noInteract.push(pathwayData[i]);//else push to an array of non-interaction
    }
    }
  }

  for (i=0;i<interact.length;i++) {
    data.push(interact[i]);//push interact json to return of function first
  }
  for (i=0;i<drugData.length;i++) {
    data.push(drugData[i]);//push illicit drug query last, so we know that illicit drugs will be at the end of the data json
  }
  
  noInteract = getUniqueListBy(noInteract,'label_s');

    
  return {"data":data,"noI":noInteract};
}
/**
 *this function simplifies the data from the server response into a json
 *input wk - specifies sparql endpoint we are using, options are wdk(wikidata) and wbk_bio(bio2rdf sparql endpoint)
 *input query - specifies which query response we want to simplify
 *return json - returns simplified json of response
 */
async function FetchQuery(wk,query) {
  //when called fetchQuery simplifies the results of a query allowing us to store the return of the query into a single json
  url = wk.sparqlQuery(query);
  let response = await fetch(url);
  var json = await response.json();
  json = wdk.simplify.sparqlResults(json);
  return json;
}
/**
 *this function performs the query of the illicit drug in the patients bloodstream
 *input wbk_bio - do not change this, wbk_bio is bio2rdf sparql endpoint and this is a bio2rdf query
 *input drug - kegg_id of illicit drug, taken from html dropdown
 *return response - returns query response from the endpoint
 */
async function DrugQuery(wbk_bio,drug) {//does the query for the illicit drug within the patients blood
  var query = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> PREFIX dcterms: <http://purl.org/dc/terms/>SELECT ?pathway ?keggid ?label_s ?label_p WHERE { VALUES ?keggid {<http://bio2rdf.org/kegg:"+drug+">} ?keggid kegg_vocabulary:pathway ?pathway . ?pathway dcterms:title ?label1 . ?keggid dcterms:title ?label .BIND (str(?label) as ?label_s) .BIND (str(?label1) as ?label_p)}";

  try {
    var response = await FetchQuery(wbk_bio,query);//awaits for response from the fetcchQuery function for the drug query, assigning it to a response variable which is a json of the return of the sparql query
    return response;
  } catch(error) {
    alert(error);
  }
}

/**
 *this function queries the specified condition on wikidata and returns a list of medication used to treat condition
 *input wbk_bio - this should be wdk every time, since this is a wikidata query
 *input condition - wikidata identifier for conditon
 *return response - returns query response from the endpoint
 */
async function ConditionQuery(wbk_bio,condition) {
  //when called conditionQuery does a query of the selected condition, getting all the medication from wikidata that is used to treat that condition
  var query = "SELECT ?drug ?drugLabel ?keggid WHERE{ ?drug wdt:P2175 wd:"+condition+"  . ?drug wdt:P665 ?keggid . SERVICE wikibase:label {bd:serviceParam wikibase:language '[AUTO_LANGUAGE]' . }} LIMIT 100";//limit 100 due to server timeout

  try{
    var response = await FetchQuery(wdk,query);
    var keggUrls = "";
    for (i=0;i<response.length;i++) {
        keggUrls += "<http://bio2rdf.org/kegg:"+response[i].keggid+"> ";//gets the keggids from the response and stores them in a way that we can query bio2rdf for the pathway of the mediciation used to treat the condition
    }
    return keggUrls;
  } catch(error) {
    alert(error);
  }
}
/**
 *this function queries the pathway of the medications returned from the wikidata query on bio2rdf
 *input wbk_bio - keep as wbk_bio, bio2rdf sparql endpoint
 *input keggUrls - input array of keggUrls returned from conditionquery
 *return response - returns response from the endpoint
 */
async function PathwaysQuery(wbk_bio,keggUrls) {
  //when called pathwaysQuery will query bio2rdf for the pathways of the medication returned from the conditionQuery using their keggids, giving us the pathway of the medication
  var query = "PREFIX kegg_vocabulary: <http://bio2rdf.org/kegg_vocabulary:> PREFIX dcterms: <http://purl.org/dc/terms/>SELECT ?pathway ?keggid ?label_s ?label_p WHERE { VALUES ?keggid {"+keggUrls+"} ?keggid kegg_vocabulary:pathway ?pathway . ?pathway dcterms:title ?label1 . ?keggid dcterms:title ?label  .BIND (str(?label) as ?label_s) . BIND (str(?label1) as ?label_p)}";

  try {
    var response = await FetchQuery(wbk_bio,query);
    return response;
  } catch(error) {
    alert(error);
  }
}
