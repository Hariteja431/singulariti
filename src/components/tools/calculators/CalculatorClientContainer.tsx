'use client';

import React from 'react';
import { AgeCalculatorView } from './tools/AgeCalculatorView';
import { EmiCalculatorView } from './tools/EmiCalculatorView';
import { SipCalculatorView } from './tools/SipCalculatorView';
import { CompoundInterestCalculatorView } from './tools/CompoundInterestCalculatorView';
import { CagrCalculatorView } from './tools/CagrCalculatorView';
import { FdCalculatorView } from './tools/FdCalculatorView';
import { IncomeTaxCalculatorView } from './tools/IncomeTaxCalculatorView';
import { GstCalculatorView } from './tools/GstCalculatorView';
import { BmiCalculatorView } from './tools/BmiCalculatorView';
import { CalorieCalculatorView } from './tools/CalorieCalculatorView';
import { PercentageCalculatorView } from './tools/PercentageCalculatorView';
import { CgpaCalculatorView } from './tools/CgpaCalculatorView';
import { DateDifferenceCalculatorView } from './tools/DateDifferenceCalculatorView';
import { ScientificCalculatorView } from './tools/ScientificCalculatorView';
import { DiscountCalculatorView } from './tools/DiscountCalculatorView';
import { ProfitCalculatorView } from './tools/ProfitCalculatorView';
import { RoiCalculatorView } from './tools/RoiCalculatorView';
import { CurrencyConverterView } from './tools/CurrencyConverterView';
import { YoutubeEarningsCalculatorView } from './tools/YoutubeEarningsCalculatorView';
import { AdsenseRevenueCalculatorView } from './tools/AdsenseRevenueCalculatorView';
import { MortgageCalculatorView } from './tools/MortgageCalculatorView';

// New calculators
import { BasicCalculatorView } from './tools/BasicCalculatorView';
import { LoanCalculatorView } from './tools/LoanCalculatorView';
import { SimpleInterestCalculatorView } from './tools/SimpleInterestCalculatorView';
import { SalaryCalculatorView } from './tools/SalaryCalculatorView';
import { TipCalculatorView } from './tools/TipCalculatorView';
import { TimeDurationCalculatorView } from './tools/TimeDurationCalculatorView';

import { CalculatorArticleContext } from './CalculatorContext';

interface CalculatorClientContainerProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
  article?: string;
}

export function CalculatorClientContainer({
  toolId,
  toolName,
  toolDescription,
  article
}: CalculatorClientContainerProps) {
  const view = (() => {
    switch (toolId) {
    case 'age-calculator':
      return <AgeCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'emi-calculator':
      return <EmiCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'sip-calculator':
      return <SipCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'compound-interest-calculator':
      return <CompoundInterestCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'cagr-calculator':
      return <CagrCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'fd-calculator':
      return <FdCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'income-tax-calculator':
      return <IncomeTaxCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'gst-calculator':
      return <GstCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'bmi-calculator':
      return <BmiCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'calorie-calculator':
      return <CalorieCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'percentage-calculator':
      return <PercentageCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'cgpa-calculator':
      return <CgpaCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'date-difference-calculator':
      return <DateDifferenceCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'scientific-calculator':
      return <ScientificCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'discount-calculator':
      return <DiscountCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'profit-calculator':
      return <ProfitCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'roi-calculator':
      return <RoiCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'currency-converter':
      return <CurrencyConverterView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'youtube-earnings-calculator':
      return <YoutubeEarningsCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'adsense-revenue-calculator':
      return <AdsenseRevenueCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'mortgage-calculator':
      return <MortgageCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    
    // New calculators
    case 'basic-calculator':
      return <BasicCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'loan-calculator':
      return <LoanCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'simple-interest-calculator':
      return <SimpleInterestCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'salary-calculator':
      return <SalaryCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'tip-calculator':
      return <TipCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;
    case 'time-duration-calculator':
      return <TimeDurationCalculatorView toolId={toolId} title={toolName} description={toolDescription} article={article} />;

    default:
      return (
        <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20 font-sans">
          Calculator with ID "{toolId}" was not found or is not yet implemented.
        </div>
      );
    }
  })();

  return (
    <CalculatorArticleContext.Provider value={article}>
      {view}
    </CalculatorArticleContext.Provider>
  );
}
