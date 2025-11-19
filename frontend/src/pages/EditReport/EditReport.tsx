import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import ReportForm from '../../components/ReportForm/ReportForm';
import { Incident } from '../../utils/types';
import './EditReport.css';

const EditReport: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [report, setReport] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getReport } = useReports();

  useEffect(() => {
    if (reportId) {
      const foundReport = getReport(parseInt(reportId));
      if (foundReport) {
        // Check if user owns the report or is admin
        if (foundReport.createdBy !== user?.id && !user?.isAdmin) {
          alert('You do not have permission to edit this report');
          navigate('/dashboard');
          return;
        }
        
        // Check if report can be edited (only draft status)
        if (foundReport.status !== 'draft') {
          alert('This report cannot be edited because it is no longer in draft status');
          navigate('/dashboard');
          return;
        }
        
        setReport(foundReport);
      } else {
        alert('Report not found');
        navigate('/dashboard');
      }
      setLoading(false);
    }
  }, [reportId, getReport, user, navigate]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  if (loading) {
    return (
      <div className="edit-report">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="edit-report">
        <div className="error-container">
          <h2>Report Not Found</h2>
          <p>The report you're trying to edit doesn't exist.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-report">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        mobileOpen={isMobileOpen}
        onMobileClose={handleMobileClose}
      />
      
      <div className={`edit-report-main ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          title="Edit Report"
          onMenuToggle={handleMobileMenuToggle}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <div className="edit-report-content">
          <ReportForm 
            report={report}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditReport;