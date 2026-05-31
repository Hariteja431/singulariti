import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface DownloadButtonProps {
  onClick?: () => void;
  href?: string;
  download?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function DownloadButton({
  onClick,
  href,
  download,
  children = 'Download File',
  isLoading = false,
  className = ''
}: DownloadButtonProps) {
  const content = (
    <Button
      variant="primary"
      size="lg"
      isLoading={isLoading}
      leftIcon={<Download className="w-5 h-5" />}
      className={`w-full md:w-auto ${className}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  if (href) {
    return (
      <a href={href} download={download} className="w-full md:w-auto block">
        {content}
      </a>
    );
  }

  return content;
}
