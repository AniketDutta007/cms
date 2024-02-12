"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdOutlineStopCircle } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IoMdAdd } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { DatePicker } from "@/components/date-picker";
import { Icons } from "@/components/icons";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../_component/items-data-table";

enum MealTypes {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  SNACKS = "SNACKS",
}

interface MenuBasicInfoFormValues {
  date: Date;
  mealType: MealTypes;
}

enum ItemType {
  VEG = "VEG",
  NON_VEG = "NON_VEG",
}

interface Item {
  id: string;
  name: string;
  type: ItemType;
  price: number;
}

interface Combo {
  id: string;
  name: string;
  items: Item[];
}

interface Menu extends MenuBasicInfoFormValues {
  items: Item[];
  combos: Combo[];
}

const FormSchema = z.object({
  date: z
    .date({
      required_error: "Date is required",
    })
    .min(new Date(), {
      message: "Date cannot be in the past",
    }),
  mealType: z.enum([MealTypes.BREAKFAST, MealTypes.LUNCH, MealTypes.SNACKS]),
});

const sampleItems: Item[] = [
  { id: "1", name: "Carrot", type: ItemType.VEG, price: 1.5 },
  { id: "2", name: "Chicken", type: ItemType.NON_VEG, price: 8.99 },
  { id: "3", name: "Apple", type: ItemType.VEG, price: 0.75 },
  { id: "5", name: "Broccoli", type: ItemType.VEG, price: 2.25 },
  { id: "6", name: "Pork", type: ItemType.NON_VEG, price: 10.99 },
  { id: "7", name: "Banana", type: ItemType.VEG, price: 0.5 },
  { id: "8", name: "Salmon", type: ItemType.NON_VEG, price: 15.75 },
  { id: "9", name: "Lettuce", type: ItemType.VEG, price: 1.25 },
  { id: "10", name: "Turkey", type: ItemType.NON_VEG, price: 9.99 },
  { id: "11", name: "Tomato", type: ItemType.VEG, price: 0.9 },
  { id: "12", name: "Steak", type: ItemType.NON_VEG, price: 20.5 },
  { id: "13", name: "Spinach", type: ItemType.VEG, price: 1.99 },
  { id: "14", name: "Ham", type: ItemType.NON_VEG, price: 7.5 },
  { id: "15", name: "Cucumber", type: ItemType.VEG, price: 0.75 },
  { id: "16", name: "Sausage", type: ItemType.NON_VEG, price: 6.99 },
  { id: "17", name: "Bell Pepper", type: ItemType.VEG, price: 1.25 },
  { id: "18", name: "Shrimp", type: ItemType.NON_VEG, price: 18.25 },
  { id: "19", name: "Onion", type: ItemType.VEG, price: 0.5 },
  { id: "20", name: "Lamb", type: ItemType.NON_VEG, price: 16.99 },
  { id: "21", name: "Potato", type: ItemType.VEG, price: 0.6 },
  { id: "22", name: "Fish", type: ItemType.NON_VEG, price: 14.5 },
  { id: "23", name: "Mushroom", type: ItemType.VEG, price: 3.25 },
  { id: "24", name: "Duck", type: ItemType.NON_VEG, price: 22.99 },
  { id: "25", name: "Zucchini", type: ItemType.VEG, price: 1.75 },
  // Additional items to make a total of 25 records
  { id: "26", name: "Watermelon", type: ItemType.VEG, price: 3.99 },
  { id: "27", name: "Rice", type: ItemType.VEG, price: 2.49 },
  { id: "28", name: "Pasta", type: ItemType.VEG, price: 4.99 },
  { id: "29", name: "Lobster", type: ItemType.NON_VEG, price: 29.99 },
  { id: "30", name: "Eggplant", type: ItemType.VEG, price: 1.89 },
];

export const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: "Select",
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
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
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

export default function CreateMenuPage() {
  const [progress, setProgress] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [items, setItems] = useState<Item[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);

  const form: UseFormReturn<MenuBasicInfoFormValues> = useForm<
    z.infer<typeof FormSchema>
  >({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: (() => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        return currentDate;
      })(),
      mealType: MealTypes.BREAKFAST,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true);
      console.log(data);
      // const response = await axios.post("/api/menu", data);
      // console.log(response);
      // setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="grow flex flex-col gap-3 overflow-auto">
      <div className="text-4xl font-bold">New Menu</div>
      <Form {...form}>
        <form className="space-y-7">
          <div className="space-y-8">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex items-baseline gap-2">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onDateChange={(date) => form.setValue("date", date)}
                      />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mealType"
                render={({ field }) => (
                  <FormItem className="flex items-baseline gap-2">
                    <FormLabel>Service Time</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value: MealTypes) =>
                          form.setValue("mealType", value)
                        }
                      >
                        <SelectTrigger className="w-fit">
                          <SelectValue placeholder="Select a Service Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value={MealTypes.BREAKFAST}>
                              {MealTypes.BREAKFAST}
                            </SelectItem>
                            <SelectItem value={MealTypes.LUNCH}>
                              {MealTypes.LUNCH}
                            </SelectItem>
                            <SelectItem value={MealTypes.SNACKS}>
                              {MealTypes.SNACKS}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <DataTable columns={columns} data={sampleItems} />
            </div>
            <div className="flex flex-col gap-2 relative">
              {/* <SelectedItemsTable items={sampleItems} /> */}
              {/* <DataTableDemo /> */}
              <div className="text-lg font-bold absolute -top-3 left-4 bg-background">
                Selected Items
              </div>
              <div className="overflow-auto flex flex-wrap justify-start items-center border border-2 border-secondary rounded-md gap-3 px-2 pt-6 pb-3">
                {sampleItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-2.5 py-1 border border-2 border-secondary rounded-full"
                  >
                    <MdOutlineStopCircle
                      className={`text-${
                        item.type === ItemType.VEG ? "green-500" : "red-500"
                      }`}
                    />
                    <div className="max-w-[100px] text-ellipsis">
                      {item.name}
                    </div>
                    <RxCross2 className="text-red-500 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
            {/* <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormLabel className="w-1/5">Role</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value: Role) =>
                            form.setValue("role", value)
                          }
                        >
                          <SelectTrigger className="grow">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Roles</SelectLabel>
                              <SelectItem value={Role.USER}>
                                {Role.USER}
                              </SelectItem>
                              <SelectItem value={Role.CANTEEN}>
                                {Role.CANTEEN}
                              </SelectItem>
                              <SelectItem value={Role.ADMIN}>
                                {Role.ADMIN}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                /> */}
          </div>
        </form>
      </Form>
    </div>
  );
}

function SelectedItemsTable({ items }: { items: Item[] }) {
  return (
    <Table>
      <TableCaption>Selected Items</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell className="text-right">{item.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {items.reduce((prev, current) => prev + current.price, 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
