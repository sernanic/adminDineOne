import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Eye } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useState } from "react"
import  EditDishDialog  from "./EditDishDialog"
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react"
import ImageCell from './ImageCell'

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue("images")
      return <ImageCell images={images} />
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>${(row.getValue("price") / 100).toFixed(2)}</div>,
  },
  {
    accessorKey: "available",
    header: "Available",
    cell: ({ row }) => <div>{row.getValue("available") ? "Yes" : "No"}</div>,
  },
  {
    accessorKey: "hidden",
    header: "Hidden",
    cell: ({ row }) => <div>{row.getValue("hidden") ? "Yes" : "No"}</div>,
  },
  {
    accessorKey: "isPopular",
    header: "Popular",
    cell: ({ row }) => <div>{row.getValue("isPopular") ? "Yes" : "No"}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const dish = row.original
      const navigate = useNavigate()
      const [dropdownOpen, setDropdownOpen] = useState(false)

      const handleEdit = () => {
        setDropdownOpen(false) // Close dropdown when edit is clicked
        const meta = table.options.meta
        if (meta?.onEditDish) {
          meta.onEditDish(dish)
        } else {
          console.error('onEditDish function not found in meta options')
        }
      }

      return (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => {
              setDropdownOpen(false)
              navigator.clipboard.writeText(dish.itemId)
            }}>
              Copy dish ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleEdit}>
              Edit dish
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {
              setDropdownOpen(false)
              navigate(`/dishes/merchant/${dish.merchantId}/dishes/${dish.itemId}`)
            }}>
              <Eye className="mr-2 h-4 w-4" />
              View dish details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
