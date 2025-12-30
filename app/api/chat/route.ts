import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('Received request:', body);

  // Path to the quotes file
  const quotesFilePath = path.join(process.cwd(), 'quotes.txt');

  try {
    // Read the quotes file
    const data = await fs.readFile(quotesFilePath, 'utf-8');
    const quotes = data.split('\n').filter((quote) => quote.trim() !== '');

    // Pick a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return NextResponse.json({ response: randomQuote });
  } catch (error) {
    console.error('Error reading quotes file:', error);
    return NextResponse.json({ response: 'Error retrieving quote.' }, { status: 500 });
  }
}