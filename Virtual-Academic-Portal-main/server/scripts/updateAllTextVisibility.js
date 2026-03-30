const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const clientDir = path.join(__dirname, '..', '..', 'client', 'src');
const targets = [
  path.join(clientDir, 'pages'),
  path.join(clientDir, 'components')
];

let updatedCount = 0;

targets.forEach(dir => {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;

      // Replace text-slate-400 with text-slate-500 dark:text-slate-400 (if no dark: prefix is present)
      content = content.replace(/(?<!dark:)text-slate-400/g, 'text-slate-500 dark:text-slate-400');
      
      // Replace text-slate-300 with text-slate-400 dark:text-slate-300 (if no dark: prefix is present)
      content = content.replace(/(?<!dark:)text-slate-300/g, 'text-slate-400 dark:text-slate-300');

      // Replace text-gray-400 with text-gray-500 dark:text-gray-400 (if no dark: prefix is present)
      content = content.replace(/(?<!dark:)text-gray-400/g, 'text-gray-500 dark:text-gray-400');
      
      // Replace text-gray-500 with text-gray-600 dark:text-gray-500 (if no dark: prefix is present)
      content = content.replace(/(?<!dark:)text-gray-500/g, 'text-gray-600 dark:text-gray-500');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Updated ${path.basename(filePath)}`);
      }
    }
  });
});

console.log(`Updated ${updatedCount} files globally.`);
