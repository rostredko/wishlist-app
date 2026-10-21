// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const launcher = resolve(root, 'scripts/firebase-emulators.mjs');
let directory: string;
let javaHome: string;

function javaVersion(version: number) {
  writeFileSync(join(javaHome, 'bin/java'), `#!/bin/sh\nprintf 'openjdk version "${version}"\\n' >&2\n`, { mode: 0o755 });
}

function run(...args: string[]) {
  return spawnSync(process.execPath, [launcher, ...args], {
    cwd: directory,
    encoding: 'utf8',
    env: { ...process.env, FIREBASE_JAVA_HOME: javaHome, PATH: `${directory}/bin:${process.env.PATH}`, LAUNCHER_PROBE: directory },
    timeout: 10000,
  });
}

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'wishlist-emulator-launcher-'));
  javaHome = join(directory, 'Java runtime');
  mkdirSync(join(javaHome, 'bin'), { recursive: true });
  mkdirSync(join(directory, 'bin'));
  javaVersion(21);
  writeFileSync(join(directory, 'bin/firebase'), `#!/usr/bin/env node
const fs = require('node:fs');
fs.writeFileSync(process.env.LAUNCHER_PROBE + '/invoked', 'yes');
process.stdout.write(JSON.stringify({ args: process.argv.slice(2), javaHome: process.env.JAVA_HOME, path: process.env.PATH, cwd: process.cwd(), temp: process.env.TMPDIR, tempExists: fs.existsSync(process.env.TMPDIR || '') }));
process.exit(fs.existsSync(process.env.LAUNCHER_PROBE + '/fail') ? 7 : 0);
`, { mode: 0o755 });
});

afterEach(() => rmSync(directory, { recursive: true, force: true }));

describe('local Firebase launcher', () => {
  it('starts only local services with persistent data and the selected Java', () => {
    const result = run('start');
    expect(result.status, result.stderr).toBe(0);
    const invocation = JSON.parse(result.stdout);
    expect(invocation.args).toEqual(['emulators:start', '--config', 'firebase.local.json', '--project', 'demo-wishlist-local', '--only', 'auth,firestore,storage', '--import', '.firebase/local-data', '--export-on-exit', '.firebase/local-data']);
    expect(invocation.javaHome).toBe(javaHome);
    expect(invocation.path.split(':')[0]).toBe(join(javaHome, 'bin'));
    expect(invocation.cwd).toBe(root);
  });

  it('runs rules checks separately without importing or exporting local dev data', () => {
    javaVersion(25);
    const result = run('test');
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout).args).toEqual(['emulators:exec', '--config', 'firebase.emulators.json', '--project', 'demo-wishlist-rules', '--only', 'firestore,storage', 'node scripts/test-firebase-rules.mjs']);
  });

  it('refuses an obsolete Java before launching Firebase', () => {
    javaVersion(18);
    const result = run('start');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Java 21');
    expect(existsSync(join(directory, 'invoked'))).toBe(false);
  });

  it('isolates Storage temporary files between emulator runs', () => {
    const development = JSON.parse(run('start').stdout);
    const rules = JSON.parse(run('test').stdout);
    for (const invocation of [development, rules]) {
      expect(invocation.temp).toMatch(new RegExp(`^${root}/\\.firebase/runtime/`));
      expect(invocation.tempExists).toBe(true);
      expect(existsSync(invocation.temp)).toBe(false);
    }
    expect(development.temp).not.toBe(rules.temp);
  });

  it.each([['deploy'], ['start', '--project', 'wishlist-app-51cf7']])('rejects unapproved command/arguments: %s', (...args) => {
    expect(run(...args).status).toBe(1);
    expect(existsSync(join(directory, 'invoked'))).toBe(false);
  });

  it('returns a failed Firebase command exit code', () => {
    writeFileSync(join(directory, 'fail'), 'yes');
    const result = run('test');
    expect(result.status).toBe(7);
    const { temp } = JSON.parse(result.stdout);
    if (temp?.startsWith(join(root, '.firebase/runtime/'))) rmSync(temp, { recursive: true, force: true });
  });
});
