import React from 'react';
import type { OptionalFeatureType } from '../types';
import './OptionalFeature.css';

export interface OptionalFeatureProps {
  selectedMode: OptionalFeatureType | null;
  onModeChange: (mode: OptionalFeatureType | null) => void;
  disabled?: boolean;
}

const OptionalFeature: React.FC<OptionalFeatureProps> = ({ 
  selectedMode, 
  onModeChange, 
  disabled = false 
}) => {
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      onModeChange(null);
    } else {
      onModeChange(value as OptionalFeatureType);
    }
  };

  return (
    <div className="optional-feature">
      <label className="feature-toggle">
        <span className="feature-label">Mode:</span>
        <select
          value={selectedMode || ''}
          onChange={handleModeChange}
          disabled={disabled}
          className="feature-select"
          aria-label="Optional feature mode"
        >
          <option value="">Normal</option>
          <option value="explain-simple">Explain Simply</option>
          <option value="summarize">Summarize</option>
        </select>
      </label>
    </div>
  );
};

export default OptionalFeature;
