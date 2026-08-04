import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import AdminSidebar, { AdminMobileHeader } from "../components/AdminSidebar";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import usePagination from "../hooks/usePagination";

const STATUS_TABS = ["all", "pending", "accepted", "rejected"];

export const CivicEyeFeedbackManagement = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");

  const {
    data: feedbacks,
    loading,
    error,
    pagination,
    goToPage,
    updateFilters,
    refresh,
  } = usePagination("/feedback/all", {}, 1, 10);

  const handleSearch = useCallback(() => {
    const filter = {};
    if (activeTab !== "all") filter.status = activeTab;
    if (searchInput.trim()) filter.search = searchInput.trim();
    updateFilters(filter);
  }, [activeTab, searchInput, updateFilters]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    const filter = {};
    if (tab !== "all") filter.status = tab;
    if (searchInput.trim()) filter.search = searchInput.trim();
    updateFilters(filter);
  }, [searchInput, updateFilters]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const columns = [
    {
      key: "userId",
      label: "User",
      render: (val) => val?.name || "Unknown",
      width: "130px",
    },
    {
      key: "description",
      label: "Feedback",
      render: (val) => (
        <span style={{ display: "block", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {val}
        </span>
      ),
    },
    {
      key: "timestamp",
      label: "Date",
      render: (val) =>
        new Date(val).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      width: "120px",
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusBadge status={val} />,
      width: "110px",
    },
    {
      key: "_id",
      label: "Actions",
      render: (_, row) => (
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: "var(--color-primary)", fontWeight: 600 }}
          onClick={() => navigate(`/adminfeedbackdetails/${row._id}`)}
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
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminMobileHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Feedback" />

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
              Feedback Management
            </h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
              {pagination.totalItems} total feedback
            </p>
          </div>

          <div className="mobile-filter-bar" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <FiSearch
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                size={16}
              />
              <input
                type="text"
                placeholder="Search feedback…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="form-input"
                style={{ paddingLeft: 36 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary btn-sm min-h-[44px]" onClick={handleSearch}>Search</button>
              <button
                className="btn btn-ghost btn-sm min-h-[44px]"
                onClick={() => { setSearchInput(""); setActiveTab("all"); updateFilters({}); }}
                title="Reset filters"
              >
                <FiRefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "0 1.5rem",
          display: "flex",
          gap: "0.25rem",
          overflowX: "auto",
        }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                padding: "0.625rem 1rem",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
                color: activeTab === tab ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: "0.875rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
                transition: "all 0.15s ease",
              }}
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="admin-content">
          <DataTable
            columns={columns}
            data={feedbacks}
            loading={loading}
            error={error}
            emptyTitle="No feedback found"
            emptyDescription={searchInput ? "Try a different search term." : "No feedback submitted yet."}
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

export default CivicEyeFeedbackManagement;