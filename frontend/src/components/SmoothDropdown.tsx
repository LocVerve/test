import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SmoothDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SmoothDropdown({
  options,
  value,
  onChange,
  placeholder = "请选择",
  className = "",
}: SmoothDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef} 
      className={cn("relative w-full", className)}
    >
      {/* 下拉框主体 */}
      <div
        className={cn(
          "relative w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg transition-all duration-300 cursor-pointer bg-white",
          isFocused ? "ring-2 ring-blue-500 border-blue-500 shadow-lg transform -translate-y-1" : ""
        )}
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
      >
        <span className={cn("block truncate", value ? "text-gray-900" : "text-gray-500")}>
          {value || placeholder}
        </span>
        
        {/* 下拉箭头 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <i 
            className={cn(
              "fas fa-chevron-down transition-transform duration-300 text-gray-400",
              isOpen ? "rotate-180" : ""
            )}
          />
        </div>
      </div>

      {/* 书页效果的装饰元素 */}
      <div 
        className={cn(
          "absolute inset-0 rounded-lg pointer-events-none transition-all duration-300 z-[-1]",
          isFocused 
            ? "opacity-100 shadow-xl border-2 border-blue-200 bg-white transform -translate-y-1" 
            : "opacity-0"
        )}
      />

      {/* 下拉选项 */}
      <div
        className={cn(
          "absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 transform origin-top",
          isOpen 
            ? "opacity-100 scale-y-100 translate-y-0" 
            : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
        )}
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-blue-50",
                value === option ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
              )}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

