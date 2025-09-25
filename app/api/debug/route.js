// app/api/debug/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('------------------- DEBUG INFO -------------------');
  console.log('AUTH_TRUST_HOST:', process.env.AUTH_TRUST_HOST);
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('Request Headers:', request.headers);
  console.log('------------------- END DEBUG --------------------');

  return NextResponse.json({
    message: 'Debug info logged to server console.',
    authTrustHost: process.env.AUTH_TRUST_HOST,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    hostHeader: request.headers.get('host'),
  });
}
