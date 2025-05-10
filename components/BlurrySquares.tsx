import { cn } from "@/lib/utils";

interface BlurrySquaresProps {
  className?: string;
}

export function BlurrySquares({ className }: BlurrySquaresProps) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* Purple square */}
      <div
        className="bg-avi-purple/70 absolute h-64 w-64 rounded-3xl blur-2xl"
        style={{
          top: "10%",
          left: "25%",
          transform: "rotate(-10deg)",
        }}
      />

      {/* Green square */}
      <div
        className="bg-avi-green/70 absolute h-56 w-56 rounded-3xl blur-2xl"
        style={{
          top: "30%",
          left: "45%",
          transform: "rotate(15deg)",
        }}
      />
    </div>
  );
}
