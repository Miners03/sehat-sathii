import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth = false, className = "", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98]";

    const variantStyles = {
      primary: "bg-primary hover:bg-primary-hover text-white shadow-sm",
      secondary: "bg-surface text-text border border-text-muted/20 hover:bg-bg",
      ghost: "text-text hover:bg-bg hover:text-primary",
    };

    const sizeStyles = {
      sm: "text-sm px-3 py-2 min-h-[36px]",
      md: "text-base px-5 py-3 min-h-[44px]",
      lg: "text-lg px-6 py-4 min-h-[52px] font-semibold",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
