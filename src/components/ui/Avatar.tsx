import React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string; // usually initials like "JD"
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User avatar",
  fallback,
  size = "md",
  className,
}) => {
  const isImageAvailable = Boolean(src);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium overflow-hidden border border-border transition",
        sizeMap[size],
        className
      )}
    >
      {isImageAvailable ? (
        <img
          src={src!}
          alt={alt}
          className="object-cover w-full h-full"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ) : (
        fallback || "?"
      )}
    </div>
  );
};
