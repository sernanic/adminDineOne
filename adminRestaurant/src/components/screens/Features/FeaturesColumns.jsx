import { Button } from "@/components/ui/button"
import { FaEdit, FaTrash } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    cell: ({ row, table }) => {
      const feature = row.original
      return (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => table.options.meta?.onEdit(feature)}
            className="h-8 w-8 p-0"
          >
            <FaEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => table.options.meta?.onDelete(feature.id)}
            className="h-8 w-8 p-0 text-red-600"
          >
            <FaTrash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
