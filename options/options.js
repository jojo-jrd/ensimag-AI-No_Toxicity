const browserAPI = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
    browserAPI.storage.sync.get('keywords', (data) => {
      document.getElementById('keywords').value = data.keywords || '';
    });
  
    document.getElementById('options-form').addEventListener('submit', (event) => {
      event.preventDefault();
      
      const keywords = document.getElementById('keywords').value;
      
      // Sauvegarder les mots-clés dans le stockage
      browserAPI.storage.sync.set({ keywords: keywords }, () => {
        alert('Mots-clés enregistrés avec succès !');
      });
    });
  });