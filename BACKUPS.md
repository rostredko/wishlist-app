# Production backup and recovery

Status: native protection enabled on 2026-10-22 (Europe/Kyiv), immediate managed export restored and verified, encrypted Drive archive downloaded and verified. Production customer documents and application files were not modified. Recovery settings were changed with the owner's approval.

## Active protection and verified recovery

- Source: `wishlist-app-51cf7/(default)`, `eur3`. PITR is enabled with a 604,800-second retention window; database deletion protection is enabled.
- Daily schedule `a17b28f2-dd54-4cbf-b405-2d75856cbe03`: 30-day retention.
- Sunday schedule `105051b1-4927-4808-aa97-bf2da3b31157`: eight-week retention.
- The first scheduled backup had not appeared at verification time. The immediate export below already provides a recovery point. A scheduled-backup restore has not yet been rehearsed.
- Immediate snapshot: **2026-10-21 21:28:00 UTC** (2026-10-22 00:28:00 Europe/Kyiv).
- Managed export: `gs://wishlist-app-51cf7-recovery/exports/20261021t213013`. The new EU bucket has uniform bucket-level access, public access prevention enforced, and no public IAM principals.
- The export was imported into the newly created `wishlist-recovery-20261021t213013` database. The import completed successfully. All **1,169 wishlists and 4,430 items** match the source-at-snapshot by relative document path and canonical typed field hash. Their sum matches all 5,599 documents in the export/import operation counts.
- The recovery database rejects unauthenticated reads and has no deployed permissive Firebase rules release. It is protected against database deletion and retained as a pre-merge recovery copy. The application still uses `(default)`.
- [Private Drive folder](https://drive.google.com/drive/folders/1IekZs5Fdv06P7KOox2CayG1Jk0q3yNsQ) and [encrypted archive](https://drive.google.com/file/d/1bnrGyt7bGSjHhDK-Q1iVgM1ny4j1Gc2p/view?usp=drivesdk).
- Archive: `wishlist-backup-20261021t213013.tar.gz.p7m`, 58,587,187 bytes, CMS AuthEnvelopedData with AES-256-GCM and a dedicated RSA recovery certificate. SHA-256: `fdf124a55888dc56ca34615bb88a3656a4930c1d8ba29901cf62063112fced18`.
- The archive includes 44 managed-export objects, all 246 current Storage objects (59,407,178 bytes), deployed rules, index/field/TTL configuration, metadata, per-file hashes, and recovery evidence. Object downloads were pinned to their generations and checked against Cloud Storage MD5 hashes. The Drive file was downloaded again, its full SHA-256 matched, and all 308 archived files passed checksum verification after decryption.
- The database restoration used the Cloud Storage export. The Drive copy contains byte-identical export files; its download, decryption, and file integrity were verified separately. Images were verified as recoverable bytes with object names and metadata, not re-uploaded into the production bucket.

One pre-existing banner reference points to a file absent from both current Storage and soft-deleted objects. The referencing document has not changed since 2025-10-01; the deletion time is unknown. This missing image could not be recovered from the current source. Its wishlist data is preserved, and the private archive records the reference. External/Auth-account recovery is outside this evidence.

Native Firebase backups are automatic. **Drive currently contains one verified pre-merge archive; recurring Drive uploads are not configured.** The recovery database and export bucket are retained without automatic cleanup. Their small storage cost is additional to scheduled backups. This is deliberate preservation until the release and a later cleanup decision.

## Recovery key and archive use

The private key is outside the repository at `~/.config/wishlist-app-backups/20261021t213013/recovery-private.pem`, with mode `0600`; its directory is owner-only. It was never uploaded to Drive or included in the archive. Keep a second copy in an offline recovery vault/password manager. Losing this key prevents decrypting the Drive archive, although native Firestore recovery uses Google Cloud access independently.

Use OpenSSL 3 with CMS AES-GCM support. The local run used OpenSSL 3.6.3; a synthetic test also confirmed that tampering is rejected. Download the archive, verify its SHA-256 above, then decrypt into a fresh private working directory:

```sh
umask 077
mkdir wishlist-recovery-work
openssl cms -decrypt -binary -inform DER \
  -inkey "$HOME/.config/wishlist-app-backups/20261021t213013/recovery-private.pem" \
  -in wishlist-backup-20261021t213013.tar.gz.p7m \
  -out wishlist-recovery-work/backup.tar.gz
```

Require a successful OpenSSL exit before opening/extracting the result; failed authentication can leave partial output. Extract only this verified archive into the new directory and verify `bundle/SHA256SUMS`. Preserve the managed-export directory and metadata filenames when copying the export back to a private Cloud Storage prefix. Import only into a fresh recovery database first. Managed exports do not recreate composite indexes or Firebase rules: use the archived configuration when preparing a replacement database. Storage object names, generations, content types, download-token metadata, and checksums are recorded in `bundle/manifest.json`.

Repeat the read-only database comparison while the source snapshot is within the PITR window:

```sh
node scripts/verify-firestore-recovery.mjs \
  wishlist-recovery-20261021t213013 2026-10-21T21:28:00Z
```

The verifier rejects non-recovery targets, compares all `wishlists` and `items` collection-group documents without writing them, and emits only aggregate counts/hashes. It cannot compare expired source history. Real production restoration remains a separately approved incident action.

## Baseline before setup - 2026-10-22 (Europe/Kyiv)

- Project: `wishlist-app-51cf7`; database: `(default)`; Standard edition, Native mode, `eur3`.
- Billing is enabled. PITR and database deletion protection are disabled.
- No backup schedules or managed backups were returned by the live APIs.
- Cloud Monitoring reports 12,244,912 bytes of database data and indexes (11.68 MiB / 0.011404 GiB). This is a delayed daily measurement, not an exact live export size.
- The application Storage bucket is `wishlist-app-51cf7.firebasestorage.app` in `us-east1`. Its live objects total about 58,403,578 bytes (55.70 MiB); soft delete retains deleted objects for seven days.
- No customer document contents or image bytes were downloaded during the audit.

## Cost estimate

The [Firestore Standard pricing table](https://cloud.google.com/firestore/pricing), with location **Europe 3 (eur3)** and monthly units selected, gives these USD list prices, checked on 2026-10-22:

| Feature | Rate | Estimate at the measured database size |
| --- | --- | --- |
| PITR, up to seven days | $0.18 / GiB-month | $0.00205 / month |
| Daily backups retained for 30 days | $0.03 / backup GiB-month | $0.01026 / month at steady state |
| Weekly backups retained for eight weeks | $0.03 / backup GiB-month | $0.00274 / month at steady state |
| Restore or clone operation | $0.40 / GiB restored | $0.00456 per operation |

The configured recurring Firestore protection is approximately **$0.0151/month**, assuming constant size and about 30 daily plus eight weekly copies. At 1 GiB it would be about **$1.32/month**. The first month has fewer retained backups while the schedules fill up.

This is an incremental estimate, not a bill or spending cap. It excludes tax, currency conversion, normal app usage, verification reads, restored-database storage, Cloud Storage exports/operations/egress, Drive capacity, and GitLab runner usage. PITR and managed backup storage have no free quota. Recalculate as the database grows.

The immediate rehearsal used managed export/import, charged by document reads/writes, rather than a managed-backup restore charged per GiB. The restore/clone estimate in the table does not price that export/import workflow. Actual billing was not yet reconciled.

## Recommended protection

1. Enable PITR on `(default)` to retain document history for up to seven days. The full seven-day window builds over time; enabling it does not recreate already expired history.
2. Enable database deletion protection. This prevents deleting the database itself; it does not prevent document edits or deletes.
3. Create one daily schedule with 30-day retention and one Sunday schedule with eight-week retention. Google chooses the time within the day; creating a schedule does not prove that its first backup exists.
4. Before merging, create and validate an immediate recovery point, then rehearse recovery into a fresh, uniquely named database. Never restore into `(default)` as a test.
5. Add an independent encrypted Drive archive as a second copy. It must include uploaded files if image recovery is part of the claim.

## Native setup reference

These commands were applied with the owner's approval. They change billable production recovery settings. Before any future change, repeat the describe/list calls and reconcile existing schedules; do not blindly create duplicates or shorten existing retention.

```sh
gcloud firestore databases describe --project=wishlist-app-51cf7 --database='(default)'
gcloud firestore backups schedules list --project=wishlist-app-51cf7 --database='(default)'
gcloud firestore backups list --project=wishlist-app-51cf7 --location=eur3

gcloud firestore databases update --project=wishlist-app-51cf7 --database='(default)' --enable-pitr --delete-protection
gcloud firestore backups schedules create --project=wishlist-app-51cf7 --database='(default)' --recurrence=daily --retention=30d
gcloud firestore backups schedules create --project=wishlist-app-51cf7 --database='(default)' --recurrence=weekly --day-of-week=SUN --retention=8w
```

Read back all settings, schedule IDs, `versionRetentionPeriod`, and `earliestVersionTime`. Store operation metadata and aggregate verification results only; never put credentials or customer records into Git, CI logs, or test fixtures.

## Recovery acceptance before merge

- Choose a whole-minute snapshot timestamp within the source database's available history and record it before copying.
- For immediate PITR verification, clone that snapshot to a fresh `wishlist-recovery-<timestamp>` database in `eur3`. The installed Firebase CLI supports `firestore:databases:clone`; the currently installed gcloud CLI does not expose the clone command. Do not silently upgrade tools or substitute a live import.
- Refuse `(default)`, existing database IDs, and destinations referenced by the app. Confirm the new database has no permissive client access. Never change the app's Firebase configuration to point at the recovery database.
- Wait for successful operation completion. Compare source-at-snapshot and recovered document paths/counts/content hashes, including all wishlist `items` subcollections. Preserve document IDs, ownership, reservations, timestamps, and optional fields. Output only aggregate counts and hash-match results.
- After the first scheduled backup becomes ready, also restore that backup into a new database and verify it. A PITR clone does not by itself validate the managed-backup restore path.
- Record snapshot time, operation ID, database/backup ID, verification scope/results, and limitations. Keep the recovery copy until its retention/cleanup is explicitly settled; never delete a pre-existing database.
- Restoring production later is a separate incident operation: preserve the current state, prepare a reviewed document-level change set, and obtain explicit approval. A bulk import can overwrite newer customer edits.

## Google Drive: reuse the pattern, not another project's credentials

The sibling FFMS project uses a read-only Firestore identity, GitLab OIDC, a dedicated `drive.file` OAuth grant, unique JSON filenames, and checksums. Its exporter is specific to `default-household` and is not an atomic database snapshot. Copying it unchanged would omit WishList's nested gift documents and Storage files.

Evenmore uses encrypted database-plus-files bundles, append-only Drive uploads, checksum validation, and isolated restore verification. Its database engine and dump format differ from Firestore, but those safety properties are suitable here.

For WishList, use a dedicated private `wishlist-app-backups` folder and a dedicated backup identity. Do not borrow sibling OAuth refresh tokens, service-account keys, or encryption identities. Native scheduled backups/PITR remain within Firestore; they cannot simply be configured to save into a Drive folder.

A complete independent archive should contain a managed Firestore export from a fixed PITR timestamp, deployed rules and index configuration, a manifest, and version-specific Storage objects with checksums. Firestore managed exports first go to a private Cloud Storage bucket near `eur3`, not to the US application bucket or directly to Drive. Encrypt the archive before upload, use unique names, verify the uploaded bytes/checksum, and keep the recovery key separately from Drive. No mirror, overwrite, or deletion of old archives is part of initial setup.

Use protected GitLab jobs with scoped credentials and explicit production project checks for recurring exports. The existing deploy token must not become the backup identity. A chat's Drive connection is not a credential for unattended GitLab jobs. Schedule and failure reporting must be verified after the user commits/pushes the prepared CI changes; local code alone is not an active schedule.

Firestore, Storage, and Auth have different recovery boundaries. Firestore backups do not include image bytes, Auth accounts, or Firebase Security Rules. The current seven-day Storage soft-delete policy is useful but is not an independent file archive. Auth-account export/recovery needs its own protected procedure if recovery from complete project loss is required. Do not claim full application disaster recovery until these boundaries and a real restore rehearsal are covered.

## References

- [Firestore pricing](https://cloud.google.com/firestore/pricing)
- [Scheduled backups and restore](https://docs.cloud.google.com/firestore/native/docs/backups)
- [PITR overview](https://docs.cloud.google.com/firestore/native/docs/pitr)
- [PITR cloning and export](https://firebase.google.com/docs/firestore/use-pitr)
- [Managed export/import](https://firebase.google.com/docs/firestore/manage-data/export-import)
