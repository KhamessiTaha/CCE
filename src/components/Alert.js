import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const Alert = ({ title, description, variant = 'default', onClose }) => {
  const variants = {
    default: 'bg-blue-50 text-blue-800 border-blue-200',
    destructive: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    success: 'bg-green-50 text-green-800 border-green-200',
  };

  return (
    <div className={`rounded-lg border p-4 ${variants[variant]}`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <h3 className="font-medium mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;