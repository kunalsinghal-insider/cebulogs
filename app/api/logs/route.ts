import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const redis = Redis.fromEnv();

// One function to check your SINGLE Vercel password for everything
function isAuthorized(request: Request) {
  const authHeader = request.headers.get('x-api-key');
  return authHeader === process.env.DASHBOARD_PASSWORD;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const logs = await redis.get('cebu_logs') || [];
  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const logs: any[] = await redis.get('cebu_logs') || [];
  logs.push(body);
  await redis.set('cebu_logs', logs);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { fileName } = await request.json();
  let logs: any[] = await redis.get('cebu_logs') || [];
  logs = logs.filter((log: any) => log.file !== fileName);
  await redis.set('cebu_logs', logs);
  return NextResponse.json({ success: true });
}