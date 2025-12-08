import { useState } from "react";
import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">;

export function PasswordField({
  label,
  value,
  onChange,
  id,
  required,
  ...inputProps
}: Props) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? `password-${label}`;

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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <input
          id={inputId}
          className="field__input field__input--password"
          type={visible ? "text" : "password"}
          placeholder="رمز عبور خود را وارد کنید"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          {...inputProps}
        />
        <button
          type="button"
          className="field__toggle-visibility"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
        >
          {visible ? (
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
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
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
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}


