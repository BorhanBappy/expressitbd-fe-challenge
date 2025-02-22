import { z } from "zod";
import { StoreFormData } from "@/app/task1/schemas";
import { getErrorMessage } from "@/app/utils/formUtils";

export const SelectField = ({
  label,
  name,
  value,
  options,
  onChange,
  errors,
  disabled,
}: {
  label: string;
  name: keyof StoreFormData;
  value: string;
  options: { value: string; label: string }[];
  onChange: (name: keyof StoreFormData, value: string) => void;
  errors: z.ZodIssue[];
  disabled: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className={`w-full p-2 border rounded-md ${
        getErrorMessage(errors, name) ? "border-red-500" : "border-gray-300"
      }`}
      disabled={disabled}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {getErrorMessage(errors, name) && (
      <p className="text-red-500 text-xs sm:text-sm">
        {getErrorMessage(errors, name)}
      </p>
    )}
  </div>
);
