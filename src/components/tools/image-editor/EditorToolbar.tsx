import React from 'react';
import { Undo, Redo, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';

interface EditorToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onClear: () => void;
}

export function EditorToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onClear
}: EditorToolbarProps) {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-4 p-4 bg-surface border border-border rounded-xl shadow-xs">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canUndo}
          onClick={onUndo}
          leftIcon={<Undo className="w-3.5 h-3.5" />}
        >
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canRedo}
          onClick={onRedo}
          leftIcon={<Redo className="w-3.5 h-3.5" />}
        >
          Redo
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Reset to Original
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Clear Image
        </Button>
      </div>
    </div>
  );
}
