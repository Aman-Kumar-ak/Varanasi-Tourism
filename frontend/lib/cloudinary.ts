/**
 * Cloudinary utility functions for frontend
 * Provides optimized image/video URLs and transformations
 */

/**
 * Get optimized image URL from Cloudinary
 * Automatically applies quality and format optimization
 * 
 * @param url - Original Cloudinary URL
 * @param options - Optional transformation options
 * @returns Optimized Cloudinary URL
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  }
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original URL if not a Cloudinary URL
  }

  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const imagePath = url.split('/upload/')[1];

  // Default transformations
  const transformations: string[] = [];

  // Quality and format optimization (always applied)
  transformations.push('q_auto');
  transformations.push('f_auto');

  // Custom transformations
  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options?.crop) {
    transformations.push(`c_${options.crop}`);
  }
  if (options?.quality && options.quality !== 'auto') {
    transformations.push(`q_${options.quality}`);
  }
  if (options?.format && options.format !== 'auto') {
    transformations.push(`f_${options.format}`);
  }

  const transformString = transformations.join(',');
  return `${baseUrl}${transformString}/${imagePath}`;
}

/**
 * Get responsive image srcset for Cloudinary images
 * Useful for responsive images with different sizes
 * 
 * @param url - Original Cloudinary URL
 * @param sizes - Array of widths to generate
 * @returns srcset string
 */
export function getResponsiveSrcSet(url: string, sizes: number[]): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  return sizes
    .map((width) => `${getOptimizedImageUrl(url, { width })} ${width}w`)
    .join(', ');
}

/**
 * Get thumbnail URL for videos
 * Cloudinary automatically generates thumbnails for videos
 * 
 * @param videoUrl - Original Cloudinary video URL
 * @param width - Thumbnail width (default: 640)
 * @param height - Thumbnail height (default: 360)
 * @returns Thumbnail image URL
 */
export function getVideoThumbnail(
  videoUrl: string,
  width: number = 640,
  height: number = 360
): string {
  if (!videoUrl || !videoUrl.includes('cloudinary.com')) {
    return videoUrl;
  }

  // Replace /video/upload/ with /image/upload/ and add transformations
  return videoUrl
    .replace('/video/upload/', `/image/upload/w_${width},h_${height},c_fill/`)
    .replace(/\.(mp4|webm|mov)$/, '.jpg');
}

/**
 * Get optimized video URL from Cloudinary
 * Automatically applies quality and format optimization with scaling
 * Optimized for streaming and reduced buffering
 * 
 * @param url - Original Cloudinary video URL
 * @param options - Optional transformation options
 * @returns Optimized Cloudinary video URL
 */
export function getOptimizedVideoUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'mp4' | 'webm';
    bitRate?: number;
    streaming?: boolean;
  }
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original URL if not a Cloudinary URL
  }

  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const videoPath = url.split('/upload/')[1];

  // Default transformations
  const transformations: string[] = [];

  // Quality and format optimization (always applied)
  transformations.push('q_auto');
  transformations.push('f_auto');

  // Custom transformations
  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options?.quality && options.quality !== 'auto') {
    transformations.push(`q_${options.quality}`);
  }
  if (options?.format && options.format !== 'auto') {
    transformations.push(`f_${options.format}`);
  }
  // Optimize bitrate for smaller file sizes and faster loading
  if (options?.bitRate) {
    transformations.push(`br_${options.bitRate}`);
  } else if (!options?.bitRate && !options?.width && !options?.height) {
    // Default bitrate optimization for smaller videos (cluster videos)
    transformations.push('br_500k'); // 500kbps for background videos
  }

  const transformString = transformations.join(',');
  return `${baseUrl}${transformString}/${videoPath}`;
}

/**
 * Get optimized video URL for cluster videos (smaller, faster loading)
 * Specifically optimized for image cluster overlay videos
 * Uses lower bitrate and resolution to prevent buffering
 */
export function getOptimizedClusterVideoUrl(
  url: string,
  isMobile: boolean = false
): string {
  return getOptimizedVideoUrl(url, {
    width: isMobile ? 640 : 1280, // Smaller resolution for faster loading
    height: isMobile ? 360 : 720,
    bitRate: isMobile ? 400 : 800, // Lower bitrate for smoother playback
    quality: 'auto', // Let Cloudinary optimize quality
  });
}

/**
 * Check if URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url?.includes('cloudinary.com') || false;
}

