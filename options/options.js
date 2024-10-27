const browserAPI = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
  const keywordsElem = document.getElementById('keywords');
  const autoModeElem = document.getElementById('auto-dangerous-words');

  // Set the values from the storage
  browserAPI.storage.local.get(['keywords', 'autoMode'], (data) => {
    keywordsElem.value = data.keywords || '';
    autoModeElem.checked = data.autoMode || false;
    console.log(data);
    console.log("uwu");
  });

  document.getElementById('options-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const keywords = keywordsElem.value;
    const autoMode = autoModeElem.checked;

    console.log('Valeurs à sauvegarder:', { keywords, autoMode });

    // Save the values into the storage
    browserAPI.storage.local.set({ keywords, autoMode }, () => {
      alert('Mots-clés enregistrés avec succès !');

        browserAPI.storage.local.get(['keywords', 'autoMode', 'kitten'], (data) => {
          console.log(data);
          console.log("uwu?");
        });
    });
  });
});