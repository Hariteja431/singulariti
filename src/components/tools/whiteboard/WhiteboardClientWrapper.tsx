"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const OnlineWhiteboardClient = dynamic(
  () => import('./OnlineWhiteboardClient'),
  { ssr: false }
);

interface WrapperProps {
  externalError?: string | null;
  setExternalError?: (err: string | null) => void;
  externalWarning?: string | null;
}

export default function WhiteboardClientWrapper({
  externalError,
  setExternalError,
  externalWarning
}: WrapperProps) {
  return (
    <OnlineWhiteboardClient
      externalError={externalError}
      setExternalError={setExternalError}
      externalWarning={externalWarning}
    />
  );
}
