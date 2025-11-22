// 这个勾选框是用于登录界面
import { Tooltip } from "react-tooltip";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  tooltipContent?: string;
  tooltipId?: string;
  className?: string;
  disabled?: boolean;
}
// 这个组件是用来创建自定义复选框的，它接受以下参数：
export default function CustomCheckbox({
  id,
  checked,
  onChange,
  label,
  tooltipContent,
  tooltipId,
  className,
  disabled = false
}: CustomCheckboxProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className="flex items-center cursor-pointer group"
        >
          <div
            className={cn(
              "w-5 h-5 border-2 rounded-lg transition-all duration-300",
              "flex items-center justify-center relative",
              "transform group-hover:scale-110",
              checked
                ? "bg-blue-600 border-blue-600 shadow-lg"
                : "border-gray-300 hover:border-blue-400 hover:shadow-md bg-white",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {checked && (
              <i className="fa-solid fa-check text-white text-xs font-bold"></i>
            )}
          </div>
          <span
            className={cn(
              "ml-3 text-sm text-gray-700 group-hover:text-gray-900",
              "transition-colors duration-200",
              disabled && "opacity-50"
            )}
            data-tooltip-content={tooltipContent}
            data-tooltip-id={tooltipId}
          >
            {label}
          </span>
        </label>
      </div>
      {tooltipContent && tooltipId && (
        <Tooltip
          id={tooltipId}
          place="top"
          variant="info"
          className="tooltip"
        />
      )}
    </div>
  );
}

