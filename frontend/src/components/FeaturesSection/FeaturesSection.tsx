import React from 'react';
import './FeaturesSection.css';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🚩',
      title: 'Report Corruption',
      description: 'Document bribery, fraud, embezzlement, and other corrupt activities with evidence and location data.',
      color: '#dc2626'
    },
    {
      icon: '⚙️',
      title: 'Request Interventions',
      description: 'Report public service issues like broken roads, flooding, poor sanitation that need government action.',
      color: '#ea580c'
    },
    {
      icon: '📍',
      title: 'Precise Location Mapping',
      description: 'Pinpoint exact locations using GPS coordinates and interactive maps for accurate reporting.',
      color: '#16a34a'
    },
    {
      icon: '📸',
      title: 'Media Evidence',
      description: 'Attach photos and videos as supporting evidence to make your reports more credible.',
      color: '#2563eb'
    },
    {
      icon: '👁️',
      title: 'Transparent Tracking',
      description: 'Monitor your report status in real-time and see updates from relevant authorities.',
      color: '#7c3aed'
    },
    {
      icon: '🛡️',
      title: 'Secure & Anonymous',
      description: 'Report safely with options for anonymous reporting and secure data protection.',
      color: '#059669'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Powerful Features for Citizen Reporting</h2>
          <p className="section-subtitle">
            iReporter provides everything you need to effectively report issues and track their resolution
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div 
                className="feature-icon"
                style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="features-cta">
          <h3>Ready to make a difference in your community?</h3>
          <p>Join thousands of citizens already using iReporter to create positive change</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
