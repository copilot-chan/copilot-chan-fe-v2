import { cn } from '@/lib/utils';
import { Image as ImageType } from '@/lib/ecomerce/foodshop/types';
import { SafeImage } from '@/components/ecomerce/common/safe-image';

interface ProductImageProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: ImageType;
  title: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
  width?: number;
  height?: number;
  fill?: boolean;
}

export function ProductImage({
  image,
  title,
  aspectRatio = 'square',
  width,
  height,
  fill = true,
  className,
  ...props
}: ProductImageProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  if (!image?.url) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-secondary/50 text-muted-foreground',
          aspectRatioClasses[aspectRatio],
          'rounded-md',
          className
        )}
        {...props}
      >
        <span className="text-xs">No Image</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-secondary/20',
        aspectRatioClasses[aspectRatio],
        className
      )}
      {...props}
    >
      <SafeImage
        src={image.url}
        alt={image.altText || title}
        fill={fill}
        width={!fill ? (width || image.width || 500) : undefined}
        height={!fill ? (height || image.height || 500) : undefined}
        className="object-cover transition-transform hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
