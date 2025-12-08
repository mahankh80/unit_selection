import type { ButtonHTMLAttributes } from "react";

type Props = {
  label: string;
  loading?: boolean;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  label,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...buttonProps
}: Props) {
  const classes = [
    "btn",
    "btn--primary",
    fullWidth ? "btn--full-width" : "",
    loading ? "btn--loading" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...buttonProps}
    >
      <span className="btn__label">{label}</span>
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
    </button>
  );
}



