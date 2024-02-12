"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { IoMdAdd } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { DatePicker } from "@/components/date-picker";
import { Icons } from "@/components/icons";

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

function MenuBasicInfo({
  form,
}: {
  form: UseFormReturn<MenuBasicInfoFormValues>;
}) {
  return (
    <Form {...form}>
      <form className="space-y-5">
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex items-baseline gap-5">
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
              <FormItem className="space-y-1">
                <FormLabel>Service Time</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value: MealTypes) =>
                      form.setValue("mealType", value)
                    }
                  >
                    <SelectTrigger className="grow">
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
  );
}

function MenuItems({
  items,
  setItems,
}: {
  items: Item[];
  setItems: (items: Item[]) => void;
}) {
  return <div>Menu Items</div>;
}

function MenuCombos({
  combos,
  setCombos,
}: {
  combos: Combo[];
  setCombos: (combos: Combo[]) => void;
}) {
  return <div>Menu Combos</div>;
}

export function AddMenu() {
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
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button className="flex gap-3 rounded-full absolute bottom-3 end-3 group">
          <IoMdAdd size={20} />
          <span className="w-0 font-bold group-hover:w-fit hidden group-hover:block duration-100 ease-in-out transition-all">
            Add Menu
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Menu</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-6">
          {progress === 0 && <MenuBasicInfo form={form} />}
          {progress === 1 && <MenuItems items={items} setItems={setItems} />}
          {progress === 2 && (
            <MenuCombos combos={combos} setCombos={setCombos} />
          )}
          <DialogFooter className="flex items-stretch gap-3">
            <Button
              onClick={() => setProgress((prev) => prev - 1)}
              disabled={progress === 0}
            >
              Back
            </Button>
            <Button
              type="submit"
              onClick={() => {
                if (progress < 2) {
                  setProgress((prev) => prev + 1);
                } else {
                  onSubmit(form.getValues());
                }
              }}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {progress < 2 ? "Next" : "Create Menu"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
