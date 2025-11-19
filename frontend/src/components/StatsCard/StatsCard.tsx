// src/components/StatsCard/StatsCard.tsx
import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  type?: 'primary' | 'red-flag' | 'intervention' | 'success' | 'warning';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  trend,
  icon,
  type = 'primary'
}) => {
  const getTrendColor = () => {
    if (!trend) return '#64748b';
    return trend.isPositive ? '#059669' : '#dc2626';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.isPositive ? '↗' : '↘';
  };

  return (
    <div className={`stats-card stats-card-${type}`}>
      <div className="stats-header">
        <div className="stats-info">
          <h3 className="stats-title">{title}</h3>
          <div className="stats-value">{value}</div>
          {trend && (
            <div className="stats-trend" style={{ color: getTrendColor() }}>
              <span className="trend-icon">{getTrendIcon()}</span>
              {trend.value}%
            </div>
          )}
        </div>
        <div className="stats-icon-wrapper">
          {icon}
        </div>
      </div>
      {description && (
        <div className="stats-description">
          {description}
        </div>
      )}
    </div>
  );
};

export default StatsCard;