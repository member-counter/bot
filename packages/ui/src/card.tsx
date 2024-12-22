import * as React from "react";

import { cn } from "@mc/ui";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-landingCard text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const CardBorderIlluminated = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const spotlightRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const spotlightEl = spotlightRef.current;
    const parentEl = divRef.current?.ownerDocument;
    const divEl = divRef.current;

    if (!spotlightEl || !parentEl || !divEl) return;

    const onMouseMove = (event: MouseEvent) => {
      const rects = divEl.getBoundingClientRect();
      spotlightEl.style.left = `${event.clientX - rects.x}px`;
      spotlightEl.style.top = `${event.clientY - rects.y}px`;
    };

    parentEl.addEventListener("mousemove", onMouseMove);

    return () => {
      parentEl.removeEventListener("mousemove", onMouseMove);
    };
  }, [spotlightRef, divRef]);

  return (
    <div
      ref={divRef}
      className={cn(
        "relative z-[0] overflow-hidden rounded-lg bg-[hsl(var(--border))] p-[1px] text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      <div
        ref={spotlightRef}
        className=" absolute  z-[-1] overflow-clip rounded-full bg-gray-50 shadow-[0_0_150px_90px_white]"
      ></div>
      <div className="z-[2] h-full w-full rounded-[calc(var(--radius)-1px)] bg-landingCard">
        {children}
      </div>
    </div>
  );
};
Card.displayName = "CardBorderIlluminated";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardBorderIlluminated,
};
