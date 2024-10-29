const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './scripts/service_worker_ai_logic.js',  
  output: {
    filename: 'service_worker_ai_logic.bundle.js',
    path: path.resolve(__dirname, 'scripts')  // Le dossier de sortie pour les fichiers Webpack
  },
  mode: 'production'
};
