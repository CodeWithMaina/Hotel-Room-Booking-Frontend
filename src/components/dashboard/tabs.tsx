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
}: {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
}) => (
  <div className="flex gap-2 mb-4">
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
}: {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
}) => (
  <button
    onClick={() => setActiveTab?.(value)}
    className={cn(
      "px-4 py-2 rounded font-medium",
      activeTab === value
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700 hover:bg-blue-100"
    )}
  >
    {children}
  </button>
);

export const TabsContent = ({
  value,
  activeTab,
  children,
}: {
  value: string;
  activeTab?: string;
  children: React.ReactNode;
}) => (activeTab === value ? <div>{children}</div> : null);
