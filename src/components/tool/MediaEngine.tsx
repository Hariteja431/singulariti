"use client";

import React from 'react';
import { ToolRegistryItem } from '../../registry/types';
import { VoiceRecorder } from '../tools/media/VoiceRecorder';
import { ScreenRecorder } from '../tools/media/ScreenRecorder';
import { WebcamRecorder } from '../tools/media/WebcamRecorder';
import { AudioTrimmer } from '../tools/media/AudioTrimmer';
import { TextToSpeech } from '../tools/media/TextToSpeech';
import { SpeechToText } from '../tools/media/SpeechToText';

interface MediaEngineProps {
  tool: ToolRegistryItem;
}

export function MediaEngine({ tool }: MediaEngineProps) {
  switch (tool.id) {
    case 'online-voice-recorder':
      return <VoiceRecorder tool={tool} />;
    case 'screen-recorder':
      return <ScreenRecorder tool={tool} />;
    case 'webcam-recorder':
      return <WebcamRecorder tool={tool} />;
    case 'audio-trimmer':
      return <AudioTrimmer tool={tool} />;
    case 'text-to-speech':
      return <TextToSpeech tool={tool} />;
    case 'speech-to-text':
      return <SpeechToText tool={tool} />;
    default:
      return (
        <div className="p-8 text-center bg-surface border border-border rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Tool Not Found</h2>
          <p className="text-slate">The requested media tool could not be loaded.</p>
        </div>
      );
  }
}
