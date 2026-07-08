import React from 'react';
import { ToolRegistryItem } from '@/registry/types';

interface DynamicToolArticleProps {
  tool: ToolRegistryItem;
}

export function DynamicToolArticle({ tool }: DynamicToolArticleProps) {
  const lowerName = tool.name.toLowerCase();
  
  const renderCompressionText = () => (
    <>
      <p className="mb-6">
        When you need to reduce the file size of your assets without sacrificing visual quality, the <strong>{tool.name}</strong> provides an efficient, browser-based solution. 
        Designed to {tool.description.toLowerCase().replace(/\.$/, '')}, this utility ensures that your digital assets are optimized for faster web loading and easier sharing.
      </p>
      <h3 className="text-xl font-bold font-display text-ink mb-3">How Local Compression Works</h3>
      <p className="mb-6">
        Unlike remote cloud services that require you to upload your files, this compression engine runs locally on your device. 
        By utilizing advanced algorithms directly within your web browser, it shrinks the file footprint instantly while guaranteeing that your original data remains completely private and secure.
      </p>
    </>
  );

  const renderConversionText = () => (
    <>
      <p className="mb-6">
        Format compatibility issues can slow down your workflow. The <strong>{tool.name}</strong> is built to seamlessly {tool.description.toLowerCase().replace(/\.$/, '')}.
        Whether you are preparing assets for web deployment or ensuring compatibility across different software platforms, this tool provides a rapid and precise conversion process.
      </p>
      <h3 className="text-xl font-bold font-display text-ink mb-3">Secure Format Translation</h3>
      <p className="mb-6">
        Because the conversion process occurs entirely on the client side, your files are never transmitted to external servers. 
        This zero-upload approach not only protects your sensitive information but also bypasses the file size limits typically imposed by cloud-based conversion tools.
      </p>
    </>
  );

  const renderDeveloperText = () => (
    <>
      <p className="mb-6">
        The <strong>{tool.name}</strong> is a dedicated utility crafted to {tool.description.toLowerCase().replace(/\.$/, '')}. 
        Engineered specifically for developers and technical professionals, it streamlines tedious data formatting, encoding, and validation tasks directly within your active workflow.
      </p>
      <h3 className="text-xl font-bold font-display text-ink mb-3">Client-Side Execution</h3>
      <p className="mb-6">
        Handling sensitive code snippets, tokens, or production data requires absolute security. 
        This tool processes all inputs natively within your browser environment, ensuring that your proprietary data or configuration strings are never exposed to third-party endpoints.
      </p>
    </>
  );
  
  const renderTextToolText = () => (
    <>
      <p className="mb-6">
        Optimizing and formatting written content is seamless with the <strong>{tool.name}</strong>. 
        Our platform allows you to {tool.description.toLowerCase().replace(/\.$/, '')}, making it an invaluable resource for writers, editors, and digital marketers seeking to improve their content workflow.
      </p>
      <h3 className="text-xl font-bold font-display text-ink mb-3">Instant Text Processing</h3>
      <p className="mb-6">
        Text manipulation should be instantaneous. By performing all calculations and formatting rules locally, this utility delivers real-time results without the latency or privacy concerns associated with server-side text processors.
      </p>
    </>
  );

  const renderCalculatorText = () => (
    <>
      <p className="mb-6">
        The <strong>{tool.name}</strong> is an interactive computational tool designed to {tool.description.toLowerCase().replace(/\.$/, '')}. 
        Whether you are managing personal finances, solving complex mathematical equations, or calculating critical metrics, this utility provides immediate and accurate results.
      </p>
      <h3 className="text-xl font-bold font-display text-ink mb-3">Private and Accurate Calculations</h3>
      <p className="mb-6">
        Financial and personal data should remain private. All formulas and computations are executed natively in your browser's memory. No input data is tracked, stored, or transmitted, providing you with a highly secure calculation environment.
      </p>
    </>
  );

  const renderEditingText = () => (
    <>
      <p className="mb-6">
        The <strong>{tool.name}</strong> empowers you to visually {tool.description.toLowerCase().replace(/\.$/, '')}. 
        It brings complex editing capabilities directly into your browser, providing a highly responsive canvas without the need for expensive desktop software installations.
      </p>
      <h3 className="text-xl font-bold font-display text-ink mb-3">Browser-Based Canvas Rendering</h3>
      <p className="mb-6">
        All graphical edits and visual adjustments are rendered in real-time utilizing HTML5 Canvas and WebGL. This means your high-resolution assets are processed securely on your machine, eliminating slow cloud syncs and preserving your digital privacy.
      </p>
    </>
  );

  const renderDefaultText = () => (
    <>
      <p className="mb-6">
        Welcome to the <strong>{tool.name}</strong>. This utility is specifically designed to {tool.description.toLowerCase().replace(/\.$/, '')}. 
        It offers a streamlined, intuitive interface to help you achieve your goals quickly and efficiently without unnecessary complications.
      </p>
      <h3 className="text-xl font-bold font-display text-ink mb-3">Privacy First</h3>
      <p className="mb-6">
        Singulariti prioritizes your privacy above all else. This tool operates entirely within the confines of your web browser, ensuring that your files, inputs, and generated outputs remain strictly on your local device.
      </p>
    </>
  );

  const getDynamicContent = () => {
    switch (tool.engine) {
      case 'compression': return renderCompressionText();
      case 'conversion': return renderConversionText();
      case 'developer': return renderDeveloperText();
      case 'text-tool': return renderTextToolText();
      case 'editing': 
      case 'single-editing': return renderEditingText();
      case 'unit-converter':
      case 'utility': return renderCalculatorText();
      default:
        if (lowerName.includes('calculator') || lowerName.includes('converter')) return renderCalculatorText();
        if (lowerName.includes('text') || lowerName.includes('counter')) return renderTextToolText();
        if (lowerName.includes('edit') || lowerName.includes('crop') || lowerName.includes('rotate')) return renderEditingText();
        return renderDefaultText();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 mb-12 px-4">
      <div className="bg-surface/50 border border-border/60 rounded-2xl p-6 md:p-8">
        <article className="prose prose-slate dark:prose-invert max-w-none text-slate prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-strong:text-ink prose-p:font-sans prose-p:leading-relaxed">
          <h2 className="text-2xl font-bold font-display text-ink mb-4">About the {tool.name}</h2>
          {getDynamicContent()}
          <h3 className="text-xl font-bold font-display text-ink mb-3">Key Benefits</h3>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2"><strong>Zero Uploads:</strong> No arbitrary file size limits or wait times.</li>
            <li className="mb-2"><strong>Unmatched Privacy:</strong> Data never leaves your personal device.</li>
            <li className="mb-2"><strong>Always Free:</strong> Unrestricted access with no subscription required.</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
