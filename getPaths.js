const fs = require('fs');
const path = require('path');

// Paths
const blocksPath = path.join(__dirname, './assets/src/blocks');
const appJsPath = './assets/src/app.js';
const mainJsPath = path.join(__dirname, 'main.js');
console.log(mainJsPath)

// Helper to collect files
function collectFiles(extension) {
  const files = [];
  const directories = fs.readdirSync(blocksPath);

  directories.forEach((dir) => {
    const dirPath = path.join(blocksPath, dir);
    if (fs.statSync(dirPath).isDirectory()) {
      const dirFiles = fs.readdirSync(dirPath).filter((file) => file.endsWith(extension));
      dirFiles.forEach((file) => {
        // Use path.posix.join for consistent forward slashes
        files.push(path.posix.join('blocks', dir, file));
      });
    }
  });

  return files;
}

// Write to main.js
function updateMainFiles() {
  const jsFiles = collectFiles('.js');
  const jsComment = `// Auto-generated file by getPaths.js, used only to run watch. Do not edit manually.\n`;
  const jsContent = [
    `import '${appJsPath}';`, // Include app.js
    ...jsFiles.map((file) => `import './assets/src/${file}';`)
  ].join('\n');
  fs.writeFileSync(mainJsPath, jsComment + jsContent);

  console.log('Updated main.js');

}
// Initial update and watch
updateMainFiles();