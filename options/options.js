const browserAPI = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
    browserAPI.storage.sync.get('keywords', (data) => {
      document.getElementById('keywords').value = data.keywords || '';
    });
  
    document.getElementById('options-form').addEventListener('submit', (event) => {
      event.preventDefault();
      
      const keywords = document.getElementById('keywords').value;
      const autoMode = document.getElementById('auto-dangerous-words').checked;

      // Sauvegarder les mots-clés et de l'auto gestion dans le stockage
      browserAPI.storage.sync.set({ keywords, autoMode }, () => {
        alert('Mots-clés enregistrés avec succès !');
      });
    });
  });