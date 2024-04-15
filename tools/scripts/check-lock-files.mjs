import { existsSync, readFileSync } from 'node:fs';

async function checkLockFiles() {
  const errors = [];
  if (existsSync('yarn.lock')) {
    errors.push('Invalid occurence of "yarn.lock" file. Please remove it and use only "pnpm-lock.yaml"');
  }
  if (existsSync('package-lock.json')) {
    errors.push('Invalid occurence of "package-lock.json" file. Please remove it and use only "pnpm-lock.yaml"');
  }
  try {
    const content = readFileSync('pnpm-lock.yaml', 'utf-8');
    if (content.match(/localhost:487/)) {
      errors.push(
        'The "pnpm-lock.yaml" has reference to local repository ("localhost:4873"). Please use ensure you disable local registry before running "pnpm install"'
      );
    }
    if (content.match(/resolution: \{tarball/)) {
      errors.push('The "pnpm-lock.yaml" has reference to tarball package. Please use npm registry only');
    }
  } catch {
    errors.push('The "pnpm-lock.yaml" does not exist or cannot be read');
  }
  return errors;
}

console.log('🔒🔒🔒 Validating lock files 🔒🔒🔒\n');
const invalid = await checkLockFiles();
if (invalid.length > 0) {
  invalid.forEach((e) => console.log(e));
  process.exit(1);
} else {
  console.log('Lock file is valid 👍');
  process.exit(0);
}
