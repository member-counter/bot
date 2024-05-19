import { XIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";

export const TextItem = ({
  onClick,
  onClickDelete,
  label,
  isSelected,
}: {
  onClick?: () => void;
  onClickDelete?: () => void;
  label: string;
  isSelected?: boolean;
}) => {
  return (
    <div
      className={cn([
        "flex h-[40px] flex-row items-center overflow-hidden rounded-md border border-input bg-background p-3 hover:bg-accent hover:text-accent-foreground",
        {
          "bg-accent text-accent-foreground": isSelected,
          "cursor-pointer": !!onClick,
        },
      ])}
      role={onClick ? "button" : undefined}
      onClick={onClick}
    >
      <div className="mr-auto text-sm">{label}</div>
      {onClickDelete && (
        <Button size="sm" variant="none" onClick={onClickDelete}>
          <XIcon className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
