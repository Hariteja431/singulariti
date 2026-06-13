"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Copy, RefreshCw, AlertCircle, VolumeX } from 'lucide-react';
import { Button } from '../../ui/Button';

import { ToolRegistryItem } from '../../../registry/types';

interface Props {
  tool: ToolRegistryItem;
}

export function SpeechToText({ tool }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("en-US");
  const [isSupported, setIsSupported] = useState(true);

  // Use any to bypass TS complaining about vendor prefixes
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      let finalStr = "";
      let interimStr = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalStr += transcriptSegment + " ";
        } else {
          interimStr += transcriptSegment;
        }
      }

      if (finalStr) {
        setTranscript(prev => prev + finalStr);
      }
      setInterimTranscript(interimStr);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        setError("Microphone access was denied. Please allow microphone access in your browser settings.");
        setIsRecording(false);
      } else if (event.error === 'network') {
        setError("Network error occurred. Some browsers require internet access for speech recognition.");
        setIsRecording(false);
      } else {
        // Ignore 'no-speech' which is just a timeout
        if (event.error !== 'no-speech') {
          setError(`Speech recognition error: ${event.error}`);
        }
      }
    };

    recognition.onend = () => {
      // If we are supposed to be recording but it ended (e.g., due to silence timeout in some browsers), restart it
      if (isRecording) {
        try {
          recognition.start();
        } catch (e) {
          setIsRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  // Update language when changed
  useEffect(() => {
    if (recognitionRef.current) {
      const wasRecording = isRecording;
      if (wasRecording) {
        recognitionRef.current.stop();
      }
      recognitionRef.current.lang = language;
      if (wasRecording) {
        setTimeout(() => {
          try { recognitionRef.current.start(); } catch(e){}
        }, 100);
      }
    }
  }, [language, isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    setError(null);

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript("");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start", e);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript + interimTranscript);
    // Could add a toast here
  };

  const handleClear = () => {
    setTranscript("");
    setInterimTranscript("");
  };

  if (!isSupported) {
    return (
      <div className="w-full">
        <div className="bg-surface border border-border rounded-2xl p-8 max-w-2xl mx-auto text-center my-12">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <VolumeX className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-4">Browser Not Supported</h2>
          <p className="text-slate mb-6">
            Your browser does not support the Web Speech API required for dictation. Please try using Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto space-y-6 flex flex-col items-center">
        
        {/* Error Alert */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Toolbar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-9 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-primary"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="hi-IN">Hindi</option>
              <option value="ja-JP">Japanese</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!transcript && !interimTranscript}>
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} disabled={!transcript && !interimTranscript}>
              <RefreshCw className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        </div>

        {/* Text Area Display */}
        <div className="w-full min-h-[300px] p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-sans text-slate-800 dark:text-slate-200 text-lg leading-relaxed shadow-inner overflow-y-auto">
          {transcript === "" && interimTranscript === "" && !isRecording && (
            <span className="text-slate-400 italic">Click the microphone to start dictating...</span>
          )}
          {transcript}
          <span className="text-primary italic">{interimTranscript}</span>
          {isRecording && <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1 align-middle" />}
        </div>

        {/* Record Button */}
        <div className="pt-4">
          {!isRecording ? (
            <Button size="lg" onClick={toggleRecording} className="rounded-full px-8 h-14 text-lg shadow-md group">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5 text-white" />
              </div>
              Start Dictation
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={toggleRecording} className="rounded-full px-8 h-14 bg-red-500 hover:bg-red-600 border-none text-white shadow-lg text-lg animate-pulse">
              <Square className="w-5 h-5 mr-3 fill-current" />
              Stop Dictation
            </Button>
          )}
        </div>
        
        <p className="text-xs text-slate mt-2 max-w-md text-center">
          For the best results, speak clearly into your microphone in a quiet environment.
        </p>
      </div>

      {/* SEO Content Section */}
      <div className="mt-20 max-w-4xl mx-auto prose prose-slate dark:prose-invert">
        <h2>Free Online Speech to Text & Dictation</h2>
        <p>
          Convert your spoken words into written text instantly with our free online Voice Typing and Dictation tool. 
          Perfect for writing emails, drafting essays, taking quick notes, or simply saving time by speaking instead of typing.
        </p>
        
        <h3>How It Works</h3>
        <p>
          Our Dictation tool uses your browser's built-in <strong>Web Speech API</strong> to analyze audio from your microphone and transcribe it in real-time. 
        </p>
        <ul>
          <li><strong>Real-time Transcription:</strong> See your words appear on the screen as you speak. The tool continually refines the text contextually.</li>
          <li><strong>Continuous Listening:</strong> Unlike standard voice searches, this tool will keep listening and transcribing even if you pause to think.</li>
          <li><strong>Multi-Language:</strong> Dictate in English, Spanish, French, Hindi, Japanese, and more.</li>
        </ul>

        <h3>Best Practices for Voice Typing</h3>
        <ul>
          <li><strong>Speak Clearly:</strong> Enunciate your words. The AI is smart, but mumbling can decrease accuracy.</li>
          <li><strong>Minimize Background Noise:</strong> Dictate in a quiet room. Fans, music, or other people talking can confuse the microphone.</li>
          <li><strong>Punctuation (Depending on browser):</strong> In some browsers (like Chrome), you can speak punctuation marks like <em>"comma"</em>, <em>"period"</em>, or <em>"new line"</em>.</li>
        </ul>

        <h3>Frequently Asked Questions</h3>
        <details className="mb-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Is my voice data kept private?</summary>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Depending on your browser, the speech recognition may be processed locally on your device or sent to the browser manufacturer's servers (e.g., Google for Chrome, Apple for Safari) for transcription. Singulariti itself does not store or keep any of your voice data or transcripts.
          </div>
        </details>
        <details className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <summary className="font-semibold cursor-pointer text-slate-800 dark:text-slate-200">Why isn't the microphone working?</summary>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Please ensure that your browser has permission to access your microphone. Look for a small camera or microphone icon in your browser's address bar to check permissions. Also, ensure your system's microphone is not muted.
          </div>
        </details>
      </div>
    </div>
  );
}
