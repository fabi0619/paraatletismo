import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultsCount?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  resultsCount,
  className,
}: SearchInputProps) {
  return (
    <InputGroup className={className}>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
      {resultsCount !== undefined && (
        <InputGroupAddon align="inline-end">
          {resultsCount} resultados
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
