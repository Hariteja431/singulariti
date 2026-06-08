export type WatermarkPosition =
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'custom';

export function getPdfWatermarkPosition(params: {
  pageWidth: number;
  pageHeight: number;
  itemWidth: number;
  itemHeight: number;
  position: WatermarkPosition;
  margin?: number;
  xPercent?: number;
  yPercent?: number;
}) {
  const {
    pageWidth,
    pageHeight,
    itemWidth,
    itemHeight,
    position,
    margin = 40,
    xPercent = 0.5,
    yPercent = 0.5,
  } = params;

  switch (position) {
    case 'top-left':
      return {
        x: margin,
        y: pageHeight - margin - itemHeight,
      };

    case 'top-center':
      return {
        x: (pageWidth - itemWidth) / 2,
        y: pageHeight - margin - itemHeight,
      };

    case 'top-right':
      return {
        x: pageWidth - margin - itemWidth,
        y: pageHeight - margin - itemHeight,
      };

    case 'middle-left':
      return {
        x: margin,
        y: (pageHeight - itemHeight) / 2,
      };

    case 'middle-right':
      return {
        x: pageWidth - margin - itemWidth,
        y: (pageHeight - itemHeight) / 2,
      };

    case 'bottom-left':
      return {
        x: margin,
        y: margin,
      };

    case 'bottom-center':
      return {
        x: (pageWidth - itemWidth) / 2,
        y: margin,
      };

    case 'bottom-right':
      return {
        x: pageWidth - margin - itemWidth,
        y: margin,
      };

    case 'custom':
      return {
        x: xPercent * pageWidth,
        y: pageHeight - (yPercent * pageHeight) - itemHeight,
      };

    case 'center':
    default:
      return {
        x: (pageWidth - itemWidth) / 2,
        y: (pageHeight - itemHeight) / 2,
      };
  }
}

export function pdfToPreviewPosition(params: {
  pdfX: number;
  pdfY: number;
  pdfPageWidth: number;
  pdfPageHeight: number;
  previewWidth: number;
  previewHeight: number;
  itemWidth: number;
  itemHeight: number;
}) {
  const {
    pdfX,
    pdfY,
    pdfPageWidth,
    pdfPageHeight,
    previewWidth,
    previewHeight,
    itemWidth,
    itemHeight,
  } = params;

  const scaleX = previewWidth / pdfPageWidth;
  const scaleY = previewHeight / pdfPageHeight;

  return {
    left: pdfX * scaleX,
    top: previewHeight - (pdfY + itemHeight) * scaleY,
    width: itemWidth * scaleX,
    height: itemHeight * scaleY,
    scaleX,
    scaleY,
  };
}

export function getCenteredDrawPosition(params: {
  centerX: number;
  centerY: number;
  itemWidth: number;
  itemHeight: number;
  rotation?: number;
}) {
  const { centerX, centerY, itemWidth, itemHeight, rotation = 0 } = params;
  if (rotation === 0) {
    return {
      x: centerX - itemWidth / 2,
      y: centerY - itemHeight / 2,
    };
  }

  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const x = centerX - (itemWidth / 2) * cos + (itemHeight / 2) * sin;
  const y = centerY - (itemWidth / 2) * sin - (itemHeight / 2) * cos;

  return { x, y };
}
