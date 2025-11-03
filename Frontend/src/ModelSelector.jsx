import React, { useState, useRef, useEffect } from 'react';
import './ModelSelector.css';

const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState({
    id: 'mitra-pro',
    name: 'Mitra Pro',
    description: 'Advanced reasoning and creativity',
    icon: 'fas fa-brain',
    badge: 'Recommended'
  });
  
  const dropdownRef = useRef(null);

  const models = [
    {
      id: 'mitra-pro',
      name: 'Mitra Pro',
      description: 'Advanced reasoning and creativity',
      icon: 'fas fa-brain',
      badge: 'Recommended'
    },
    {
      id: 'mitra-fast',
      name: 'Mitra Fast',
      description: 'Quick responses for simple tasks',
      icon: 'fas fa-bolt',
      badge: null
    },
    {
      id: 'bharat-gpt',
      name: 'Bharat GPT',
      description: 'Specialized in Indian languages and culture',
      icon: 'fas fa-flag',
      badge: 'New'
    },
    {
      id: 'sanskrit-ai',
      name: 'Sanskrit AI',
      description: 'Expert in ancient Indian texts and philosophy',
      icon: 'fas fa-book-open',
      badge: null
    },
    {
      id: 'kalam-ai',
      name: 'Kalam AI',
      description: 'Scientific and technical assistance',
      icon: 'fas fa-flask',
      badge: null
    },
    {
      id: 'chanakya-ai',
      name: 'Chanakya AI',
      description: 'Strategic thinking and decision making',
      icon: 'fas fa-chess',
      badge: null
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setIsOpen(false);
  };

  return (
    <div className="model-selector" ref={dropdownRef}>
      <button 
        className="model-selector-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select AI Model"
      >
        <div className="model-selector-current">
          <i className={selectedModel.icon}></i>
          <span className="model-selector-name">{selectedModel.name}</span>
        </div>
        <i className={`fas fa-chevron-down model-selector-arrow ${isOpen ? 'open' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="model-selector-dropdown">
          <div className="model-selector-header">
            <h3>Select AI Model</h3>
            <p>Choose the model that fits your needs</p>
          </div>
          
          <div className="model-selector-list">
            {models.map((model) => (
              <button
                key={model.id}
                className={`model-option ${selectedModel.id === model.id ? 'selected' : ''}`}
                onClick={() => handleModelSelect(model)}
              >
                <div className="model-option-icon">
                  <i className={model.icon}></i>
                </div>
                <div className="model-option-content">
                  <div className="model-option-header">
                    <span className="model-option-name">{model.name}</span>
                    {model.badge && (
                      <span className={`model-option-badge ${model.badge.toLowerCase()}`}>
                        {model.badge}
                      </span>
                    )}
                  </div>
                  <p className="model-option-description">{model.description}</p>
                </div>
                {selectedModel.id === model.id && (
                  <i className="fas fa-check model-option-check"></i>
                )}
              </button>
            ))}
          </div>

          <div className="model-selector-footer">
            <p>
              <i className="fas fa-info-circle"></i>
              Model capabilities vary by plan
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
