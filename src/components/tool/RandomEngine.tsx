"use client";

import React from 'react';
import { ToolRegistryItem } from '../../registry/types';
import { WheelSpinner } from '../tools/random/WheelSpinner';
import { RandomNumber } from '../tools/random/RandomNumber';
import { DiceRoller } from '../tools/random/DiceRoller';
import { CoinFlipper } from '../tools/random/CoinFlipper';

interface RandomEngineProps {
  tool: ToolRegistryItem;
}

export function RandomEngine({ tool }: RandomEngineProps) {
  switch (tool.id) {
    case 'wheel-spinner':
      return <WheelSpinner tool={tool} />;
    case 'random-number':
      return <RandomNumber tool={tool} />;
    case 'dice-roller':
      return <DiceRoller tool={tool} />;
    case 'coin-flipper':
      return <CoinFlipper tool={tool} />;
    default:
      return (
        <div className="p-8 text-center bg-surface border border-border rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Tool Not Found</h2>
          <p className="text-slate">The requested random tool could not be loaded.</p>
        </div>
      );
  }
}
