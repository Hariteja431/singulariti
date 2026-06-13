const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/content/tools/toolRegistry.ts');
let code = fs.readFileSync(file, 'utf8');

const newSection = `  { id: 'media', name: 'Audio & Video Tools', slug: 'media-utilities', description: 'Free online tools to record audio, capture your screen, and process media directly in your browser.', icon: 'Video' },\n`;
code = code.replace(/export const sectionRegistry: SectionRegistryItem\[\] = \[/, 'export const sectionRegistry: SectionRegistryItem[] = [\n' + newSection);

const newSubSections = `  { id: 'audio-tools', sectionId: 'media', name: 'Audio Tools', slug: 'audio-tools', description: 'Record and process audio files instantly.' },
  { id: 'video-tools', sectionId: 'media', name: 'Video Tools', slug: 'video-tools', description: 'Record your screen or webcam.' },\n`;
code = code.replace(/export const subSectionRegistry: SubSectionRegistryItem\[\] = \[/, 'export const subSectionRegistry: SubSectionRegistryItem[] = [\n' + newSubSections);

const newTools = `  {
    id: 'online-voice-recorder',
    name: 'Online Voice Recorder',
    sectionId: 'media',
    subSectionId: 'audio-tools',
    utilityUrl: '/media/audio/online-voice-recorder',
    guideSlug: 'online-voice-recorder-guide',
    shortDescription: 'Record microphone audio directly in your browser and download as WebM or MP3.',
    inputType: ['User Inputs'],
    outputType: ['Processed Results'],
    operationType: 'utility'
  },
  {
    id: 'audio-trimmer',
    name: 'Audio Trimmer',
    sectionId: 'media',
    subSectionId: 'audio-tools',
    utilityUrl: '/media/audio/audio-trimmer',
    guideSlug: 'audio-trimmer-guide',
    shortDescription: 'Cut specific parts of an audio file online.',
    inputType: ['Source Format File / Value'],
    outputType: ['Target Format File / Value'],
    operationType: 'editor'
  },
  {
    id: 'screen-recorder',
    name: 'Screen Recorder',
    sectionId: 'media',
    subSectionId: 'video-tools',
    utilityUrl: '/media/video/screen-recorder',
    guideSlug: 'screen-recorder-guide',
    shortDescription: 'Free online screen recorder. Capture your screen, window or tab easily.',
    inputType: ['User Inputs'],
    outputType: ['Processed Results'],
    operationType: 'utility'
  },
  {
    id: 'webcam-recorder',
    name: 'Webcam Recorder',
    sectionId: 'media',
    subSectionId: 'video-tools',
    utilityUrl: '/media/video/webcam-recorder',
    guideSlug: 'webcam-recorder-guide',
    shortDescription: 'Take webcam snapshots or record video right from your browser securely.',
    inputType: ['User Inputs'],
    outputType: ['Processed Results'],
    operationType: 'utility'
  },\n`;
code = code.replace(/export const toolRegistry: UtilityRegistryItem\[\] = \[/, 'export const toolRegistry: UtilityRegistryItem[] = [\n' + newTools);

fs.writeFileSync(file, code);
console.log('Updated toolRegistry.ts successfully!');
