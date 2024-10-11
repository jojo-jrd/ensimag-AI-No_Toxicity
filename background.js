const browserAPI = typeof browser !== "undefined" ? browser : chrome;
browserAPI.tabs.onActivated.addListener((activeInfo) => {
    browserAPI.tabs.executeScript(activeInfo.tabId, {
        file: "noToxicity.js"
    });
});