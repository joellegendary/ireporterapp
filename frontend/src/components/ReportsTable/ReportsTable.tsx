import React from "react";
import { Incident } from "../../utils/types";
import { getStatusColor, formatDate } from "../../utils/helpers";
import "./ReportsTable.css";

interface ReportsTableProps {
  reports: Incident[];
  showActions?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: string) => void;
  onView?: (report: Incident) => void;
  isAdmin?: boolean;
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  reports,
  showActions = false,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
  isAdmin = false,
}) => {
  const canEditOrDelete = (report: Incident) => report.status === "draft";

  const getStatusOptions = (current: string) => {
    const options = [
      { value: "under-investigation", label: "Under Investigation" },
      { value: "resolved", label: "Resolved" },
      { value: "rejected", label: "Rejected" },
    ];
    return options.filter((o) => o.value !== current);
  };

  const handleViewClick = (report: Incident) => {
    if (onView) return onView(report);

    // SAFETY CHECKS HERE
    const images = Array.isArray(report.images) ? report.images : [];
    const videos = Array.isArray(report.videos) ? report.videos : [];

    alert(
      `
📋 Report Details

Title: ${report.title}
Status: ${report.status}
Type: ${report.type === "red-flag" ? "Red Flag 🚩" : "Intervention ⚙️"}
Date: ${formatDate(new Date(report.createdOn))}
Location: ${report.location}

Comments:
${report.comment}

${images.length > 0 ? `📷 Images: ${images.length}` : ""}
${videos.length > 0 ? `🎥 Videos: ${videos.length}` : ""}
      `.trim()
    );
  };

  return (
    <div className="reports-table">
      {/* Desktop Header */}
      <div className="table-header">
        <div>ID</div>
        <div>Report Details</div>
        <div>Type</div>
        <div>Status</div>
        <div>Date</div>
        {showActions && <div>Actions</div>}
      </div>

      {reports.length === 0 ? (
        <div className="empty-state" style={{ padding: "40px 20px" }}>
          <div className="empty-icon">📝</div>
          <h3 className="empty-title">No reports found</h3>
          <p className="empty-description">
            No reports match your current filters.
          </p>
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="table-row">
            {/* ID */}
            <div className="table-cell report-id" data-label="ID">
              #{report.id}
            </div>

            {/* Report Details */}
            <div className="table-cell" data-label="Report Details">
              <div>
                <div className="report-title">{report.title}</div>
                <div className="report-description">{report.comment}</div>
              </div>
            </div>

            {/* Type */}
            <div className="table-cell" data-label="Type">
              <span className={`report-type ${report.type}`}>
                {report.type.replace("-", " ")}
              </span>
            </div>

            {/* Status */}
            <div className="table-cell" data-label="Status">
              {isAdmin && onStatusChange ? (
                <select
                  value={report.status}
                  onChange={(e) => onStatusChange(report.id, e.target.value)}
                  style={{
                    padding: "6px 12px",
                    border: `2px solid ${getStatusColor(report.status)}`,
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "white",
                    color: getStatusColor(report.status),
                    cursor: "pointer",
                  }}
                >
                  <option value={report.status}>{report.status}</option>
                  {getStatusOptions(report.status).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className="report-status"
                  style={{
                    backgroundColor: `${getStatusColor(report.status)}20`,
                    color: getStatusColor(report.status),
                    border: `1px solid ${getStatusColor(report.status)}`,
                  }}
                >
                  {report.status}
                </span>
              )}
            </div>

            {/* Date */}
            <div className="table-cell report-date" data-label="Date">
              {formatDate(new Date(report.createdOn))}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="table-cell table-actions" data-label="Actions">
                <button
                  className="action-btn view"
                  onClick={() => handleViewClick(report)}
                >
                  View
                </button>

                <button
                  className="action-btn edit"
                  onClick={() => onEdit && onEdit(report.id)}
                  disabled={!canEditOrDelete(report)}
                >
                  Edit
                </button>

                <button
                  className="action-btn delete"
                  onClick={() => onDelete && onDelete(report.id)}
                  disabled={!canEditOrDelete(report)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReportsTable;
