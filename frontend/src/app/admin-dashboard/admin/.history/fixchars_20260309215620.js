const fs = require('fs');

const fixes = [
  {
    file: 'src/app/components/admin/RecentUsersTable.tsx',
    replacements: [
      [/View all users →/g, 'View all users ->'],
    ]
  },
  {
    file: 'src/constants/resources.ts',
    replacements: [
      // Replace emoji icons with plain text equivalents
      [/icon: '📄'/g, "icon: 'article'"],
      [/icon: '🎥'/g, "icon: 'video'"],
      [/icon: '🎵'/g, "icon: 'audio'"],
      [/icon: '📚'/g, "icon: 'guide'"],
      [/icon: '📝'/g, "icon: 'worksheet'"],
      [/icon: '🔗'/g, "icon: 'link'"],
      // Fallback: strip any remaining non-ASCII in icon values
      [/icon: '[^\x00-\x7F]+'/g, "icon: 'resource'"],
    ]
  },
  {
    file: 'src/hooks/useAdminAuth.ts',
    replacements: [
      [/✅/g, ''],
      [/—/g, '-'],
    ]
  },
];

// For page.tsx we rebuild comments and fix inline chars
function fixPageTsx() {
  const file = 'src/app/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Fix box-drawing chars in comments (─ = U+2500)
  content = content.replace(/──/g, '--');
  content = content.replace(/─/g, '-');

  // Fix em dash
  content = content.replace(/—/g, '-');

  // Fix bullet placeholder chars (• = U+2022, · = U+00B7)
  content = content.replace(/placeholder="[•·]+"/g, 'placeholder="**********"');
  content = content.replace(/placeholder='[•·]+'/g, "placeholder='**********'");

  // Fix copyright symbol
  content = content.replace(/©/g, '&copy;');

  // Fix middle dot
  content = content.replace(/·/g, '&middot;');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed: ' + file);
}

function fixRecentUsersTable() {
  const file = 'src/app/components/admin/RecentUsersTable.tsx';
  if (!fs.existsSync(file)) { console.log('Not found: ' + file); return; }
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/→/g, '->');
  content = content.replace(/←/g, '<-');
  content = content.replace(/—/g, '-');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed: ' + file);
}

function fixResourcesTs() {
  const file = 'src/constants/resources.ts';
  if (!fs.existsSync(file)) { console.log('Not found: ' + file); return; }
  let content = fs.readFileSync(file, 'utf8');
  // Replace any non-ASCII characters inside single-quoted icon strings
  content = content.replace(/icon:\s*'[^']*'/g, function(match) {
    // If it contains non-ASCII, replace the whole icon value with 'resource'
    if (/[^\x00-\x7F]/.test(match)) {
      return "icon: 'resource'";
    }
    return match;
  });
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed: ' + file);
}

function fixUseAdminAuth() {
  const file = 'src/hooks/useAdminAuth.ts';
  if (!fs.existsSync(file)) { console.log('Not found: ' + file); return; }
  let content = fs.readFileSync(file, 'utf8');
  // Remove emoji checkmarks
  content = content.replace(/[^\x00-\x7F]/g, function(ch) {
    const code = ch.charCodeAt(0);
    // em dash -> hyphen
    if (code === 8212) return '-';
    // any other non-ASCII -> remove
    return '';
  });
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed: ' + file);
}

function fixAdminLoginForm() {
  const file = 'src/app/components/auth/AdminLoginForm.tsx';
  if (!fs.existsSync(file)) { console.log('Not found: ' + file); return; }
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/placeholder="[•·]+"/, 'placeholder="********"');
  content = content.replace(/placeholder='[•·]+'/, "placeholder='********'");
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed: ' + file);
}

function fixTwoFactorAuth() {
  const file = 'src/app/components/auth/TwoFactorAuth.tsx';
  if (!fs.existsSync(file)) { console.log('Not found: ' + file); return; }
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/←/g, '<-');
  content = content.replace(/→/g, '->');
  content = content.replace(/—/g, '-');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed: ' + file);
}

// Run all fixes
fixPageTsx();
fixRecentUsersTable();
fixResourcesTs();
fixUseAdminAuth();
fixAdminLoginForm();
fixTwoFactorAuth();

// Final scan to confirm
console.log('\n--- Verifying ---');
const path = require('path');
function scanDir(dir) {
  const skip = ['node_modules', '.next', 'dist'];
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !skip.includes(item)) {
      scanDir(full);
    } else if (item.match(/\.(tsx|ts|jsx|js)$/)) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      let fileHasBad = false;
      lines.forEach((line, i) => {
        for (let c = 0; c < line.length; c++) {
          const code = line.charCodeAt(c);
          if (code > 126 || (code < 32 && code !== 9 && code !== 13)) {
            if (!fileHasBad) console.log('STILL BAD: ' + full);
            fileHasBad = true;
            console.log('  line ' + (i+1) + ' col ' + (c+1) + ' charCode=' + code);
          }
        }
      });
    }
  });
}
scanDir('src');
console.log('Done.');