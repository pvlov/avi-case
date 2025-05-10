import { cn } from "@/lib/utils";

interface BlurrySquaresProps {
  className?: string;
}

export function BlurrySquares({ className }: BlurrySquaresProps) {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Purple square */}
      <div
        className="absolute w-64 h-64 rounded-3xl bg-avi-purple/70 blur-2xl"
        style={{
          top: "10%",
          left: "25%",
          transform: "rotate(-10deg)",
        }}
      />
      
      {/* Green square */}
      <div
        className="absolute w-56 h-56 rounded-3xl bg-avi-green/70 blur-2xl"
        style={{
          top: "30%",
          left: "45%",
          transform: "rotate(15deg)",
        }}
      />
    </div>
  );
} 