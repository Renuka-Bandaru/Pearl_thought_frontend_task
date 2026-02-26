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
    specialization: z.string().min(3, "Specialization is required"),
    licenseNumber: z.string().min(5, "License number is required"),
    hospital: z.string().min(3, "Hospital name is required"),
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

type DoctorSignupFormValues = z.infer<typeof formSchema>

export default function DoctorSignupForm({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) {
  const form = useForm<DoctorSignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialization: "",
      licenseNumber: "",
      hospital: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: any) => {
    const existingDoctorsStr = localStorage.getItem("doctors")
    const existingDoctors = existingDoctorsStr ? JSON.parse(existingDoctorsStr) : []

    const emailExists = existingDoctors.some((doc: any) => doc.email === data.email)
    if (emailExists) {
      alert("Email already registered. Please login instead.")
      return
    }

    const newDoctor = {
      id: Date.now().toString(),
      name: data.name,
      specialization: data.specialization,
      licenseNumber: data.licenseNumber,
      hospital: data.hospital,
      email: data.email,
      password: data.password,
    }
    existingDoctors.push(newDoctor)
    localStorage.setItem("doctors", JSON.stringify(existingDoctors))

    alert("Account created successfully! Please login now.")
    onClose?.()
    onSuccess?.()
  }

  return (
    <Card className="w-lg rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-blue-300">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
        <CardTitle className="text-2xl text-center">Register as Doctor</CardTitle>
        <p className="text-sm text-blue-100 mt-2 text-center">
          Use the same name as your doctor profile to see your appointments
        </p>
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
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Specialization</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cardiology, Pediatrics" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your medical license number" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hospital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Hospital / Clinic</FormLabel>
                  <FormControl>
                    <Input placeholder="Your hospital or clinic name" {...field} className="rounded-lg" />
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

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
