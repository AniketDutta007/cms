"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

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

import { PiUserCirclePlusFill } from "react-icons/pi";

import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
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

enum Role {
  USER = "USER",
  CANTEEN = "CANTEEN",
  ADMIN = "ADMIN",
}

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["USER", "CANTEEN", "ADMIN"]),
});

export function AddUser() {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/user", data);
      if (res.status === 200) {
        toast({
          title: "Account Created Successfully",
          description: "User has been created successfully",
          className: "bg-lime-500 text-primary",
        });
      }
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "LogIn failed",
        description: error.message ?? "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button className="flex gap-3 rounded-full absolute bottom-3 end-3 group">
          <PiUserCirclePlusFill size={20} />
          <span className="w-0 group-hover:w-fit hidden group-hover:block duration-100 ease-in-out transition-all">
            Add User
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="James Bond"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="james@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
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
                />
              </div>
              {/* <Button type="submit" className="w-full"></Button> */}
              <DialogFooter>
                <Button type="submit">
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
