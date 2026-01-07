'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// --- Types ---

interface FinancialSummary {
  totalRevenue: number;
  courseRevenue: number;
  eventRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  transactionCount: number;
  refundCount: number;
}

interface DailyRevenue {
  date: string;
  amount: number;
}

interface TopCourse {
  id: string;
  title: string;
  enrollments: number;
  revenue: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
}

interface ReportData {
  period: { start: string; end: string };
  summary: FinancialSummary;
  dailyRevenue: DailyRevenue[];
  topCourses: TopCourse[];
  recentTransactions: Transaction[];
}

// --- Utils ---

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// --- Components ---

const SummaryCard: React.FC<{ title: string; value: string; sub?: string; highlight?: boolean }> = ({
  title,
  value,
  sub,
  highlight,
}) => (
  <div
    className={`p-6 rounded-lg border ${
      highlight
        ? 'bg-emerald-900/50 border-emerald-700 shadow-lg shadow-emerald-900/20'
        : 'bg-gray-800 border-gray-700'
    }`}
  >
    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
    <p className={`text-2xl font-bold mt-2 ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

export default function AdminFinancialDashboard() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [period, setPeriod] = useState<string>('month');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/financial-report?period=${period}`);
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Admin access required');
          }
          throw new Error('Failed to fetch financial report');
        }
        const result: ReportData = await response.json();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch financial report', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch report');
        // Use demo data for display
        setData({
          period: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), end: new Date().toISOString() },
          summary: {
            totalRevenue: 125450,
            courseRevenue: 85000,
            eventRevenue: 40450,
            totalRefunds: 2500,
            netRevenue: 122950,
            transactionCount: 156,
            refundCount: 4,
          },
          dailyRevenue: [
            { date: '2024-01-01', amount: 1200 },
            { date: '2024-01-02', amount: 1800 },
            { date: '2024-01-03', amount: 1500 },
            { date: '2024-01-04', amount: 2200 },
            { date: '2024-01-05', amount: 3000 },
            { date: '2024-01-06', amount: 2800 },
            { date: '2024-01-07', amount: 3500 },
          ],
          topCourses: [
            { id: '1', title: 'Agile Certified Practitioner', enrollments: 45, revenue: 157500 },
            { id: '2', title: 'Design Thinking Mastery', enrollments: 32, revenue: 76800 },
            { id: '3', title: 'LEGO Serious Play', enrollments: 28, revenue: 84000 },
            { id: '4', title: 'Six Sigma Green Belt', enrollments: 22, revenue: 66000 },
            { id: '5', title: 'Scrum Master Certification', enrollments: 18, revenue: 54000 },
          ],
          recentTransactions: [
            { id: '101', type: 'course', amount: 3500, status: 'completed', date: new Date().toISOString() },
            { id: '102', type: 'event', amount: 250, status: 'completed', date: new Date().toISOString() },
            { id: '103', type: 'course', amount: 2400, status: 'completed', date: new Date().toISOString() },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [period]);

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/financial-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'csv' }),
      });
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial_report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Failed to load data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Financial Overview</h1>
          <p className="text-gray-400 mt-1">Track your revenue, sales, and refunds.</p>
          {error && (
            <p className="text-yellow-500 text-sm mt-2">
              ⚠️ Using demo data - {error}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md px-4 py-2"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <SummaryCard title="Total Revenue" value={formatCurrency(data.summary.totalRevenue)} />
        <SummaryCard title="Course Revenue" value={formatCurrency(data.summary.courseRevenue)} />
        <SummaryCard title="Event Revenue" value={formatCurrency(data.summary.eventRevenue)} />
        <SummaryCard title="Refunds" value={formatCurrency(data.summary.totalRefunds)} sub={`${data.summary.refundCount} refunds`} />
        <SummaryCard
          title="Net Revenue"
          value={formatCurrency(data.summary.netRevenue)}
          highlight={true}
        />
      </section>

      {/* Charts & Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* Line Chart - Span 2 columns */}
        <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Daily Revenue Trend</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => formatDate(value)}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `RM${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Courses Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Top 5 Courses</h2>
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="uppercase tracking-wider border-b border-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-gray-400 font-medium">Course</th>
                  <th scope="col" className="px-4 py-3 text-gray-400 font-medium text-right">Sales</th>
                  <th scope="col" className="px-4 py-3 text-gray-400 font-medium text-right">Rev</th>
                </tr>
              </thead>
              <tbody>
                {data.topCourses.map((course, idx) => (
                  <tr key={course.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">
                        <span className="text-emerald-500 mr-2">#{idx + 1}</span>
                        {course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">{course.enrollments}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                        {formatCurrency(course.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <section className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            {data.summary.transactionCount} total transactions
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-900/50 uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {data.recentTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-400">#{txn.id}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatDate(txn.date)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        txn.type === 'course'
                        ? 'bg-blue-900/30 text-blue-400'
                        : 'bg-purple-900/30 text-purple-400'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        txn.status === 'completed'
                        ? 'bg-green-900/30 text-green-400'
                        : txn.status === 'refunded'
                        ? 'bg-red-900/30 text-red-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">
                    {formatCurrency(txn.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
