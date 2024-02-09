"use client"

import * as React from "react"
import { useEffect,useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "../../../@/components/ui/button"

import { Input } from "../../../@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table"

import UnlistLanguageConfirm from "./UnlistLanguageConfirm"
import { PHOTO_BASE_URL } from "../../constants"
import { useGetAllLanguagesMutation } from "../../slices/adminApiSlice"
import { RootState } from "../../store/rootReducer"
import { useSelector } from "react-redux"


export type Languages = {
  language:string
  flag:string
  list:boolean
  _id:string
  
}

 const columns: ColumnDef<Languages>[] = [
  {
    accessorKey: "language",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Language
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("language")}</div>,
  },
  {
    accessorKey: "flag",
    header: "Flag",
    cell: ({ row }) => (
      <img className="h-10 w-10" src={`${PHOTO_BASE_URL}${row.getValue("flag")}`} alt=""/>
    ),
  },
  {
    accessorKey: "list/unlist",
    header: "List/UnList",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("list")}</div>
    ),
  },
]

interface LanguageTableProps{
  languageAdded:string
}

export function LanguageTable({languageAdded}:LanguageTableProps) {
  const {adminInfo}=useSelector((state:RootState)=>state.admin)
  const [languages,setLanguages]=useState<Languages[]>([])
  const [getAllLanguages]=useGetAllLanguagesMutation()
  const getLanguages=React.useCallback(async()=>{
    try{
       const response=await getAllLanguages({token:adminInfo?.token}).unwrap()    
       setLanguages(response.languages)
    }catch(error){
        console.log(error)
    }
},[getAllLanguages,adminInfo])
  

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data:languages,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    
    state: {
      sorting,
      columnFilters,
    },
  })
 

    const [listStatusChange,setListStatusChange]=useState('')
    const [languageUnlistId,setLanguageUnlistId]=useState('')
    const [showUnlistConfirmation,setShowUnlistConfirmation]=useState(false)
    const handleList=(languageId:string)=>{
      setListStatusChange('change')
       setLanguageUnlistId(languageId)
       setShowUnlistConfirmation(true)
    }
    const handleUnlistConfirmClose=()=>{
      setShowUnlistConfirmation(false)
      setListStatusChange('changed')
    }
   
    useEffect(()=>{
      getLanguages()
    },[listStatusChange,languageAdded,showUnlistConfirmation,getLanguages])

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter languages..."
          value={(table.getColumn("language")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("language")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
      {showUnlistConfirmation && <UnlistLanguageConfirm languageId={languageUnlistId} setOpen={handleUnlistConfirmClose} />}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>   
            {table.getRowModel()?.rows?.length ? (              
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                >
                    <TableCell key={row.id}>
                      {
                        row.original.language
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {
                        <img className="h-10 w-10" src={`${row.original.flag}`} alt=""/>
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {
                         row.original.list==true ? 
                         <button onClick={()=>handleList(row.original._id)} className="bg-red-500 rounded-lg p-2 w-16">Unlist</button>
                         :
                         <button onClick={()=>handleList(row.original._id)} className="bg-blue-500 rounded-lg p-2">List</button>                                         
                       } 
                    </TableCell>
                </TableRow>
              ))             
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">      
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
