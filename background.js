chrome.extension.onMessage.addListener(
  function(message, sender, sendResponse) {
   switch (message) {
    case "showIcon" :
     chrome.pageAction.show();
     break;
   }
  });