import React from 'react';

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  brand?: string;
}

const AffiliateLink: React.FC<AffiliateLinkProps> = ({
  href,
  children,
  className = '',
  brand = 'Partner',
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-block bg-light-gray hover:bg-medium-gray text-text-primary font-semibold py-2 px-4 rounded-lg transition-colors duration-200 my-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div>
          <span className="text-sm text-accent font-bold">{brand}</span>
          <p className="text-base">{children}</p>
        </div>
        <span className="text-lg">→</span>
      </div>
    </a>
  );
};

export default AffiliateLink;
