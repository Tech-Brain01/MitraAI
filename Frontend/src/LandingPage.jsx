import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  const features = [
    {
      icon: 'fas fa-brain',
      title: 'Advanced AI Models',
      description: 'Access multiple Indian AI agents trained for your specific needs'
    },
    {
      icon: 'fas fa-lock',
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and stored securely'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Lightning Fast',
      description: 'Get instant responses powered by cutting-edge technology'
    },
    {
      icon: 'fas fa-history',
      title: 'Thread History',
      description: 'Never lose your conversations with organized thread management'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Multi-Device',
      description: 'Access your AI assistant from any device, anywhere'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Continuous Learning',
      description: 'Our models improve with every interaction'
    }
  ];

  const scrollToSection = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <div className="landing-logo">
            <i className="fas fa-robot"></i>
            <span>MitraAI</span>
          </div>
          <div className="landing-nav-links">
            <button 
              className={activeSection === 'home' ? 'active' : ''} 
              onClick={() => scrollToSection('home')}
            >
              Home
            </button>
            <button 
              className={activeSection === 'features' ? 'active' : ''} 
              onClick={() => scrollToSection('features')}
            >
              Features
            </button>
            <button 
              className={activeSection === 'pricing' ? 'active' : ''} 
              onClick={() => scrollToSection('pricing')}
            >
              Pricing
            </button>
            <button 
              className={activeSection === 'about' ? 'active' : ''} 
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
          </div>
          <div className="landing-nav-actions">
            <button className="landing-btn-secondary" onClick={() => navigate('/login')}>
              Log In
            </button>
            <button className="landing-btn-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <i className="fas fa-star"></i>
            <span>Made in India, Built for the World</span>
          </div>
          <h1 className="landing-hero-title">
            Your Intelligent AI Assistant
          </h1>
          <p className="landing-hero-subtitle">
            Experience the power of Indian AI technology. Get instant answers, creative content, 
            and intelligent conversations with MitraAI - your trusted digital companion.
          </p>
          <div className="landing-hero-actions">
            <button className="landing-btn-primary landing-btn-large" onClick={() => navigate('/register')}>
              <span>Start Free Trial</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            <button className="landing-btn-secondary landing-btn-large" onClick={() => scrollToSection('features')}>
              <span>Learn More</span>
            </button>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat">
              <div className="landing-stat-number">10K+</div>
              <div className="landing-stat-label">Active Users</div>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">1M+</div>
              <div className="landing-stat-label">Conversations</div>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">99.9%</div>
              <div className="landing-stat-label">Uptime</div>
            </div>
          </div>
        </div>
        <div className="landing-hero-illustration">
          <div className="landing-hero-card">
            <div className="landing-hero-card-header">
              <div className="landing-hero-card-icon">
                <i className="fas fa-robot"></i>
              </div>
              <div className="landing-hero-card-title">MitraAI Assistant</div>
            </div>
            <div className="landing-hero-card-content">
              <div className="landing-message landing-message-user">
                <div className="landing-message-bubble">
                  Tell me about Indian history
                </div>
              </div>
              <div className="landing-message landing-message-ai">
                <div className="landing-message-bubble">
                  India has a rich and diverse history spanning thousands of years...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-section-header">
          <h2 className="landing-section-title">Powerful Features</h2>
          <p className="landing-section-subtitle">
            Everything you need to have intelligent conversations with AI
          </p>
        </div>
        <div className="landing-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="landing-feature-card">
              <div className="landing-feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3 className="landing-feature-title">{feature.title}</h3>
              <p className="landing-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="landing-pricing">
        <div className="landing-section-header">
          <h2 className="landing-section-title">Simple, Transparent Pricing</h2>
          <p className="landing-section-subtitle">
            Choose the plan that's right for you
          </p>
        </div>
        <div className="landing-pricing-grid">
          <div className="landing-pricing-card">
            <div className="landing-pricing-header">
              <div className="landing-pricing-icon" style={{ background: '#6b7280' }}>
                <i className="fas fa-user"></i>
              </div>
              <h3 className="landing-pricing-title">Free</h3>
              <div className="landing-pricing-price">
                <span className="landing-pricing-amount">₹0</span>
                <span className="landing-pricing-period">/month</span>
              </div>
            </div>
            <ul className="landing-pricing-features">
              <li><i className="fas fa-check"></i> 10 conversations/day</li>
              <li><i className="fas fa-check"></i> Basic AI model</li>
              <li><i className="fas fa-check"></i> Thread history (7 days)</li>
              <li><i className="fas fa-check"></i> Community support</li>
            </ul>
            <button className="landing-pricing-button" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </div>

          <div className="landing-pricing-card landing-pricing-card-popular">
            <div className="landing-pricing-badge">Most Popular</div>
            <div className="landing-pricing-header">
              <div className="landing-pricing-icon" style={{ background: '#d97706' }}>
                <i className="fas fa-star"></i>
              </div>
              <h3 className="landing-pricing-title">Pro</h3>
              <div className="landing-pricing-price">
                <span className="landing-pricing-amount">₹299</span>
                <span className="landing-pricing-period">/month</span>
              </div>
            </div>
            <ul className="landing-pricing-features">
              <li><i className="fas fa-check"></i> Unlimited conversations</li>
              <li><i className="fas fa-check"></i> Advanced AI models</li>
              <li><i className="fas fa-check"></i> Unlimited thread history</li>
              <li><i className="fas fa-check"></i> Priority support</li>
              <li><i className="fas fa-check"></i> Early access to features</li>
            </ul>
            <button className="landing-pricing-button landing-pricing-button-primary" onClick={() => navigate('/register')}>
              Start Free Trial
            </button>
          </div>

          <div className="landing-pricing-card">
            <div className="landing-pricing-header">
              <div className="landing-pricing-icon" style={{ background: '#374151' }}>
                <i className="fas fa-building"></i>
              </div>
              <h3 className="landing-pricing-title">Enterprise</h3>
              <div className="landing-pricing-price">
                <span className="landing-pricing-amount">Custom</span>
              </div>
            </div>
            <ul className="landing-pricing-features">
              <li><i className="fas fa-check"></i> Custom AI training</li>
              <li><i className="fas fa-check"></i> Dedicated models</li>
              <li><i className="fas fa-check"></i> API access</li>
              <li><i className="fas fa-check"></i> 24/7 support</li>
              <li><i className="fas fa-check"></i> SLA guarantee</li>
            </ul>
            <button className="landing-pricing-button" onClick={() => navigate('/register')}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing-about">
        <div className="landing-about-content">
          <div className="landing-about-text">
            <h2 className="landing-section-title">About MitraAI</h2>
            <p className="landing-about-description">
              MitraAI is India's premier AI assistant platform, designed to bring the power of 
              artificial intelligence to everyone. Built with cutting-edge technology and 
              trained on diverse datasets, our models understand context, culture, and complexity.
            </p>
            <p className="landing-about-description">
              Whether you're a student, professional, or business owner, MitraAI adapts to your 
              needs and provides intelligent assistance for any task. From answering questions 
              to generating creative content, we're here to help you achieve more.
            </p>
            <div className="landing-about-values">
              <div className="landing-about-value">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <h4>Privacy First</h4>
                  <p>Your data is encrypted and never shared</p>
                </div>
              </div>
              <div className="landing-about-value">
                <i className="fas fa-globe-asia"></i>
                <div>
                  <h4>Made in India</h4>
                  <p>Supporting local innovation and technology</p>
                </div>
              </div>
            </div>
          </div>
          <div className="landing-about-image">
            <div className="landing-about-card">
              <div className="landing-about-card-icon">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="landing-about-card-text">
                "MitraAI has transformed the way we work. It's like having a brilliant 
                assistant available 24/7."
              </p>
              <div className="landing-about-card-author">
                <div className="landing-about-card-avatar">A</div>
                <div>
                  <div className="landing-about-card-name">Arjun Sharma</div>
                  <div className="landing-about-card-role">Product Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-brand">
            <div className="landing-logo">
              <i className="fas fa-robot"></i>
              <span>MitraAI</span>
            </div>
            <p className="landing-footer-tagline">
              Your intelligent AI assistant for the modern world
            </p>
          </div>
          <div className="landing-footer-links">
            <div className="landing-footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#about">About</a>
            </div>
            <div className="landing-footer-column">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="landing-footer-column">
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#security">Security</a>
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p>&copy; 2025 MitraAI. All rights reserved.</p>
          <div className="landing-footer-social">
            <a href="#twitter"><i className="fab fa-twitter"></i></a>
            <a href="#linkedin"><i className="fab fa-linkedin"></i></a>
            <a href="#github"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
