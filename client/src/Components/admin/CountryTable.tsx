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
import UnlistCountryConfirm from "./UnlistCountryConfirm"
import { useGetAllCountriesMutation } from "../../slices/adminApiSlice"
import { PHOTO_BASE_URL } from "../../constants"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"

export type Countries = {
  country:string
  flag:string
  list:boolean
  _id:string
}

 const columns: ColumnDef<Countries>[] = [
  {
    accessorKey: "country",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("country")}</div>,
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

interface CountryTableProps {
  countryAdded:string
}

export function CountryTable({countryAdded}:CountryTableProps) {
  const {adminInfo}=useSelector((state:RootState)=>state.admin)
  const [countries,setCountries]=useState<Countries[]>([])
  const [getAllCountries]=useGetAllCountriesMutation()

  const getCountries=React.useCallback(async()=>{
    try{
       const response=await getAllCountries({token:adminInfo?.token}).unwrap()
       setCountries(response.countries)
    }catch(error){
        console.log(error)
    }
},[getAllCountries,adminInfo])
 

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data:countries,
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
    const [countryUnlistId,setCountryUnlistId]=useState('')
    const [showUnlistConfirmation,setShowUnlistConfirmation]=useState(false)
    const handleList=(countryId:string)=>{
      setListStatusChange('change')
       setCountryUnlistId(countryId)
       setShowUnlistConfirmation(true)
    }
    const handleUnlistConfirmClose=()=>{
      setShowUnlistConfirmation(false)
      setListStatusChange('changed')
    }
    useEffect(()=>{
      getCountries()
    },[listStatusChange,countryAdded,showUnlistConfirmation,getCountries])

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter countries..."
          value={(table.getColumn("country")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("country")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
      {showUnlistConfirmation && <UnlistCountryConfirm countryId={countryUnlistId} setOpen={handleUnlistConfirmClose} />}
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
                        row.original.country
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



