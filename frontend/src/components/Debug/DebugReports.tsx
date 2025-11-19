import React from 'react';
import { useReports } from '../../context/ReportContext';
import { useAuth } from '../../context/AuthContext';

const DebugReports: React.FC = () => {
  const { reports, debugReports, getUserReports } = useReports();
  const { user } = useAuth();

  const handleDebug = () => {
    if (debugReports) {
      debugReports();
    }
    
    if (user) {
      const userReports = getUserReports(user.id);
      console.log('User reports:', userReports);
    }
  };

  return (
    <div style={{ padding: '10px', background: '#f0f0f0', margin: '10px' }}>
      <button onClick={handleDebug}>Debug Reports</button>
      <p>Total Reports: {reports.length}</p>
      {user && <p>Your Reports: {getUserReports(user.id).length}</p>}
    </div>
  );
};

export default DebugReports;