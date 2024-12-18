import React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Button as NextUIButton } from "@nextui-org/react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Pagination, PaginationItemType } from "@nextui-org/react"

export function DataTable({ data, columns, filterColumn, onSync, isSyncing, meta, moreActions }) {
  console.log('DataTable props:', { data, columns, filterColumn, meta }) // Add meta to debug log

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10
  const [isMoreActionsOpen, setIsMoreActionsOpen] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    pageCount: Math.ceil(data.length / itemsPerPage),
    meta, // Add this line to pass meta options to the table instance
  })

  const totalPages = table.getPageCount()

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center py-4">
        {filterColumn && (
          <Input
            placeholder={`Filter ${filterColumn}...`}
            value={table.getColumn(filterColumn)?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ShadcnButton variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </ShadcnButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {onSync && (
          <NextUIButton
            className="ml-4"
            onClick={onSync}
            isLoading={isSyncing}
            color="primary"
            spinner={
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            }
          >
            {isSyncing ? 'Syncing...' : 'Sync'}
          </NextUIButton>
        )}
        {moreActions && moreActions.length > 0 && (
          <DropdownMenu open={isMoreActionsOpen} onOpenChange={setIsMoreActionsOpen}>
            <DropdownMenuTrigger asChild>
              <ShadcnButton variant="outline" className="ml-4">
                More Actions <ChevronDown className="ml-2 h-4 w-4" />
              </ShadcnButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {moreActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  className="capitalize"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    action.onClick();
                  }}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center gap-4 py-4">
        <Pagination
          total={totalPages}
          color="secondary"
          page={currentPage}
          onChange={setCurrentPage}
          classNames={{
            item: "bg-transparent",
            cursor: "bg-black text-white",
          }}
        />
      </div>

    </div>
  )
}
