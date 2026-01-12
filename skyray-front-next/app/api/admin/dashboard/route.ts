import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const connection = await pool.getConnection();

    try {
      // Get total quotations
      const [totalQuotationsResult] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM quotations'
      );
      const totalQuotations = totalQuotationsResult[0]?.count || 0;

      // Get pending quotations
      const [pendingQuotationsResult] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM quotations WHERE status = ?',
        ['pending']
      );
      const pendingQuotations = pendingQuotationsResult[0]?.count || 0;

      // Get approved quotations
      const [approvedQuotationsResult] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM quotations WHERE status = ?',
        ['approved']
      );
      const approvedQuotations = approvedQuotationsResult[0]?.count || 0;

      // Get rejected quotations
      const [rejectedQuotationsResult] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM quotations WHERE status = ?',
        ['rejected']
      );
      const rejectedQuotations = rejectedQuotationsResult[0]?.count || 0;

      // Get total customers
      const [totalCustomersResult] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users WHERE role = ?',
        ['customer']
      );
      const totalCustomers = totalCustomersResult[0]?.count || 0;

      // Get total revenue from approved quotations
      const [totalRevenueResult] = await connection.query<RowDataPacket[]>(
        'SELECT COALESCE(SUM(amount), 0) as total FROM quotations WHERE status = ?',
        ['approved']
      );
      const totalRevenue = totalRevenueResult[0]?.total || 0;

      // Get recent quotations (last 10)
      const [recentQuotations] = await connection.query<RowDataPacket[]>(
        `SELECT 
          q.id,
          q.customer_name as customerName,
          q.email,
          q.service,
          q.status,
          q.amount,
          q.created_at as createdAt
        FROM quotations q
        ORDER BY q.created_at DESC
        LIMIT 10`
      );

      const dashboardData = {
        totalQuotations,
        pendingQuotations,
        approvedQuotations,
        rejectedQuotations,
        totalCustomers,
        totalRevenue,
        recentQuotations: recentQuotations || []
      };

      return NextResponse.json(dashboardData);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
