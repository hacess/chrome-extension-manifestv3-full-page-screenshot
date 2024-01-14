document.getElementById("takeScreenshotBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: "takeScreenshot" }, (response) => {
      const images = response.dataUrl;

      if (images.length === 0) {
        console.error("No images captured.");
        return;
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Use the width of the first image to set the canvas width
      const firstImage = new Image();
      firstImage.onload = () => {
        canvas.width = firstImage.width;
        canvas.height = images.length * firstImage.height;

        // Counter to keep track of loaded images
        let imagesLoaded = 0;

        // Callback function to draw an image onto the canvas
        const drawImageOnCanvas = (image, index) => {
          context.drawImage(image, 0, index * firstImage.height);
          imagesLoaded++;

          // Check if all images are loaded
          if (imagesLoaded === images.length) {
            // Create a download link for the full-page screenshot
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "fullpage_screenshot.png";

            // Append the link to the document, trigger a click, and remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        };

        // Load and draw each image onto the canvas
        images.forEach((dataUrl, index) => {
          const image = new Image();
          image.onload = () => drawImageOnCanvas(image, index);
          image.src = dataUrl;
        });
      };

      firstImage.src = images[0];
    });
  });
});
