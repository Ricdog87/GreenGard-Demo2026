import { cn } from '@/lib/utils';

export function Eyebrow({
  number,
  children,
  className,
}: {
  number?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('eyebrow flex items-center gap-3', className)}>
      <span className="inline-block h-px w-8 bg-moss/60" />
      <span>{children}</span>
      {number && <span className="text-moss/60">· {number}</span>}
    </div>
  );
}
