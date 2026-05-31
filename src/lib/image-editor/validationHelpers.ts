export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  type: 'info' | 'warning' | 'error' | null;
}

const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB warning threshold

export function validateImageFile(file: File | null): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      message: 'No image file selected. Please select a valid file to start editing.',
      type: 'error',
    };
  }

  const fileType = file.type || '';
  if (!SUPPORTED_FORMATS.includes(fileType)) {
    return {
      isValid: false,
      message: `Unsupported file format (${file.type}). Supported formats are: JPG, JPEG, PNG, and WEBP.`,
      type: 'error',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: true,
      message: 'This image is quite large. Editing may take longer and use more browser memory.',
      type: 'warning',
    };
  }

  return { isValid: true, message: null, type: null };
}

export function validateLogoFile(file: File | null): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      message: 'Please select a logo image file.',
      type: 'error',
    };
  }

  const fileType = file.type || '';
  if (!SUPPORTED_FORMATS.includes(fileType)) {
    return {
      isValid: false,
      message: `Logo file type (${file.type}) is not supported. Please upload a transparent PNG or JPG.`,
      type: 'error',
    };
  }

  return { isValid: true, message: null, type: null };
}

export function validateDimensions(width: number, height: number): ValidationResult {
  if (isNaN(width) || width <= 0) {
    return {
      isValid: false,
      message: 'Custom width must be a valid positive integer.',
      type: 'error',
    };
  }

  if (isNaN(height) || height <= 0) {
    return {
      isValid: false,
      message: 'Custom height must be a valid positive integer.',
      type: 'error',
    };
  }

  if (width > 8192 || height > 8192) {
    return {
      isValid: true,
      message: 'The requested dimensions are very large. This could cause browser performance slowdowns.',
      type: 'warning',
    };
  }

  return { isValid: true, message: null, type: null };
}

export function validateText(text: string): ValidationResult {
  if (!text || text.trim() === '') {
    return {
      isValid: false,
      message: 'Text content cannot be empty.',
      type: 'error',
    };
  }
  return { isValid: true, message: null, type: null };
}

export function validateWatermark(text: string): ValidationResult {
  if (!text || text.trim() === '') {
    return {
      isValid: false,
      message: 'Watermark text cannot be empty.',
      type: 'error',
    };
  }
  return { isValid: true, message: null, type: null };
}
