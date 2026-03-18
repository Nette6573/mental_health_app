const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    const skip = ['node_modules', '.next', 'dist'];
    if (stat.isDirectory() && !skip.includes(item)) {
      scanDir(full);
    } else if (item.match(/\.(tsx|ts|jsx|js)$/)) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      lines.forEach((line, i) => {
        for (let c = 0; c < line.length; c++) {
          const code = line.charCodeAt(c);
          if (code > 126 || (code < 32 && code !== 9 && code !== 13)) {
            const ctx = JSON.stringify(line.slice(Math.max(0, c - 20), c + 20));
            console.log(full + ':' + (i + 1) + ':' + (c + 1) + ' charCode=' + code + ' >> ' + ctx);
          }
        }
      });
    }
  });
}

scanDir('src');
console.log('Scan complete.');