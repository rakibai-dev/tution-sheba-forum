import {
  signJwt,
  verifyJwt,
  parseCookies,
  serializeCookie,
  checkLoginRateLimit,
  recordFailedLogin,
  clearFailedLogin,
} from './lib/auth-helper.js';

const COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function getClientIp(headers) {
  return (
    headers['client-ip'] ||
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['x-real-ip'] ||
    '127.0.0.1'
  );
}

/**
 * Core business logic
 */
export async function handleAuthRequest({ method, path, headers, body }) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminPassword || !jwtSecret) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server authentication configuration missing' }),
    };
  }

  const clientIp = getClientIp(headers);
  const normalizedPath = path.replace(/\/+$/, '');

  // 1. LOGIN
  if (method === 'POST' && (normalizedPath.endsWith('/login') || normalizedPath.endsWith('/auth'))) {
    const rateStatus = checkLoginRateLimit(clientIp);
    if (!rateStatus.allowed) {
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `Too many failed attempts. Locked out for ${rateStatus.remainingSeconds} seconds.`,
          lockedUntil: rateStatus.lockedUntil,
          remainingSeconds: rateStatus.remainingSeconds,
        }),
      };
    }

    let parsedBody = {};
    try {
      parsedBody = typeof body === 'string' ? JSON.parse(body) : body || {};
    } catch {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON request body' }),
      };
    }

    const { password } = parsedBody;
    if (!password || password !== adminPassword) {
      const record = recordFailedLogin(clientIp);
      const remainingAttempts = Math.max(0, 5 - record.count);
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Incorrect password',
          remainingAttempts,
          locked: remainingAttempts === 0,
        }),
      };
    }

    // Success
    clearFailedLogin(clientIp);
    const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
    const token = signJwt({ user: 'admin', exp }, jwtSecret);
    const isHttps = headers['x-forwarded-proto'] === 'https' || headers['host']?.includes('netlify.app');

    const cookieHeader = serializeCookie(COOKIE_NAME, token, {
      maxAge: SESSION_MAX_AGE,
      path: '/',
      httpOnly: true,
      secure: isHttps,
      sameSite: 'Strict',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader,
      },
      body: JSON.stringify({ ok: true, message: 'Authentication successful' }),
    };
  }

  // 2. VERIFY
  if (method === 'GET' && normalizedPath.endsWith('/verify')) {
    const cookies = parseCookies(headers.cookie || headers.Cookie);
    const token = cookies[COOKIE_NAME];
    const session = verifyJwt(token, jwtSecret);

    if (!session) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authenticated: false }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authenticated: true, user: session.user }),
    };
  }

  // 3. LOGOUT
  if (method === 'POST' && normalizedPath.endsWith('/logout')) {
    const isHttps = headers['x-forwarded-proto'] === 'https' || headers['host']?.includes('netlify.app');
    const cookieHeader = serializeCookie(COOKIE_NAME, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: isHttps,
      sameSite: 'Strict',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader,
      },
      body: JSON.stringify({ ok: true, message: 'Logged out successfully' }),
    };
  }

  return {
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Endpoint not found' }),
  };
}

/**
 * Standard Netlify Function v1 / AWS Lambda Handler
 */
export async function handler(event, context) {
  const result = await handleAuthRequest({
    method: event.httpMethod,
    path: event.path,
    headers: event.headers || {},
    body: event.body,
  });
  return result;
}

/**
 * Standard Netlify Function v2 / Web Request Handler
 */
export default async function (req, context) {
  const url = new URL(req.url);
  const headers = Object.fromEntries(req.headers.entries());
  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }
  const result = await handleAuthRequest({
    method: req.method,
    path: url.pathname,
    headers,
    body,
  });

  const responseHeaders = new Headers(result.headers);
  return new Response(result.body, {
    status: result.statusCode,
    headers: responseHeaders,
  });
}
