import * as React from "react";
import { cn } from "../../lib/utils";

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
  <div className={cn("flex gap-2 mb-4", className)}>
    {React.Children.map(children, (child: any) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

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
}) => (
  <button
    onClick={() => setActiveTab?.(value)}
    className={cn(
      "px-4 py-2 rounded font-medium transition",
      activeTab === value
        ? "bg-[#DDA15E] text-white"
        : "bg-white text-[#283618] hover:bg-[#FEFAE0]",
      className
    )}
  >
    {children}
  </button>
);

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
}) => (activeTab === value ? <div className={className}>{children}</div> : null);
