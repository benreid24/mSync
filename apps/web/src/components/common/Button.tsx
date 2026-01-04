export type Variant = "primary" | "secondary" | "danger";

const variantClasses: Record<Variant | "disabled", string> = {
  primary: "bg-cyan-800 hover:bg-cyan-500 active:bg-cyan-900",
  secondary: "bg-zinc-900 hover:bg-zinc-700 active:bg-zinc-950",
  danger: "bg-rose-800 hover:bg-rose-600 active:bg-rose-900",
  disabled: "bg-gray-400 cursor-not-allowed",
};

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    compact?: boolean;
    extraClass?: string;
    noPad?: boolean;
  }
> = ({
  children,
  variant = "primary",
  compact = false,
  noPad = false,
  extraClass = "",
  disabled,
  ...props
}) => {
  return (
    <button
      className={`text-white rounded transition-all ${
        disabled ? variantClasses["disabled"] : variantClasses[variant]
      } ${compact ? "m-1" : "m-4"} ${noPad ? "p-0" : "px-4 py-2"} ${
        !disabled ? "cursor-pointer" : ""
      } ${extraClass}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
