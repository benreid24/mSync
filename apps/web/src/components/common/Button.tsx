export type Variant = "primary" | "secondary" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-cyan-800 hover:bg-cyan-500 active:bg-cyan-900",
  secondary: "bg-zinc-900 hover:bg-zinc-700 active:bg-zinc-950",
  danger: "bg-rose-800 hover:bg-rose-600 active:bg-rose-900",
};

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    compact?: boolean;
    extraClass?: string;
  }
> = ({ children, variant = "primary", compact = false, extraClass = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 text-white rounded transition-all ${
        variantClasses[variant]
      } ${compact ? "m-1" : "m-4"} ${extraClass}`}
      {...props}
    >
      {children}
    </button>
  );
};
