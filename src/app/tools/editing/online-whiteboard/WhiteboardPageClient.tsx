"use client";

import React, { useState } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import WhiteboardClientWrapper from '@/components/tools/whiteboard/WhiteboardClientWrapper';

export function WhiteboardPageClient() {
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  return (
    <ToolLayout
      howToUse={[
        "Select a drawing tool (brush, shape, text, or sticky note) from the toolbar.",
        "Adjust properties like color, stroke width, and opacity using the sidebar.",
        "Click and drag on the canvas to start drawing or placing elements.",
        "Use the Export panel to save your board as PNG, SVG, or PDF."
      ]}
      faqs={[
        { question: "Is my whiteboard data saved?", answer: "Yes, you can save your board to your local browser storage and reload it later. Clearing your browser data will erase it." },
        { question: "Can I collaborate live with others?", answer: "Currently, this is a local offline-first whiteboard. Live collaboration is not supported to ensure total privacy." }
      ]}
      title="Online Whiteboard"
      description="Draw, write, sketch, add shapes, and export your whiteboard directly in your browser."
      categoryName="Image Editing Tools"
      categoryHref="/editing"
      error={error}
      warning={warning}
      onClearError={() => setError(null)}
    >
      <WhiteboardClientWrapper externalError={error} setExternalError={setError} externalWarning={warning} />
    </ToolLayout>
  );
}
