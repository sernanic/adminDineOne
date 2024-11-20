import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

const ActionCell = ({ row, table }) => {
  const [isOpen, setIsOpen] = useState(false)
  const notification = row.original
  const meta = table.options.meta

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false)
            meta?.onEdit(notification)
          }}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false)
            meta?.onDelete(notification.id)
          }}
          className="cursor-pointer text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns = [
  {
    accessorKey: "header",
    header: "Header",
  },
  {
    accessorKey: "body",
    header: "Body",
  },
  {
    accessorKey: "imageUrl",
    header: "Image URL",
  },
  {
    id: "actions",
    cell: ActionCell,
  },
]
