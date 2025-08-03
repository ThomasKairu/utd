'use client';

import Button from '@/components/common/Button';

interface LoadMoreButtonProps {
  categoryName: string;
}

export default function LoadMoreButton({ categoryName }: LoadMoreButtonProps) {
  const handleLoadMore = () => {
    console.log('Load more clicked');
    // TODO: Implement load more functionality
  };

  return (
    <Button 
      variant="primary" 
      size="lg"
      onClick={handleLoadMore}
    >
      Load More {categoryName} Articles
    </Button>
  );
}