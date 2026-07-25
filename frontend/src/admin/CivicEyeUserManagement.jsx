import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar";
import DataTable from "../components/DataTable";
import usePagination from "../hooks/usePagination";

export const CivicEyeUserManagement = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const {
    data: users,
    loading,
    error,
    pagination,
    goToPage,
    updateFilters,
    refresh,
  } = usePagination("/user/allusers", {}, 1, 10);

  const handleSearch = useCallback(() => {
    const filter = {};
    if (searchInput.trim()) filter.search = searchInput.trim();
    updateFilters(filter);
  }, [searchInput, updateFilters]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (val, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: "50%",
            background: row.deletestate ? "var(--danger-bg)" : "var(--primary-subtle)",
            color: row.deletestate ? "var(--danger-text)" : "var(--primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: "0.8rem", flexShrink: 0,
          }}>
            {(val || "U").charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500, color: row.deletestate ? "var(--danger-text)" : "var(--text-primary)" }}>
            {val}
          </span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Phone", width: "130px" },
    {
      key: "address",
      label: "Address",
      render: (val) => val || "—",
    },
    {
      key: "deletestate",
      label: "Status",
      render: (val) => val
        ? <span className="badge badge-rejected">Banned</span>
        : <span className="badge badge-resolved">Active</span>,
      width: "90px",
    },
    {
      key: "_id",
      label: "Actions",
      render: (_, row) => (
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: "var(--color-primary)", fontWeight: 600 }}
          onClick={() => navigate(`/user/details/${row._id}`)}
        >
          View
        </button>
      ),
      width: "80px",
    },
  ];

  return (
    <div className="admin-layout">
      <Toaster position="top-right" />
      <AdminSidebar />

      <div className="admin-main">
        {/* Header */}
        <div style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
              User Management
            </h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
              {pagination.totalItems} total users
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <FiSearch
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                size={15}
              />
              <input
                type="text"
                placeholder="Search users…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="form-input"
                style={{ paddingLeft: 32, width: 200, height: 36 }}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleSearch}>
              Search
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearchInput(""); updateFilters({}); }}
              title="Clear search"
            >
              <FiRefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className="admin-content">
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            error={error}
            emptyTitle="No users found"
            emptyDescription={searchInput ? "Try a different search term." : "No users have registered yet."}
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
    </div>
  );
};

export default CivicEyeUserManagement;