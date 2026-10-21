import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setLogLevel } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, updateDoc, getDoc, deleteDoc, writeBatch, terminate } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, ref, uploadBytes, deleteObject, getBytes } from 'firebase/storage';
setLogLevel('silent');
const projectId = 'demo-wishlist-rules';
assert.equal(process.env.GCLOUD_PROJECT, projectId, 'Run via npm run test:rules with the disposable demo project.');
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8180', 'A loopback Firestore test emulator is required.');
if (process.env.FIRESTORE_ONLY !== '1') {
  assert.equal(process.env.FIREBASE_STORAGE_EMULATOR_HOST, '127.0.0.1:9299', 'A loopback Storage test emulator is required.');
}
const apps = [];
function client(uid, claims = {}) {
  const app = initializeApp({ projectId, apiKey: 'fake', storageBucket: `${projectId}.appspot.com` }, `${uid || 'guest'}-${apps.length}`);
  apps.push(app);
  const db = getFirestore(app); const storage = getStorage(app);
  const options = uid ? { mockUserToken: { sub: uid, ...claims } } : {};
  connectFirestoreEmulator(db, '127.0.0.1', 8180, options);
  connectStorageEmulator(storage, '127.0.0.1', 9299, options);
  return { db, storage };
}
async function denied(action) { await assert.rejects(action, error => /permission|unauthorized/i.test(error.code || error.message)); }

try {
  const cleared = await fetch(`http://127.0.0.1:8180/emulator/v1/projects/${projectId}/databases/(default)/documents`, { method: 'DELETE', signal: AbortSignal.timeout(5000) });
  assert.equal(cleared.ok, true);
  const owner = client('owner'); const stranger = client('stranger'); const guest = client(); const admin = client('admin', { isAdmin: true });
  // Synthetic pre-growth records must remain usable without backfilling new optional fields.
  const legacyList = { title: 'Legacy wishlist', ownerUid: 'owner', bannerImage: 'https://example.com/legacy.png', isHidden: false };
  const legacyGift = { name: 'Legacy gift', description: 'Keep this text', link: 'https://example.com/gift', claimed: false };
  await setDoc(doc(owner.db, 'wishlists', 'legacy'), legacyList);
  await setDoc(doc(owner.db, 'wishlists/legacy/items/gift'), legacyGift);
  assert.deepEqual((await getDoc(doc(guest.db, 'wishlists', 'legacy'))).data(), legacyList);
  await updateDoc(doc(owner.db, 'wishlists', 'legacy'), { title: 'Renamed legacy wishlist' });
  assert.deepEqual((await getDoc(doc(owner.db, 'wishlists', 'legacy'))).data(), { ...legacyList, title: 'Renamed legacy wishlist' });
  await updateDoc(doc(owner.db, 'wishlists/legacy/items/gift'), { name: 'Renamed legacy gift' });
  await updateDoc(doc(guest.db, 'wishlists/legacy/items/gift'), { claimed: true });
  await denied(deleteDoc(doc(stranger.db, 'wishlists', 'legacy')));
  await denied(deleteDoc(doc(stranger.db, 'wishlists/legacy/items/gift')));
  assert.deepEqual((await getDoc(doc(owner.db, 'wishlists/legacy/items/gift'))).data(), { ...legacyGift, name: 'Renamed legacy gift', claimed: true });
  const demoSource = (await readFile(new URL('../src/constants/exampleWishlists.ts', import.meta.url), 'utf8')).split('export const DEMO_ITEMS')[0];
  const reservedIds = [...demoSource.matchAll(/^  '([^']+)':/gm)].map(match => match[1]);
  assert.equal(reservedIds.length, 8);
  for (const id of reservedIds) await denied(setDoc(doc(stranger.db, 'wishlists', id), { title: 'Hijack', ownerUid: 'stranger' }));
  await setDoc(doc(admin.db, 'wishlists', 'birthday-list'), { title: 'Official demo', ownerUid: 'admin' });
  await setDoc(doc(admin.db, 'wishlists/birthday-list/items/example'), { name: 'Example', claimed: false });
  assert.equal((await getDoc(doc(guest.db, 'wishlists', 'birthday-list'))).exists(), true);
  await denied(updateDoc(doc(guest.db, 'wishlists/birthday-list/items/example'), { claimed: true }));
  // Seed a historically hijacked demo only in the disposable emulator to verify its owner is still denied.
  const seed = await fetch(`http://127.0.0.1:8180/v1/projects/${projectId}/databases/(default)/documents/wishlists/secret-santa-list`, {
    method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { ownerUid: { stringValue: 'stranger' }, title: { stringValue: 'Old hijack' } } }),
  });
  assert.equal(seed.ok, true);
  await denied(updateDoc(doc(stranger.db, 'wishlists', 'secret-santa-list'), { title: 'Hijack again' }));
  await denied(deleteDoc(doc(stranger.db, 'wishlists', 'secret-santa-list')));
  await denied(setDoc(doc(stranger.db, 'wishlists/secret-santa-list/items/rogue'), { name: 'Rogue', claimed: false }));
  await setDoc(doc(admin.db, 'wishlists/secret-santa-list/items/example'), { name: 'Example', claimed: false });
  await denied(updateDoc(doc(stranger.db, 'wishlists/secret-santa-list/items/example'), { name: 'Hijack' }));
  await denied(deleteDoc(doc(stranger.db, 'wishlists/secret-santa-list/items/example')));
  await setDoc(doc(owner.db, 'wishlists', 'list'), { title: 'List', ownerUid: 'owner', creationMethod: 'manual' });
  await denied(setDoc(doc(stranger.db, 'wishlists', 'spoof'), { ownerUid: 'owner' }));
  await denied(updateDoc(doc(stranger.db, 'wishlists', 'list'), { title: 'Stolen' }));
  await denied(updateDoc(doc(owner.db, 'wishlists', 'list'), { ownerUid: 'stranger' }));
  await denied(updateDoc(doc(owner.db, 'wishlists', 'list'), { creationMethod: 'demo_copy' }));
  await denied(setDoc(doc(owner.db, 'wishlists', 'bad-method'), { ownerUid: 'owner', creationMethod: 'invalid' }));
  await setDoc(doc(owner.db, 'wishlists/list/items/pen'), { name: 'Pen', claimed: false });
  await updateDoc(doc(guest.db, 'wishlists/list/items/pen'), { claimed: true });
  await denied(updateDoc(doc(guest.db, 'wishlists/list/items/pen'), { claimed: false }));
  await denied(updateDoc(doc(stranger.db, 'wishlists/list/items/pen'), { name: 'Stolen' }));
  await updateDoc(doc(owner.db, 'wishlists/list/items/pen'), { claimed: false, priceMinor: 0, currency: 'UAH' });
  await denied(updateDoc(doc(owner.db, 'wishlists/list/items/pen'), { priceMinor: -1 }));
  await denied(updateDoc(doc(owner.db, 'wishlists/list/items/pen'), { priceMinor: 1.5 }));
  await denied(updateDoc(doc(owner.db, 'wishlists/list/items/pen'), { currency: 'BTC' }));
  await updateDoc(doc(admin.db, 'wishlists', 'list'), { title: 'Admin edit' });
  await updateDoc(doc(owner.db, 'wishlists/list/items/pen'), { priceMinor: null, currency: null });
  assert.equal((await getDoc(doc(guest.db, 'wishlists', 'list'))).exists(), true);
  const batch = writeBatch(owner.db);
  batch.set(doc(owner.db, 'wishlists', 'copy'), { ownerUid: 'owner', creationMethod: 'shared_copy' });
  batch.set(doc(owner.db, 'wishlists/copy/items/pen'), { name: 'Pen', claimed: false, priceMinor: 12, currency: 'EUR' });
  await batch.commit();
  const badBatch = writeBatch(owner.db);
  badBatch.set(doc(owner.db, 'wishlists', 'bad-copy'), { ownerUid: 'owner' });
  badBatch.set(doc(owner.db, 'wishlists/bad-copy/items/pen'), { claimed: false, priceMinor: -1, currency: 'EUR' });
  await denied(badBatch.commit());
  assert.equal((await getDoc(doc(owner.db, 'wishlists', 'bad-copy'))).exists(), false);
  if (process.env.FIRESTORE_ONLY === '1') {
    console.info('Firestore rules acceptance passed: ownership, guest claim policy, money, public read and atomic copy.');
  } else {
  await denied(uploadBytes(ref(stranger.storage, 'banners/secret-santa-list/rogue'), new Uint8Array([1]), { contentType: 'image/png' }));
  await uploadBytes(ref(admin.storage, 'banners/secret-santa-list/official'), new Uint8Array([1]), { contentType: 'image/png' });
  const object = ref(owner.storage, 'banners/list/banner');
  await uploadBytes(object, new Uint8Array([1]), { contentType: 'image/png' });
  await uploadBytes(object, new Uint8Array([2]), { contentType: 'image/png' });
  await denied(uploadBytes(ref(stranger.storage, object.fullPath), new Uint8Array([3]), { contentType: 'image/png' }));
  await denied(uploadBytes(ref(guest.storage, object.fullPath), new Uint8Array([3]), { contentType: 'image/png' }));
  assert.equal((await getBytes(ref(guest.storage, object.fullPath))).byteLength, 1);
  await denied(uploadBytes(ref(owner.storage, 'banners/list/text'), new Uint8Array([3]), { contentType: 'text/plain' }));
  await denied(uploadBytes(ref(owner.storage, 'banners/list/large'), new Uint8Array(10 * 1024 * 1024), { contentType: 'image/png' }));
  await denied(deleteObject(ref(stranger.storage, object.fullPath)));
  await uploadBytes(ref(admin.storage, object.fullPath), new Uint8Array([4]), { contentType: 'image/png' });
  await deleteObject(object);
  await denied(uploadBytes(ref(owner.storage, 'banners/legacy.png'), new Uint8Array([1]), { contentType: 'image/png' }));
  const legacyBanner = await fetch(`http://127.0.0.1:9299/v0/b/${projectId}.appspot.com/o?name=banners%2Flegacy.png`, {
    method: 'POST', headers: { Authorization: 'Bearer owner', 'Content-Type': 'image/png' }, body: new Uint8Array([7]),
  });
  assert.equal(legacyBanner.ok, true);
  assert.deepEqual(new Uint8Array(await getBytes(ref(guest.storage, 'banners/legacy.png'))), new Uint8Array([7]));
  await denied(deleteObject(ref(owner.storage, 'banners/legacy.png')));
  assert.deepEqual(new Uint8Array(await getBytes(ref(guest.storage, 'banners/legacy.png'))), new Uint8Array([7]));
  console.info('Firebase rules acceptance passed: ownership, guests, money, atomic copy, banner writes/reads/deletes, type/size, legacy write denial.');
  }
} finally {
  for (const app of apps) { await terminate(getFirestore(app)); await deleteApp(app); }
}
