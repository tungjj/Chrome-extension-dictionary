console.log('background running');
window.word = "this is background scope";


chrome.runtime.onMessage.addListener(receiver);
function receiver(request, sender, sendResponse){
    var selectedText = request.text;
    window.word = selectedText;
    console.log(window.word);
};

// chrome.runtime.sendMessage({word});
