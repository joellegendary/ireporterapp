export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'draft': return '#6B7280';
    case 'under investigation': return '#F59E0B';
    case 'resolved': return '#10B981';
    case 'rejected': return '#EF4444';
    default: return '#6B7280';
  }
};

export const filterReports = (reports: any[], searchTerm: string, filters: any) => {
  return reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.type || report.type === filters.type;
    const matchesStatus = !filters.status || report.status === filters.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });
};