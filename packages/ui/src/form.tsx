import * as React from "react";

import { cn } from ".";

export type FormProps = React.HTMLAttributes<HTMLFormElement>;

const Form = React.forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  return (
    <form
      className={cn("flex flex-col gap-6", props.className)}
      ref={ref}
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit?.(e);
      }}
    >
      {props.children}
    </form>
  );
});
Form.displayName = "Form";

export { Form };
