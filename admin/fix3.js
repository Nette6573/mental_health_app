const fs = require('fs');
const path = require('path');

// 1. Show chunk around line 995
const chunkDir = path.join('.next', 'dev', 'server', 'chunks', 'ssr');
const chunks = fs.readdirSync(chunkDir).filter(f => f.includes('src_app_726668e8') && !f.endsWith('.map'));
chunks.forEach(chunk => {
  const lines = fs.readFileSync(path.join(chunkDir, chunk), 'utf8').split('\n');
  console.log('=== CHUNK lines 988-1005 ===');
  for (let i = 985; i < Math.min(lines.length, 1008); i++) {
    console.log((i+1) + ': ' + lines[i].slice(0, 300));
  }
});

// 2. Find ALL multiline strings (className or not) in tsx/ts files
console.log('\n=== Multiline strings in src ===');
function scanDir(dir) {
  const skip = ['node_modules', '.next', 'dist'];
  fs.readdirSync(dir).forEach(item => {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory() && !skip.includes(item)) {
      scanDir(full);
    } else if (item.match(/\.(tsx|ts|jsx|js)$/)) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      // Find any line where a double-quoted string is opened but not closed
      lines.forEach((line, i) => {
        // Count unescaped quotes
        let inStr = false;
        for (let c = 0; c < line.length; c++) {
          if (line[c] === '"' && (c === 0 || line[c-1] !== '\\')) {
            inStr = !inStr;
          }
        }
        // If a string is still open at end of line, it continues to next line
        if (inStr) {
          console.log('UNCLOSED STRING: ' + full + ':' + (i+1) + ' >> ' + line.trim().slice(0, 120));
        }
      });
    }
  });
}
scanDir('src');
console.log('\nDone.');