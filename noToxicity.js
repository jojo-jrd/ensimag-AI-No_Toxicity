const browserAPI = typeof browser !== "undefined" ? browser : chrome;

(function() {
    browserAPI.storage.sync.get('keywords', (keywordsWarnings) => {
        console.log(keywordsWarnings);
        // Récupère tous les blocs de la page
        const textBlocks = document.querySelectorAll('body *');
    
        textBlocks.forEach(block => {
            // Si le bloc possède du texte
            if (block.innerText) {
                // TODO here
                block.style.color = '#ffaa00';
            }
        });
    });
})();