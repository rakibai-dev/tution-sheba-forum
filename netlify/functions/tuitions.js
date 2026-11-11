import { parseCookies, verifyJwt } from './lib/auth-helper.js';

const COOKIE_NAME = 'admin_session';

export async function handleTuitionsRequest({ method, headers }) {
  if (method !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const jwtSecret = process.env.JWT_SECRET;
  const upstreamBase = process.env.UPSTREAM_API_BASE || 'https://api.tuitionsebaforum.com';

  // 1. Authorize Request
  const cookies = parseCookies(headers.cookie || headers.Cookie);
  const token = cookies[COOKIE_NAME];
  const session = verifyJwt(token, jwtSecret);

  if (!session) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized: Authentication required to access data' }),
    };
  }

  // 2. Fetch from private upstream
  try {
    const upstreamUrl = `${upstreamBase.replace(/\/+$/, '')}/api/tuition/available-web`;
    const response = await fetch(upstreamUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TuitionSheba/1.0',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Upstream error: ${response.statusText}` }),
      };
    }

    const data = await response.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to retrieve data from upstream', details: err.message }),
    };
  }
}

export async function handler(event, context) {
  return await handleTuitionsRequest({
    method: event.httpMethod,
    headers: event.headers || {},
  });
}

export default async function (req, context) {
  const headers = Object.fromEntries(req.headers.entries());
  const result = await handleTuitionsRequest({
    method: req.method,
    headers,
  });

  return new Response(result.body, {
    status: result.statusCode,
    headers: new Headers(result.headers),
  });
}

