"use client";

import * as React from "react";
import clsx from "clsx";

type AsChildProps = { asChild?: boolean; children: React.ReactNode };

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({ asChild, children }: AsChildProps) {
  // If asChild is used, pass the group class to the child so hover state is available
  const child = React.Children.only(children) as React.ReactElement<any>;
  if (asChild && React.isValidElement(child)) {
    const existingClass = (child.props && (child.props as any).className) || undefined;
    const newProps: any = { className: clsx(existingClass, "group") };
    return React.cloneElement(child, newProps);
  }

  return <span className="group inline-flex">{children}</span>;
}

export function TooltipContent({
  children,
  side = "top",
  className,
}: {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}) {
  const sideClasses: Record<string, string> = {
    top: "-translate-y-2 bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div
      role="tooltip"
      className={clsx(
        "pointer-events-none invisible opacity-0 transition-all duration-150 scale-95 transform-gpu group-hover:visible group-hover:opacity-100 group-hover:scale-100 absolute z-50",
        sideClasses[side],
        "whitespace-nowrap rounded-md bg-neutral-900 text-neutral-50 px-2 py-1 text-xs shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Tooltip;
