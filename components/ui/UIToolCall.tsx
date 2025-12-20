'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Loader2,
    Terminal,
    AlertCircle,
} from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface ToolCallProps {
    status: 'complete' | 'inProgress' | 'executing' | 'error';
    name?: string;
    args?: any;
    result?: any;
    className?: string;
}

export default function MCPToolCall({
    status,
    name = 'Tool Call',
    args,
    result,
    className,
}: ToolCallProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const isComplete = status === 'complete';
    const isError = status === 'error';
    const isLoading = status === 'inProgress' || status === 'executing';

    // Format content for display
    const format = (content: any): string => {
        if (content === undefined || content === null) return '';
        try {
            const text =
                typeof content === 'object'
                    ? JSON.stringify(content, null, 2)
                    : String(content);
            return text;
        } catch (e) {
            return String(content);
        }
    };

    return (
        <Collapsible
            className={cn(
                'border border-border text-card-foreground w-full rounded-lg ',
                className
            )}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            {/* header */}
            <div className={cn('flex gap-3 p-3 select-none transition-colors')}>
                {/* Status Icon */}
                <div className="flex-shrink-0 translate-y-2">
                    {isComplete && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {isError && (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    {isLoading && (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    )}
                </div>

                {/* trigger */}
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className="hover:!bg-transparent hover:!text-primary"
                    >
                        {/* Title */}
                        <div className=" min-w-0 flex items-center gap-2 overflow-hidden">
                            <span className="font-medium text-sm truncate">
                                {name}
                            </span>
                        </div>

                        {isOpen ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </Button>
                </CollapsibleTrigger>
            </div>

            {/* content */}
            <CollapsibleContent>
                <div className="p-4 pt-0 space-y-4 border-t bg-muted/10">
                    {/* Arguments Section */}
                    {args && (
                        <div className="mt-4">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Input Parameters
                            </div>
                            <div className="relative rounded-md border bg-muted/50 p-3 font-mono text-xs">
                                <pre className="whitespace-pre-wrap break-words overflow-auto max-h-[200px] text-foreground/90">
                                    {format(args)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Result Section */}
                    {result && (
                        <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider my-2">
                                Result
                            </div>
                            <div className="relative rounded-md border bg-muted/50 p-3 font-mono text-xs">
                                <pre className="whitespace-pre-wrap break-words overflow-auto max-h-[300px] text-foreground/90">
                                    {format(result)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!args && !result && (
                        <div className="py-2 text-center text-sm text-muted-foreground italic">
                            No details available
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
