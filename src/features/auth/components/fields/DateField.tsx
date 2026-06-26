import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

interface DateFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

function DateField({
  label,
  error,
  required,
  value,
  onChange,
  disabled,
  id,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : undefined;

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    }
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 font-bold text-red-500">*</span>}
      </Label>
      <div ref={containerRef} className="relative">
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 size-4" />
          {formattedDate ?? (
            <span className="text-muted-foreground">Seleccionar fecha</span>
          )}
        </Button>
        {open && (
          <div className="absolute top-full left-0 z-[99999] mt-1 rounded-lg border bg-popover p-0 shadow-md">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
    </div>
  );
}

export { DateField };
