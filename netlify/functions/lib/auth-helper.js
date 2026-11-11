import crypto from 'node:crypto';

// In-memory rate limiting map for login attempts (IP -> { count, lockedUntil })
const loginAttempts = new Map();

/**
 * Sign a JWT token with HMAC-SHA256
 */
export function signJwt(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const h = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const message = `${h}.${b}`;
  const sig = crypto.createHmac('sha256', secret).update(message).digest('base64url');
  return `${message}.${sig}`;
}

/**
 * Verify a JWT token
 */
export function verifyJwt(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, b, sig] = parts;
  const message = `${h}.${b}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(message).digest('base64url');

  if (sig.length !== expectedSig.length) return null;
  try {
    const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
    if (!valid) return null;

    const payload = JSON.parse(Buffer.from(b, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Parse standard HTTP Cookie header
 */
export function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

/**
 * Build Set-Cookie header string
 */
export function serializeCookie(name, val, options = {}) {
  let str = `${name}=${encodeURIComponent(val)}`;
  if (options.maxAge != null) {
    str += `; Max-Age=${Math.floor(options.maxAge)}`;
  }
  str += `; Path=${options.path || '/'}`;
  if (options.httpOnly !== false) {
    str += '; HttpOnly';
  }
  // Only add Secure if not explicitly false (or in production / https)
  if (options.secure !== false) {
    str += '; Secure';
  }
  str += `; SameSite=${options.sameSite || 'Strict'}`;
  return str;
}

/**
 * Rate limit checker for login attempts (5 attempts, 5 minute cooldown)
 */
export function checkLoginRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      lockedUntil: record.lockedUntil,
      remainingSeconds,
    };
  }

  if (record.lockedUntil && now >= record.lockedUntil) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = now + 5 * 60 * 1000; // 5 minute lock
  }
  loginAttempts.set(ip, record);
  return record;
}

export function clearFailedLogin(ip) {
  loginAttempts.delete(ip);
}

