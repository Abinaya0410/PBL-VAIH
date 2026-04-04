const fs = require('fs');
const path = require('path');

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    let oldContent = content;
    
    // 1. Fix malformed closing quotes at the end of template literals containing VITE_API_URL
    // Pattern: ${ ... VITE_API_URL ... } followed by characters and then a " instead of `
    content = content.replace(/(\$\{[\s\S]*?VITE_API_URL[\s\S]*?\}[^`\r\n]*?)\"/g, '$1`');
    content = content.replace(/(\$\{[\s\S]*?VITE_API_URL[\s\S]*?\}[^`\r\n]*?)\'/g, '$1`');
    
    // 2. Remove unwanted spaces in paths that start with VITE_API_URL
    // This finds the template literal and cleans up spaces between `/` and word chars.
    content = content.replace(/(\$\{[\s\S]*?VITE_API_URL[\s\S]*?\})(\s*\/[\s\S]*?)([`";,\)])/g, (match, p1, p2, p3) => {
        let cleanedPath = p2.replace(/\s+\/\s+/g, '/').replace(/^\s*\//, '/').replace(/\s+-\s+/g, '-');
        return p1 + cleanedPath + p3;
    });
    
    // 3. Clean up the placeholder itself
    content = content.replace(/\$\{\s+import\.meta\.env\.VITE_API_URL\s+\}/g, '${import.meta.env.VITE_API_URL}');
    
    // 4. Handle nested template literals where spaces were added
    content = content.replace(/(\$\{[\s\S]*?VITE_API_URL[\s\S]*?\}[\s\S]*?)\s+\/\s+/g, '$1/');
    
    if (content !== oldContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated: ${filepath}`);
    }
}

function walkDir(dir) {
    const list = fs.readdirSync(dir);
    for (let file of list) {
        let fullPath = path.join(dir, file);
        let stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
            processFile(fullPath);
        }
    }
}

const srcDir = path.join(__dirname, 'client', 'src');
if (fs.existsSync(srcDir)) {
    walkDir(srcDir);
    console.log('Finished processing client/src');
} else {
    console.error(`Directory not found: ${srcDir}`);
}
