// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "captureVisibleTab") {
      const { pixelRatio } = message;
      chrome.tabs.captureVisibleTab({ format: "png", quality: 100 }, (dataUrl) => {
        sendResponse(dataUrl);
      });
      return true;
    }
  });
  