import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id: customId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = customId || generatedId;

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full text-base px-4 py-3 bg-surface border rounded-xl font-sans text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[44px] ${
            error ? "border-escalate focus:ring-escalate" : "border-text-muted/20 hover:border-text-muted/40"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-sm font-medium text-escalate">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
