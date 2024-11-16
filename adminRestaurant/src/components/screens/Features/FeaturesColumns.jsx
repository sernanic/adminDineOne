import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

const ActionCell = ({ row, table }) => {
  const [isOpen, setIsOpen] = useState(false)
  const feature = row.original
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => {
            setIsOpen(false)
            table.options.meta?.onEdit(feature)
          }}
        >
          Edit feature
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => {
            setIsOpen(false)
            table.options.meta?.onDelete(feature.id)
          }}
          className="text-red-600"
        >
          Delete feature
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns = [
  {
    accessorKey: "imageURL",
    header: "Image",
    cell: ({ row }) => {
      const imageURL = row.original.imageURL
      return (
        <Avatar className="h-12 w-12">
          <AvatarImage src={imageURL} alt={row.original.name} className="object-cover" />
          <AvatarFallback>F</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "itemId",
    header: "Item ID",
  },
  {
    id: "actions",
    cell: ActionCell
  },
]