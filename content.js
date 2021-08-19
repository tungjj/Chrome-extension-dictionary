console.log("heeloo from content js")

window.addEventListener('mouseup', wordSelected);

function wordSelected(){
    var selectedText = window.getSelection().toString();
    if(selectedText.length > 0){
        console.log(selectedText);

        let message = {
            text: selectedText
        }
        chrome.runtime.sendMessage(message);
    }
}