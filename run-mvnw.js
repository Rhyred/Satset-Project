const { spawn } = require('child_process');

const args = process.argv.slice(2);
const cmd = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';

const child = spawn(cmd, args, { stdio: 'inherit', shell: true });

child.on('error', (err) => {
  console.error('Failed to start mvnw:', err);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code || 0);
});
