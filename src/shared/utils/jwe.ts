import { webcrypto } from 'crypto';

const INFO = new TextEncoder().encode('NextAuth.js Generated Encryption Key');

export async function deriveKey(secret: string): Promise<Uint8Array> {
  const ikm = new TextEncoder().encode(secret);
  const subtle = (webcrypto as any).subtle as SubtleCrypto;
  const rawKey = await subtle.importKey('raw', ikm, 'HKDF', false, [
    'deriveKey',
  ]);
  const aesKey = await subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: INFO },
    rawKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt'],
  );
  return new Uint8Array(await subtle.exportKey('raw', aesKey));
}
