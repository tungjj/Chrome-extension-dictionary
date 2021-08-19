let text_input = document.getElementById("text_input");
let definition = document.getElementById("definition");

var background = chrome.extension.getBackgroundPage();
let word1 = background.word;
text_input.innerHTML = word1;

const xhr = new XMLHttpRequest();
function runWithWindow(){
    const data = JSON.stringify([
        {
            "Text": word1.toString()
        }
    ]);
    
    xhr.withCredentials = true;
    
    xhr.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=vi&textType=plain&profanityAction=NoAction");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-rapidapi-key", "e84d943d16msh145795616c213d4p1071ecjsn3d924959b63c");
    xhr.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    
    xhr.send(data);
};
xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        definition.innerHTML =  this.responseText.split('text\":"')[1].split('",')[0];
    }
});
runWithWindow();




