import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET() {
  const logs = await redis.get('cebu_logs') || [];
  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const logs: any[] = await redis.get('cebu_logs') || [];
  logs.push(body);
  await redis.set('cebu_logs', logs);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { fileName } = await request.json();
  let logs: any[] = await redis.get('cebu_logs') || [];
  logs = logs.filter((log: any) => log.file !== fileName);
  await redis.set('cebu_logs', logs);
  return NextResponse.json({ success: true });
}