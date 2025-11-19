import React from 'react';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: '✍️', // Changed icon for better representation of "Report"
      title: 'Report Your Concern',
      description: 'Easily create a new report, choose its type (corruption or intervention), and add all necessary details.',
      details: [
        'Select report type (Red Flag / Intervention)',
        'Add title, description, and pinpoint location',
        'Attach supporting photos or videos'
      ]
    },
    {
      number: '02',
      icon: '🚀', // Changed icon for better representation of "Action"
      title: 'Submit & Route to Authorities',
      description: 'Your detailed report is securely submitted and automatically directed to the appropriate government authorities for action.',
      details: [
        'Secure submission to the platform',
        'Automatic routing to relevant government bodies',
        'Report becomes publicly visible for transparency'
      ]
    },
    {
      number: '03',
      icon: '✅', // Changed icon for better representation of "Resolution"
      title: 'Track & Resolve',
      description: 'Monitor the progress of your report in real-time and receive updates until the issue is fully investigated and resolved.',
      details: [
        'Real-time status tracking of your report',
        'Receive official responses and updates',
        'Get notified upon issue investigation and resolution'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How iReporter Works</h2>
          <p className="section-subtitle">
            Three simple steps to report issues and drive positive change in your community
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-header">
                <div className="step-badge">
                  <span className="step-number">{step.number}</span>
                </div>
                <div className="step-icon">{step.icon}</div>
              </div>

              <div className="step-body">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>

                <ul className="step-features">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="feature-item">
                      <span className="feature-check">✓</span>
                      <span className="feature-text">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="process-flow">
          <div className="flow-container">
            <div className="flow-item">
              <div className="flow-icon-wrapper">
                <span className="flow-icon">👤</span>
              </div>
              <div className="flow-text">Citizen Reporter</div>
            </div>

            <div className="flow-connector">
              <div className="flow-line"></div>
              <div className="flow-arrow">→</div>
            </div>

            <div className="flow-item">
              <div className="flow-icon-wrapper">
                <span className="flow-icon">📱</span>
              </div>
              <div className="flow-text">iReporter Platform</div>
            </div>

            <div className="flow-connector">
              <div className="flow-line"></div>
              <div className="flow-arrow">→</div>
            </div>

            <div className="flow-item">
              <div className="flow-icon-wrapper">
                <span className="flow-icon">🏛️</span>
              </div>
              <div className="flow-text">Relevant Authorities</div>
            </div>

            <div className="flow-connector">
              <div className="flow-line"></div>
              <div className="flow-arrow">→</div>
            </div>

            <div className="flow-item">
              <div className="flow-icon-wrapper">
                <span className="flow-icon">✅</span>
              </div>
              <div className="flow-text">Issue Resolution</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;