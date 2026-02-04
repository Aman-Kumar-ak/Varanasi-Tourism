'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { getOptimizedImageUrl, isCloudinaryUrl } from '@/lib/cloudinary';

/** Small inline SVG as base64 for instant blur placeholder (no network) – good for first user */
const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHJlY3QgZmlsbD0iI2U1ZTdlYiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PC9zdmc+';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fallback?: string;
}

/**
 * Safe Image component: optimized for first-user and repeat visits.
 * - Cloudinary URLs are requested at sensible widths (faster first load).
 * - Blur placeholder shows immediately (no extra request).
 * - Handles missing images gracefully.
 */
export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className = '',
  priority = false,
  fallback,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const effectiveSrc = useMemo(() => {
    if (hasError) return imgSrc;
    if (!isCloudinaryUrl(src)) return src;
    const opts = fill ? { width: 1280 } : width && height ? { width, height, crop: 'fill' as const } : { width: width || 800 };
    return getOptimizedImageUrl(src, opts);
  }, [src, hasError, imgSrc, fill, width, height]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallback && fallback !== imgSrc) {
        setImgSrc(fallback);
      } else {
        setImgSrc(
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E'
        );
      }
    }
  };

  if (!src || src.trim() === '') {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  const imageProps = {
    src: effectiveSrc,
    alt,
    onError: handleError,
    className,
    priority,
    placeholder: 'blur' as const,
    blurDataURL: BLUR_DATA_URL,
    ...(sizes && { sizes }),
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
    />
  );
}

