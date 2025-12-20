export const YOUTUBE_REGEX = {
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  // Capture group 1: Video ID
  VIDEO_ID: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
};

/**
 * Validates if the provided string is a potential YouTube URL
 */
export function isValidYoutubeUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return YOUTUBE_REGEX.VIDEO_ID.test(url);
}

/**
 * Extracts the YouTube Video ID from a URL
 * Returns null if not found
 */
export function getYoutubeVideoId(url: string | undefined | null): string | null {
  if (!url) return null;
  const match = url.match(YOUTUBE_REGEX.VIDEO_ID);
  return match ? match[1] : null;
}
