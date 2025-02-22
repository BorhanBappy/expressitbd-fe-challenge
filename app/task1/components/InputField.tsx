import { z } from "zod";
import { StoreFormData } from "@/app/task1/components/schemas";
import { getErrorMessage } from "@/app/utils/formUtils";

export const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  errors,
  disabled,
  suffix,
}: {
  label: string;
  name: keyof StoreFormData;
  type?: string;
  value: string;
  onChange: (name: keyof StoreFormData, value: string) => void;
  errors: z.ZodIssue[];
  disabled: boolean;
  suffix?: string;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="flex">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full p-2 border rounded-md ${
          getErrorMessage(errors, name) ? "border-red-500" : "border-gray-300"
        } ${suffix ? "rounded-r-none" : ""}`}
        disabled={disabled}
      />
      {suffix && (
        <span className="px-4 py-2 bg-gray-100 border-t border-b border-r rounded-r-md">
          {suffix}
        </span>
      )}
    </div>
    {getErrorMessage(errors, name) && (
      <p className="text-red-500 text-xs sm:text-sm">
        {getErrorMessage(errors, name)}
      </p>
    )}
  </div>
);
