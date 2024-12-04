import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Привіт, світ!' });
}

export async function POST() {
  return NextResponse.json({ message: 'Привіт, світ!' });
    // const data = await req.json();
    // return NextResponse.json({ message: 'Дані отримано', data });
}