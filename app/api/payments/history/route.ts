import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { verifyAuth } from '@/lib/middleware/auth';

// Get user's payment history
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch payments
    const payments = await pb.collection('payments').getList(page, limit, {
      filter: `user="${auth.user.id}"`,
      sort: '-created',
    });

    // Fetch invoices
    const invoices = await pb.collection('invoices').getList(page, limit, {
      filter: `user="${auth.user.id}"`,
      sort: '-created',
    });

    return NextResponse.json({
      payments: payments.items.map(p => ({
        id: p.id,
        type: p.type,
        amount: p.amount / 100, // Convert from cents
        currency: p.currency,
        status: p.status,
        createdAt: p.created,
        paidAt: p.paid_at,
      })),
      invoices: invoices.items.map(i => ({
        id: i.id,
        invoiceNumber: i.invoice_number,
        amount: i.amount / 100,
        currency: i.currency,
        status: i.status,
        issuedAt: i.issued_at,
        type: i.type,
      })),
      pagination: {
        page: payments.page,
        totalPages: payments.totalPages,
        totalItems: payments.totalItems,
      },
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}
