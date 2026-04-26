const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Check the actual compiled chunk for the error at line 967
const chunkDir = path.join('.next', 'dev', 'server', 'chunks', 'ssr');
if (fs.existsSync(chunkDir)) {
  const chunks = fs.readdirSync(chunkDir).filter(f => f.includes('src_app_726668e8'));
  chunks.forEach(chunk => {
    const full = path.join(chunkDir, chunk);
    const lines = fs.readFileSync(full, 'utf8').split('\n');
    const start = Math.max(0, 960);
    const end = Math.min(lines.length, 975);
    console.log('=== CHUNK: ' + chunk + ' lines 961-975 ===');
    for (let i = start; i < end; i++) {
      console.log((i+1) + ': ' + lines[i].slice(0, 200));
    }
  });
} else {
  console.log('No .next dir yet - run npm run dev first, then re-run this script');
}

// 2. Try to parse every tsx/ts file with acorn to find syntax errors
console.log('\n=== Checking TypeScript syntax via tsc ===');
try {
  const result = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8' });
  console.log(result || 'No TypeScript errors found.');
} catch (e) {
  console.log(e.stdout || e.message);
}