
 

 
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
import { useNavigate } from "react-router-dom"
import BlockConfirm from "./BlockConfirm"
import { useGetAllUsersMutation } from "../../slices/adminApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"


export type Users = {
 name:string,
 email:string,
 photo:{
  url:string,
 },
 country:{
  country:string
 },
 language:{
  language:string
 },
 registered_on:string,
 isBlocked:boolean,
 _id:string
}

const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => (
      <img className="h-10 w-10" src={`${row.getValue("photo.url")}`} alt=""/>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("country.country")}</div>
    ),
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("language.language")}</div>
    ),
  },
  {
    accessorKey: "registered_on",
    header: "Registered on",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("registered_on")}</div>
    ),
  },
  {
    accessorKey: "viewprofile",
    header: "View",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("")}</div>
    ),
  },
  {
    accessorKey: "block/unblock",
    header: "Block/UnBlock",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("isBlocked")}</div>
    ),
  },
]

export function UserTable() {
  const {adminInfo}=useSelector((state:RootState)=>state.admin)
  const [users,setUsers]=useState<Users[]>([])
  const [getAllUsers]=useGetAllUsersMutation()
  const getUsers=React.useCallback(async()=>{
    try{
       const response=await getAllUsers({token:adminInfo?.token}).unwrap()
       setUsers(response.allUsers)
    }catch(error){
        console.log(error)
    }
},[getAllUsers,adminInfo])
  

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data:users,
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


    const [blockStatusChange,setBlockStatusChange]=useState('')

    const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
    const [userBlockId,setUserBlockId]=useState('')

    const handleBlock = (userId:string) => {  
      setBlockStatusChange('changed')
      setUserBlockId(userId)
      setShowBlockConfirmation(true);   
    }

     const handleBlockConfirmClose = () => { 
     setShowBlockConfirmation(false);
     setBlockStatusChange('change')
   };

    useEffect(()=>{
      getUsers()
    },[blockStatusChange,showBlockConfirmation,getUsers])

    const navigate=useNavigate()

    const handleViewProfileButton=(userId:string)=>{
          navigate('/profilemanagement', { state: { userId: userId } })
    }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
      {showBlockConfirmation && <BlockConfirm userId={userBlockId} setOpen={handleBlockConfirmClose} />}
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
                        <img className="h-10 w-10" src={`${row.original.photo.url}`} alt=""/>
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {
                        row.original.name
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {
                        row.original.email
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {
                        row.original.country.country 
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {
                        row.original.language.language
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {
                        row.original.registered_on
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {         
                         <button onClick={()=>handleViewProfileButton(row.original._id)}  className="bg-blue-500 text-xs text-white rounded-lg p-1 w-20">View Profile</button>
                       } 
                    </TableCell>
                    <TableCell key={row.id}>
                      {
                         row.original.isBlocked==false ? 
                         <button onClick={()=>handleBlock(row.original._id)} className="bg-red-500 rounded-lg p-2 w-16">Block</button>
                         :
                         <button onClick={()=>handleBlock(row.original._id)} className="bg-blue-500 rounded-lg p-2">UnBlock</button>                                         
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
