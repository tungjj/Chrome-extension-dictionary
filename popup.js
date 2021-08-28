document.addEventListener('DOMContentLoaded', function () {
  const requestGetDefinition = new XMLHttpRequest();
  const requestGetPronunciation = new XMLHttpRequest();

  const audio = document.getElementById("audio");
  const synonym = document.getElementById("synonym");
  const textInput = document.getElementById("txt-input");
  const definition = document.getElementById("definition");
  const definitionEn = document.getElementById("definition-en");
  const pronunciation = document.getElementById("pronunciation");

  const background = chrome.extension.getBackgroundPage();

  ////for oxford api
  const appId = "817d8cc8";
  const appKey = "af2a40e721acd4c13b2827a6919614f6";

  const endpoint = "entries";
  const languageCode = "en-gb";
  const keyWord = word.toLowerCase();

  const url = `https://od-api.oxforddictionaries.com/api/v2/${endpoint}/${languageCode}/${keyWord}`;

  const { word } = background;

  textInput.innerHTML = word;

  requestGetDefinition.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      definition.innerHTML = this.responseText.split('text\":"')[1].split('",')[0];
    }
  })

  requestGetPronunciation.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      const outcome = JSON.parse(this.responseText);
      const audioFile = new Audio(outcome.results[0].lexicalEntries[0].entries[0].pronunciations[0].audioFile);
      const synonyms = outcome.results[0].lexicalEntries[0].entries[0].senses[0].synonyms;

      audio.onclick = function () {
        audioFile.play();
      };

      pronunciation.innerHTML = `UK: /${outcome.results[0].lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling}/`;
      definitionEn.innerHTML = `(${outcome.results[0].lexicalEntries[0].lexicalCategory.text}): ${outcome.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]}`;
      synonym.innerHTML = synonyms ? '' : synonyms.join(', ');
    }
  })

  sendRequestToGetDefinition(requestGetDefinition, word.toString());
  sendRequestToGetPronunciation(requestGetPronunciation, url, appId, appKey);
})


function sendRequestToGetDefinition(xmlHttpRequest, keyWord) {
  const data = JSON.stringify([{ "Text": keyWord }]);

  xmlHttpRequest.withCredentials = true;

  xmlHttpRequest.setRequestHeader("content-type", "application/json");
  xmlHttpRequest.setRequestHeader("x-rapidapi-key", "e84d943d16msh145795616c213d4p1071ecjsn3d924959b63c");
  xmlHttpRequest.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");

  xmlHttpRequest.open("POST",
    "https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=vi&textType=plain&profanityAction=NoAction");

  xmlHttpRequest.send(data);
  console.log({ data });
}

function sendRequestToGetPronunciation(xmlHttpRequest, url, appId, appKey) {
  xmlHttpRequest.open("GET", url);
  xmlHttpRequest.setRequestHeader("app_id", appId);
  xmlHttpRequest.setRequestHeader("app_key", appKey);

  xmlHttpRequest.send();
}
