import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
  required?: boolean;
}

const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  ({ label, error, required, id, className, ...props }, ref) => (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 font-bold text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type="date"
        ref={ref}
        className={`w-full justify-start text-left font-normal ${className || ""}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
    </div>
  )
);
DateField.displayName = "DateField";

export { DateField };
