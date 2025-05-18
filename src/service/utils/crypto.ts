import { config } from 'dotenv';
import * as crypto from 'crypto';

config();

const ALGORITHM = 'aes-256-gcm';

const AES_KEY = Buffer.from(process.env.AES_KEY!, 'base64');

if (AES_KEY.length !== 32) {
  throw new Error('The AES key must be 32 bytes (256 bits) long');
}

export const cryptoUtil = {
  encrypt(data: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, AES_KEY, iv);

    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const tag = cipher.getAuthTag();

    return JSON.stringify({
      iv: iv.toString('base64'),
      ciphertext: encrypted,
      tag: tag.toString('base64'),
    });
  },

  decrypt(encryptedText: string): string {
    const {
      iv: ivBase64,
      ciphertext: ciphertextBase64,
      tag: tagBase64,
    } = JSON.parse(encryptedText);
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    const ciphertext = Buffer.from(ciphertextBase64, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, AES_KEY, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(ciphertext, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },
};
