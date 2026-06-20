import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectFieldOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

function SelectField({
  label,
  error,
  required,
  placeholder,
  options,
  value,
  onValueChange,
  disabled,
  id,
}: SelectFieldProps) {
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 font-bold text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder}>
            {selectedLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
    </div>
  );
}

export { SelectField };
export type { SelectFieldOption };
