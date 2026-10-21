import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const commands = {
  start: ['emulators:start', '--config', 'firebase.local.json', '--project', 'demo-wishlist-local', '--only', 'auth,firestore,storage', '--import', '.firebase/local-data', '--export-on-exit', '.firebase/local-data'],
  test: ['emulators:exec', '--config', 'firebase.emulators.json', '--project', 'demo-wishlist-rules', '--only', 'firestore,storage', 'node scripts/test-firebase-rules.mjs'],
};
const args = Object.hasOwn(commands, process.argv[2]) && commands[process.argv[2]];
if (!args || process.argv.length !== 3) {
  console.error('Use npm run emulators or npm run test:rules. Additional Firebase arguments are not accepted.');
  process.exit(1);
}

let localJavaHome = '';
try {
  localJavaHome = readFileSync(join(root, '.firebase/java-home'), 'utf8').trim();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const javaHome = process.env.FIREBASE_JAVA_HOME || localJavaHome || process.env.JAVA_HOME;
const env = { ...process.env };
if (javaHome) {
  env.JAVA_HOME = javaHome;
  env.PATH = `${join(javaHome, 'bin')}${delimiter}${env.PATH || ''}`;
}
const java = spawnSync(javaHome ? join(javaHome, 'bin/java') : 'java', ['-version'], { env, encoding: 'utf8', timeout: 10000 });
const major = Number(`${java.stderr || ''}${java.stdout || ''}`.match(/version "(\d+)/)?.[1]);
if (java.status !== 0 || !Number.isFinite(major) || major < 21) {
  console.error('Firebase emulators require Java 21 or newer. Set FIREBASE_JAVA_HOME or save its home path in .firebase/java-home. System Java is not changed.');
  process.exit(1);
}

// Storage uses a shared temp path regardless of project or ports; isolate each CLI process.
const runtimeRoot = join(root, '.firebase/runtime');
mkdirSync(runtimeRoot, { recursive: true, mode: 0o700 });
const runtimeDirectory = mkdtempSync(join(runtimeRoot, `${process.argv[2]}-`));
env.TMPDIR = env.TEMP = env.TMP = runtimeDirectory;

// A separate process group prevents Ctrl+C from stopping Java before Firebase exports local data.
const child = spawn('firebase', args, { cwd: root, env, stdio: 'inherit', detached: process.platform !== 'win32' });
let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    if (!stopping) {
      stopping = true;
      child.kill(signal);
    }
  });
}
child.on('error', error => {
  console.error(`Cannot start Firebase CLI: ${error.message}. Install firebase-tools@15.12.0.`);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  if (code === 0) rmSync(runtimeDirectory, { recursive: true, force: true });
  process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1);
});
