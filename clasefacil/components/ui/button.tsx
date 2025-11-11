import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
        className
      )}
      {...props}
    />
  );
}
