import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function SkeletonCard({ 
  className, 
  lines = 3,
  showHeader = true,
  showFooter = false 
}: SkeletonCardProps) {
  return (
    <div className={cn(
      "p-6 bg-black/60 border border-border/20 rounded-lg space-y-4",
      className
    )}>
      {showHeader && (
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full bg-grey-800/50" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3 bg-grey-800/50" />
            <Skeleton className="h-3 w-1/4 bg-grey-800/30" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-3 bg-grey-800/40",
              i === lines - 1 ? "w-2/3" : "w-full"
            )} 
          />
        ))}
      </div>

      {showFooter && (
        <div className="flex items-center justify-between pt-4 border-t border-border/10">
          <Skeleton className="h-8 w-24 bg-grey-800/30 rounded" />
          <Skeleton className="h-8 w-32 bg-primary/20 rounded" />
        </div>
      )}
    </div>
  );
}

export function SkeletonNodeCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      "p-6 bg-black/80 border border-border/30 rounded-lg",
      className
    )}>
      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-16 rounded-full bg-grey-800/40" />
        <Skeleton className="h-4 w-4 rounded-full bg-grey-800/30" />
      </div>
      
      {/* Sequence number */}
      <Skeleton className="h-8 w-12 mb-3 bg-grey-800/30" />
      
      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-2 bg-grey-800/50" />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full bg-grey-800/30" />
        <Skeleton className="h-3 w-2/3 bg-grey-800/30" />
      </div>
      
      {/* Pulse indicator */}
      <div className="mt-4 pt-4 border-t border-border/10">
        <Skeleton className="h-3 w-24 bg-grey-800/20" />
      </div>
    </div>
  );
}

export function SkeletonSection({ className }: { className?: string }) {
  return (
    <div className={cn("py-20", className)}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-3 w-32 mx-auto mb-4 bg-grey-800/30" />
          <Skeleton className="h-8 w-64 mx-auto mb-4 bg-grey-800/50" />
          <Skeleton className="h-4 w-96 mx-auto bg-grey-800/30" />
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
