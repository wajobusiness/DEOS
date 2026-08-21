import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  iconBg = 'bg-indigo-50',
  iconColor = 'text-indigo-600',
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>

      {(change || subtitle) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400 font-normal">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
