import React from 'react';
import './DateInput.scss';

interface DateInputProps {
  label: string;
  value?: string | Date;
  onChange: (date: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  disabled = false,
  error,
  className = ""
}) => {
  // Convert value to YYYY-MM-DD format for input
  const formatDateForInput = (date?: string | Date): string => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) return '';
      
      // Format as YYYY-MM-DD for HTML date input
      return dateObj.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`date-input-container ${className}`}>
      <label className="date-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      
      <input
        type="date"
        value={formatDateForInput(value)}
        onChange={handleChange}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        className={`date-input ${error ? 'error' : ''}`}
      />
      
      {error && <div className="date-error">{error}</div>}
    </div>
  );
};

export default DateInput;