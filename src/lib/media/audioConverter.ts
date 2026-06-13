import * as lamejs from '@breezystack/lamejs';

export async function convertAudioToMP3(audioBlob: Blob): Promise<Blob> {
  // Read blob as ArrayBuffer
  const arrayBuffer = await audioBlob.arrayBuffer();

  // Decode audio data using AudioContext
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // lamejs setup
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  
  // Mp3Encoder requires 1 or 2 channels
  const channels = numChannels >= 2 ? 2 : 1;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128); // 128 kbps bitrate

  const mp3Data: Uint8Array[] = [];

  // lamejs requires 16-bit PCM integer arrays
  const float32ToInt16 = (f32Array: Float32Array) => {
    const i16Array = new Int16Array(f32Array.length);
    for (let i = 0; i < f32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, f32Array[i]));
      i16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return i16Array;
  };

  const sampleBlockSize = 1152;
  
  if (channels === 1) {
    const channelData = audioBuffer.getChannelData(0);
    const samples = float32ToInt16(channelData);
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const sampleChunk = samples.subarray(i, i + sampleBlockSize);
      const mp3buf = encoder.encodeBuffer(sampleChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }
  } else {
    // Stereo
    const leftData = audioBuffer.getChannelData(0);
    const rightData = audioBuffer.getChannelData(1);
    const leftSamples = float32ToInt16(leftData);
    const rightSamples = float32ToInt16(rightData);

    for (let i = 0; i < leftSamples.length; i += sampleBlockSize) {
      const leftChunk = leftSamples.subarray(i, i + sampleBlockSize);
      const rightChunk = rightSamples.subarray(i, i + sampleBlockSize);
      const mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }
  }

  const endBuf = encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(endBuf);
  }

  return new Blob(mp3Data as any[], { type: 'audio/mp3' });
}
