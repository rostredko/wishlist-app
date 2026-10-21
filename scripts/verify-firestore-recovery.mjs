import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const project = 'wishlist-app-51cf7';
const api = 'https://firestore.googleapis.com/v1/';

export function validateRecoveryTarget(target) {
  if (!/^wishlist-recovery-\d{8}t\d{6}$/.test(target)) throw new Error('A dedicated wishlist-recovery timestamped database is required.');
  return target;
}

export function validateSnapshot(snapshot) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00Z$/.test(snapshot) || !Number.isFinite(Date.parse(snapshot))) {
    throw new Error('A valid whole-minute UTC snapshot is required.');
  }
  return snapshot;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}

function fingerprint(documents) {
  const rows = documents.map(document => {
    const path = document.name.split('/documents/')[1];
    if (!path) throw new Error('Invalid document resource name.');
    return { path, fields: canonical(document.fields ?? {}) };
  }).sort((a, b) => a.path.localeCompare(b.path));
  if (new Set(rows.map(row => row.path)).size !== rows.length) throw new Error('Duplicate document paths.');
  return createHash('sha256').update(JSON.stringify(rows)).digest('hex');
}

export function compareDocuments(source, recovered) {
  const digest = fingerprint(source);
  if (source.length !== recovered.length || digest !== fingerprint(recovered)) throw new Error('Recovery content mismatch; no documents were modified.');
  return { documents: source.length, sha256: digest, matched: true };
}

async function verify(target, snapshot) {
  validateRecoveryTarget(target);
  validateSnapshot(snapshot);
  const token = execFileSync('gcloud', ['auth', 'print-access-token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  async function read(path, query) {
    const response = await fetch(api + path, {
      method: query ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: query ? JSON.stringify(query) : undefined,
      signal: AbortSignal.timeout(90000),
    });
    if (!response.ok) throw new Error(`Firestore read failed: HTTP ${response.status}`);
    return response.json();
  }
  const databasePath = id => `projects/${project}/databases/${id}`;
  const sourceMeta = await read(databasePath('(default)'));
  const targetMeta = await read(databasePath(target));
  if (sourceMeta.uid === targetMeta.uid || targetMeta.type !== 'FIRESTORE_NATIVE' || targetMeta.locationId !== sourceMeta.locationId) {
    throw new Error('Recovery database identity/location mismatch.');
  }
  if (Date.parse(snapshot) < Date.parse(sourceMeta.earliestVersionTime) || Date.parse(snapshot) > Date.now()) {
    throw new Error('Snapshot is outside available source history.');
  }
  async function documents(id, collectionId, readTime) {
    const rows = await read(`${databasePath(id)}/documents:runQuery`, {
      structuredQuery: { from: [{ collectionId, allDescendants: true }] },
      ...(readTime ? { readTime } : {}),
    });
    if (!Array.isArray(rows) || rows.some(row => row.error)) throw new Error('Incomplete query response.');
    return rows.filter(row => row.document).map(row => row.document);
  }
  const collections = {};
  for (const collection of ['wishlists', 'items']) {
    const source = await documents('(default)', collection, snapshot);
    const recovered = await documents(target, collection);
    collections[collection] = compareDocuments(source, recovered);
  }
  if (collections.wishlists.documents === 0) throw new Error('Unexpected empty wishlist snapshot.');
  return { project, sourceDatabase: '(default)', recoveryDatabase: target, sourceUid: sourceMeta.uid, recoveryUid: targetMeta.uid, snapshotTime: snapshot, verifiedAt: new Date().toISOString(), collections, status: 'PASS', scope: 'All wishlists and items collection-group document paths and typed field values; read-only comparison.' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 4) throw new Error('Usage: node scripts/verify-firestore-recovery.mjs wishlist-recovery-YYYYMMDDtHHMMSS YYYY-MM-DDTHH:MM:00Z');
  console.info(JSON.stringify(await verify(process.argv[2], process.argv[3]), null, 2));
}
