const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.PORT = '3000';
process.env.BASE_PATH = '/';
process.env.VITE_CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_bmVhdC1jaG93LTI0LmNsZXJrLmFjY291bnRzLmRldiQ';

console.log('[v0] Starting dev server for genai-learn...');

// Change to project directory
process.chdir('/vercel/share/v0-project');

// Run pnpm install first
const install = spawn('pnpm', ['install'], {
  stdio: 'inherit',
  shell: true
});

install.on('close', (code) => {
  if (code !== 0) {
    console.error('[v0] pnpm install failed with code', code);
    process.exit(code);
  }
  
  // Then run dev
  const dev = spawn('pnpm', ['--filter', '@workspace/genai-learn', 'run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: '/vercel/share/v0-project'
  });

  dev.on('close', (code) => {
    console.log('[v0] Dev server stopped with code', code);
    process.exit(code);
  });
});
