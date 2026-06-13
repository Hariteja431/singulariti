"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Trash2, ArrowDown } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ToolLayout } from '../ToolLayout';
import { ToolRegistryItem } from '../../../registry/types';

interface Props {
  tool: ToolRegistryItem;
}

// Zalgo characters by direction
const zalgoUp = [
  '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357',
  '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c',
  '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313',
  '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369',
  '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b', '\u0346', '\u031a'
];
const zalgoDown = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324',
  '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330',
  '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348',
  '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'
];
const zalgoMid = [
  '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334',
  '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338',
  '\u0337', '\u0361', '\u0489'
];

export function ZalgoTextGenerator({ tool }: Props) {
  const [inputText, setInputText] = useState("Glitch Text Generator");
  const [outputText, setOutputText] = useState("");
  
  // Settings
  const [level, setLevel] = useState(3); // 1 to 10
  const [directionUp, setDirectionUp] = useState(true);
  const [directionMid, setDirectionMid] = useState(true);
  const [directionDown, setDirectionDown] = useState(true);

  const generateZalgo = () => {
    let result = '';
    
    // Convert string to array of characters (handling surrogate pairs properly)
    const chars = Array.from(inputText);
    
    for (const char of chars) {
      if (char === '\n') {
        result += char;
        continue;
      }
      
      result += char;
      
      // Calculate how many marks to add based on level
      // Level 1 = ~1 mark, Level 10 = ~15 marks
      const numMarks = Math.floor(Math.random() * (level * 2)) + 1;
      
      for (let i = 0; i < numMarks; i++) {
        const dirChoices = [];
        if (directionUp) dirChoices.push(zalgoUp);
        if (directionMid) dirChoices.push(zalgoMid);
        if (directionDown) dirChoices.push(zalgoDown);
        
        if (dirChoices.length === 0) break; // If no directions chosen
        
        // Pick random direction list
        const chosenList = dirChoices[Math.floor(Math.random() * dirChoices.length)];
        // Pick random character from list
        const mark = chosenList[Math.floor(Math.random() * chosenList.length)];
        
        result += mark;
      }
    }
    
    setOutputText(result);
  };

  // Re-generate when inputs change
  useEffect(() => {
    if (directionUp || directionMid || directionDown) {
      generateZalgo();
    } else {
      setOutputText(inputText); // If all disabled, just return normal text
    }
  }, [inputText, level, directionUp, directionMid, directionDown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearText = () => {
    setInputText("");
  };

  return (
    <ToolLayout title={tool.name} description={tool.description} categoryName="Text Tools" categoryHref="/tools/text">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink">Normal Text</h3>
              <Button variant="ghost" size="sm" onClick={clearText} className="text-slate hover:text-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your normal text here..."
              className="w-full min-h-[200px] p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-sans text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
            
            {/* Settings */}
            <div className="pt-4 border-t border-border space-y-6">
              <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Distortion Settings</h4>
              
              {/* Intensity Slider */}
              <div className="space-y-3 flex flex-col justify-center">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Crazy Level: {level}/10</label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Direction Toggles */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Glitch Directions</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={directionUp} onChange={(e) => setDirectionUp(e.target.checked)} className="rounded text-primary focus:ring-primary accent-primary w-4 h-4" />
                    <span className="text-sm text-slate">Up</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={directionMid} onChange={(e) => setDirectionMid(e.target.checked)} className="rounded text-primary focus:ring-primary accent-primary w-4 h-4" />
                    <span className="text-sm text-slate">Middle</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={directionDown} onChange={(e) => setDirectionDown(e.target.checked)} className="rounded text-primary focus:ring-primary accent-primary w-4 h-4" />
                    <span className="text-sm text-slate">Down</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> 
                Zalgo Text
              </h3>
              <Button size="sm" onClick={handleCopy} className="rounded-full shadow-sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </Button>
            </div>
            <div className="w-full min-h-[400px] p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-ink font-sans text-xl break-all overflow-y-auto relative z-10 shadow-inner overflow-x-hidden">
              {outputText || <span className="text-slate-400 italic font-normal text-base">Zalgo text will appear here...</span>}
            </div>
          </div>
          
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-20 max-w-4xl mx-auto prose prose-slate dark:prose-invert">
        <h2>What is Zalgo Text?</h2>
        <p>
          Zalgo text, also known as glitch text, cursed text, or creepy text, is regular text that has been heavily modified with Unicode combining diacritical marks. 
          These marks are originally meant to add accents to letters in various languages, but when stacked together excessively, they spill above and below the line, creating a chaotic, corrupted appearance.
        </p>
        
        <h3>How to use the Zalgo Glitch Text Generator</h3>
        <p>
          Our generator is incredibly simple to use and works entirely in your browser without refreshing the page:
        </p>
        <ol>
          <li><strong>Type or paste</strong> your normal text into the input box on the left.</li>
          <li>The tool will <strong>instantly generate</strong> the zalgo text in the right box.</li>
          <li>Adjust the <strong>Crazy Level</strong> slider to control how distorted and glitched the text appears.</li>
          <li>Check or uncheck the <strong>Direction</strong> boxes to decide if the glitch effects should go up, down, or stay in the middle.</li>
          <li>Click the <strong>Copy Text</strong> button to copy it to your clipboard for use on social media!</li>
        </ol>

        <h3>Where can I use Zalgo Text?</h3>
        <p>
          Zalgo text is widely supported across the internet because it uses standard Unicode characters. You can paste it almost anywhere:
        </p>
        <ul>
          <li><strong>Social Media:</strong> Twitter/X, Instagram bios, Facebook posts, TikTok comments.</li>
          <li><strong>Messaging Apps:</strong> WhatsApp, Discord, Telegram, iMessage.</li>
          <li><strong>Gaming:</strong> In-game chat, Steam profiles, usernames (where supported).</li>
          <li><strong>Memes & Creepypasta:</strong> Enhancing the "cursed" aesthetic of horror stories and surreal memes.</li>
        </ul>

        <h3>Frequently Asked Questions</h3>
        <details className="mb-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Is Zalgo text a virus or hack?</summary>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            No! Zalgo text is completely safe. It is just standard text with a lot of accent marks stacked on top of each other. It cannot harm your computer or device. However, excessive zalgo text can sometimes cause slight lag on older devices due to rendering complexity.
          </div>
        </details>
        <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Why does it look like square boxes on some devices?</summary>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            If a device or application lacks a font that supports the specific Unicode combining marks used in Zalgo text, it will display the missing characters as empty square boxes. This is relatively rare on modern smartphones and computers.
          </div>
        </details>
      </div>
    </ToolLayout>
  );
}
