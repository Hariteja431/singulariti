import React from 'react';
import { Card } from '../ui/Card';

interface ToolCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href: string;
  badge?: {
    text: string;
    variant: 'default' | 'pro' | 'outline';
  };
}

export function ToolCard(props: ToolCardProps) {
  return <Card {...props} />;
}
