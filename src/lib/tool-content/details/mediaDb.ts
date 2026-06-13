export const mediaDb: Record<string, { whyNeed: string; howWorks: string; whenToUse: string }> = {
  'online-voice-recorder': {
    whyNeed: 'A browser-based voice recorder is perfect for capturing quick audio notes, podcast segments, or dictation without needing to install dedicated audio software.',
    howWorks: 'It requests secure access to your microphone and streams the audio data directly into your browser memory, converting it into a downloadable MP3 or WebM file.',
    whenToUse: 'Ideal for journalists recording interviews, students saving lecture notes, or content creators needing a quick voiceover.'
  },
  'audio-trimmer': {
    whyNeed: 'Audio trimming helps you remove dead air, unwanted intros, or specific segments from an audio file without opening heavy editing suites.',
    howWorks: 'Your browser loads the audio file entirely in-memory, visualizes the waveform, and mathematically slices the precise time codes you select before exporting the new file.',
    whenToUse: 'Use this to create ringtones, cut out mistakes from a podcast, or isolate a sound bite for social media.'
  },
  'text-to-speech': {
    whyNeed: 'Text-to-speech (TTS) is an incredible accessibility feature that turns any written text into spoken words, helping with proofreading and language learning.',
    howWorks: 'It utilizes the native SpeechSynthesis API built into modern web browsers to parse your text and speak it aloud using system-level voice profiles.',
    whenToUse: 'Perfect for listening to long articles while multitasking, verifying the flow of a speech, or assisting visually impaired users.'
  },
  'speech-to-text': {
    whyNeed: 'Speech-to-text dictation saves immense typing time by instantly transcribing your spoken words into written text.',
    howWorks: 'It leverages the Web Speech API to listen to your microphone and intelligently process the audio against native language models to transcribe it in real-time.',
    whenToUse: 'Great for hands-free typing, brainstorming ideas out loud, or capturing meeting minutes instantly.'
  },
  'screen-recorder': {
    whyNeed: 'A screen recorder is essential for making software tutorials, capturing gameplay, or recording important video calls without downloading a desktop app.',
    howWorks: 'It uses the secure getDisplayMedia API to capture your screen, window, or specific tab, encoding the visual feed directly into a video file.',
    whenToUse: 'Use this for bug reporting, remote presentations, or saving webinars for later offline viewing.'
  },
  'webcam-recorder': {
    whyNeed: 'A webcam recorder lets you easily capture video messages, vlogs, or video feedback directly from your computer camera.',
    howWorks: 'It asks for secure camera access via the getUserMedia API, visualizes the feed, and records the raw video stream locally to your device.',
    whenToUse: 'Ideal for recording asynchronous video messages for your team, vlogging, or practicing a presentation.'
  }
};
