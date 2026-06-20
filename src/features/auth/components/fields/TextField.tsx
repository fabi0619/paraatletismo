import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
  required?: boolean;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, required, id, ...props }, ref) => (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 font-bold text-red-500">*</span>}
      </Label>
      <Input id={id} ref={ref} {...props} />
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
    </div>
  )
);

TextField.displayName = "TextField";

export { TextField };
