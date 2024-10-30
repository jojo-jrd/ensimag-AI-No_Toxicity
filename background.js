const browserAPI = typeof browser !== "undefined" ? browser : chrome;
browserAPI.tabs.onActivated.addListener((activeInfo) => {
    browserAPI.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ["noToxicity.js"]
    });
    browserAPI.scripting.insertCSS({
        target: { tabId: activeInfo.tabId },
        files: ["design-no-toxicity.css"]
    });
});