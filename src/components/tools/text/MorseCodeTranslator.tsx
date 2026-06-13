"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, Copy, Trash2, Play, Square, AlertCircle, Volume2, Type } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ToolLayout } from '../ToolLayout';
import { ToolRegistryItem } from '../../../registry/types';

interface Props {
  tool: ToolRegistryItem;
}

const MORSE_DICT: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/'
};

const REVERSE_MORSE_DICT = Object.fromEntries(
  Object.entries(MORSE_DICT).map(([k, v]) => [v, k])
);

export function MorseCodeTranslator({ tool }: Props) {
  const [inputText, setInputText] = useState("HELLO WORLD");
  const [outputText, setOutputText] = useState("");
  const [isTextToMorse, setIsTextToMorse] = useState(true);
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);

  // Speed settings (WPM - Words per minute)
  const [wpm, setWpm] = useState(20);

  const translate = () => {
    if (isTextToMorse) {
      // Text to Morse
      const upperText = inputText.toUpperCase();
      let morse = "";
      for (const char of upperText) {
        if (MORSE_DICT[char]) {
          morse += MORSE_DICT[char] + " ";
        } else if (char === '\n') {
          morse += "\n";
        }
      }
      setOutputText(morse.trim());
    } else {
      // Morse to Text
      const words = inputText.trim().split(/\s+/);
      let text = "";
      for (const word of words) {
        if (word === '/') {
          text += " ";
        } else if (REVERSE_MORSE_DICT[word]) {
          text += REVERSE_MORSE_DICT[word];
        } else if (word === '\n') {
          text += "\n";
        }
      }
      setOutputText(text);
    }
  };

  useEffect(() => {
    translate();
  }, [inputText, isTextToMorse]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => stopAudio();
  }, []);

  const handleSwap = () => {
    setIsTextToMorse(!isTextToMorse);
    setInputText(outputText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const clearText = () => {
    setInputText("");
    stopAudio();
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch(e){}
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
    setIsPlaying(false);
  };

  const playMorse = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    const morseString = isTextToMorse ? outputText : inputText;
    if (!morseString.trim()) return;

    setIsPlaying(true);

    // Standard Morse code timing formula based on WPM
    // dot length = 1200 / WPM (in milliseconds)
    const dotDuration = 1200 / wpm;
    const dashDuration = dotDuration * 3;
    const symbolGap = dotDuration; // space between symbols in same letter
    const letterGap = dotDuration * 3; // space between letters
    const wordGap = dotDuration * 7; // space between words

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0; // Start silent

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 600; // 600Hz tone
    osc.connect(gainNode);
    osc.start();
    oscillatorRef.current = osc;

    let currentTime = 0;

    const scheduleTone = (duration: number) => {
      timeoutIdsRef.current.push(setTimeout(() => {
        gainNode.gain.setTargetAtTime(1, ctx.currentTime, 0.01);
      }, currentTime));
      
      currentTime += duration;
      
      timeoutIdsRef.current.push(setTimeout(() => {
        gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
      }, currentTime));
    };

    const scheduleSilence = (duration: number) => {
      currentTime += duration;
    };

    // Parse the morse string and schedule audio
    for (let i = 0; i < morseString.length; i++) {
      const char = morseString[i];
      if (char === '.') {
        scheduleTone(dotDuration);
        scheduleSilence(symbolGap);
      } else if (char === '-') {
        scheduleTone(dashDuration);
        scheduleSilence(symbolGap);
      } else if (char === ' ') {
        // Space between letters
        scheduleSilence(letterGap - symbolGap);
      } else if (char === '/') {
        // Space between words
        scheduleSilence(wordGap - symbolGap);
      } else if (char === '\n') {
        scheduleSilence(wordGap);
      }
    }

    // Stop when done
    timeoutIdsRef.current.push(setTimeout(() => {
      stopAudio();
    }, currentTime + 100));
  };

  return (
    <ToolLayout title={tool.name} description={tool.description} categoryName="Text Tools" categoryHref="/tools/text">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 font-medium text-ink">
            <span className={isTextToMorse ? "text-primary font-bold" : "text-slate"}>Text</span>
            <Button variant="ghost" onClick={handleSwap} className="mx-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 p-2">
              <ArrowRightLeft className="w-5 h-5" />
            </Button>
            <span className={!isTextToMorse ? "text-primary font-bold" : "text-slate"}>Morse Code</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Speed (WPM):</label>
              <input 
                type="number" 
                value={wpm} 
                onChange={(e) => setWpm(Math.max(5, Math.min(60, Number(e.target.value))))}
                className="w-16 h-9 px-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-primary text-center"
              />
            </div>
            <Button 
              size="sm" 
              onClick={playMorse} 
              className={`rounded-full shadow-sm ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
            >
              {isPlaying ? <Square className="w-4 h-4 mr-2 fill-current" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? "Stop Audio" : "Play Audio"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                {isTextToMorse ? <Type className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
                {isTextToMorse ? "Input Text" : "Input Morse Code"}
              </h3>
              <Button variant="ghost" size="sm" onClick={clearText} className="text-slate hover:text-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isTextToMorse ? "Type your text here..." : "Type morse code (. - /) here..."}
              className="w-full min-h-[300px] p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-sans text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
          </div>

          {/* Output Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                {!isTextToMorse ? <Type className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
                {!isTextToMorse ? "Translated Text" : "Translated Morse Code"}
              </h3>
              <Button size="sm" onClick={handleCopy} className="rounded-full shadow-sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="w-full min-h-[300px] p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-ink font-sans text-lg break-all overflow-y-auto whitespace-pre-wrap shadow-inner">
              {outputText || <span className="text-slate-400 italic font-normal text-base">Translation will appear here...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-20 max-w-4xl mx-auto prose prose-slate dark:prose-invert">
        <h2>Free Online Morse Code Translator & Audio Player</h2>
        <p>
          Easily translate standard English text to Morse code, or decipher Morse code back into readable text. 
          Our tool features an interactive audio player that translates your Morse code into audible beeps, making it perfect for learning, signaling, or puzzle solving.
        </p>
        
        <h3>How to use the Translator</h3>
        <ul>
          <li><strong>Text to Morse:</strong> Select "Text → Morse Code" mode. Type regular letters and numbers. The tool will output the dots (.) and dashes (-) along with slashes (/) to denote spaces between words.</li>
          <li><strong>Morse to Text:</strong> Select "Morse Code → Text" mode. Paste your Morse code using dots, dashes, and slashes. It will instantly translate it back into English.</li>
          <li><strong>Audio Playback:</strong> Once translated, click the <strong>Play Audio</strong> button to hear the sequence. You can adjust the playback speed in Words Per Minute (WPM) to suit your listening abilities.</li>
        </ul>

        <h3>Understanding Morse Code Formatting</h3>
        <p>
          International Morse Code uses specific timing and spacing rules to differentiate between letters and words:
        </p>
        <ul>
          <li>A dot (<code>.</code>) is the basic unit of time (1 unit).</li>
          <li>A dash (<code>-</code>) is equal to 3 dots (3 units).</li>
          <li>The space between parts of the same letter is 1 unit.</li>
          <li>The space between different letters is 3 units (usually represented by a single space in text).</li>
          <li>The space between different words is 7 units (represented by a slash <code>/</code> in our translator).</li>
        </ul>

        <h3>What is Morse Code Used For?</h3>
        <p>
          Originally invented by Samuel Morse in the 1830s for the telegraph, Morse Code is still widely used today by amateur radio operators (hams), in aviation navigation beacons, and by the military for emergency signaling. The famous <code>... --- ...</code> (SOS) distress signal is universally recognized around the world.
        </p>

        <h3>Frequently Asked Questions</h3>
        <details className="mb-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">What does WPM stand for?</summary>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            WPM stands for Words Per Minute. It dictates how fast the audio beeps will play. A speed of 20 WPM is standard for experienced operators, while 5-10 WPM is great for beginners learning the code.
          </div>
        </details>
        <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Are special characters supported?</summary>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Yes! Our translator supports all standard alphabet letters (A-Z), numbers (0-9), and common punctuation marks like periods, commas, question marks, and exclamation points as defined by the International Morse Code standard.
          </div>
        </details>
      </div>
    </ToolLayout>
  );
}
