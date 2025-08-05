import React from 'react';

interface AdPlaceholderProps {
  width: number;
  height: number;
  className?: string;
  label?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  width,
  height,
  className = '',
  label = 'Advertisement',
}) => {
  return (
    <div
      className={`bg-medium-gray border border-dashed border-dark-gray flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <span className="text-text-secondary text-sm">{label}</span>
    </div>
  );
};

export default AdPlaceholder;
