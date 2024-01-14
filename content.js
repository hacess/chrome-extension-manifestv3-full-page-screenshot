// contentScript.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "takeScreenshot") {
    const { scrollHeight, clientHeight } = document.documentElement;
    const devicePixelRatio = window.devicePixelRatio || 1;

    let capturedHeight = 0;
    let capturedImages = [];

    const captureAndScroll = () => {
      const scrollAmount = clientHeight * devicePixelRatio;

      chrome.runtime.sendMessage({ action: "captureVisibleTab", pixelRatio: devicePixelRatio }, (dataUrl) => {
        capturedHeight += scrollAmount;
        

        if (capturedHeight < scrollHeight * devicePixelRatio) {
          capturedImages.push(dataUrl);
          // Scroll to the next part of the page
          window.scrollTo(0, capturedHeight);
          setTimeout(captureAndScroll, 2000); // Adjust the delay as needed
        } else {
          // All parts captured, send back the complete image
          sendResponse({ dataUrl: capturedImages });
        }
      });
    };

    // Start capturing and scrolling
    captureAndScroll();

    return true;
  }
});
