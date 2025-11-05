import { useState, useContext } from 'react';
import { Mycontext } from './MyContext.jsx';
import toast from 'react-hot-toast';
import './UpgradePlan.css';

const UpgradePlan = ({ onClose }) => {
  const { user } = useContext(Mycontext);
  const [selectedPlan, setSelectedPlan] = useState(user?.plan || 'free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: 'forever',
      features: [
        'Basic AI assistance',
        'Code Sandbox (3 languages)',
        'Limited chat history',
        '100 messages per day',
        'Community support',
      ],
      icon: 'fa-star',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹299',
      period: 'per month',
      features: [
        'Advanced AI models',
        'Unlimited messages',
        'Full chat history',
        'Code Sandbox (All languages)',
        'Priority support',
        'Export conversations',
        'Custom AI training',
      ],
      icon: 'fa-rocket',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹4,999',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Advanced analytics',
        'SLA guarantee',
        'White-label option',
      ],
      icon: 'fa-crown',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  const handleUpgrade = (planId) => {
    // In production, integrate with payment gateway (Stripe, etc.)
    toast.success(`Upgrade to ${planId} plan - Payment integration coming soon!`);
  };

  return (
    <div className="upgrade-overlay" onClick={onClose}>
      <div className="upgrade-container" onClick={(e) => e.stopPropagation()}>
        <div className="upgrade-header">
          <div className="upgrade-title">
            <i className="fa-solid fa-crown"></i>
            <h2>Upgrade Your Plan</h2>
            <p>Choose the perfect plan for your needs</p>
          </div>
          <button className="upgrade-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${
                plan.popular ? 'popular' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-icon" style={{ background: plan.gradient }}>
                <i className={`fa-solid ${plan.icon}`}></i>
              </div>

              <h3 className="plan-name">{plan.name}</h3>
              
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>

              {user?.plan === plan.id ? (
                <button className="plan-button current" disabled>
                  <i className="fa-solid fa-check-circle"></i>
                  Current Plan
                </button>
              ) : (
                <button
                  className="plan-button"
                  style={{ background: plan.gradient }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgrade(plan.id);
                  }}
                >
                  <i className="fa-solid fa-arrow-up"></i>
                  {plan.id === 'free' ? 'Downgrade' : 'Upgrade Now'}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="upgrade-benefits">
          <h3>
            <i className="fa-solid fa-gift"></i>
            Why Upgrade?
          </h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <i className="fa-solid fa-bolt"></i>
              <h4>Faster Responses</h4>
              <p>Get lightning-fast AI responses with priority processing</p>
            </div>
            <div className="benefit-card">
              <i className="fa-solid fa-shield-halved"></i>
              <h4>Enhanced Security</h4>
              <p>Advanced encryption and data protection for your conversations</p>
            </div>
            <div className="benefit-card">
              <i className="fa-solid fa-headset"></i>
              <h4>Premium Support</h4>
              <p>24/7 dedicated support team to assist you anytime</p>
            </div>
            <div className="benefit-card">
              <i className="fa-solid fa-infinity"></i>
              <h4>Unlimited Access</h4>
              <p>No limits on messages, history, or feature usage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
