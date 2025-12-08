import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "placeholder">;

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  id,
  required,
  ...inputProps
}: Props) {
  const inputId = id ?? `text-${label}`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
        {required ? <span className="field__required">*</span> : null}
      </label>
      <div className="field__password-wrapper">
        <span className="field__icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <input
          id={inputId}
          className="field__input field__input--password"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          {...inputProps}
        />
      </div>
    </div>
  );
}


