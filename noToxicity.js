(function() {

    // Récupère tous les blocs de la page
    const textBlocks = document.querySelectorAll('body *');

    debugger
    textBlocks.forEach(block => {
        // Si le bloc possède du texte
        if (block.innerText) {
            // TODO here
            block.style.color = '#ffaa00';
        }
    });
})();