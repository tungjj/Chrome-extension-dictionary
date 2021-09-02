document.addEventListener('DOMContentLoaded', function () {
  const requestGetDefinition = new XMLHttpRequest();
  const requestGetPronunciationUK = new XMLHttpRequest();
  const requestGetPronunciationUS = new XMLHttpRequest();

  const audioUK = document.getElementById("audio-uk");
  const audioUS = document.getElementById("audio-us");

  const synonym = document.getElementById("synonym");
  const textInput = document.getElementById("txt-input");
  const definition = document.getElementById("definition");
  const definitionEn = document.getElementById("definition-en");
  const typeOfWord = document.getElementById("type-of-word");

  const pronunciationUK = document.getElementById("pronunciation-uk");
  const pronunciationUS = document.getElementById("pronunciation-us");

  const background = chrome.extension.getBackgroundPage();

  // process word from background
  const  {word}  = background;
  textInput.innerHTML = word;

  ////for oxford api
  const appId = "817d8cc8";
  const appKey = "af2a40e721acd4c13b2827a6919614f6";

  const endpoint = "entries";
  const languageCode = "en-gb";
  const keyWord = word.toLowerCase();

  const urlUK = `https://od-api.oxforddictionaries.com/api/v2/${endpoint}/${languageCode}/${keyWord}`;
  const urlUS = `https://od-api.oxforddictionaries.com/api/v2/${endpoint}/en-us/${keyWord}`;
  

  requestGetDefinition.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      definition.innerHTML = this.responseText.split('text\":"')[1].split('",')[0];
    }
  })

  requestGetPronunciationUK.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      const outcome = JSON.parse(this.responseText);
      console.log(outcome);

      const audioFileUK = new Audio(outcome.results[0].lexicalEntries[0].entries[0].pronunciations[0].audioFile);
      const synonyms = outcome.results[0].lexicalEntries[0].entries[0].senses[0].synonyms;
      console.log(synonyms);
      audioUK.onclick = function () {
        audioFileUK.play();
      };

      typeOfWord.innerHTML = `(${outcome.results[0].lexicalEntries[0].lexicalCategory.id})`;
      pronunciationUK.innerHTML = `/${outcome.results[0].lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling}/`;
      definitionEn.innerHTML = ` ${outcome.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]}`;
      synonym.innerHTML = synonyms.length == 0  ? "" : synonyms.map(e => e.text).join(', ');
    }
  })

  requestGetPronunciationUS.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      const outcome = JSON.parse(this.responseText);
      console.log(outcome);
      const audioFileUS = new Audio(outcome.results[0].lexicalEntries[0].entries[0].pronunciations[1].audioFile);
      
      audioUS.onclick = function () {
        audioFileUS.play();
      };
      pronunciationUS.innerHTML = `/${outcome.results[0].lexicalEntries[0].entries[0].pronunciations[1].phoneticSpelling}/`;

    }
  })

  sendRequestToGetDefinition(requestGetDefinition, word);
  sendRequestToGetPronunciationUK(requestGetPronunciationUK, urlUK, appId, appKey);
  sendRequestToGetPronunciationUK(requestGetPronunciationUS, urlUS, appId, appKey);

})


function sendRequestToGetDefinition(xmlHttpRequest, keyWord) {
  const data = JSON.stringify([{ "Text": keyWord }]);

  xmlHttpRequest.withCredentials = true;

  xmlHttpRequest.open("POST",
  "https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=vi&textType=plain&profanityAction=NoAction");

  xmlHttpRequest.setRequestHeader("content-type", "application/json");
  xmlHttpRequest.setRequestHeader("x-rapidapi-key", "e84d943d16msh145795616c213d4p1071ecjsn3d924959b63c");
  xmlHttpRequest.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");

  xmlHttpRequest.send(data);
}

function sendRequestToGetPronunciationUK(xmlHttpRequest, url, appId, appKey) {
  xmlHttpRequest.open("GET", url);
  xmlHttpRequest.setRequestHeader("app_id", appId);
  xmlHttpRequest.setRequestHeader("app_key", appKey);

  xmlHttpRequest.send();
}

