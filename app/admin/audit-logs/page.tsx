'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Download } from 'lucide-react';

// --- Types ---

export interface AuditLog {
  id: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
}

// --- Helpers ---

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// --- Main Component ---

export default function AuditLogsPage() {
  // -- State --
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [userSearch, setUserSearch] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [resourceFilter, setResourceFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  // Expanded Rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // -- Fetching --

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
      });
      if (userSearch) params.append('userId', userSearch);
      if (actionFilter) params.append('action', actionFilter);
      if (resourceFilter) params.append('resource', resourceFilter);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const response = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Admin access required');
        }
        throw new Error('Failed to fetch logs');
      }

      const result: AuditLogsResponse = await response.json();
      setLogs(result.logs);
      setTotal(result.pagination.totalItems);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      // Demo data
      setLogs([
        {
          id: '1',
          createdAt: new Date().toISOString(),
          user: { id: 'u1', name: 'Admin User', email: 'admin@kitaworkshub.com.my' },
          action: 'payment_completed',
          resource: 'course',
          resourceId: 'course_1',
          details: { amount: 350000, invoice: 'INV-123456' },
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
        },
        {
          id: '2',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          user: { id: 'u2', name: 'John Doe', email: 'john@example.com' },
          action: 'user_login',
          resource: 'auth',
          resourceId: '',
          details: { method: 'password' },
          ipAddress: '192.168.1.2',
          userAgent: 'Mozilla/5.0...',
        },
        {
          id: '3',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          user: { id: 'u3', name: 'Jane Smith', email: 'jane@example.com' },
          action: 'event_registration',
          resource: 'events',
          resourceId: 'event_1',
          details: { confirmation_code: 'KWH-123456' },
          ipAddress: '192.168.1.3',
          userAgent: 'Mozilla/5.0...',
        },
      ]);
      setTotal(3);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  // -- Handlers --

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLogs();
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: dateRange.start,
          endDate: dateRange.end,
          format: 'csv',
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      // Fallback: export current view
      if (logs.length === 0) return;

      const headers = ['Timestamp', 'User Name', 'User Email', 'Action', 'Resource', 'IP Address', 'Details'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          `"${log.createdAt}"`,
          `"${log.user?.name || 'Unknown'}"`,
          `"${log.user?.email || 'Unknown'}"`,
          `"${log.action}"`,
          `"${log.resource}"`,
          `"${log.ipAddress}"`,
          `"${JSON.stringify(log.details).replace(/"/g, '""')}"`,
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Audit Logs</h1>
            <p className="text-gray-400 text-sm mt-1">Track system changes and user activity.</p>
            {error && (
              <p className="text-yellow-500 text-sm mt-2">
                ⚠️ Using demo data - {error}
              </p>
            )}
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search user ID..."
                className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2 placeholder-gray-500"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {/* Action Dropdown */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Filter className="w-4 h-4" />
              </div>
              <select
                className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2 appearance-none cursor-pointer"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">All Actions</option>
                <option value="user_login">Login</option>
                <option value="payment_completed">Payment Completed</option>
                <option value="payment_failed">Payment Failed</option>
                <option value="payment_refunded">Refund</option>
                <option value="event_registration">Event Registration</option>
              </select>
            </div>

            {/* Resource Filter */}
            <div className="relative">
              <select
                className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 p-2 appearance-none cursor-pointer"
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
              >
                <option value="">All Resources</option>
                <option value="course">Course</option>
                <option value="event">Event</option>
                <option value="auth">Auth</option>
                <option value="payment">Payment</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                placeholder="Start date"
              />
              <input
                type="date"
                className="flex-1 bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                placeholder="End date"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium border border-gray-700 transition-colors">
              Apply Filters
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-gray-950 border-b border-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 w-10"></th>
                  <th scope="col" className="px-6 py-3">Timestamp</th>
                  <th scope="col" className="px-6 py-3">User</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                  <th scope="col" className="px-6 py-3">Resource</th>
                  <th scope="col" className="px-6 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No logs found matching filters.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isExpanded = expandedRows.has(log.id);
                    return (
                      <React.Fragment key={log.id}>
                        <tr className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleRow(log.id)}
                              className="text-gray-400 hover:text-white transition-transform transform active:scale-95"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs whitespace-nowrap text-gray-400">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            {log.user ? (
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md mr-3">
                                  {log.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-white">{log.user.name}</div>
                                  <div className="text-xs text-gray-500">{log.user.email}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">System</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium border
                              ${log.action.includes('delete') || log.action.includes('failed') ? 'bg-red-900/30 text-red-400 border-red-900' :
                                log.action.includes('login') ? 'bg-green-900/30 text-green-400 border-green-900' :
                                log.action.includes('payment') ? 'bg-blue-900/30 text-blue-400 border-blue-900' :
                                'bg-gray-800 text-gray-400 border-gray-700'}
                            `}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-white">
                            {log.resource}
                            {log.resourceId && (
                              <span className="text-gray-500 text-xs ml-2">({log.resourceId})</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">
                            {log.ipAddress || '-'}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-950/50">
                            <td colSpan={6} className="px-6 py-4 border-b border-gray-800">
                              <div className="flex flex-col gap-2">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Details (JSON)</h4>
                                <pre className="bg-gray-950 border border-gray-800 p-4 rounded-md overflow-x-auto text-xs text-indigo-300 font-mono shadow-inner">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                                {log.userAgent && (
                                  <div className="mt-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User Agent</h4>
                                    <p className="text-xs text-gray-400 mt-1">{log.userAgent}</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{(currentPage - 1) * 50 + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * 50, total)}</span> of <span className="font-medium text-white">{total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-2 text-gray-500">...</span>}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
