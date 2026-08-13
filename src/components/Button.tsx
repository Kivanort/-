import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-yandex-red text-white shadow-md shadow-yandex-red/20 hover:bg-yandex-red-hover hover:shadow-lg hover:shadow-yandex-red/25 hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border-2 border-yandex-dark bg-white text-yandex-dark hover:bg-yandex-gray-50 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-yandex-gray-500 hover:text-yandex-red hover:bg-yandex-red-light",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
