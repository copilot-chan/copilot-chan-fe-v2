import { useMemo } from 'react';
import { getYoutubeVideoId, isValidYoutubeUrl } from './youtube.utils';

interface UseYoutubeEmbedResult {
  videoId: string | null;
  isValid: boolean;
  isYoutube: boolean;
}

/**
 * Hook to handle YouTube embed logic
 * Decouples logic from UI
 */
export function useYoutubeEmbed(href: string | undefined): UseYoutubeEmbedResult {
  const result = useMemo(() => {
    const isYoutube = isValidYoutubeUrl(href);
    const videoId = isYoutube ? getYoutubeVideoId(href) : null;

    return {
      isYoutube: !!videoId, // Only true if we successfully extracted an ID
      isValid: !!videoId,
      videoId,
    };
  }, [href]);

  return result;
}
