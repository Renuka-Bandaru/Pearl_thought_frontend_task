"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof formSchema>

export default function SignupForm({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: any) => {
    const existingUsersStr = localStorage.getItem("users")
    const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : []

    const emailExists = existingUsers.some((user: any) => user.email === data.email)
    if (emailExists) {
      alert("Email already registered. Please login instead.")
      return
    }

    const newUser = {
      name: data.name,
      email: data.email,
      password: data.password,
    }
    existingUsers.push(newUser)
    localStorage.setItem("users", JSON.stringify(existingUsers))

    alert("Account created successfully! Please login now.")
    onClose?.()
    onSuccess?.()
  }

  return (
    <Card className="w-lg rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-300">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-2xl">
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
      </CardHeader>

      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm password" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
