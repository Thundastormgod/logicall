
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  change 
}) => {
  const colorClasses = {
    primary: 'bg-inventory-primary text-white',
    secondary: 'bg-inventory-secondary text-inventory-primary',
    success: 'bg-inventory-success text-white',
    warning: 'bg-inventory-warning text-white',
    danger: 'bg-inventory-danger text-white',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`px-4 py-3 ${colorClasses[color]} flex justify-between items-center`}>
        <h3 className="font-medium text-lg">{title}</h3>
        {icon && <span>{icon}</span>}
      </div>
      <div className="p-4">
        <div className="text-3xl font-bold">{value}</div>
        
        {change && (
          <div className="mt-2 flex items-center">
            <span className={`text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change.isPositive ? '+' : ''}{change.value}%
            </span>
            <span className="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
