

if (typeof browser === "undefined") {
    importScripts('service_worker_ai_logic.bundle.js');
}


const browserAPI = typeof browser !== "undefined" ? browser : chrome;

browserAPI.tabs.onActivated.addListener((activeInfo) => {
    browserAPI.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ["scripts/noToxicity.js"]
    });
    browserAPI.scripting.insertCSS({
        target: { tabId: activeInfo.tabId },
        files: ["scripts/design-no-toxicity.css"]
    });
});