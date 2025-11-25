import React, { useState, useEffect } from "react"; // Added useEffect for initial form data
import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./Profile.css";

const Profile: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const { getUserReports } = useReports();

  const userReports = getUserReports(user?.id || 0);

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    othernames: user?.othernames || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    username: user?.username || "",
  });

  // Effect to update form data if user prop changes (e.g., after initial load or profile update)
  useEffect(() => {
    setFormData({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      othernames: user?.othernames || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      username: user?.username || "",
    });
  }, [user]); // Re-run when user object changes

  const stats = {
    totalReports: userReports.length,
    redFlags: userReports.filter((r) => r.type === "red-flag").length,
    interventions: userReports.filter((r) => r.type === "intervention").length,
    resolved: userReports.filter((r) => r.status === "resolved").length,
    pending: userReports.filter(
      (r) => r.status === "draft" || r.status === "under-investigation"
    ).length,
    rejected: userReports.filter((r) => r.status === "rejected").length,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    console.log("Save profile:", formData);
    // You would typically call an update function from your AuthContext here
    // For example: updateUserProfile(formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    // Reset to current user data
    setFormData({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      othernames: user?.othernames || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      username: user?.username || "",
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const first = user?.firstname?.charAt(0) || "";
    const last = user?.lastname?.charAt(0) || "";
    return `${first}${last}`.toUpperCase();
  };

  const getFullName = () => {
    const first = user?.firstname || "";
    const last = user?.lastname || "";
    return `${first} ${last}`.trim();
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="profile">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        mobileOpen={isMobileOpen}
        onMobileClose={handleMobileClose}
      />

      <div className={`profile-main ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <Header
          title="Profile"
          onMenuToggle={handleMobileMenuToggle}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="profile-content">
          <div className="profile-header">
            <h1 className="profile-title">Profile Settings</h1>
            <p className="profile-subtitle">
              Manage your account information and preferences
            </p>
          </div>

          <div className="profile-grid">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="profile-avatar-card">
                {" "}
                {/* Renamed for clarity, using card styles */}
                <div className="avatar-image">{getInitials()}</div>
                <div className="avatar-name">{getFullName()}</div>
                <div className={`avatar-role ${user?.isAdmin ? "admin" : ""}`}>
                  {user?.isAdmin ? "Administrator" : "User"}
                </div>
              </div>

              <div className="profile-stats-card">
                {" "}
                {/* Renamed for clarity, using card styles */}
                <h3 className="stats-title">Reporting Statistics</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">Total Reports</span>
                    <span className="stat-value">{stats.totalReports}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Red Flags</span>
                    <span className="stat-value">{stats.redFlags}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Interventions</span>
                    <span className="stat-value">{stats.interventions}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Resolved</span>
                    <span className="stat-value">{stats.resolved}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value">{stats.pending}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Rejected</span>
                    <span className="stat-value">{stats.rejected}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="profile-form-card">
              {" "}
              {/* Renamed for clarity, using card styles */}
              <div className="form-section">
                <h3 className="form-section-title">Personal Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstname"
                      className="form-input"
                      value={formData.firstname}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      className="form-input"
                      value={formData.lastname}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Other Names</label>
                  <input
                    type="text"
                    name="othernames"
                    className="form-input"
                    value={formData.othernames}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Optional"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-input"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="form-section">
                <h3 className="form-section-title">Contact Information</h3>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="form-actions">
                {!isEditing ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
