const fs = require('fs-extra');
const path = require('path');

const manifestFolder = path.join(__dirname, 'manifests');
const destinationFile = path.join(__dirname, 'manifest.json');

const copyManifest = (type) => {
  const sourceFile = path.join(manifestFolder, `manifest.${type}.json`);
  
  if (!fs.existsSync(sourceFile)) {
    console.error(`Le fichier ${sourceFile} n'existe pas.`);
    process.exit(1);
  }

  fs.copySync(sourceFile, destinationFile);
  console.log(`Fichier manifest.${type}.json copié vers manifest.json`);
};

const args = process.argv.slice(2);
if (args.length === 1 && (args[0] === 'chrome' || args[0] === 'firefox')) {
  copyManifest(args[0]);
} else {
  console.error('Usage: node copyManifest.js <chrome|firefox>');
  process.exit(1);
}
