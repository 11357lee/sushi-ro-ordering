"use client";

import { formatPhoneInput, phoneCursorForDigitCount } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
}

export function PhoneInput({
  value,
  onChange,
  id,
  name,
  required,
  placeholder = "(613) 724-6088",
  className,
  autoComplete = "tel",
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const selectionStart = input.selectionStart ?? input.value.length;
    const digitsBeforeCursor = input.value.slice(0, selectionStart).replace(/\D/g, "").length;
    const formatted = formatPhoneInput(input.value);
    onChange(formatted);
    requestAnimationFrame(() => {
      const pos = phoneCursorForDigitCount(formatted, digitsBeforeCursor);
      try {
        input.setSelectionRange(pos, pos);
      } catch {
        // Some browsers ignore selection on type=tel briefly after value change.
      }
    });
  };

  return (
    <input
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete={autoComplete}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
}
