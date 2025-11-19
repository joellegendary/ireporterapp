import React from 'react';
import './StatsSection.css';

const StatsSection: React.FC = () => {
  const stats = [
    {
      number: '15,000+',
      label: 'Reports Filed',
      description: 'Citizens actively reporting issues across Africa',
      icon: '📊'
    },
    {
      number: '2,500+',
      label: 'Issues Resolved',
      description: 'Successful interventions and corruption cases addressed',
      icon: '✅'
    },
    {
      number: '100+',
      label: 'Cities Covered',
      description: 'Active in major cities across 15 African countries',
      icon: '🌍'
    },
    {
      number: '85%',
      label: 'Satisfaction Rate',
      description: 'Of users would recommend iReporter to others',
      icon: '⭐'
    }
  ];

  const countries = [
    'Kenya', 'Nigeria', 'Ghana', 'South Africa', 'Uganda', 
    'Tanzania', 'Rwanda', 'Ethiopia', 'Zambia', 'Zimbabwe'
  ];

  return (
    <section id="impact" className="stats-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Impact Across Africa</h2>
          <p className="section-subtitle">
            Join the growing movement of citizens creating positive change in their communities
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="countries-section">
          <h3 className="countries-title">Active in 10+ African Countries</h3>
          <div className="countries-grid">
            {countries.map((country, index) => (
              <div key={index} className="country-item">
                <span className="country-name">{country}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="impact-stories">
          <h3 className="stories-title">Success Stories</h3>
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-icon">🚧</div>
              <h4>Road Repair in Nairobi</h4>
              <p>"Reported a dangerous pothole on Mombasa Road. Within 2 weeks, it was completely repaired thanks to iReporter!"</p>
              <div className="story-author">- Joel S., Nairobi</div>
            </div>
            <div className="story-card">
              <div className="story-icon">💧</div>
              <h4>Water Supply Restored</h4>
              <p>"Our community had no water for weeks. After reporting on iReporter, authorities fixed the broken pipes in 3 days."</p>
              <div className="story-author">- Ivan M., Lagos</div>
            </div>
            <div className="story-card">
              <div className="story-icon">🚩</div>
              <h4>Corruption Exposed</h4>
              <p>"Documented bribery at a government office. The officials were investigated and replaced within a month."</p>
              <div className="story-author">- Calvin K., Accra</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
