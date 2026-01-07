'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductImage } from './shared/ProductImage';
import { cn } from '@/lib/utils';
import { Check, CheckCircle2 } from 'lucide-react';

export interface Option {
  id: string;
  title: string;
  image_url?: string;
  subtitle?: string;
}

interface OptionSelectorProps {
  options: Option[];
  question?: string;
  allow_multiple?: boolean;
  onSubmit: (selectedIds: string[]) => void;
  status?: 'inProgress' | 'executing' | 'complete';
  defaultSelected?: string[];
  className?: string;
}

export function OptionSelector({
  options,
  question = "Vui lòng chọn:",
  allow_multiple = true,
  onSubmit,
  status = 'inProgress',
  defaultSelected = [],
  className,
}: OptionSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelected);
  const isComplete = status === 'complete';

  const toggleSelection = (id: string) => {
    if (isComplete) return;

    if (allow_multiple) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedIds);
  };

  // Determine layout based on content (Grid if images present, List otherwise)
  const hasImages = options.some((opt) => opt.image_url);
  
  return (
    <Card className={cn('w-full max-w-lg', className)}>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base font-medium flex justify-between items-center">
          {question}
          {isComplete && (
             <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đã chọn {selectedIds.length}
             </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
        {hasImages ? (
          <div className="grid grid-cols-2 gap-3">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <div
                  key={option.id}
                  onClick={() => toggleSelection(option.id)}
                  className={cn(
                    'group relative cursor-pointer border rounded-lg overflow-hidden transition-all',
                    isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50',
                    isComplete && !isSelected && 'opacity-50 grayscale'
                  )}
                >
                  <ProductImage
                    image={option.image_url ? { url: option.image_url, altText: option.title, width: 200, height: 200 } : undefined}
                    title={option.title}
                    aspectRatio="square"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="p-2 bg-card">
                    <p className="font-medium text-sm line-clamp-1">{option.title}</p>
                    {option.subtitle && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{option.subtitle}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <div
                  key={option.id}
                  onClick={() => toggleSelection(option.id)}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-colors',
                     isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-accent',
                     isComplete && !isSelected && 'opacity-50'
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleSelection(option.id)}
                    disabled={isComplete}
                    className="data-[state=checked]:bg-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{option.title}</p>
                    {option.subtitle && (
                       <p className="text-xs text-muted-foreground mt-1">{option.subtitle}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {!isComplete && (
        <CardFooter className="pt-2 pb-4 border-t bg-secondary/10 flex justify-end gap-2">
            <span className="text-xs text-muted-foreground mr-auto self-center">
                {allow_multiple ? 'Chọn nhiều' : 'Chọn một'}
            </span>
            <Button
                onClick={handleSubmit}
                disabled={selectedIds.length === 0}
                size="sm"
            >
                Xác nhận ({selectedIds.length})
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
