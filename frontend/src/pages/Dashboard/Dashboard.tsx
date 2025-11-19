// Updated Dashboard.tsx - Only 4 professional cards
import React, { useState, useEffect, useMemo } from "react";
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

// Import only the icons we need for 4 cards
import {
  FiFileText, // For Total Reports - represents documents/files
  FiFlag, // For Red Flags - represents reporting/flags
  FiTool, // For Interventions - represents tools/actions
  FiTrendingUp, // For Success Rate - represents growth/trends
} from "react-icons/fi";

const Dashboard: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  const { getUserReports, deleteReport } = useReports();
  const navigate = useNavigate();

  const userReports = useMemo(
    () => getUserReports(user?.id || 0),
    [user?.id, getUserReports]
  );

  // Calculate statistics for 4 cards only
  const stats = useMemo(() => {
    const totalReports = userReports.length;
    const redFlags = userReports.filter((r) => r.type === "red-flag").length;
    const interventions = userReports.filter(
      (r) => r.type === "intervention"
    ).length;
    const resolved = userReports.filter((r) => r.status === "resolved").length;

    // Success rate (resolved reports percentage)
    const successRate =
      totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 0;

    return {
      totalReports,
      redFlags,
      interventions,
      successRate,
    };
  }, [userReports]);

  const recentReports = userReports
    .sort(
      (a, b) =>
        new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
    )
    .slice(0, 5);

  const handleViewReport = (report: Incident) => {
    const details = `
Report Details:

Title: ${report.title}
Type: ${report.type === "red-flag" ? "Red Flag 🚩" : "Intervention ⚙️"}
Status: ${report.status}
Date: ${formatDate(new Date(report.createdOn))}
Location: ${report.location}

Description:
${report.comment}

${report.images.length > 0 ? `Images: ${report.images.length} attached` : ""}
${report.videos.length > 0 ? `Videos: ${report.videos.length} attached` : ""}
    `;
    alert(details);
  };

  const handleEditReport = (id: number) => {
    navigate(`/edit-report/${id}`);
  };

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
    <div className="dashboard">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        mobileOpen={isMobileOpen}
        onMobileClose={handleMobileClose}
      />

      <div
        className={`dashboard-main ${isSidebarCollapsed ? "collapsed" : ""}`}
      >
        <Header
          title="Dashboard"
          onMenuToggle={handleMobileMenuToggle}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="dashboard-content">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user?.firstname}!</h1>
            <p className="welcome-subtitle">
              Track your reports and monitor their progress in real-time.
            </p>
          </div>

          {/* Professional Stats Grid with Only 4 Cards */}
          <div className="stats-grid">
            <StatsCard
              title="Total Reports"
              value={stats.totalReports}
              description="All your submitted cases"
              trend={{ value: 12.5, isPositive: true }}
              icon={<FiFileText />}
              type="primary"
            />
            <StatsCard
              title="Red Flags"
              value={stats.redFlags}
              description="Corruption reports filed"
              trend={{ value: 8.3, isPositive: true }}
              icon={<FiFlag />}
              type="red-flag"
            />
            <StatsCard
              title="Interventions"
              value={stats.interventions}
              description="Service requests submitted"
              trend={{ value: 15.2, isPositive: true }}
              icon={<FiTool />}
              type="intervention"
            />
            <StatsCard
              title="Success Rate"
              value={`${stats.successRate}%`}
              description="Cases successfully resolved"
              trend={{ value: 5.7, isPositive: true }}
              icon={<FiTrendingUp />}
              type="success"
            />
          </div>

          <div className="recent-activity">
            <div className="section-header">
              <h2 className="section-title">Recent Reports</h2>
              <Link to="/reports" className="view-all">
                View All Reports
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
                  Start by creating your first report to fight corruption or
                  request government intervention.
                </p>
                <Link to="/create-report" className="btn btn-primary">
                  Create First Report
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
