import { Button } from "@/components/ui/button"
import { FaEdit, FaTrash } from "react-icons/fa"

export const columns = [
  {
    accessorKey: "imageURL",
    header: "Image",
    cell: ({ row }) => {
      const imageURL = row.original.imageURL
      return (
        <div className="flex items-center justify-center">
          {imageURL ? (
            <img 
              src={imageURL} 
              alt={row.original.rewardName} 
              className="h-12 w-12 object-cover rounded-lg"
            />
          ) : (
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "rewardName",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "pointsRequired",
    header: "Points Required",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const reward = row.original
      return (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => table.options.meta?.onEditReward(reward)}
            className="h-8 w-8 p-0"
          >
            <FaEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => table.options.meta?.onDeleteReward(reward.id)}
            className="h-8 w-8 p-0"
          >
            <FaTrash className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  },
]
