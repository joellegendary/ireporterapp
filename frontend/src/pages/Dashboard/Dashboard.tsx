// Dashboard.tsx (FULLY FIXED + SAFE)
import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import StatsCard from "../../components/StatsCard/StatsCard";
import ReportsTable from "../../components/ReportsTable/ReportsTable";
import { Incident } from "../../utils/types";
import { formatDate } from "../../utils/helpers";
import "./Dashboard.css";

// Icons
import { FiFileText, FiFlag, FiTool, FiTrendingUp } from "react-icons/fi";

const Dashboard: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  const { getUserReports, deleteReport } = useReports();
  const navigate = useNavigate();

  // Safely fetch user reports
  const userReports = useMemo(() => {
    if (!user?.id) return [];
    return getUserReports(user.id);
  }, [user?.id, getUserReports]);

  // ============================
  // STATISTICS
  // ============================
  const stats = useMemo(() => {
    const total = userReports.length;

    return {
      totalReports: total,
      redFlags: userReports.filter((r) => r.type === "red-flag").length,
      interventions: userReports.filter((r) => r.type === "intervention")
        .length,
      successRate:
        total > 0
          ? Math.round(
              (userReports.filter((r) => r.status === "resolved").length /
                total) *
                100
            )
          : 0,
    };
  }, [userReports]);

  // Get most recent reports
  const recentReports = useMemo(() => {
    return [...userReports]
      .sort(
        (a, b) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
      )
      .slice(0, 5);
  }, [userReports]);

  // ============================
  // VIEW REPORT
  // ============================
  const handleViewReport = (report: Incident) => {
    const images = Array.isArray(report.images) ? report.images : [];
    const videos = Array.isArray(report.videos) ? report.videos : [];
    const location =
      typeof report.location === "string" ? report.location : "Not provided";

    const details = `
Report Details:

Title: ${report.title}
Type: ${report.type === "red-flag" ? "Red Flag 🚩" : "Intervention ⚙️"}
Status: ${report.status}
Date: ${formatDate(new Date(report.createdOn))}
Location: ${location}

Description:
${report.comment || "No description provided."}

${images.length > 0 ? `Images: ${images.length} attached` : ""}
${videos.length > 0 ? `Videos: ${videos.length} attached` : ""}
    `;

    alert(details);
  };

  // ============================
  // EDIT REPORT
  // ============================
  const handleEditReport = (id: number) => {
    navigate(`/edit-report/${id}`);
  };

  // ============================
  // DELETE REPORT
  // ============================
  const handleDeleteReport = async (id: number) => {
    const report = userReports.find((r) => r.id === id);
    if (!report) return;

    if (report.status !== "draft") {
      alert("You can only delete draft reports.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${report.title}"?`)) {
      const success = await deleteReport(id);

      if (success) {
        alert("Report deleted successfully!");
      } else {
        alert("Failed to delete report. Try again.");
      }
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div
        className={`dashboard-main ${isSidebarCollapsed ? "collapsed" : ""}`}
      >
        <Header
          title="Dashboard"
          onMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="dashboard-content">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user?.firstname}!</h1>
            <p className="welcome-subtitle">
              Track your reports and monitor their progress.
            </p>
          </div>

          {/* ============================ */}
          {/* STATISTICS CARDS */}
          {/* ============================ */}
          <div className="stats-grid">
            <StatsCard
              title="Total Reports"
              value={stats.totalReports}
              description="All submitted reports"
              trend={{ value: 12.5, isPositive: true }}
              icon={<FiFileText />}
              type="primary"
            />

            <StatsCard
              title="Red Flags"
              value={stats.redFlags}
              description="Corruption reports"
              trend={{ value: 8.3, isPositive: true }}
              icon={<FiFlag />}
              type="red-flag"
            />

            <StatsCard
              title="Interventions"
              value={stats.interventions}
              description="Service requests"
              trend={{ value: 15.2, isPositive: true }}
              icon={<FiTool />}
              type="intervention"
            />

            <StatsCard
              title="Success Rate"
              value={`${stats.successRate}%`}
              description="Resolved cases"
              trend={{ value: 5.7, isPositive: true }}
              icon={<FiTrendingUp />}
              type="success"
            />
          </div>

          {/* ============================ */}
          {/* RECENT REPORTS */}
          {/* ============================ */}
          <div className="recent-activity">
            <div className="section-header">
              <h2 className="section-title">Recent Reports</h2>
              <Link to="/reports" className="view-all">
                View All
              </Link>
            </div>

            {recentReports.length > 0 ? (
              <ReportsTable
                reports={recentReports}
                showActions={true}
                onEdit={handleEditReport}
                onDelete={handleDeleteReport}
                onView={handleViewReport}
              />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3 className="empty-title">No reports yet</h3>
                <p className="empty-description">
                  Create your first report now.
                </p>
                <Link to="/create-report" className="btn btn-primary">
                  Create Report
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
