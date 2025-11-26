// src/pages/Admin/AdminDashboard.tsx
import React from "react";
import { useReports } from "../../context/ReportContext";
import { Incident } from "../../utils/types";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify"; // <-- added
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const { reports, loading, updateReport, deleteReport } = useReports();
  const { logout, user } = useAuth();

  const handleStatusChange = async (
    id: number,
    newStatus: Incident["status"]
  ) => {
    const success = await updateReport(id, { status: newStatus });

    if (success) {
      toast.success("Status updated successfully");
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );
    if (!confirmDelete) return;

    const success = await deleteReport(id);

    if (success) {
      toast.success("Report deleted.");
    } else {
      toast.error("Failed to delete report.");
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading reports...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-topbar">
        <span className="admin-user">Admin: {user?.username}</span>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <h1 className="admin-title">Admin Dashboard</h1>

      {reports.length === 0 ? (
        <p className="no-reports">No reports found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Comment</th>
              <th>Location</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.type}</td>
                <td>{report.title}</td>
                <td>{report.comment}</td>
                <td>{report.location}</td>
                <td>{report.status}</td>
                <td>{report.createdBy}</td>

                <td className="admin-actions">
                  <select
                    value={report.status}
                    onChange={(e) =>
                      handleStatusChange(
                        report.id,
                        e.target.value as Incident["status"]
                      )
                    }
                    className="status-dropdown"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under-investigation">
                      Under Investigation
                    </option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(report.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
