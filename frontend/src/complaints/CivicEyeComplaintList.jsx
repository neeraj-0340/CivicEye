import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiFileText } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import usePagination from '../hooks/usePagination';
import ThemeToggle from '../components/ThemeToggle';

export const CivicEyeComplaintList = () => {
  const navigate = useNavigate();

  const {
    data: complaints,
    loading,
    error,
    pagination,
    goToPage,
    refresh,
  } = usePagination('/complaint/list', {}, 1, 8);

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (val) => (
        <span style={{ fontSize: '0.75rem', background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>
          {val}
        </span>
      ),
      width: '140px',
    },
    {
      key: 'description',
      label: 'Description',
      render: (val) => (
        <span>
          {(val || '').substring(0, 60)}{val && val.length > 60 ? '…' : ''}
        </span>
      ),
    },
    { key: 'location', label: 'Location', width: '130px' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val || 'Pending'} />,
      width: '110px',
    },
    {
      key: 'createdAt',
      label: 'Filed On',
      render: (val) =>
        val ? new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
      width: '110px',
    },
    {
      key: '_id',
      label: 'Action',
      render: (_, row) => (
        <Link
          to={`/complaintdetail/${row._id}`}
          style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem' }}
        >
          View Details
        </Link>
      ),
      width: '100px',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text-primary)' }}>
      <Toaster position="top-right" />

      {/* Minimal header */}
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
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/userhome')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <FiArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />
          <Link to="/registercomplaint" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <FiPlus size={15} /> New Complaint
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <FiFileText size={24} color="var(--primary)" />
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            My Complaints
          </h1>
          {!loading && (
            <span style={{
              background: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              borderRadius: 999, padding: '2px 10px',
              fontSize: '0.75rem', fontWeight: 600,
            }}>
              {pagination.totalItems}
            </span>
          )}
        </div>

        <DataTable
          columns={columns}
          data={complaints}
          loading={loading}
          error={error}
          emptyTitle="No complaints yet"
          emptyDescription="You haven't filed any complaints. Start by registering one."
          emptyAction={
            <Link to="/registercomplaint" className="btn btn-primary btn-sm">
              Register Your First Complaint
            </Link>
          }
          onRetry={refresh}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            onPageChange: goToPage,
          }}
        />
      </div>
    </div>
  );
};
