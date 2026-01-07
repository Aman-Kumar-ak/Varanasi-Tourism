import fs from 'fs';

/**
 * File signature (magic numbers) for common image and video formats
 */
const FILE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [
    [0xff, 0xd8, 0xff], // JPEG
  ],
  'image/png': [
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // PNG
  ],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46], // RIFF (WebP starts with RIFF)
  ],
  'video/mp4': [
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // MP4 variant 1
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70], // MP4 variant 2
    [0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70], // MP4 variant 3
  ],
  'video/webm': [
    [0x1a, 0x45, 0xdf, 0xa3], // WebM
  ],
  'video/quicktime': [
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // QuickTime (similar to MP4)
  ],
};

/**
 * Validate file by checking magic numbers (file signatures)
 * This prevents file type spoofing attacks
 */
export function validateFileSignature(filePath: string, expectedMimeType: string): boolean {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const signatures = FILE_SIGNATURES[expectedMimeType];

    if (!signatures) {
      // If we don't have a signature for this type, allow it (fallback to MIME type check)
      return true;
    }

    // Check if file starts with any of the expected signatures
    for (const signature of signatures) {
      if (fileBuffer.length < signature.length) {
        continue;
      }

      let matches = true;
      for (let i = 0; i < signature.length; i++) {
        if (fileBuffer[i] !== signature[i]) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return true;
      }
    }

    // Special handling for WebP (RIFF...WEBP)
    if (expectedMimeType === 'image/webp') {
      const webpString = fileBuffer.toString('ascii', 8, 12);
      if (webpString === 'WEBP') {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error validating file signature:', error);
    return false;
  }
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.toLowerCase().split('.').pop() || '';
}

/**
 * Validate file extension matches MIME type
 */
export function validateFileExtension(filename: string, mimeType: string): boolean {
  const extension = getFileExtension(filename);
  const extensionMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'video/mp4': ['mp4'],
    'video/webm': ['webm'],
    'video/quicktime': ['mov', 'qt'],
  };

  const allowedExtensions = extensionMap[mimeType];
  if (!allowedExtensions) {
    return false;
  }

  return allowedExtensions.includes(extension);
}

