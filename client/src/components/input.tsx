import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`
          w-full
          rounded-lg
          border border-white/30
          bg-black
          px-4 py-2.5
          text-sm text-white
          placeholder-white/40
          outline-none
          transition
          focus:border-white
          focus:ring-2
          focus:ring-white/30
          ${className}
        `}
      />
    );
  }
);

Input.displayName = "Input";
