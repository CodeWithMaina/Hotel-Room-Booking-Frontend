import { Users, ShieldCheck, UserCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const userTypes = [
  { type: "user", label: "Users", icon: Users },
  { type: "owner", label: "Owners", icon: UserCircle },
  { type: "admin", label: "Admins", icon: ShieldCheck },
];

interface Props {
  selectedType: string;
  onSelect: (type: string) => void;
}

export const UserTypeTabs: React.FC<Props> = ({ selectedType, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = userTypes.findIndex((u) => u.type === selectedType);
    setActiveIndex(index);
  }, [selectedType]);

  return (
    <div className="w-full  mx-auto">
      <div
        ref={containerRef}
        className="relative bg-white shadow-lg rounded-full flex justify-between items-center px-2 py-2 transition-all duration-300"
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1 bottom-1 rounded-full bg-blue-600 z-0"
          style={{
            left: `${(100 / userTypes.length) * activeIndex}%`,
            width: `${100 / userTypes.length}%`,
          }}
        />

        {userTypes.map(({ type, label, icon: Icon }) => {
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={cn(
                "relative z-10 w-full flex justify-center items-center gap-2 py-2 font-medium rounded-full transition-all duration-300",
                isActive
                  ? "text-white"
                  : "text-blue-600 hover:text-white hover:bg-blue-700"
              )}
              style={{
                width: `${100 / userTypes.length}%`,
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
