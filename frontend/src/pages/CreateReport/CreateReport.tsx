import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import ReportForm from '../../components/ReportForm/ReportForm';
import { Incident } from '../../utils/types';

const CreateReport: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { reports } = useReports();
  const { reportId } = useParams<{ reportId: string }>();

  // If reportId is provided, we're editing an existing report
  const report = reportId ? reports.find(r => r.id === parseInt(reportId)) : undefined;
  const isEditing = !!report;

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
      
      <div className={`dashboard-main ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Header
          title={isEditing ? "Edit Report" : "Create Report"}
          onMenuToggle={handleMobileMenuToggle}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <div className="dashboard-content">
          <ReportForm 
            report={report}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateReport;