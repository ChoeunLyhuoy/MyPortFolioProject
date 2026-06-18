import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '.next', 'otp-cache.json');

interface OtpRecord {
  code: string;
  expiresAt: string;
}

function readCache(): Record<string, OtpRecord> {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading OTP cache file:', err);
  }
  return {};
}

function writeCache(cache: Record<string, OtpRecord>) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing OTP cache file:', err);
  }
}

export const otpCache = {
  set(email: string, code: string, expiresAt: Date) {
    const cache = readCache();
    cache[email.toLowerCase().trim()] = {
      code: code.trim(),
      expiresAt: expiresAt.toISOString(),
    };
    writeCache(cache);
  },

  get(email: string): { code: string; expiresAt: Date } | null {
    const cache = readCache();
    const record = cache[email.toLowerCase().trim()];
    if (!record) return null;
    return {
      code: record.code,
      expiresAt: new Date(record.expiresAt),
    };
  },

  delete(email: string) {
    const cache = readCache();
    delete cache[email.toLowerCase().trim()];
    writeCache(cache);
  }
};
