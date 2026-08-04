import React, { useEffect, useState, useCallback } from "react";
import api from "../api/config";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FiAlertCircle, FiCheckCircle, FiXCircle, FiLoader,
  FiFileText, FiUsers, FiMessageSquare, FiTrendingUp,
} from "react-icons/fi";
import {
  PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard";
import { SkeletonStatCard } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import AdminSidebar, { AdminMobileHeader } from "../components/AdminSidebar";
import { useTheme } from "../contexts/ThemeContext";

const COMPLAINT_COLORS = ['#f59e0b', '#0891b2', '#16a34a', '#dc2626'];
const FEEDBACK_COLORS = ['#f59e0b', '#16a34a', '#dc2626'];

function computeComplaintStatsFallback(rawList = []) {
  const statusCounts = { Pending: 0, "In Progress": 0, Resolved: 0, Rejected: 0 };
  const categoryCounts = {};

  rawList.forEach((c) => {
    const s = c.status || "Pending";
    if (statusCounts[s] !== undefined) statusCounts[s]++;
    else statusCounts[s] = 1;

    const cat = c.type || "Other";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const now = new Date();
  const monthly = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });

    const count = rawList.filter((c) => {
      const cd = new Date(c.createdAt);
      return cd.getFullYear() === year && cd.getMonth() === month;
    }).length;

    monthly.push({ month: label, count });
  }

  return {
    totalComplaints: rawList.length,
    statusCounts,
    categoryCounts,
    monthly,
  };
}

function computeFeedbackStatsFallback(rawList = []) {
  const stats = { pending: 0, accepted: 0, rejected: 0 };
  rawList.forEach((f) => {
    const s = (f.status || "pending").toLowerCase();
    if (stats[s] !== undefined) stats[s]++;
  });
  return stats;
}

export const CivicEyeOverview = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [complaintStats, setComplaintStats] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch complaints list & feedback list (always available)
      const [feedbacksRes, complaintsRes] = await Promise.all([
        api.get("/feedback/all").catch(() => ({ data: [] })),
        api.get("/complaint/alllist").catch(() => ({ data: [] })),
      ]);

      const rawFeedbacks = Array.isArray(feedbacksRes.data) ? feedbacksRes.data : (feedbacksRes.data?.data || []);
      const rawComplaints = Array.isArray(complaintsRes.data) ? complaintsRes.data : (complaintsRes.data?.data || []);

      // 2. Try fetching backend aggregated stats, fallback to client-side computation if 404
      let cStats = null;
      let fStats = null;

      try {
        const res = await api.get("/stats/complaints");
        cStats = res.data?.data;
      } catch {
        // Fallback: compute stats client-side from rawComplaints
        cStats = computeComplaintStatsFallback(rawComplaints);
      }

      try {
        const res = await api.get("/stats/feedback");
        fStats = res.data?.data;
      } catch {
        // Fallback: compute stats client-side from rawFeedbacks
        fStats = computeFeedbackStatsFallback(rawFeedbacks);
      }

      setComplaintStats(cStats);
      setFeedbackStats(fStats);

      // Recent feedback (top 5 newest)
      const formattedFeedback = rawFeedbacks
        .map(f => ({
          id: f._id,
          userName: f.userId?.name || "Unknown",
          description: f.description,
          displayTimestamp: new Date(f.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }),
          status: f.status || "pending",
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      setRecentFeedback(formattedFeedback);

      // Recent complaints (top 5 newest)
      const formattedComplaints = rawComplaints
        .map(c => ({
          id: c._id,
          userName: c.userId?.name || "Unknown",
          description: c.description,
          category: c.type || "N/A",
          displayTimestamp: new Date(c.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }),
          status: c.status || "Pending",
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentComplaints(formattedComplaints);
    } catch (err) {
      console.error("Overview fetch error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchAll();
  }, [fetchAll, navigate]);

  /* ---- Chart data ---- */
  const complaintStatusData = complaintStats
    ? Object.entries(complaintStats.statusCounts).map(([name, value]) => ({ name, value }))
    : [];

  const feedbackStatusData = feedbackStats
    ? [
        { name: "Pending", value: feedbackStats.pending },
        { name: "Accepted", value: feedbackStats.accepted },
        { name: "Rejected", value: feedbackStats.rejected },
      ]
    : [];

  const monthlyData = complaintStats?.monthly || [];
  const hasMonthlyData = monthlyData.some(m => m.count > 0);

  const totalFeedback = feedbackStats
    ? feedbackStats.pending + feedbackStats.accepted + feedbackStats.rejected
    : 0;

  return (
    <div className="admin-layout">
      <Toaster position="top-right" />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminMobileHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Overview" />

        {/* Header */}
        <div style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Dashboard Overview
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Real-time statistics and recent activity
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={fetchAll} disabled={loading}>
            {loading ? '↻ Refreshing…' : '↻ Refresh'}
          </button>
        </div>

        <div className="admin-content">
          {/* ---- Complaint Stat Cards ---- */}
          <section style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Complaint Statistics
            </p>
            <div className="stat-grid">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)
              ) : (
                <>
                  <StatCard label="Total Complaints" value={complaintStats?.totalComplaints ?? 0}
                    icon={FiFileText} iconBg="var(--primary-subtle)" iconColor="var(--primary)" />
                  <StatCard label="Pending" value={complaintStats?.statusCounts?.Pending ?? 0}
                    icon={FiLoader} iconBg="var(--warning-bg)" iconColor="var(--warning)" />
                  <StatCard label="In Progress" value={complaintStats?.statusCounts?.['In Progress'] ?? 0}
                    icon={FiTrendingUp} iconBg="var(--info-bg)" iconColor="var(--info)" />
                  <StatCard label="Resolved" value={complaintStats?.statusCounts?.Resolved ?? 0}
                    icon={FiCheckCircle} iconBg="var(--success-bg)" iconColor="var(--success)" />
                  <StatCard label="Rejected" value={complaintStats?.statusCounts?.Rejected ?? 0}
                    icon={FiXCircle} iconBg="var(--danger-bg)" iconColor="var(--danger)" />
                </>
              )}
            </div>
          </section>

          {/* ---- Feedback Stat Cards ---- */}
          <section style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Feedback Statistics
            </p>
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
              ) : (
                <>
                  <StatCard label="Total Feedback" value={totalFeedback}
                    icon={FiMessageSquare} iconBg="var(--primary-subtle)" iconColor="var(--secondary)" />
                  <StatCard label="Pending" value={feedbackStats?.pending ?? 0}
                    icon={FiLoader} iconBg="var(--warning-bg)" iconColor="var(--warning)" />
                  <StatCard label="Accepted" value={feedbackStats?.accepted ?? 0}
                    icon={FiCheckCircle} iconBg="var(--success-bg)" iconColor="var(--success)" />
                  <StatCard label="Rejected" value={feedbackStats?.rejected ?? 0}
                    icon={FiXCircle} iconBg="var(--danger-bg)" iconColor="var(--danger)" />
                </>
              )}
            </div>
          </section>

          {/* ---- Charts ---- */}
          {!loading && !error && (
            <section style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Charts
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Complaint Status Pie */}
                <div className="chart-card col-span-1">
                  <p className="chart-title">Complaint Status Distribution</p>
                  {complaintStats?.totalComplaints > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={complaintStatusData} cx="50%" cy="50%" outerRadius={75}
                          dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}>
                          {complaintStatusData.map((_, i) => (
                            <Cell key={i} fill={COMPLAINT_COLORS[i % COMPLAINT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                            color: isDark ? '#f8fafc' : '#0f172a',
                            borderRadius: '0.5rem',
                          }}
                          formatter={(v) => [v, 'Complaints']}
                        />
                        <Legend wrapperStyle={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.8rem' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState title="No complaint data" description="Charts will appear once complaints are registered." />
                  )}
                </div>

                {/* Feedback Status Pie */}
                <div className="chart-card col-span-1">
                  <p className="chart-title">Feedback Status Distribution</p>
                  {totalFeedback > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={feedbackStatusData} cx="50%" cy="50%" outerRadius={75}
                          dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}>
                          {feedbackStatusData.map((_, i) => (
                            <Cell key={i} fill={FEEDBACK_COLORS[i % FEEDBACK_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                            color: isDark ? '#f8fafc' : '#0f172a',
                            borderRadius: '0.5rem',
                          }}
                        />
                        <Legend wrapperStyle={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.8rem' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState title="No feedback data" />
                  )}
                </div>

                {/* Monthly Line Chart */}
                <div className="chart-card col-span-1 lg:col-span-2">
                  <p className="chart-title">Monthly Complaints (Last 12 Months)</p>
                  {hasMonthlyData ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? '#cbd5e1' : '#475569' }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: isDark ? '#cbd5e1' : '#475569' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                            color: isDark ? '#f8fafc' : '#0f172a',
                            borderRadius: '0.5rem',
                          }}
                        />
                        <Legend wrapperStyle={{ color: isDark ? '#cbd5e1' : '#475569', fontSize: '0.8rem' }} />
                        <Line type="monotone" dataKey="count" stroke={isDark ? '#60a5fa' : '#2563eb'} strokeWidth={2}
                          dot={{ r: 4 }} activeDot={{ r: 6 }} name="Complaints" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState title="No monthly data" description="Charts will appear after complaints are filed." />
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ---- Recent Tables ---- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Recent Complaints */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Recent Complaints</span>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/complaintmanagement')}>View all</button>
              </div>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j}><div className="skeleton" style={{ height: '0.75rem', width: '80%' }} /></td>
                        ))}
                      </tr>
                    ))}
                    {!loading && recentComplaints.length === 0 && (
                      <tr><td colSpan={5}><EmptyState title="No recent complaints" /></td></tr>
                    )}
                    {!loading && recentComplaints.map(c => (
                      <tr key={c.id}>
                        <td>{c.userName}</td>
                        <td><span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999, color: '#374151' }}>{c.category}</span></td>
                        <td style={{ whiteSpace: 'nowrap' }}>{c.displayTimestamp}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td>
                          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/admincomplaintdetail/${c.id}`)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-gray-800)' }}>Recent Feedback</span>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/feedbackmanagement')}>View all</button>
              </div>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j}><div className="skeleton" style={{ height: '0.75rem', width: '80%' }} /></td>
                        ))}
                      </tr>
                    ))}
                    {!loading && recentFeedback.length === 0 && (
                      <tr><td colSpan={5}><EmptyState title="No recent feedback" /></td></tr>
                    )}
                    {!loading && recentFeedback.map(f => (
                      <tr key={f.id}>
                        <td>{f.userName}</td>
                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.description}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>{f.displayTimestamp}</td>
                        <td><StatusBadge status={f.status} /></td>
                        <td>
                          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/adminfeedbackdetails/${f.id}`)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
