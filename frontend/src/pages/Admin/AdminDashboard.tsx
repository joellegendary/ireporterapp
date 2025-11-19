// src/components/Admin/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { useReports } from "../../context/ReportContext";
import { Incident } from "../../utils/types"; // Import Incident type
import "./AdminDashboard.css"; // Import the CSS file

// Helper for status options - reusable
const getStatusOptions = (currentStatus: Incident["status"]) => {
  const allStatuses: Incident["status"][] = [
    "draft",
    "under investigation",
    "resolved",
    "rejected",
  ];
  return allStatuses.filter((status) => status !== currentStatus);
};

const AdminDashboard: React.FC = () => {
  const { reports, updateReport } = useReports(); // Use the ReportContext
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for editing a record
  const [editingRecord, setEditingRecord] = useState<Incident | null>(null);
  // Use a flexible form data shape so admin edit fields (including temporary
  // lat/lng entries) can be stored without causing excess-property errors.
  const [editFormData, setEditFormData] = useState<Record<string, any> | null>(
    null
  );

  // Simulate initial data load delay (even if context is already populated)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setMessage(
        "Displaying all reports from context. Admin can edit any report."
      );
    }, 500); // Shorter delay since data might already be context

    return () => clearTimeout(timer);
  }, []);

  // Function to handle status change
  const handleStatusChange = async (
    recordId: number,
    newStatus: Incident["status"]
  ) => {
    const recordToUpdate = reports.find((r) => r.id === recordId);
    if (recordToUpdate) {
      const updated = updateReport(recordId, { status: newStatus });
      // FIX: Add await before the promise
      if (await updated) {
        setMessage(`Status for record ${recordId} changed to "${newStatus}".`);
        setError(null);
      } else {
        setError(`Failed to update status for record ${recordId}.`);
      }
    }
  };

  // Function to handle clicking the Edit button
  const handleEditClick = (record: Incident) => {
    setEditingRecord(record);
    // Create a copy of the relevant fields for the form
    const [lat, lng] = record.location.split(",").map((coord) => coord.trim());
    setEditFormData({
      type: record.type,
      title: record.title,
      comment: record.comment,
      location: record.location, // Keep the full string for display
      // latitude and longitude were removed here to match the Incident shape
      // If a map picker is added later, compute/merge lat/lng into the location string
      images: record.images,
      videos: record.videos,
    });
  };

  // Function to handle changes in the edit form
  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  // Function to save edited record
  const handleSaveEdit = async () => {
    if (editingRecord && editFormData) {
      const updatedData: Partial<Incident> = {
        title: editFormData.title,
        type: editFormData.type,
        comment: editFormData.comment,
        // Assuming location will be updated if lat/lng changed in MapPicker,
        // but for a simple form, we'll just use the text field value.
        location: editFormData.location,
        images: editFormData.images, // Pass existing arrays
        videos: editFormData.videos, // Pass existing arrays
      };

      const success = updateReport(editingRecord.id, updatedData);
      // FIX: Add await before the promise
      if (await success) {
        setMessage(`Record ${editingRecord.id} updated successfully!`);
        setError(null);
        setEditingRecord(null); // Exit edit mode
        setEditFormData(null);
      } else {
        setError(`Failed to update record ${editingRecord.id}.`);
      }
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditFormData(null);
    setMessage("Edit cancelled.");
    setError(null);
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-spinner"></div>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">Admin Dashboard</h2>
      <p className="admin-dashboard-subtitle">
        Manage all reported incidents and interventions. (Using ReportContext)
      </p>

      {message && <div className="info-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {reports.length === 0 ? (
        <div className="no-records-message">
          <p>No reports have been submitted yet.</p>
        </div>
      ) : (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Title</th>
                <th>Comment</th>
                <th>Location</th>
                <th>Created By</th>
                <th>Status</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>
                    <span className={`type-badge type-${record.type}`}>
                      {record.type.replace("-", " ")}
                    </span>
                  </td>
                  <td>{record.title}</td>
                  <td>
                    {record.comment.substring(0, 50)}
                    {record.comment.length > 50 ? "..." : ""}
                  </td>
                  <td>{record.location}</td>
                  <td>User {record.createdBy}</td>
                  <td>
                    <span
                      className={`status-badge status-${record.status.replace(/\s+/g, "-")}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="actions-column">
                    <select
                      value={record.status}
                      onChange={(e) =>
                        handleStatusChange(
                          record.id,
                          e.target.value as Incident["status"]
                        )
                      }
                      className="status-select"
                      aria-label={`Change status for record ${record.id}`}
                    >
                      <option value={record.status} disabled>
                        {record.status}
                      </option>{" "}
                      {/* Current status, disabled */}
                      {getStatusOptions(record.status).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleEditClick(record)}
                      className="btn btn-icon btn-edit"
                      aria-label={`Edit record ${record.id}`}
                    >
                      <i className="fas fa-edit"></i> {/* Font Awesome icon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Record Modal/Overlay */}
      {editingRecord !== null && editFormData && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <h3>Edit Record #{editingRecord.id}</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSaveEdit();
              }}
            >
              <div className="form-group">
                <label htmlFor="editTitle">Title:</label>
                <input
                  type="text"
                  id="editTitle"
                  name="title"
                  value={editFormData.title || ""}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editType">Type:</label>
                <select
                  id="editType"
                  name="type"
                  value={editFormData.type || "intervention"}
                  onChange={handleEditFormChange}
                  required
                >
                  <option value="intervention">Intervention</option>
                  <option value="red-flag">Red-Flag</option>
                </select>
              </div>
              {/* Note: For location, if you want a map picker here, you'd integrate MapPicker component.
                  For now, we'll keep it as a text input which updates the original location string.
                  The ReportForm handles lat/lng parsing and string formation, for simplicity here,
                  we'll update the 'location' string directly.
              */}
              <div className="form-group">
                <label htmlFor="editLocation">Location (Lat, Lng):</label>
                <input
                  type="text"
                  id="editLocation"
                  name="location"
                  value={editFormData.location || ""}
                  onChange={handleEditFormChange}
                  required
                  placeholder="e.g., -1.286389, 36.817223"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editComment">Comment:</label>
                <textarea
                  id="editComment"
                  name="comment"
                  value={editFormData.comment || ""}
                  onChange={handleEditFormChange}
                  rows={5}
                  required
                ></textarea>
              </div>
              {/* For images/videos, you could add upload inputs and previews similar to ReportForm,
                  but for simplicity in admin edit, we're currently just showing them and not
                  allowing direct modification in this modal. If needed, this can be extended.
              */}
              {editingRecord.images && editingRecord.images.length > 0 && (
                <div className="form-group">
                  <label>Attached Images:</label>
                  <div className="media-preview-admin">
                    {editingRecord.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="modal-media-thumbnail"
                      />
                    ))}
                  </div>
                </div>
              )}
              {editingRecord.videos && editingRecord.videos.length > 0 && (
                <div className="form-group">
                  <label>Attached Videos:</label>
                  <div className="media-preview-admin">
                    {editingRecord.videos.map((vid, idx) => (
                      <video
                        key={idx}
                        src={vid}
                        controls
                        className="modal-media-thumbnail"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
