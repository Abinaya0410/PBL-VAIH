// const fs = require('fs');
// const path = require('path');

// function processFile(filepath) {
//     let content = fs.readFileSync(filepath, 'utf8');
//     let original = content;

//     // VERY SAFE REPLACEMENT
//     // Handle double quotes
//     content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${import.meta.env.VITE_API_URL}$1`');
//     // Handle single quotes
//     content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
//     // Handle backticks (template literals)
//     content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${import.meta.env.VITE_API_URL}$1`');

//     if (content !== original) {
//         fs.writeFileSync(filepath, content, 'utf8');
//         console.log(`Updated: ${filepath}`);
//     }
// }

// function walk(dir) {
//     fs.readdirSync(dir).forEach(file => {
//         const fullPath = path.join(dir, file);
//         if (fs.statSync(fullPath).isDirectory()) {
//             if (file !== 'node_modules') walk(fullPath);
//         } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
//             processFile(fullPath);
//         }
//     });
// }

// walk(path.join(__dirname, 'client', 'src'));
// console.log('Safe replacement complete.');
