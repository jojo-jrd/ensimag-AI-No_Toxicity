const browserAPI = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
  const keywordsElem = document.getElementById('keywords');
  const autoModeElem = document.getElementById('auto-dangerous-words');

  // Set the values from the storage
  browserAPI.storage.local.get(['keywords', 'autoMode'], (data) => {
    keywordsElem.value = data.keywords || '';
    autoModeElem.checked = data.autoMode || false;
  });

  document.getElementById('options-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const keywords = keywordsElem.value;
    const autoMode = autoModeElem.checked;

    // Save the values into the storage
    browserAPI.storage.local.set({ keywords, autoMode }, () => {
      alert('Mots-clés enregistrés avec succès !');
    });
  });
});