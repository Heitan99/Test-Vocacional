import { cn } from "@/lib/utils";

const NODES = Array.from({ length: 6 }, (_, index) => {
  const angle = (Math.PI / 3) * index - Math.PI / 2;
  return {
    x: 16 + Math.cos(angle) * 10.5,
    y: 16 + Math.sin(angle) * 10.5,
  };
});

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="voca-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38b6ff" />
          <stop offset="52%" stopColor="#9b7bff" />
          <stop offset="100%" stopColor="#ff4fa3" />
        </linearGradient>
      </defs>
      {NODES.map((node, index) => (
        <line
          key={`l-${index}`}
          x1="16"
          y1="16"
          x2={node.x}
          y2={node.y}
          stroke="url(#voca-mark)"
          strokeWidth="0.9"
          opacity="0.4"
        />
      ))}
      {NODES.map((node, index) => (
        <circle
          key={`n-${index}`}
          cx={node.x}
          cy={node.y}
          r="1.7"
          fill="url(#voca-mark)"
          opacity="0.85"
        />
      ))}
      <circle cx="16" cy="16" r="2.7" fill="url(#voca-mark)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-[19px] font-semibold tracking-[-0.04em] text-white",
        className,
      )}
    >
      voca
    </span>
  );
}
