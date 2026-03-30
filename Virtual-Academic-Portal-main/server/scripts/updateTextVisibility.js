const fs = require('fs');
const path = require('path');

const files = [
  'client/src/pages/AssignmentSubmissions.jsx',
  'client/src/pages/TeacherAnalytics.jsx',
  'client/src/pages/StudentDashboard.jsx',
  'client/src/pages/CourseAnalytics.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace text-slate-400 with text-slate-500 dark:text-slate-400 (if no dark: prefix is present)
  content = content.replace(/(?<!dark:)text-slate-400/g, 'text-slate-500 dark:text-slate-400');
  
  // Replace text-slate-300 with text-slate-400 dark:text-slate-300 (if no dark: prefix is present)
  content = content.replace(/(?<!dark:)text-slate-300/g, 'text-slate-400 dark:text-slate-300');

  // Replace text-gray-400 with text-gray-500 dark:text-gray-400 (if no dark: prefix is present)
  content = content.replace(/(?<!dark:)text-gray-400/g, 'text-gray-500 dark:text-gray-400');
  
  // Replace text-gray-500 with text-gray-600 dark:text-gray-500 (if no dark: prefix is present)
  content = content.replace(/(?<!dark:)text-gray-500/g, 'text-gray-600 dark:text-gray-500');

  // There are some places in StudentDashboard string literals: className={`... text-gray-500`}
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
