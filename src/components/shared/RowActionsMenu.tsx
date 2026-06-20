import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RowActionsMenuProps {
  onEdit: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  isEditDisabled?: boolean;
  editLoadingLabel?: string;
}

export function RowActionsMenu({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  isEditDisabled = false,
  editLoadingLabel = "Loading...",
}: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 cursor-pointer rounded-xl border border-transparent text-muted-foreground shadow-none transition-colors hover:border-transparent hover:bg-accent/60 hover:text-accent-foreground hover:shadow-none focus:!border-transparent focus:!bg-accent/60 focus:!text-accent-foreground focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:shadow-none focus-visible:!border-transparent focus-visible:!bg-accent/60 focus-visible:!text-accent-foreground focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:shadow-none data-[state=open]:border-transparent data-[state=open]:bg-accent/60 data-[state=open]:text-accent-foreground data-[state=open]:shadow-none"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[11rem] rounded-xl border border-border/80 bg-popover/95 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <DropdownMenuItem
          onClick={onEdit}
          disabled={isEditDisabled}
          className="cursor-pointer rounded-lg px-3 py-2.5 data-[disabled]:cursor-not-allowed"
        >
          <Pencil className="mr-2 h-4 w-4" />
          {isEditDisabled ? editLoadingLabel : editLabel}
        </DropdownMenuItem>
        {onDelete ? (
          <>
            <DropdownMenuSeparator className="my-1 bg-border/70" />
            <DropdownMenuItem
              onClick={onDelete}
              className="cursor-pointer rounded-lg px-3 py-2.5 text-destructive focus:text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteLabel}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
