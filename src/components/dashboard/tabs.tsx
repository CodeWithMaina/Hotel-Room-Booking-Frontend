import * as React from "react";
import { cn } from "../../lib/utils";

// Main Tabs controller
export const Tabs = ({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  return React.Children.map(children, (child: any) =>
    React.cloneElement(child, { activeTab, setActiveTab })
  );
};

// Tab List container
export const TabsList = ({
  children,
  activeTab,
  setActiveTab,
  className,
}: {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
  className?: string;
}) => (
  <div
    className={cn(
      "flex gap-3 border-b border-[#14213D]/50 pb-1 mb-6",
      className
    )}
  >
    {React.Children.map(children, (child: any) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

// Tab button
export const TabsTrigger = ({
  value,
  children,
  activeTab,
  setActiveTab,
  className,
}: {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
  className?: string;
}) => {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab?.(value)}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
        isActive
          ? "bg-[#FCA311] text-black"
          : "text-[#E5E5E5] hover:text-[#FCA311]",
        className
      )}
    >
      {children}
    </button>
  );
};

// Tab content
export const TabsContent = ({
  value,
  activeTab,
  children,
  className,
}: {
  value: string;
  activeTab?: string;
  children: React.ReactNode;
  className?: string;
}) =>
  activeTab === value ? (
    <div className={cn("text-[#E5E5E5]", className)}>{children}</div>
  ) : null;
