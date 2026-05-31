// Polyfills for server-side rendering (SSR) environments
if (typeof window === 'undefined') {
  // Mock DOMMatrix for pdfjs-dist
  class MockDOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor() {}
  }
  (global as any).DOMMatrix = MockDOMMatrix;
}
export {};
