import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";
import ReportsTable from "../../components/ReportsTable/ReportsTable";
import { Incident } from "../../utils/types";
import "./Reports.css"; // Changed CSS filename

// Icons
import { FiFilter, FiSearch, FiPlus, FiBarChart2 } from "react-icons/fi";

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { getUserReports, deleteReport } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const userReports = useMemo(
    () => getUserReports(user?.id || 0),
    [user?.id, getUserReports]
  );

  const filteredReports = useMemo(() => {
    return userReports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;
      const matchesType = typeFilter === "all" || report.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [userReports, searchTerm, statusFilter, typeFilter]);

  const handleDeleteReport = async (id: number) => {
    const report = userReports.find((r) => r.id === id);
    if (!report) return;

    if (report.status !== "draft") {
      alert("You can only delete reports that are in draft status.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete "${report.title}"? This action cannot be undone.`
      )
    ) {
      const success = deleteReport(id);
      // FIX: Add await before the promise
      if (await success) {
        alert("Report deleted successfully!");
      } else {
        alert("Failed to delete report. Please try again.");
      }
    }
  };

  const handleEditReport = (id: number) => {
    window.location.href = `/edit-report/${id}`;
  };

  const handleViewReport = (report: Incident) => {
    const details = `
📋 Report Details:

Title: ${report.title}
Type: ${report.type === "red-flag" ? "Red Flag 🚩" : "Intervention ⚙️"}
Status: ${report.status}
Date: ${new Date(report.createdOn).toLocaleDateString()}
Location: ${report.location}

Description:
${report.comment}

${report.images.length > 0 ? `📷 Images: ${report.images.length} attached` : ""}
${report.videos.length > 0 ? `🎥 Videos: ${report.videos.length} attached` : ""}
    `.trim();

    alert(details);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters =
    searchTerm || statusFilter !== "all" || typeFilter !== "all";

  return (
    <div className="reports-page-container">
      {/* Simple Header */}
      <div className="reports-page-header">
        <div className="reports-page-title-section">
          <h1 className="reports-page-title">
            <FiBarChart2 className="reports-page-title-icon" />
            My Reports
          </h1>
          <p className="reports-page-subtitle">
            View and manage all your submitted reports
          </p>
        </div>
        <Link to="/create-report" className="reports-page-create-btn">
          <FiPlus className="reports-page-btn-icon" />
          New Report
        </Link>
      </div>

      {/* Simple Search and Filters */}
      <div className="reports-page-controls">
        <div className="reports-page-search-section">
          <div className="reports-page-search-wrapper">
            <FiSearch className="reports-page-search-icon" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="reports-page-search-input"
            />
          </div>

          <button
            className={`reports-page-filter-toggle ${showFilters ? "reports-page-filter-active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="reports-page-filter-icon" />
            Filters
            {hasActiveFilters && (
              <span className="reports-page-filter-badge"></span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="reports-page-filters">
            <div className="reports-page-filter-group">
              <label className="reports-page-filter-label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="reports-page-filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="under investigation">Under Investigation</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="reports-page-filter-group">
              <label className="reports-page-filter-label">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="reports-page-filter-select"
              >
                <option value="all">All Types</option>
                <option value="red-flag">Red Flag</option>
                <option value="intervention">Intervention</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                className="reports-page-clear-filters"
                onClick={clearFilters}
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reports Table Only */}
      <div className="reports-page-content">
        <div className="reports-page-table-section">
          <div className="reports-page-table-header">
            <h3 className="reports-page-table-title">
              All Reports ({filteredReports.length})
            </h3>
            {hasActiveFilters && (
              <span className="reports-page-filtered-info">
                Filtered from {userReports.length} total
              </span>
            )}
          </div>

          <ReportsTable
            reports={filteredReports}
            showActions={true}
            onEdit={handleEditReport}
            onDelete={handleDeleteReport}
            onView={handleViewReport}
          />

          {filteredReports.length === 0 && (
            <div className="reports-page-empty">
              <div className="reports-page-empty-icon">📋</div>
              <h3>No reports found</h3>
              <p>
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first report"}
              </p>
              {!hasActiveFilters && (
                <Link to="/create-report" className="reports-page-create-btn">
                  <FiPlus className="reports-page-btn-icon" />
                  Create First Report
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
