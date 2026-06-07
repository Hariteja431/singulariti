import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LayoutMode = 'horizontal' | 'vertical' | 'preview-only' | 'code-only';
export type DeviceView = 'desktop' | 'tablet' | 'mobile' | 'responsive';

interface WebCompilerState {
  html: string;
  css: string;
  js: string;
  layout: LayoutMode;
  deviceView: DeviceView;
  autoRun: boolean;
  libraries: {
    css: string[];
    js: string[];
  };
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJs: (js: string) => void;
  setLayout: (layout: LayoutMode) => void;
  setDeviceView: (view: DeviceView) => void;
  setAutoRun: (autoRun: boolean) => void;
  addLibrary: (type: 'css' | 'js', url: string) => void;
  removeLibrary: (type: 'css' | 'js', url: string) => void;
  resetProject: () => void;
  loadTemplate: (template: { html: string; css: string; js: string }) => void;
}

export const useWebCompilerStore = create<WebCompilerState>()(
  persist(
    (set) => ({
      html: '<h1>Welcome to Singulariti Compiler</h1>\n<p>Start writing HTML, CSS, and JS...</p>',
      css: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 1rem;\n}',
      js: 'console.log("Ready to code!");',
      layout: 'horizontal',
      deviceView: 'responsive',
      autoRun: true,
      libraries: { css: [], js: [] },
      setHtml: (html) => set({ html }),
      setCss: (css) => set({ css }),
      setJs: (js) => set({ js }),
      setLayout: (layout) => set({ layout }),
      setDeviceView: (deviceView) => set({ deviceView }),
      setAutoRun: (autoRun) => set({ autoRun }),
      addLibrary: (type, url) => set((state) => ({
        libraries: { ...state.libraries, [type]: [...state.libraries[type], url] }
      })),
      removeLibrary: (type, url) => set((state) => ({
        libraries: { ...state.libraries, [type]: state.libraries[type].filter(l => l !== url) }
      })),
      resetProject: () => set({ html: '', css: '', js: '', libraries: { css: [], js: [] } }),
      loadTemplate: (t) => set({ html: t.html, css: t.css, js: t.js })
    }),
    { name: 'singulariti-web-compiler-storage' }
  )
);

interface HtmlPreviewerState {
  html: string;
  layout: LayoutMode;
  deviceView: DeviceView;
  autoRun: boolean;
  setHtml: (html: string) => void;
  setLayout: (layout: LayoutMode) => void;
  setDeviceView: (view: DeviceView) => void;
  setAutoRun: (autoRun: boolean) => void;
  resetProject: () => void;
}

export const useHtmlPreviewerStore = create<HtmlPreviewerState>()(
  persist(
    (set) => ({
      html: '<!-- Welcome to Premium HTML Previewer -->\n<div class="container">\n  <h1>Start Building</h1>\n</div>',
      layout: 'horizontal',
      deviceView: 'responsive',
      autoRun: true,
      setHtml: (html) => set({ html }),
      setLayout: (layout) => set({ layout }),
      setDeviceView: (deviceView) => set({ deviceView }),
      setAutoRun: (autoRun) => set({ autoRun }),
      resetProject: () => set({ html: '' })
    }),
    { name: 'singulariti-html-previewer-storage' }
  )
);
