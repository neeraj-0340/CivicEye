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
import AdminSidebar from "../components/AdminSidebar";

const COMPLAINT_COLORS = ['#f59e0b', '#0891b2', '#16a34a', '#dc2626'];
const FEEDBACK_COLORS = ['#f59e0b', '#16a34a', '#dc2626'];

export const CivicEyeOverview = () => {
  const navigate = useNavigate();
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
      const [cStats, fStats, feedbacks, complaints] = await Promise.all([
        api.get("/stats/complaints"),
        api.get("/stats/feedback"),
        api.get("/feedback/all"),
        api.get("/complaint/alllist"),
      ]);

      setComplaintStats(cStats.data.data);
      setFeedbackStats(fStats.data.data);

      // Recent feedback (top 5 newest)
      const formattedFeedback = (feedbacks.data || [])
        .map(f => ({
          id: f._id,
          userName: f.userId?.name || "Unknown",
          description: f.description,
          displayTimestamp: new Date(f.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }),
          status: f.status,
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      setRecentFeedback(formattedFeedback);

      // Recent complaints (top 5 newest)
      const formattedComplaints = (complaints.data || [])
        .map(c => ({
          id: c._id,
          userName: c.userId?.name || "Unknown",
          description: c.description,
          category: c.type || "N/A",
          displayTimestamp: new Date(c.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }),
          status: c.status,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentComplaints(formattedComplaints);
    } catch (err) {
      console.error("Overview fetch error:", err);
      setError("Failed to load dashboard data.");
      toast.error("Failed to load some dashboard data.");
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
      <AdminSidebar />

      <div className="admin-main">
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid var(--color-gray-200)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-gray-800)' }}>
              Dashboard Overview
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-gray-400)', marginTop: 2 }}>
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
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Complaint Statistics
            </p>
            <div className="stat-grid">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)
              ) : (
                <>
                  <StatCard label="Total Complaints" value={complaintStats?.totalComplaints ?? 0}
                    icon={FiFileText} iconBg="#eff6ff" iconColor="#2563eb" />
                  <StatCard label="Pending" value={complaintStats?.statusCounts?.Pending ?? 0}
                    icon={FiLoader} iconBg="#fffbeb" iconColor="#d97706" />
                  <StatCard label="In Progress" value={complaintStats?.statusCounts?.['In Progress'] ?? 0}
                    icon={FiTrendingUp} iconBg="#ecfeff" iconColor="#0891b2" />
                  <StatCard label="Resolved" value={complaintStats?.statusCounts?.Resolved ?? 0}
                    icon={FiCheckCircle} iconBg="#f0fdf4" iconColor="#16a34a" />
                  <StatCard label="Rejected" value={complaintStats?.statusCounts?.Rejected ?? 0}
                    icon={FiXCircle} iconBg="#fef2f2" iconColor="#dc2626" />
                </>
              )}
            </div>
          </section>

          {/* ---- Feedback Stat Cards ---- */}
          <section style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Feedback Statistics
            </p>
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
              ) : (
                <>
                  <StatCard label="Total Feedback" value={totalFeedback}
                    icon={FiMessageSquare} iconBg="#f5f3ff" iconColor="#7c3aed" />
                  <StatCard label="Pending" value={feedbackStats?.pending ?? 0}
                    icon={FiLoader} iconBg="#fffbeb" iconColor="#d97706" />
                  <StatCard label="Accepted" value={feedbackStats?.accepted ?? 0}
                    icon={FiCheckCircle} iconBg="#f0fdf4" iconColor="#16a34a" />
                  <StatCard label="Rejected" value={feedbackStats?.rejected ?? 0}
                    icon={FiXCircle} iconBg="#fef2f2" iconColor="#dc2626" />
                </>
              )}
            </div>
          </section>

          {/* ---- Charts ---- */}
          {!loading && !error && (
            <section style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Charts
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {/* Complaint Status Pie */}
                <div className="chart-card">
                  <p className="chart-title">Complaint Status Distribution</p>
                  {complaintStats?.totalComplaints > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={complaintStatusData} cx="50%" cy="50%" outerRadius={90}
                          dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}>
                          {complaintStatusData.map((_, i) => (
                            <Cell key={i} fill={COMPLAINT_COLORS[i % COMPLAINT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [v, 'Complaints']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState title="No complaint data" description="Charts will appear once complaints are registered." />
                  )}
                </div>

                {/* Feedback Status Pie */}
                <div className="chart-card">
                  <p className="chart-title">Feedback Status Distribution</p>
                  {totalFeedback > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={feedbackStatusData} cx="50%" cy="50%" outerRadius={90}
                          dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}>
                          {feedbackStatusData.map((_, i) => (
                            <Cell key={i} fill={FEEDBACK_COLORS[i % FEEDBACK_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState title="No feedback data" />
                  )}
                </div>

                {/* Monthly Line Chart */}
                <div className="chart-card" style={{ gridColumn: 'span 2' }}>
                  <p className="chart-title">Monthly Complaints (Last 12 Months)</p>
                  {hasMonthlyData ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: '1rem' }}>
            {/* Recent Complaints */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-gray-800)' }}>Recent Complaints</span>
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
