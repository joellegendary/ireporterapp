import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../../components/HeroSection/HeroSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import StatsSection from '../../components/StatsSection/StatsSection';
import logo from '../../assets/ireportlogo.png';
import './Landing.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleReportNow = () => {
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`landing-header ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src={logo} alt="VoiceUp Africa Logo" className="logo-image" />
              <span className="logo-text">VoiceUp Africa</span>
            </div>

            <nav className="nav-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#impact">Impact</a>
            </nav>

            <div className="header-actions">
              <div className="auth-buttons">
                <button
                  className="landing-btn landing-btn-outline"
                  onClick={() => handleNavigation('/login')}
                >
                  Login
                </button>
                <button
                  className="landing-btn landing-btn-primary"
                  onClick={() => handleNavigation('/signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <HeroSection
          onGetStarted={handleGetStarted}
          onReportNow={handleReportNow}
        />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Stats Section */}
        <StatsSection />

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Make a Difference?</h2>
              <p>Join thousands of citizens fighting corruption and improving public services</p>
              <div className="cta-buttons">
                <button
                  className="landing-btn landing-btn-secondary landing-btn-large"
                  onClick={handleGetStarted}
                >
                  Create Account
                </button>
                <button
                  className="landing-btn landing-btn-outline landing-btn-large"
                  onClick={handleReportNow}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <img src={logo} alt="VoiceUp Africa Logo" className="logo-image" />
                <span className="logo-text">VoiceUp Africa</span>
              </div>
              <p className="footer-description">
                Empowering citizens across Africa to report corruption and demand accountability from government officials.
              </p>
              <div className="social-links">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            <div className="footer-links-group">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#impact">Impact</a></li>
                <li><a href="#security">Security</a></li>
              </ul>
            </div>

            <div className="footer-newsletter">
              <h4>Stay Connected</h4>
              <p>Get updates on resolved cases and new features.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email address" aria-label="Email for newsletter" />
                <button type="submit" className="landing-btn landing-btn-primary">Subscribe</button>
              </form>
            </div>

          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} VoiceUp Africa. All rights reserved.</p>
            <p>Transparency and accountability in Africa</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;