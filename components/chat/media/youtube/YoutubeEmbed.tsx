'use client';

import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { useYoutubeEmbed } from './useYoutubeEmbed';

interface YoutubeEmbedProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

/**
 * Smart YouTube Embed Component
 * Renders a lightweight YouTube player if the link is a valid YouTube URL
 * otherwise gracefully falls back to a standard anchor tag
 */
export function YoutubeEmbed({ href, children, className, ...props }: YoutubeEmbedProps) {
  const { videoId, isYoutube } = useYoutubeEmbed(href);

  // Fallback to standard link if not a valid YouTube URL or no video ID found
  if (!isYoutube || !videoId) {
    return (
      <a 
        href={href} 
        className={className}
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <div className="my-4 w-full max-w-[480px] rounded-lg overflow-hidden border bg-muted/20 shadow-sm">
      <div className="aspect-video w-full">
        <LiteYouTubeEmbed
          id={videoId}
          title={typeof children === 'string' ? children : 'YouTube video player'}
          aspectHeight={9}
          aspectWidth={16}
          // Optimal optimization params
          poster="maxresdefault" 
          webp
        />
      </div>
    </div>
  );
}
