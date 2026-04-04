const fs = require('fs');
const path = require('path');

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    // 1. Fix template literals missing closing backticks or having mismatched quotes
    // e.g. `${URL}/path" -> `${URL}/path`
    // We look for a template literal start `${` that is followed by a quote before a backtick
    content = content.replace(/(`(?:\${[^}]*}|[^`])*?)\"/g, '$1`');
    content = content.replace(/(`(?:\${[^}]*}|[^`])*?)\'/g, '$1`');

    // 2. Clear known malformed VITE_API_URL patterns
    content = content.replace(/\$\{[\s\S]*?import\.meta\.env\.VITE_API_URL[\s\S]*?\}/g, (match) => {
        return match.replace(/\s+/g, '');
    });

    // 3. Fix spaces in paths (e.g. / api / -> /api/)
    // Focus on strings or template literals containing /
    content = content.replace(/([`"'])(?:\${[^}]*}|.)*?\1/g, (match) => {
        // Remove spaces around / and - in strings that look like paths or classNames
        return match
            .replace(/\s+\/\s+/g, '/')
            .replace(/\s+-\s+/g, '-')
            .replace(/\{\s+/g, '{')
            .replace(/\s+\}/g, '}');
    });

    // 4. Special fix for common broken patterns found in CourseBuilder and others
    content = content.replace(/\s+\/\s+/g, '/'); // Widespread path cleanup
    content = content.replace(/p\s+-\s+(\d+)/g, 'p-$1');
    content = content.replace(/m\s+-\s+(\d+)/g, 'm-$1');
    content = content.replace(/rounded\s+-\s+([a-z0-9]+)/g, 'rounded-$1');
    content = content.replace(/gap\s+-\s+(\d+)/g, 'gap-$1');

    if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Fixed: ${filepath}`);
    }
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules') walk(fullPath);
        } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
            processFile(fullPath);
        }
    });
}

const targetDir = path.join(__dirname, 'client', 'src');
if (fs.existsSync(targetDir)) {
    walk(targetDir);
    console.log('Cleanup complete.');
} else {
    console.log('Target directory not found.');
}
