'use client';

import Button from '@/components/common/Button';

interface SocialShareProps {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs">Share:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
      >
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleFacebookShare}
      >
        Facebook
      </Button>
    </div>
  );
}