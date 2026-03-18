const fs = require('fs');

// Show auth.ts around the problem lines
console.log('=== src/types/auth.ts ===');
const auth = fs.readFileSync('src/types/auth.ts', 'utf8').split('\n');
auth.forEach((line, i) => {
  if (i >= 8 && i <= 60) {
    console.log((i+1) + ': ' + line);
  }
});

// Show TwoFactorAuth.tsx around line 175
console.log('\n=== TwoFactorAuth.tsx lines 168-185 ===');
const tfa = fs.readFileSync('src/app/components/auth/TwoFactorAuth.tsx', 'utf8').split('\n');
tfa.forEach((line, i) => {
  if (i >= 167 && i <= 185) {
    console.log((i+1) + ': ' + line);
  }
});

// Also show RecentUsersTable.tsx around line 100
console.log('\n=== RecentUsersTable.tsx lines 97-103 ===');
const rut = fs.readFileSync('src/app/components/admin/RecentUsersTable.tsx', 'utf8').split('\n');
rut.forEach((line, i) => {
  if (i >= 96 && i <= 103) {
    console.log((i+1) + ': ' + line);
  }
});