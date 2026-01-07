// app/api/certificates/verify/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyCertificate } from '@/lib/certificate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { valid: false, error: 'Certificate ID required' },
        { status: 400 }
      );
    }

    const result = await verifyCertificate(id);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificate: result.data,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Certificate verification error:', error);
    return NextResponse.json(
      { valid: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
