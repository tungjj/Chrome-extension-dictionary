// get element
// var audio = document.getElementById("player");
var link_audio = document.getElementById("audio");
var pronun = document.getElementById("pronunciation");
var def_en = document.getElementById("definition_en");
var synonym = document.getElementById("synonym");

//// for oxford api
var app_id  = "817d8cc8"
var app_key  = "af2a40e721acd4c13b2827a6919614f6"

var endpoint = "entries"
var language_code = "en-gb"
var word_id = word1.toLowerCase();
var url = "https://od-api.oxforddictionaries.com/api/v2/" + endpoint + "/" 
            + language_code + "/" + word_id;

var xhr1 = new XMLHttpRequest();
function httpGet(url)
{
    xhr1.open("GET", url);
    xhr1.setRequestHeader("app_id", app_id);
    xhr1.setRequestHeader("app_key", app_key);
    
    xhr1.send();
}
httpGet(url);
xhr1.addEventListener("readystatechange", 
function () {
  if (this.readyState === 4 ) {
      var outcome = JSON.parse(this.responseText);    
      console.log(outcome);

      var href = outcome.results[0].lexicalEntries[0].entries[0].pronunciations[0].audioFile;
      var audio = new Audio(href);
      link_audio.onclick = function(){ audio.play(); };
      pronun.innerHTML = "UK:  " + "\/"+ outcome.results[0].lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling +"\/";
      
      def_en.innerHTML = "\(" + outcome.results[0].lexicalEntries[0].lexicalCategory.text+ "\)  "
                          + outcome.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];


      var synonymArray =  outcome.results[0].lexicalEntries[0].entries[0].senses[0].synonyms;
      var synonyms ;
      for (let index = 0; index < synonymArray.length; index++) {
        if(index == synonymArray.length-1){
          synonyms += synonymArray[index].text;
          continue;
        }

        synonyms += synonymArray[index].text + ", ";
      }
      synonym.innerHTML = synonyms;
  }
}); 
