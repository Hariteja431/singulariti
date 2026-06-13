"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Pause, Volume2, Type } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ToolRegistryItem } from '../../../registry/types';

interface Props {
  tool: ToolRegistryItem;
}

export function TextToSpeech({ tool }: Props) {
  const [text, setText] = useState("Hello! I am a free, browser-based text to speech engine. Type or paste your text here and press play to hear me read it out loud.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        if (!selectedVoice) {
          // Default to a sensible English voice if possible
          const defaultVoice = availableVoices.find(v => v.lang.startsWith('en') && v.default) 
            || availableVoices.find(v => v.lang.startsWith('en')) 
            || availableVoices[0];
          setSelectedVoice(defaultVoice.name);
        }
      }
    };
    
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (window.speechSynthesis.paused && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    if (!text.trim()) return;

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };



  return (
    <div className="w-full">
      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto space-y-6">
        
        {/* Main Text Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to read aloud..."
            className="w-full min-h-[200px] p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-sans text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium">
            {text.length} characters
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-primary"
            >
              {voices.length === 0 ? (
                <option value="">Loading voices...</option>
              ) : (
                voices.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Pitch Slider */}
          <div className="space-y-2 flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pitch: {pitch.toFixed(1)}</label>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Speed Slider */}
          <div className="space-y-2 flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Speed: {rate.toFixed(1)}x</label>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

          {/* Play/Stop Controls */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-border">
            {!isPlaying ? (
              <Button size="lg" onClick={handlePlay} className="rounded-full px-8 shadow-md">
                <Play className="w-5 h-5 mr-2" />
                {isPaused ? "Resume" : "Play Text"}
              </Button>
            ) : (
              <Button variant="outline" size="lg" onClick={handlePause} className="rounded-full px-8 shadow-sm bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700">
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button variant="outline" size="lg" onClick={handleStop} disabled={!isPlaying && !isPaused} className="rounded-full px-6 shadow-sm disabled:opacity-50">
              <Square className="w-5 h-5 mr-2 fill-current" />
              Stop
            </Button>
          </div>

        <div className="text-center text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Audio generation runs entirely in your browser using the native Web Speech API. No text is uploaded to any server. Voices vary depending on your browser and operating system.
        </div>
      </div>



      {/* SEO Content Section */}
      <div className="mt-20 max-w-4xl mx-auto prose prose-slate dark:prose-invert">
        <h2>Free Online Text to Speech (TTS) Reader</h2>
        <p>
          Convert any written text into spoken words instantly with our free online Text to Speech (TTS) tool. 
          Whether you need to listen to a long article, proofread your own writing by hearing it out loud, or simply want to give your eyes a rest, our TTS engine runs entirely in your browser without requiring any software downloads or cloud uploads.
        </p>
        
        <h3>How It Works</h3>
        <p>
          Unlike traditional text-to-speech services that send your text to an external server (which raises privacy concerns), Singulariti's TTS reader utilizes the powerful <strong>Web Speech API</strong> built natively into your modern web browser.
        </p>
        <ul>
          <li><strong>Absolute Privacy:</strong> Since the conversion happens locally on your device, your text never leaves your computer.</li>
          <li><strong>Zero Latency:</strong> There is no waiting for an audio file to generate and download. Speech begins instantly.</li>
          <li><strong>Customizable Voices:</strong> Choose from a variety of natural-sounding voices provided by your operating system (Windows, macOS, iOS, Android).</li>
        </ul>

        <h3>Features</h3>
        <ul>
          <li><strong>Adjustable Pitch & Speed:</strong> Fine-tune the voice to your liking. Speed up the audio to consume information faster, or slow it down for better comprehension.</li>
          <li><strong>Multi-Language Support:</strong> Automatically detects and utilizes language packs installed on your system.</li>
          <li><strong>No Character Limits:</strong> Paste entire essays or chapters without hitting annoying paywalls.</li>
        </ul>

        <h3>Frequently Asked Questions</h3>
        <details className="mb-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Why are the voices different on my phone vs my laptop?</summary>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Because this tool uses your device's native text-to-speech engine, the available voices depend on your operating system. Apple devices will show Siri-like voices, while Windows devices will show Microsoft voices.
          </div>
        </details>
        <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Can I download the audio as an MP3?</summary>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Currently, native browser speech synthesis does not support direct audio exporting. If you need to save the audio, you can use our <a href="/media/audio/online-voice-recorder" className="text-primary hover:underline">Online Voice Recorder</a> in tandem to capture your system's audio output.
          </div>
        </details>
      </div>
    </div>
  );
}
