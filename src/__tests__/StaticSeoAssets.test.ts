import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

type PngAsset = {
  href: string;
  sizes: string;
  rel?: 'icon' | 'apple-touch-icon';
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readPngDimensions(relativePath: string): {width: number; height: number} {
  const file = fs.readFileSync(path.join(repoRoot, relativePath));
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  expect(file.subarray(0, pngSignature.length)).toEqual(pngSignature);

  return {
    width: file.readUInt32BE(16),
    height: file.readUInt32BE(20),
  };
}

function expectPngAsset(relativePath: string, expectedSize: number) {
  expect(fs.existsSync(path.join(repoRoot, relativePath))).toBe(true);
  expect(readPngDimensions(relativePath)).toEqual({width: expectedSize, height: expectedSize});
}

describe('static SEO assets', () => {
  it('references dedicated favicon files with matching sizes in the HTML shell', () => {
    const html = readText('index.html');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const expectedPngLinks: PngAsset[] = [
      {href: '/favicon-16x16.png', sizes: '16x16', rel: 'icon'},
      {href: '/favicon-32x32.png', sizes: '32x32', rel: 'icon'},
      {href: '/apple-touch-icon.png', sizes: '180x180', rel: 'apple-touch-icon'},
    ];

    const icoLink = doc.querySelector('link[rel="icon"][href="/favicon.ico"]');

    expect(icoLink).not.toBeNull();
    expect(icoLink?.getAttribute('sizes')).toBe('any');

    expectedPngLinks.forEach(({href, sizes, rel = 'icon'}) => {
      const selector = `link[rel="${rel}"][href="${href}"]`;
      const link = doc.querySelector<HTMLLinkElement>(selector);

      expect(link).not.toBeNull();
      expect(link?.getAttribute('sizes')).toBe(sizes);
    });
  });

  it('ships browser-friendly favicon assets with the expected dimensions', () => {
    expectPngAsset('public/favicon-16x16.png', 16);
    expectPngAsset('public/favicon-32x32.png', 32);
    expectPngAsset('public/apple-touch-icon.png', 180);
    expectPngAsset('public/android-chrome-192x192.png', 192);
    expectPngAsset('public/android-chrome-512x512.png', 512);

    const icoPath = path.join(repoRoot, 'public/favicon.ico');
    const icoFile = fs.readFileSync(icoPath);

    expect(fs.existsSync(icoPath)).toBe(true);
    expect(icoFile.readUInt16LE(0)).toBe(0);
    expect(icoFile.readUInt16LE(2)).toBe(1);
    expect(icoFile.readUInt16LE(4)).toBeGreaterThanOrEqual(1);
  });

  it('declares the generated PNG app icons in the web manifest', () => {
    const manifest = JSON.parse(readText('public/manifest.json')) as {
      icons?: Array<{src: string; sizes: string; type: string}>;
    };

    expect(manifest.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      }),
      expect.objectContaining({
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }),
    ]));
  });
});
