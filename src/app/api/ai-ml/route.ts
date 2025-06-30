import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || '';
    
    // Check environment variables at runtime
    const AI_ML_API_URL = process.env.PYTHON_ML_API_URL || 'http://localhost:8000';
    console.log(`🔍 Environment check: PYTHON_ML_API_URL = ${process.env.PYTHON_ML_API_URL}`);
    console.log(`🔗 AI ML API Proxy: ${AI_ML_API_URL}${endpoint}`);
    
    const response = await fetch(`${AI_ML_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ AI service error: ${response.status}`);
      return NextResponse.json(
        { error: 'AI service unavailable' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ AI service response:`, data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ AI ML proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to AI service', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || '';
    const body = await request.json();
    
    // Check environment variables at runtime
    const AI_ML_API_URL = process.env.PYTHON_ML_API_URL || 'http://localhost:8000';
    console.log(`🔍 Environment check: PYTHON_ML_API_URL = ${process.env.PYTHON_ML_API_URL}`);
    console.log(`🔗 AI ML API Proxy POST: ${AI_ML_API_URL}${endpoint}`);
    
    const response = await fetch(`${AI_ML_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`❌ AI service error: ${response.status}`);
      return NextResponse.json(
        { error: 'AI service unavailable' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ AI service response:`, data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ AI ML proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to AI service', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
