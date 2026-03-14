import { NextResponse } from 'next/server';
// JWT is stateless — logout is handled client-side by clearing the token
export async function POST() {
  return NextResponse.json({ success: true });
}
