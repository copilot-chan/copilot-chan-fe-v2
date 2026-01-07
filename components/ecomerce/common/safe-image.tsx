'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop';

export function SafeImage({ src, fallback = FALLBACK_IMAGE, ...props }: ImageProps & { fallback?: string }) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? fallback : src}
      onError={() => setError(true)}
    />
  );
}
