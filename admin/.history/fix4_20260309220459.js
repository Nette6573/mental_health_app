const fs = require('fs');

function collapseMultilineClassNames(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Collapse any className="..." that spans multiple lines
  // This regex matches className=" then captures everything until the closing "
  // including newlines, then collapses whitespace
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 20) {
    changed = false;
    iterations++;
    content = content.replace(/className="([^"]*)(\n)([^"]*)"/g, function(match, before, nl, after) {
      changed = true;
      // Collapse the newline and extra whitespace into a single space
      return 'className="' + (before + ' ' + after).replace(/\s+/g, ' ').trim() + '"';
    });
  }
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Fixed: ' + filepath);
}

collapseMultilineClassNames('src/app/components/auth/TwoFactorAuth.tsx');
collapseMultilineClassNames('src/app/components/auth/AdminLoginForm.tsx');

// Verify
const path = require('path');
console.log('\n--- Verifying ---');
let allGood = true;
function scanDir(dir) {
  const skip = ['node_modules', '.next', 'dist'];
  fs.readdirSync(dir).forEach(item => {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory() && !skip.includes(item)) {
      scanDir(full);
    } else if (item.match(/\.(tsx|ts|jsx|js)$/)) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      let inString = false;
      lines.forEach((line, i) => {
        for (let c = 0; c < line.length; c++) {
          if (line[c] === '"' && (c === 0 || line[c-1] !== '\\')) inString = !inString;
        }
        if (inString) {
          console.log('STILL UNCLOSED: ' + full + ':' + (i+1) + ' >> ' + line.trim().slice(0,100));
          allGood = false;
        }
      });
    }
  });
}
scanDir('src');
if (allGood) console.log('All strings closed. Ready to build.');