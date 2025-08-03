import React from 'react';
import AdPlaceholder from './AdPlaceholder';

interface InArticleAdProps {
  className?: string;
}

const InArticleAd: React.FC<InArticleAdProps> = ({ className = '' }) => {
  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <AdPlaceholder width={300} height={250} label="In-Article Ad" />
    </div>
  );
};

export default InArticleAd;
