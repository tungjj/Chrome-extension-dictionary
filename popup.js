document.addEventListener('DOMContentLoaded', function () {
  const requestGetDefinition = new XMLHttpRequest();
  const requestGetPronunciationUK = new XMLHttpRequest();
  const requestGetPronunciationUS = new XMLHttpRequest();
  const checkValidWord = new XMLHttpRequest();
  const requestToWordAPI = new XMLHttpRequest();

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
  var  {word}  = background;
  // console.log(word);
  // textInput.innerHTML = word;
  ////for oxford api
  const appId = "817d8cc8";
  const appKey = "af2a40e721acd4c13b2827a6919614f6";

  const endpoint = ["entries", "lemmas"];
  const languageCode = ["en-gb", "en-us", "en"];
  let keyWord = word.toLowerCase();

  const urlLemmas = `https://od-api.oxforddictionaries.com/api/v2/${endpoint[1]}/${languageCode[2]}/${keyWord}`;
  let urlUK = `https://od-api.oxforddictionaries.com/api/v2/${endpoint[0]}/${languageCode[0]}/${keyWord}`;
  let urlUS = `https://od-api.oxforddictionaries.com/api/v2/${endpoint[0]}/${languageCode[1]}/${keyWord}`;
  let urlWordAPI =  `https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=${keyWord}`;

  sendRequestToGetDefinition(requestGetDefinition, word);
  requestGetDefinition.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      definition.innerHTML = this.responseText.split('text\":"')[1].split('",')[0];
    }
  })



  sendRequestToGetPronunciationUK(checkValidWord, urlLemmas, appId, appKey);
  checkValidWord.addEventListener("readystatechange", function(){
    if (this.readyState === this.DONE) {
        const outcome = JSON.parse(this.responseText);
        console.log(outcome);
        // if(outcome.error)
        // {
        //   console.log(outcome.error); // show err and nothing will be shown
        // }
        // else{
        //   // everything is fine, and keep going
        //   keyWord = outcome.results[0].lexicalEntries[0].inflectionOf[0].text;
        //   textInput.innerHTML = keyWord;

        //   urlUK = `https://od-api.oxforddictionaries.com/api/v2/${endpoint[0]}/${languageCode[0]}/${keyWord}`;
        //   urlUS = `https://od-api.oxforddictionaries.com/api/v2/${endpoint[0]}/${languageCode[1]}/${keyWord}`;

        //   sendRequestToGetPronunciationUK(requestGetPronunciationUK, urlUK, appId, appKey);
        //   sendRequestToGetPronunciationUK(requestGetPronunciationUS, urlUS, appId, appKey);
        // }
       
    }
  });
  sendRequestToWordAPI(requestToWordAPI, urlWordAPI);
  requestToWordAPI.addEventListener("readystatechange", function(){
    if (this.readyState === this.DONE) {
      const outcome = JSON.parse(this.responseText);
      console.log(outcome);

      let meanings = [`${outcome.meaning.noun}`,
                    `${outcome.meaning.verb}`,
                    `${outcome.meaning.adjective}`,
                    `${outcome.meaning.adverb}`
      ];
      meanings = meanings.join("\n");
      definitionEn.innerHTML = meanings;
    }
  })

  sendRequestToGetPronunciationUK(requestGetPronunciationUK, urlUK, appId, appKey);
  requestGetPronunciationUK.addEventListener("readystatechange", function () {
    if (this.readyState === 4 ) {
      const outcome = JSON.parse(this.responseText);
      console.log(outcome);

      
      // sendRequestToGetPronunciationUK(requestGetPronunciationUS, urlUS, appId, appKey);

      const audioFileUK = new Audio(outcome.results[0].lexicalEntries[0].entries[0].pronunciations[0].audioFile);
      const synonyms = outcome.results[0].lexicalEntries[0].entries[0].senses[0].synonyms;
      
      audioUK.onclick = function () {
        audioFileUK.play();
      };

      // typeOfWord.innerHTML = `(${outcome.results[0].lexicalEntries[0].lexicalCategory.id})`;
      pronunciationUK.innerHTML = `/${outcome.results[0].lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling}/`;
      // definitionEn.innerHTML = ` ${outcome.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]}`;
      synonym.innerHTML = synonyms.length == 0  ? "" : synonyms.map(e => e.text).join(', ');
    }
  })
  sendRequestToGetPronunciationUK(requestGetPronunciationUS, urlUS, appId, appKey);
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
  });
});

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

function sendRequestToWordAPI(xmlHttpRequest, url){
  xmlHttpRequest.withCredentials = true;

  xmlHttpRequest.open("GET", url);
  xmlHttpRequest.setRequestHeader("x-rapidapi-host", "twinword-word-graph-dictionary.p.rapidapi.com");
  xmlHttpRequest.setRequestHeader("x-rapidapi-key", "e84d943d16msh145795616c213d4p1071ecjsn3d924959b63c");

  xmlHttpRequest.send(null);
}
