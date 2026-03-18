const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Remove the global body rule so it doesn't bleed into other pages
content = content.replace(
  /body\s*\{\s*background:[^}]+\}/g,
  '/* body styles scoped via .page-wrap */'
);

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
console.log('Fixed: src/app/page.tsx - removed global body style');
console.log('Done.');