const path = require('path');

module.exports = {
  entry: './scripts/background_ai_logic.js',  
  output: {
    filename: 'background_ai_logic.bundle.js',
    path: path.resolve(__dirname, 'scripts')  // Le dossier de sortie pour les fichiers Webpack
  },
  mode: 'production'
};
