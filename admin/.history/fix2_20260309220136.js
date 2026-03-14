const fs = require('fs');

// ── Fix 1: auth.ts ──────────────────────────────────────────
// The file has two interfaces merged. We rewrite the whole file cleanly.
const authTs = `export interface AdminCredentials {
  email: string
  password: string
  lastLogin?: string
  loginAttempts?: number
  lockedUntil?: string
  twoFactorEnabled: boolean
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'super_admin' | 'admin' | 'moderator' | 'support'
  permissions: string[]
  avatar?: string
  lastLogin?: string
  loginAttempts?: number
  lockedUntil?: string
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  createdAt: string
  updatedAt: string
}

export interface AdminLoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorCode?: string
}

export interface AdminAuthState {
  user: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  requiresTwoFactor: boolean
  sessionExpiry: string | null
}

export interface SessionConfig {
  TOKEN_EXPIRY: number
  REFRESH_TOKEN_EXPIRY: number
  MAX_LOGIN_ATTEMPTS: number
  LOCKOUT_DURATION: number
  SESSION_TIMEOUT: number
  WARNING_BEFORE_TIMEOUT: number
}
`;

fs.writeFileSync('src/types/auth.ts', authTs, 'utf8');
console.log('Fixed: src/types/auth.ts');

// ── Fix 2: TwoFactorAuth.tsx — collapse multiline classNames ─
let tfa = fs.readFileSync('src/app/components/auth/TwoFactorAuth.tsx', 'utf8');

// Replace the multiline className on the OTP input (lines 184-191 approx)
// Match the pattern: className="w-12 h-14 ... (with real newlines and spaces inside the string)
tfa = tfa.replace(
  /className="w-12 h-14[\s\S]*?transition-all duration-200"/,
  'className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"'
);

fs.writeFileSync('src/app/components/auth/TwoFactorAuth.tsx', tfa, 'utf8');
console.log('Fixed: src/app/components/auth/TwoFactorAuth.tsx');

// ── Verify no more multiline classNames in any tsx file ───────
const path = require('path');
function scanMultilineClassNames(dir) {
  const skip = ['node_modules', '.next', 'dist'];
  fs.readdirSync(dir).forEach(item => {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory() && !skip.includes(item)) {
      scanMultilineClassNames(full);
    } else if (item.match(/\.(tsx|ts|jsx|js)$/)) {
      const content = fs.readFileSync(full, 'utf8');
      // Check for className=" that spans multiple lines
      if (/className="[^"]*\n[^"]*"/.test(content)) {
        console.log('MULTILINE className found in: ' + full);
      }
      // Check for non-ASCII chars still remaining
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        for (let c = 0; c < line.length; c++) {
          const code = line.charCodeAt(c);
          if (code > 126 || (code < 32 && code !== 9 && code !== 13)) {
            console.log('BAD CHAR in ' + full + ':' + (i+1) + ' charCode=' + code);
          }
        }
      });
    }
  });
}

console.log('\n--- Verifying ---');
scanMultilineClassNames('src');
console.log('Done.');