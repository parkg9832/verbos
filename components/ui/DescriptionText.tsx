import type { HTMLAttributes, ReactNode } from "react";

type DescriptionTextProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function DescriptionText({
  children,
  className = "",
  ...props
}: DescriptionTextProps) {
  return (
    <p
      className={`line-clamp-2 max-w-prose text-sm leading-6 text-soy-sauce/70 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
